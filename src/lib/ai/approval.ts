/**
 * Layer 5 — Human-in-the-loop approval.
 * Risk policy:
 *  - low      → auto-execute
 *  - medium   → notify + auto-execute after 24h if no response
 *  - high     → patient OR physician approval required
 *  - critical → physician approval required, never auto
 */
import { supabase } from "@/integrations/supabase/client";
import type { AgentActionType, RiskLevel } from "./types";

interface CreatePendingActionInput {
  patient_id: string;
  agent_type: string;
  action_type: AgentActionType;
  action_data: Record<string, unknown>;
  reasoning: string;
  risk_level: RiskLevel;
}

const APPROVER_BY_RISK: Record<RiskLevel, "patient" | "physician" | "admin"> = {
  low: "patient",
  medium: "patient",
  high: "patient",
  critical: "physician",
};

const TTL_HOURS_BY_RISK: Record<RiskLevel, number> = {
  low: 1,
  medium: 24,
  high: 72,
  critical: 168,
};

export async function createPendingAction(input: CreatePendingActionInput) {
  const ttl = TTL_HOURS_BY_RISK[input.risk_level];
  const expires = new Date(Date.now() + ttl * 3600 * 1000).toISOString();

  const { data, error } = await supabase
    .from("pending_agent_actions")
    .insert({
      patient_id: input.patient_id,
      agent_type: input.agent_type,
      action_type: input.action_type,
      action_data: input.action_data as never,
      reasoning: input.reasoning,
      risk_level: input.risk_level,
      requires_approval_from: APPROVER_BY_RISK[input.risk_level],
      expires_at: expires,
      // low risk = auto-approved at insert; service layer should execute it.
      status: input.risk_level === "low" ? "approved" : "pending",
    })
    .select("id, status")
    .single();

  if (error) throw error;
  return data;
}

export async function approveAction(id: string) {
  const { data, error } = await supabase
    .from("pending_agent_actions")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function rejectAction(id: string) {
  const { error } = await supabase
    .from("pending_agent_actions")
    .update({ status: "rejected", approved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function listPendingForUser(userId: string) {
  const { data, error } = await supabase
    .from("pending_agent_actions")
    .select("*")
    .eq("status", "pending")
    .or(`patient_id.eq.${userId},requires_approval_from.eq.physician`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
