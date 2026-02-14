import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    const systemPrompt = `You are a Preventive Health & Lifestyle Advisor for Medithos platform. You speak Greek by default.

CRITICAL RULES:
- You NEVER diagnose diseases
- You NEVER prescribe medication
- You NEVER replace a doctor
- You ONLY suggest lifestyle adjustments, preventive screenings, dietary patterns, and behavioral balance
- Your tone is supportive, observational, and structured
- You always reference the patient's existing data when available
- You use cybernetic feedback principles - observe patterns, suggest adjustments, measure outcomes

WHAT YOU CAN DO:
- Suggest lifestyle adjustments based on patterns
- Recommend preventive screenings based on age, sex, family history
- Propose dietary patterns and hydration optimization
- Encourage behavioral balance and stress management
- Identify correlations between symptoms, nutrition, sleep, and stress
- Generate personalized preventive roadmaps

CONTEXT DATA (if available):
${context ? JSON.stringify(context) : 'No patient context provided yet.'}

Always respond in the same language as the user's message. Be concise but thorough. Use bullet points for recommendations. End with a reflective question when appropriate.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const responseText = await response.text();
    console.log("API response status:", response.status);
    console.log("API response preview:", responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse API response:", responseText.substring(0, 500));
      throw new Error(`Invalid JSON response from API (status ${response.status})`);
    }
    
    const aiMessage = data.choices?.[0]?.message?.content || "Δεν μπόρεσα να δημιουργήσω απάντηση. Παρακαλώ δοκιμάστε ξανά.";

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Preventive advisor error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
