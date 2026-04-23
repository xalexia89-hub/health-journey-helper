/**
 * Layer 3 — Agentic loop. Replaces one-shot AI calls with
 * think → act → observe → think again.
 *
 * Each step is logged to `agent_actions` for full audit trail.
 */
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { aiGateway } from "./gateway";
import { retrieveRelevantMemories, storeMemory } from "./memory";
import type {
  AgentAction,
  AgentStep,
  AITask,
  PatientContext,
} from "./types";

export interface AgentLoopResult {
  steps: AgentStep[];
  final_context: PatientContext;
  session_id?: string;
}

const SYSTEM_PROMPT_BY_AGENT: Record<AITask, string> = {
  triage:
    "Είσαι ο Navigator Agent. Αξιολόγησε τα συμπτώματα και πρότεινε επόμενο βήμα. Όταν τελειώσεις γράψε [DONE].",
  monitor:
    "Είσαι ο Guardian Agent. Παρακολούθησε ζωτικά σημεία και ανίχνευσε ανωμαλίες. [DONE] όταν ολοκληρώσεις.",
  insight:
    "Είσαι ο Insight Agent. Συνδύασε δεδομένα και πρότεινε προληπτικές παρεμβάσεις. [DONE] στο τέλος.",
  summarize: "Σύνοψε με σαφήνεια. [DONE] όταν τελειώσεις.",
  score: "Υπολόγισε σκορ υγείας. [DONE] στο τέλος.",
  protocol: "Σχεδίασε εξατομικευμένο πρωτόκολλο. [DONE] στο τέλος.",
  drug_check: "Έλεγξε αλληλεπιδράσεις φαρμάκων. [DONE] στο τέλος.",
  extract: "Εξάγαγε δομημένα δεδομένα. [DONE] στο τέλος.",
  reason: "Σκέψου βήμα-βήμα. [DONE] όταν φτάσεις σε συμπέρασμα.",
};

function formatPreviousSteps(steps: AgentStep[]): string {
  if (steps.length === 0) return "";
  return (
    "\n\n## Προηγούμενα βήματα:\n" +
    steps
      .map(
        (s, i) =>
          `Βήμα ${i + 1}:\n- Σκέψη: ${s.thought}\n- Ενέργεια: ${
            s.action ? JSON.stringify(s.action) : "καμία"
          }\n- Παρατήρηση: ${s.observation ?? "—"}`,
      )
      .join("\n\n")
  );
}

const ACTION_REGEX = /```action\s*([\s\S]*?)```/i;

function parseAgentAction(text: string): AgentAction | null {
  const match = text.match(ACTION_REGEX);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1].trim());
    if (parsed.type && parsed.params) return parsed as AgentAction;
  } catch (e) {
    logger.debug("parseAgentAction failed", e);
  }
  return null;
}

async function executeAction(
  action: AgentAction,
  context: PatientContext,
): Promise<string> {
  switch (action.type) {
    case "query_memory": {
      const memories = await retrieveRelevantMemories(
        context.patient_id,
        String(action.params.query ?? ""),
        Number(action.params.limit ?? 5),
      );
      return `Βρέθηκαν ${memories.length} σχετικές μνήμες: ${memories
        .map((m) => `[${m.memory_type}] ${m.content}`)
        .join("; ")}`;
    }
    case "store_memory": {
      const stored = await storeMemory(
        context.patient_id,
        String(action.params.content ?? ""),
        (action.params.memory_type as never) ?? "agent_hypothesis",
        String(action.params.source ?? "agent_loop"),
        Number(action.params.confidence ?? 0.7),
      );
      return stored ? `Memory stored: ${stored.id}` : "Memory store failed";
    }
    case "fetch_data":
      return `Data fetch requested: ${JSON.stringify(action.params)}`;
    case "send_alert":
    case "update_protocol":
    case "notify_physician":
      return `Action ${action.type} queued for human approval`;
    default:
      return `Unknown action: ${(action as AgentAction).type}`;
  }
}

function mergeObservation(ctx: PatientContext, observation: string): PatientContext {
  return {
    ...ctx,
    snapshot: {
      ...(ctx.snapshot ?? {}),
      last_observation: observation,
    },
  };
}

async function logAgentStep(args: {
  agent: AITask;
  patient_id: string;
  step_index: number;
  thought: string;
  action: AgentAction | null;
  observation: string | null;
  session_id?: string;
}) {
  try {
    await supabase.from("agent_actions").insert({
      patient_id: args.patient_id,
      agent_type: args.agent,
      action_type: "memory_stored",
      reasoning: args.thought,
      action_data: {
        step: args.step_index,
        action: args.action,
        observation: args.observation,
      },
      session_id: args.session_id ?? null,
    });
  } catch (e) {
    logger.error("logAgentStep failed", e);
  }
}

export async function runAgentLoop(
  agent: AITask,
  context: PatientContext,
  maxSteps = 5,
): Promise<AgentLoopResult> {
  const steps: AgentStep[] = [];
  let currentContext = context;

  // Open a session row to group all steps.
  const { data: sessionRow } = await supabase
    .from("agent_sessions")
    .insert({
      patient_id: context.patient_id,
      agent_type: agent,
      context_snapshot: (context.snapshot ?? {}) as never,
    })
    .select("id")
    .single();
  const sessionId: string | undefined = sessionRow?.id;

  for (let i = 0; i < maxSteps; i++) {
    const thought = await aiGateway({
      task: agent,
      context: currentContext,
      system: SYSTEM_PROMPT_BY_AGENT[agent],
      system_additions: formatPreviousSteps(steps),
      prompt:
        i === 0
          ? `Ξεκίνα ανάλυση για ασθενή ${context.patient_id}.`
          : "Συνέχισε. Αν χρειάζεσαι ενέργεια, χρήση block ```action {json}```.",
    });

    const action = parseAgentAction(thought.content);
    const observation = action ? await executeAction(action, currentContext) : null;

    await logAgentStep({
      agent,
      patient_id: context.patient_id,
      step_index: i,
      thought: thought.content,
      action,
      observation,
      session_id: sessionId,
    });

    steps.push({
      thought: thought.content,
      action,
      observation,
      should_continue: !!action,
    });

    if (!action || thought.content.includes("[DONE]")) break;
    if (observation) currentContext = mergeObservation(currentContext, observation);
  }

  if (sessionId) {
    await supabase
      .from("agent_sessions")
      .update({
        session_end: new Date().toISOString(),
        outcomes: { steps: steps.length } as never,
      })
      .eq("id", sessionId);
  }

  return { steps, final_context: currentContext, session_id: sessionId };
}
