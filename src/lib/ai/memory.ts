/**
 * Layer 4 — Semantic memory retrieval & storage.
 * Uses the `ai-memory` edge function so embeddings stay server-side
 * (no embedding API key in the browser).
 */
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import type { MemoryType, PatientMemory } from "./types";

export async function retrieveRelevantMemories(
  patientId: string,
  query: string,
  limit = 10,
  threshold = 0.7,
): Promise<PatientMemory[]> {
  const { data, error } = await supabase.functions.invoke("ai-memory", {
    body: { op: "retrieve", patient_id: patientId, query, limit, threshold },
  });
  if (error) {
    logger.error("retrieveRelevantMemories error", error);
    return [];
  }
  return ((data as { memories?: PatientMemory[] })?.memories) ?? [];
}

export async function storeMemory(
  patientId: string,
  content: string,
  type: MemoryType,
  source: string,
  confidence = 0.8,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase.functions.invoke("ai-memory", {
    body: {
      op: "store",
      patient_id: patientId,
      content,
      memory_type: type,
      source,
      confidence,
    },
  });
  if (error) {
    logger.error("storeMemory error", error);
    return null;
  }
  return data as { id: string };
}

export async function listRecentMemories(
  patientId: string,
  limit = 20,
): Promise<PatientMemory[]> {
  const { data, error } = await supabase
    .from("patient_memory")
    .select("id, patient_id, memory_type, content, confidence, source, created_at")
    .eq("patient_id", patientId)
    .eq("is_active", true)
    .order("last_reinforced_at", { ascending: false })
    .limit(limit);
  if (error) {
    logger.error("listRecentMemories error", error);
    return [];
  }
  return (data ?? []) as PatientMemory[];
}
