// Analyzes a medical document (PDF or image) using Lovable AI Gateway (Gemini vision)
// Returns structured: extracted values, out-of-range flags, plain Greek explanation.
// SAFETY: Never returns a diagnosis. Always appends a disclaimer.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Είσαι βοηθός ιατρικής ενημέρωσης που αναλύει εικόνες/PDF ιατρικών εγγράφων στα Ελληνικά.

ΚΑΝΟΝΕΣ:
- ΠΟΤΕ μη δίνεις διάγνωση. ΠΟΤΕ μη συστήνεις φάρμακα ή θεραπεία.
- Εξήγησε σε απλά Ελληνικά τι δείχνει το έγγραφο.
- Για εξετάσεις αίματος: εξάγαγε ΟΛΕΣ τις τιμές με unit + reference range αν υπάρχει.
- Επισήμανε τιμές εκτός φυσιολογικών ορίων ως flags με severity (info/warning/critical).
- Για απεικονιστικά (X-ray/MRI): δώσε μόνο γενικές παρατηρήσεις από το κείμενο της γνωμάτευσης. ΜΗΝ ερμηνεύεις την εικόνα ως ακτινολόγος.
- Πάντα κατέληξε με σύσταση "Συζητήστε τα αποτελέσματα με τον γιατρό σας."

ΕΠΙΣΤΡΟΦΗ: Πρέπει να καλέσεις την συνάρτηση record_analysis με δομημένα αποτελέσματα.`;

const ANALYSIS_TOOL = {
  type: "function",
  function: {
    name: "record_analysis",
    description: "Record the structured analysis of a medical document.",
    parameters: {
      type: "object",
      properties: {
        document_kind: {
          type: "string",
          enum: ["blood_test", "imaging", "prescription", "diagnosis_report", "other"],
        },
        summary: {
          type: "string",
          description: "Σύντομη σύνοψη 1-2 προτάσεων στα Ελληνικά.",
        },
        plain_explanation: {
          type: "string",
          description: "Αναλυτική εξήγηση σε απλά Ελληνικά (3-6 προτάσεις).",
        },
        extracted_values: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "string" },
              unit: { type: "string" },
              reference_range: { type: "string" },
              status: {
                type: "string",
                enum: ["normal", "low", "high", "unknown"],
              },
            },
            required: ["name", "value", "status"],
          },
        },
        flags: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              severity: {
                type: "string",
                enum: ["info", "warning", "critical"],
              },
              explanation: { type: "string" },
            },
            required: ["label", "severity", "explanation"],
          },
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
          description: "Γενικές συστάσεις (π.χ. 'Συζητήστε με γιατρό', 'Επανέλεγχος σε 3 μήνες').",
        },
      },
      required: ["document_kind", "summary", "plain_explanation", "extracted_values", "flags", "recommendations"],
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth check
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const documentId: string | undefined = body.document_id;
    if (!documentId || typeof documentId !== "string") {
      return new Response(JSON.stringify({ error: "document_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client to read the file (bucket is private) and write analysis
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: doc, error: docErr } = await admin
      .from("medical_documents")
      .select("id, user_id, file_name, file_url, file_type, document_category, description")
      .eq("id", documentId)
      .single();

    if (docErr || !doc) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (doc.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as processing (upsert on document_id unique)
    await admin.from("medical_document_analyses").upsert(
      {
        user_id: userId,
        document_id: documentId,
        status: "processing",
        ai_model: "google/gemini-3-flash-preview",
      },
      { onConflict: "document_id" }
    );

    // Download the file
    const { data: fileBlob, error: dlErr } = await admin.storage
      .from("medical-documents")
      .download(doc.file_url);

    if (dlErr || !fileBlob) {
      await admin
        .from("medical_document_analyses")
        .update({ status: "failed", error_message: "Δεν ήταν δυνατή η λήψη του αρχείου." })
        .eq("document_id", documentId);
      return new Response(JSON.stringify({ error: "Cannot download file" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mimeType = doc.file_type || fileBlob.type || "application/octet-stream";
    const arrayBuf = await fileBlob.arrayBuffer();
    // base64 encode
    const bytes = new Uint8Array(arrayBuf);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const userMessageContent: any[] = [
      {
        type: "text",
        text: `Ανέλυσε αυτό το ιατρικό έγγραφο. Κατηγορία (από χρήστη): ${doc.document_category || "άγνωστο"}. Περιγραφή: ${doc.description || "—"}. Όνομα αρχείου: ${doc.file_name}.`,
      },
      {
        type: "image_url",
        image_url: { url: dataUrl },
      },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessageContent },
        ],
        tools: [ANALYSIS_TOOL],
        tool_choice: { type: "function", function: { name: "record_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error", aiResp.status, errText);
      let userMsg = "Η AI ανάλυση απέτυχε. Δοκιμάστε ξανά.";
      if (aiResp.status === 429) userMsg = "Πολλά αιτήματα. Δοκιμάστε σε λίγο.";
      if (aiResp.status === 402) userMsg = "Έχουν εξαντληθεί τα AI credits.";
      await admin
        .from("medical_document_analyses")
        .update({ status: "failed", error_message: userMsg })
        .eq("document_id", documentId);
      return new Response(JSON.stringify({ error: userMsg }), {
        status: aiResp.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      await admin
        .from("medical_document_analyses")
        .update({
          status: "failed",
          error_message: "Δεν παρήχθη δομημένο αποτέλεσμα.",
        })
        .eq("document_id", documentId);
      return new Response(JSON.stringify({ error: "No structured output" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      parsed = {};
    }

    const update = {
      status: "completed",
      document_kind: parsed.document_kind || "other",
      summary: parsed.summary || null,
      plain_explanation: parsed.plain_explanation || null,
      extracted_values: Array.isArray(parsed.extracted_values) ? parsed.extracted_values : [],
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
      error_message: null,
    };

    const { data: saved, error: upErr } = await admin
      .from("medical_document_analyses")
      .update(update)
      .eq("document_id", documentId)
      .select()
      .single();

    if (upErr) {
      console.error("DB update error", upErr);
      return new Response(JSON.stringify({ error: "Failed to save analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ analysis: saved }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-medical-document fatal", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
