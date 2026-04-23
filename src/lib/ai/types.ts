/**
 * AGI-ready type system for Medithos AI Gateway.
 * The shell stays the same forever; only MODEL_ROUTER swaps when smarter models arrive.
 */

export type AITask =
  | "triage"      // Navigator agent — symptom routing
  | "monitor"     // Guardian agent — anomaly detection
  | "insight"    // Insight agent — pattern synthesis
  | "summarize"   // Executive summary generation
  | "score"       // Health score calculation
  | "protocol"    // Biohacking protocol generation
  | "drug_check"  // Medication interaction analysis
  | "extract"     // Structured data extraction from unstructured text
  | "reason";     // Multi-step reasoning (reserved for AGI-grade tasks)

export type ModelTier = "fast" | "smart" | "reasoning";

export interface PatientContext {
  patient_id: string;
  // Free-form holistic snapshot — anything the agent should know.
  snapshot?: Record<string, unknown>;
  // Optional retrieved memories from semantic search.
  memories?: PatientMemory[];
  // Optional running session messages.
  history?: AIMessage[];
}

export interface AIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: unknown;
}

export interface AIRequest {
  task: AITask;
  context: PatientContext;
  prompt: string;
  system?: string;
  model_preference?: ModelTier;
  max_tokens?: number;
  temperature?: number;
  /** Tool/function schema for structured output. */
  tools?: unknown[];
  tool_choice?: unknown;
  /** Extra system instructions appended (e.g. previous agent steps). */
  system_additions?: string;
}

export interface AIResponse {
  content: string;
  model_used: string;
  tokens_used: number;
  tokens_input: number;
  tokens_output: number;
  latency_ms: number;
  tool_calls?: unknown;
  confidence?: number;
  raw?: unknown;
}

export type MemoryType =
  | "health_fact"
  | "observed_pattern"
  | "preference"
  | "concern"
  | "milestone"
  | "agent_hypothesis";

export interface PatientMemory {
  id: string;
  patient_id: string;
  memory_type: MemoryType;
  content: string;
  confidence: number;
  source: string;
  created_at: string;
  similarity?: number;
}

export type AgentActionType =
  | "alert_sent"
  | "appointment_suggested"
  | "protocol_adjusted"
  | "memory_stored"
  | "physician_notified"
  | "risk_flag_raised"
  | "prescription_reviewed";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface AgentStep {
  thought: string;
  action: AgentAction | null;
  observation: string | null;
  should_continue: boolean;
}

export interface AgentAction {
  type:
    | "query_memory"
    | "fetch_data"
    | "send_alert"
    | "update_protocol"
    | "notify_physician"
    | "store_memory";
  params: Record<string, unknown>;
}

export interface AgentMessage {
  from: AITask;
  to: AITask | "human";
  type: "request" | "response" | "alert" | "handoff";
  payload: unknown;
  priority: "low" | "normal" | "high" | "urgent";
}
