// Layer 1 — Universal AI Gateway edge function.
// Every AI call in the platform funnels through here.
// To swap models when AGI arrives: change MODEL_ROUTER below.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ModelTier = "fast" | "smart" | "reasoning";
type AITask =
  | "triage" | "monitor" | "insight" | "summarize" | "score"
  | "protocol" | "drug_check" | "extract" | "reason";

const MODEL_ROUTER: Record<ModelTier, string> = {
  fast: "google/gemini-2.5-flash-lite",
  smart: "google/gemini-3-flash-preview",
  reasoning: "openai/gpt-5",
};

const TASK_MODEL_MAP: Record<AITask, ModelTier> = {
  triage: "smart",
  monitor: "fast",
  insight: "smart",
  summarize: "smart",
  score: "fast",
  protocol: "smart",
  drug_check: "fast",
  extract: "fast",
  reason: "reasoning",
};

// Approximate per-token USD costs (input/output) for observability.
const COST_PER_1K: Record<string, { in: number; out: number }> = {
  "google/gemini-2.5-flash-lite": { in: 0.0001, out: 0.0004 },
  "google/gemini-3-flash-preview": { in: 0.0003, out: 0.0012 },
  "openai/gpt-5": { in: 0.005, out: 0.015 },
};

function jsonResp(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const start = Date.now();
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResp({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return jsonResp({ error: "Unauthorized" }, 401);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonResp({ error: "Invalid JSON" }, 400);
  }

  const task = body.task as AITask;
  const tier = (body.model_preference as ModelTier | undefined) ?? TASK_MODEL_MAP[task];
  const model = MODEL_ROUTER[tier];
  if (!task || !model) return jsonResp({ error: "Missing task" }, 400);

  // Build the message stack.
  const memoriesBlock = body.context?.memories?.length
    ? `\n\n## Σχετικές μνήμες ασθενή:\n${body.context.memories
        .map((m: any) => `- [${m.memory_type}] ${m.content}`)
        .join("\n")}`
    : "";

  const systemContent = [
    body.system ?? "Είσαι ο Medithos AI assistant.",
    body.system_additions ?? "",
    memoriesBlock,
  ]
    .filter(Boolean)
    .join("\n");

  const messages = [
    { role: "system", content: systemContent },
    ...(body.context?.history ?? []),
    { role: "user", content: body.prompt ?? "" },
  ];

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return jsonResp({ error: "LOVABLE_API_KEY not configured" }, 500);

  const aiBody: Record<string, unknown> = {
    model,
    messages,
    max_tokens: body.max_tokens,
    temperature: body.temperature,
  };
  if (body.tools) aiBody.tools = body.tools;
  if (body.tool_choice) aiBody.tool_choice = body.tool_choice;

  let aiResp: Response;
  try {
    aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aiBody),
    });
  } catch (e) {
    console.error("Gateway fetch failed", e);
    await logCall({ supabase, task, model, patient: body.context?.patient_id,
      latency: Date.now() - start, status: "error", error: String(e) });
    return jsonResp({ error: "Network error" }, 502);
  }

  if (!aiResp.ok) {
    const text = await aiResp.text();
    console.error("AI error", aiResp.status, text);
    await logCall({ supabase, task, model, patient: body.context?.patient_id,
      latency: Date.now() - start, status: "error", error: `${aiResp.status}: ${text.slice(0, 200)}` });
    if (aiResp.status === 429) return jsonResp({ error: "Υπέρβαση ορίου. Δοκιμάστε ξανά σε λίγο." }, 429);
    if (aiResp.status === 402) return jsonResp({ error: "Εξαντλήθηκαν τα AI credits του workspace." }, 402);
    return jsonResp({ error: "AI gateway failure" }, 500);
  }

  const aiData = await aiResp.json();
  const choice = aiData.choices?.[0];
  const content = choice?.message?.content ?? "";
  const toolCalls = choice?.message?.tool_calls;
  const tokensIn = aiData.usage?.prompt_tokens ?? 0;
  const tokensOut = aiData.usage?.completion_tokens ?? 0;
  const latency = Date.now() - start;
  const cost = computeCost(model, tokensIn, tokensOut);

  await logCall({
    supabase, task, model, patient: body.context?.patient_id,
    tokensIn, tokensOut, latency, status: "success", cost,
  });

  return jsonResp({
    content,
    tool_calls: toolCalls ?? null,
    model_used: model,
    tokens_used: tokensIn + tokensOut,
    tokens_input: tokensIn,
    tokens_output: tokensOut,
    latency_ms: latency,
  });
});

function computeCost(model: string, tIn: number, tOut: number): number {
  const c = COST_PER_1K[model];
  if (!c) return 0;
  return Number(((tIn / 1000) * c.in + (tOut / 1000) * c.out).toFixed(6));
}

async function logCall(args: {
  supabase: ReturnType<typeof createClient>;
  task: string;
  model: string;
  patient?: string | null;
  tokensIn?: number;
  tokensOut?: number;
  latency: number;
  status: string;
  cost?: number;
  error?: string;
}) {
  try {
    await args.supabase.from("ai_observability").insert({
      task: args.task,
      model_used: args.model,
      patient_id: args.patient ?? null,
      tokens_input: args.tokensIn ?? 0,
      tokens_output: args.tokensOut ?? 0,
      latency_ms: args.latency,
      cost_usd: args.cost ?? null,
      status: args.status,
      error: args.error ?? null,
    });
  } catch (e) {
    console.error("logCall failed", e);
  }
}
