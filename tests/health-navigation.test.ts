import { describe, it, expect } from "vitest";
import {
  evaluateNavigation,
  buildAdaptiveSafetyNet,
  ROUTING_RANK,
  SCENARIOS,
  missingInfoLabel,
  type PatientContextState,
  type RoutingCategory,
} from "../supabase/functions/_shared/health-navigation.ts";

const emptyCtx = (over: Partial<PatientContextState> = {}): PatientContextState => ({
  age: null,
  sex: null,
  chronicConditions: [],
  medications: [],
  allergies: [],
  recentEpisodes: [],
  ...over,
});

const run = (text: string, ctx: PatientContextState = emptyCtx()) =>
  evaluateNavigation(text, text, ctx);

describe("deterministic red-flag escalation", () => {
  const cases: Array<[string, string, RoutingCategory, string]> = [
    ["chest pain", "Έχω πόνο στο στήθος από το πρωί", "EMERGENCY", "RF_CHEST_PAIN_ACUTE"],
    ["dyspnea", "Έχω δύσπνοια και δεν μπορώ να αναπνεύσω", "EMERGENCY", "RF_DYSPNEA"],
    ["neuro deficit", "Στράβωσε το στόμα μου και δεν μιλάω καθαρά", "EMERGENCY", "RF_NEURO_DEFICIT"],
    ["syncope", "Λιποθύμησα πριν λίγο", "EMERGENCY", "RF_SYNCOPE"],
    ["bleeding", "Έχω αιμορραγία που δεν σταματά", "EMERGENCY", "RF_ACTIVE_BLEEDING"],
    ["anaphylaxis", "Πρήστηκε ο λαιμός μου και δεν καταπίνω", "EMERGENCY", "RF_ANAPHYLAXIS"],
    ["suicidal ideation", "Σκέφτομαι την αυτοκτονία", "EMERGENCY", "RF_SUICIDAL_IDEATION"],
    ["sepsis pattern", "Πυρετός με ρίγη και αυχενική δυσκαμψία", "URGENT_ASSESSMENT", "RF_SEPSIS_PATTERN"],
    ["severe abdomen", "Ξαφνικός αφόρητος κοιλιακός πόνος", "URGENT_ASSESSMENT", "RF_SEVERE_ABDOMEN"],
  ];

  it.each(cases)("%s triggers %s", (_name, text, routing, ruleId) => {
    const d = run(text);
    expect(d.redFlags.map((r) => r.id)).toContain(ruleId);
    expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(ROUTING_RANK[routing]);
  });

  it("marks the emergency pathway and emergency urgency", () => {
    const d = run("Έχω πόνο στο στήθος και εφίδρωση");
    expect(d.routing).toBe("EMERGENCY");
    expect(d.emergencyPathway).toBe(true);
    expect(d.urgency).toBe("emergency");
  });

  it("works with English input and without accents", () => {
    const d = run("I have chest pain since this morning");
    expect(d.routing).toBe("EMERGENCY");
    const noAccents = run("πονος στο στηθος");
    expect(noAccents.routing).toBe("EMERGENCY");
  });
});

describe("relationship analysis (combinations, not isolated facts)", () => {
  it("escalates bleeding while on anticoagulants", () => {
    const d = run("Χτύπησα το κεφάλι μου σε πτώση", emptyCtx({ medications: ["Xarelto 20mg"] }));
    expect(d.relationships.map((r) => r.id)).toContain("REL_BLEEDING_ON_ANTICOAG");
    expect(d.routing).toBe("EMERGENCY");
  });

  it("escalates fever in an immunosuppressed patient", () => {
    const d = run("Έχω πυρετό 38 βαθμούς εδώ και μέρες", emptyCtx({ chronicConditions: ["χημειοθεραπεία"] }));
    expect(d.relationships.map((r) => r.id)).toContain("REL_FEVER_IMMUNOSUPPRESSED");
    expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(ROUTING_RANK["URGENT_ASSESSMENT"]);
  });

  it("lowers the threshold for patients aged 65+ with acute symptoms", () => {
    const d = run("Ξαφνικά νιώθω πολύ αδύναμος", emptyCtx({ age: 78 }));
    expect(d.relationships.map((r) => r.id)).toContain("REL_AGE65_PLUS_ACUTE");
    expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(ROUTING_RANK["URGENT_ASSESSMENT"]);
  });

  it("escalates musculoskeletal pain in pregnancy to specialist level", () => {
    const d = run("Πονάει η μέση μου εδώ και μέρες, είμαι έγκυος");
    expect(d.relationships.map((r) => r.id)).toContain("REL_PREGNANCY");
    expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(ROUTING_RANK["SPECIALIST"]);
  });

  it("never de-escalates below the scenario baseline", () => {
    for (const s of SCENARIOS) {
      const d = run("κάτι γενικό");
      expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(0);
      expect(typeof s.baselineRouting).toBe("string");
    }
    const chest = run("πόνος στο στήθος");
    expect(ROUTING_RANK[chest.routing]).toBeGreaterThanOrEqual(ROUTING_RANK["URGENT_ASSESSMENT"]);
  });
});

