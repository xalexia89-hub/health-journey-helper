// Layer 4 — Patient memory (semantic store + retrieval).
// Embeddings produced via Lovable AI Gateway (google/text-embedding-004 dim=768).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EMBED_MODEL = "google/text-embedding-004";

function jsonResp(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function embed(text: string): Promise<number[] | null> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return null;
  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: text }),
    });
    if (!resp.ok) {
      console.error("embed failed", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (e) {
    console.error("embed error", e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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
  try { body = await req.json(); } catch { return jsonResp({ error: "Invalid JSON" }, 400); }

  const op = body.op as "store" | "retrieve";
  const patient_id = body.patient_id as string;
  if (!op || !patient_id) return jsonResp({ error: "Missing op/patient_id" }, 400);

  if (op === "store") {
    const content = String(body.content ?? "").trim();
    if (!content) return jsonResp({ error: "Empty content" }, 400);
    const embedding = await embed(content);

    const { data, error } = await supabase
      .from("patient_memory")
      .insert({
        patient_id,
        memory_type: body.memory_type ?? "observed_pattern",
        content,
        embedding: embedding as never,
        confidence: body.confidence ?? 0.8,
        source: body.source ?? "ai_memory",
      })
      .select("id")
      .single();

    if (error) {
      console.error("store memory error", error);
      return jsonResp({ error: error.message }, 500);
    }
    return jsonResp(data);
  }

  if (op === "retrieve") {
    const query = String(body.query ?? "").trim();
    if (!query) return jsonResp({ memories: [] });
    const embedding = await embed(query);
    if (!embedding) {
      // Fallback: recent memories only.
      const { data } = await supabase
        .from("patient_memory")
        .select("id, patient_id, memory_type, content, confidence, source, created_at")
        .eq("patient_id", patient_id)
        .eq("is_active", true)
        .order("last_reinforced_at", { ascending: false })
        .limit(body.limit ?? 10);
      return jsonResp({ memories: data ?? [], fallback: true });
    }

    const { data, error } = await supabase.rpc("match_patient_memories", {
      p_patient_id: patient_id,
      query_embedding: embedding as never,
      match_threshold: body.threshold ?? 0.7,
      match_count: body.limit ?? 10,
    });
    if (error) {
      console.error("rpc match error", error);
      return jsonResp({ error: error.message }, 500);
    }
    return jsonResp({ memories: data ?? [] });
  }

  return jsonResp({ error: "Unknown op" }, 400);
});
