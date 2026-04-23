/**
 * Layer 1 — Model-agnostic AI Gateway.
 *
 * NEVER call providers directly. All AI traffic flows through this gateway,
 * which forwards to the `ai-gateway` edge function. When a smarter model
 * arrives, change one line in MODEL_ROUTER (or in the edge function) and
 * the entire platform absorbs the new capability.
 */
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import type { AIRequest, AIResponse, AITask, ModelTier } from "./types";

/** Model routing — the ONLY place model identifiers live on the client. */
export const MODEL_ROUTER: Record<ModelTier, string> = {
  fast: "google/gemini-2.5-flash-lite",
  smart: "google/gemini-3-flash-preview",
  reasoning: "openai/gpt-5",
};

/** Default tier per task. Change here without touching call sites. */
export const TASK_MODEL_MAP: Record<AITask, ModelTier> = {
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

export function resolveModel(task: AITask, preference?: ModelTier): string {
  return MODEL_ROUTER[preference ?? TASK_MODEL_MAP[task]];
}

/**
 * Single entrypoint for every AI call in the app.
 * Routes through the `ai-gateway` edge function so secrets, observability,
 * and rate-limiting stay server-side.
 */
export async function aiGateway(request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const { data, error } = await supabase.functions.invoke("ai-gateway", {
    body: request,
  });

  if (error || !data) {
    logger.error("aiGateway error", error);
    throw new Error(error?.message ?? "AI gateway failed");
  }
  if ((data as { error?: string }).error) {
    throw new Error((data as { error: string }).error);
  }

  return {
    ...(data as AIResponse),
    latency_ms: (data as AIResponse).latency_ms ?? Date.now() - start,
  };
}
