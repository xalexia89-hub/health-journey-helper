// Client-side types + helpers for the Medithos Systemic Health Navigation layer.
// The decision itself is produced deterministically on the server; the client
// only renders it. No internal chain-of-thought is ever transported here.

export type RoutingCategory =
  | "EMERGENCY"
  | "URGENT_ASSESSMENT"
  | "DOCTOR_PRIMARY_CARE"
  | "SPECIALIST"
  | "TELEMEDICINE"
  | "SCHEDULED_CARE"
  | "SELF_CARE_MONITORING";

export interface NavigationSignal {
  scenario: string;
  routing: RoutingCategory;
  routingLabel: string;
  urgency: "emergency" | "urgent" | "soon" | "routine";
  uncertainty: "LOW" | "MODERATE" | "HIGH";
  emergencyPathway: boolean;
  safetyNet: string[];
  missingCriticalInfo: string[];
  redFlagCount: number;
  timestamp: string;
}

/** Reads the deterministic navigation decision from the response headers. */
export function parseNavigationHeader(headers: Headers): NavigationSignal | null {
  const raw = headers.get("X-Medithos-Navigation");
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as NavigationSignal;
  } catch {
    return null;
  }
}

export const ROUTING_LABELS_EL: Record<RoutingCategory, string> = {
  EMERGENCY: "Έκτακτη ανάγκη",
  URGENT_ASSESSMENT: "Επείγουσα εκτίμηση",
  DOCTOR_PRIMARY_CARE: "Γιατρός / Πρωτοβάθμια φροντίδα",
  SPECIALIST: "Παραπομπή σε ειδικότητα",
  TELEMEDICINE: "Τηλεϊατρική",
  SCHEDULED_CARE: "Προγραμματισμένη φροντίδα",
  SELF_CARE_MONITORING: "Αυτοφροντίδα & παρακολούθηση",
};

export const ROUTING_DESCRIPTIONS_EL: Record<RoutingCategory, string> = {
  EMERGENCY: "Χρειάζεται άμεση δράση τώρα — καλέστε 166 ή 112.",
  URGENT_ASSESSMENT: "Χρειάζεται ιατρική εκτίμηση μέσα στις επόμενες ώρες.",
  DOCTOR_PRIMARY_CARE: "Προτείνεται επίσκεψη σε γιατρό τις επόμενες ημέρες.",
  SPECIALIST: "Προτείνεται εκτίμηση από ειδικότητα.",
  TELEMEDICINE: "Μια τηλεϊατρική εκτίμηση μπορεί να ξεκαθαρίσει την εικόνα.",
  SCHEDULED_CARE: "Μπορεί να προγραμματιστεί χωρίς βιασύνη.",
  SELF_CARE_MONITORING: "Παρακολούθηση με αυτοφροντίδα και επανεκτίμηση.",
};

export const UNCERTAINTY_LABELS_EL: Record<NavigationSignal["uncertainty"], string> = {
  LOW: "Επαρκείς πληροφορίες",
  MODERATE: "Μερικώς επαρκείς πληροφορίες",
  HIGH: "Περιορισμένες πληροφορίες",
};

export const URGENCY_LABELS_EL: Record<NavigationSignal["urgency"], string> = {
  emergency: "Άμεσα",
  urgent: "Επείγον",
  soon: "Σύντομα",
  routine: "Χωρίς βιασύνη",
};

export const SCENARIO_LABELS_EL: Record<string, string> = {
  chest_pain: "Θωρακικό ενόχλημα",
  neurological: "Νευρολογικά συμπτώματα",
  respiratory: "Αναπνευστικό",
  abdominal_pain: "Κοιλιακό άλγος",
  fever: "Πυρετός / λοίμωξη",
  musculoskeletal: "Μυοσκελετικό",
  mental_health_crisis: "Ψυχική υγεία",
  bleeding: "Αιμορραγία",
  allergic_reaction: "Αλλεργική αντίδραση",
  general: "Γενικό ερώτημα υγείας",
};

export const MISSING_INFO_LABELS_EL: Record<string, string> = {
  onset: "πότε ξεκίνησε",
  duration: "πόσο διαρκεί",
  severity: "πόσο έντονο είναι",
  progression: "αν επιδεινώνεται ή βελτιώνεται",
  location: "πού ακριβώς εντοπίζεται",
  associated_symptoms: "ποια άλλα συμπτώματα συνυπάρχουν",
  fever: "αν υπάρχει πυρετός",
  temperature: "η τιμή της θερμοκρασίας",
  trauma: "αν προηγήθηκε τραυματισμός ή πτώση",
  cardiac_history: "το καρδιολογικό ιστορικό",
  neuro_signs: "αν υπάρχουν νευρολογικά σημεία",
  focal_signs: "αν υπάρχουν εστιακά νευρολογικά σημεία",
  dyspnea_at_rest: "αν υπάρχει δύσπνοια σε ηρεμία",
  systemic_signs: "αν υπάρχουν σημεία συστηματικής επιβάρυνσης",
  oral_intake: "αν λαμβάνετε υγρά κανονικά",
  self_harm_risk: "αν υπάρχουν σκέψεις αυτοτραυματισμού",
  support: "αν υπάρχει υποστηρικτικό περιβάλλον",
  main_symptom: "ποιο είναι το κύριο σύμπτωμα",
  medications: "η τρέχουσα φαρμακευτική αγωγή",
};

export const scenarioLabel = (id: string) => SCENARIO_LABELS_EL[id] ?? id;
export const missingInfoLabel = (f: string) => MISSING_INFO_LABELS_EL[f] ?? f;
