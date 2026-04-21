export const PERSONAS: Record<string, { label: string; emoji: string; description: string }> = {
  sleep_deprived_achiever: {
    label: "Sleep-Deprived Achiever",
    emoji: "🥱",
    description: "Έχεις υψηλή απόδοση αλλά ο ύπνος σου υποφέρει. Ώρα να ισορροπήσεις.",
  },
  burnout_risk: {
    label: "Burnout Risk",
    emoji: "🔥",
    description: "Υψηλό stress, χαμηλή ενέργεια, κακός ύπνος. Άμεση παρέμβαση recovery.",
  },
  high_performer: {
    label: "High Performer",
    emoji: "⚡",
    description: "Καλά scores παντού — εστιάζουμε στη βελτιστοποίηση των άκρων.",
  },
  energy_depleted: {
    label: "Energy Depleted",
    emoji: "🔋",
    description: "Η ενέργεια είναι το κύριο θέμα. Mitochondrial & circadian focus.",
  },
  stress_overloaded: {
    label: "Stress Overloaded",
    emoji: "🌀",
    description: "Το stress σε καταβάλλει. Recovery και HRV-based παρεμβάσεις.",
  },
  good_baseline: {
    label: "Good Baseline",
    emoji: "✅",
    description: "Καλό σημείο εκκίνησης — υπάρχει περιθώριο για fine-tuning.",
  },
};

export const TIER_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Tier 1 · Lifestyle", color: "bg-health-mint-light text-primary" },
  2: { label: "Tier 2 · Supplements", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  3: { label: "Tier 3 · Medical", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
};

export const EVIDENCE_LABELS: Record<string, string> = {
  strong: "Ισχυρή",
  moderate: "Μέτρια",
  emerging: "Αναδυόμενη",
  anecdotal: "Ανέκδοτη",
};

export const DOMAIN_ICONS: Record<string, string> = {
  sleep: "🌙",
  energy: "⚡",
  stress: "🧘",
  nutrition: "🥗",
  movement: "🏃",
  mindfulness: "🧠",
  supplements: "💊",
};

export const DISCLAIMER = "Το Medithos παρέχει evidence-based πληροφόρηση για βελτιστοποίηση απόδοσης. Δεν αποτελεί ιατρική πράξη. Τα Tier 3 πρωτόκολλα απαιτούν πάντα ιατρική παρακολούθηση.";
