/**
 * Layer 7 — Multi-agent message bus.
 * Guardian → Navigator → Insight handoffs flow through here.
 */
import { logger } from "@/lib/logger";
import { runAgentLoop } from "./agent-loop";
import { createPendingAction } from "./approval";
import type { AgentMessage, AITask, PatientContext, RiskLevel } from "./types";

const PRIORITY_TO_RISK: Record<AgentMessage["priority"], RiskLevel> = {
  low: "low",
  normal: "medium",
  high: "high",
  urgent: "critical",
};

export async function orchestrate(
  trigger: AgentMessage,
  patientContext: PatientContext,
): Promise<void> {
  logger.debug("orchestrate", { from: trigger.from, to: trigger.to, type: trigger.type });

  if (trigger.to === "human") {
    await createPendingAction({
      patient_id: patientContext.patient_id,
      agent_type: trigger.from,
      action_type: "physician_notified",
      action_data: { payload: trigger.payload, type: trigger.type } as never,
      reasoning: `Handoff from ${trigger.from} (${trigger.type})`,
      risk_level: PRIORITY_TO_RISK[trigger.priority],
    });
    return;
  }

  const target = trigger.to as AITask;
  await runAgentLoop(target, {
    ...patientContext,
    snapshot: {
      ...(patientContext.snapshot ?? {}),
      handoff_from: trigger.from,
      handoff_payload: trigger.payload,
    },
  });
}