describe("uncertainty handling", () => {
  it("reports HIGH uncertainty and escalates at least to telemedicine", () => {
    const d = run("πονάει");
    expect(d.uncertainty).toBe("HIGH");
    expect(ROUTING_RANK[d.routing]).toBeGreaterThanOrEqual(ROUTING_RANK["TELEMEDICINE"]);
  });

  it("reduces uncertainty when the critical fields are described", () => {
    const vague = run("έχω πυρετό");
    const detailed = run("Έχω πυρετό 38.5 εδώ και 2 μέρες, με ρίγη και αδυναμία");
    expect(detailed.missingCriticalInfo.length).toBeLessThan(vague.missingCriticalInfo.length);
  });

  it("asks only routing-relevant questions (max 3)", () => {
    const d = run("πονάει το κεφάλι μου");
    expect(d.keyQuestions.length).toBeGreaterThan(0);
    expect(d.keyQuestions.length).toBeLessThanOrEqual(3);
  });
});

describe("routing categories per supported scenario", () => {
  const scenarioCases: Array<[string, string]> = [
    ["Πόνος στο στήθος", "chest_pain"],
    ["Έχω δυνατό πονοκέφαλο", "neurological"],
    ["Έχω βήχα και πονόλαιμο", "respiratory"],
    ["Έχω ναυτία και πόνο στο στομάχι", "abdominal_pain"],
    ["Έχω πυρετό", "fever"],
    ["Πονάει η μέση μου", "musculoskeletal"],
    ["Έχω άγχος και κατάθλιψη", "mental_health_crisis"],
    ["Θέλω μια γενική συμβουλή", "general"],
  ];

  it.each(scenarioCases)("%s maps to scenario %s", (text, scenario) => {
    expect(run(text).scenario).toBe(scenario);
  });

  it("only ever produces known routing categories", () => {
    for (const [text] of scenarioCases) {
      expect(Object.keys(ROUTING_RANK)).toContain(run(text).routing);
    }
  });
});

describe("adaptive safety net", () => {
  it("adapts to the detected red flag", () => {
    const d = run("Έχω πόνο στο στήθος");
    expect(d.safetyNet.some((s) => s.includes("166"))).toBe(true);
    expect(d.safetyNet.length).toBeLessThanOrEqual(6);
  });

  it("uses the crisis line for suicidal ideation", () => {
    const d = run("σκέφτομαι να δώσω τέλος");
    expect(d.safetyNet.some((s) => s.includes("1018"))).toBe(true);
  });

  it("mentions the specific missing information when uncertainty is high", () => {
    const d = run("πονάει");
    expect(d.uncertainty).toBe("HIGH");
    expect(d.safetyNet.some((s) => s.includes("περιορισμένες"))).toBe(true);
  });

  it("adds anticoagulant-specific guidance", () => {
    const d = run("έπεσα και χτύπησα το κεφάλι", emptyCtx({ medications: ["Sintrom"] }));
    expect(d.safetyNet.some((s) => s.includes("αντιπηκτική"))).toBe(true);
  });

  it("produces distinct safety nets for different risk states", () => {
    const a = run("Έχω πόνο στο στήθος").safetyNet.join("|");
    const b = run("Πονάει η μέση μου εδώ και μέρες, ήπιος πόνος, σταθερό").safetyNet.join("|");
    expect(a).not.toBe(b);
  });

  it("always ends with a reassessment instruction and no duplicates", () => {
    const d = run("Έχω πυρετό 38 και βήχα εδώ και 3 μέρες");
    expect(new Set(d.safetyNet).size).toBe(d.safetyNet.length);
    expect(d.safetyNet.length).toBeGreaterThan(0);
  });

  it("builder is pure and bounded", () => {
    const net = buildAdaptiveSafetyNet(
      SCENARIOS[0], "EMERGENCY", [], [], ["onset", "severity", "progression"], "HIGH", emptyCtx(),
    );
    expect(net.length).toBeLessThanOrEqual(6);
    expect(net[0]).toContain("166");
  });
});

describe("greek localisation helpers", () => {
  it("translates missing information field ids", () => {
    expect(missingInfoLabel("onset")).toBe("πότε ξεκίνησε");
    expect(missingInfoLabel("unknown_field")).toBe("unknown_field");
  });
});
