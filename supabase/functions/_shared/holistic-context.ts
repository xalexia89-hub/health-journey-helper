/**
 * Builds the holistic system prompt block to inject into any AI agent.
 * Use as a SECOND system message AFTER the agent's role-specific prompt.
 */
export function buildHolisticContextPrompt(ctx: any): string {
  if (!ctx) return "";

  const fmt = (v: any, fallback = "—") =>
    v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
      ? fallback
      : Array.isArray(v)
        ? v.join(", ")
        : typeof v === "object"
          ? JSON.stringify(v)
          : String(v);

  const meds = (ctx.current_medications || [])
    .map((m: any) => `• ${m.name} ${m.dose || ""} (${m.frequency || ""})`)
    .join("\n") || "—";

  const labs = (ctx.last_lab_results || [])
    .map((l: any) => `• ${l.test}: ${l.value} ${l.unit} [${l.flag}] (${l.date})`)
    .join("\n") || "—";

  const family = (ctx.family_history || [])
    .map((f: any) => `• ${f.relation}: ${(f.conditions || []).join(", ")}${f.age_of_onset ? ` (onset ${f.age_of_onset})` : ""}${f.deceased ? " [deceased]" : ""}`)
    .join("\n") || "—";

  const risks = (ctx.hereditary_risk_flags || [])
    .map((r: any) => `• ${r.condition} — risk: ${r.risk_level} (${r.reasoning})`)
    .join("\n") || "—";

  const appts = (ctx.appointment_history || [])
    .slice(0, 8)
    .map((a: any) => `• ${a.date} — ${a.specialty} (${a.status})`)
    .join("\n") || "—";

  const ls = ctx.lifestyle || {};

  return `

═══════════════════════════════════════════════════════════
HOLISTIC PATIENT CONTEXT — read in full before answering
═══════════════════════════════════════════════════════════

Age: ${fmt(ctx.age)} | Gender: ${fmt(ctx.gender)} | Blood type: ${fmt(ctx.blood_type)}

MEDICAL HISTORY
Chronic conditions: ${fmt(ctx.chronic_conditions)}
Past diagnoses:     ${fmt(ctx.past_diagnoses)}
Past surgeries:     ${fmt(ctx.past_surgeries)}
Allergies:          ${fmt(ctx.allergies)}

CURRENT MEDICATIONS
${meds}
⚠ Mentally check medication interactions before any new suggestion.

RECENT LAB RESULTS
${labs}
Flag any out-of-range values when relevant.

FAMILY HEREDITARY TREE
${family}
Hereditary risk flags:
${risks}
Consider genetic predispositions when interpreting symptoms.

BEHAVIOUR PATTERNS
Recent appointments:
${appts}
Recurring symptom themes: ${fmt(ctx.symptom_search_patterns)}
Most visited specialties: ${fmt(ctx.most_visited_specialties)}
Prevention plan adherence: ${fmt(ctx.prevention_plan_adherence)}

LIFESTYLE
Smoking: ${fmt(ls.smoking)} | Alcohol: ${fmt(ls.alcohol)} | Exercise: ${fmt(ls.exercise_frequency)}
Sleep: ${fmt(ls.sleep_hours)} hrs | Stress: ${fmt(ls.stress_level)} | Work: ${fmt(ls.work_type)}
Diet notes: ${fmt(ls.diet_notes)}

THINKING INSTRUCTIONS
1. Read the full context before responding.
2. Look for CONNECTIONS — does this symptom relate to existing conditions, family history, or current meds?
3. Check medication interactions for anything you suggest.
4. Weight hereditary risks (e.g. early heart disease in father + chest tightness = higher urgency).
5. Notice patterns across symptom themes and lab values.
6. Consider lifestyle factors (stress, sleep, activity).
7. Be warm, clear, human — never clinical and cold.
8. Always end with: what to do RIGHT NOW + what to monitor over time.
9. Never diagnose. Recommend professional consultation for anything beyond general wellness.
10. If a medication interaction risk is detected, flag clearly with ⚠.

Language: respond in the same language as the patient's message.
═══════════════════════════════════════════════════════════
`;
}

/** Fetch context from inside an edge function using the caller's auth token. */
export async function fetchHolisticContext(authHeader: string, patient_id?: string) {
  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/assemble-patient-context`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
      },
      body: JSON.stringify(patient_id ? { patient_id } : {}),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.context || null;
  } catch (e) {
    console.error("fetchHolisticContext error:", e);
    return null;
  }
}
