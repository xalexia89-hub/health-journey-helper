// Pre-loaded demo data for investor presentations

export const DEMO_PROFILE = {
  full_name: 'Μαρία Παπαδοπούλου',
};

export const DEMO_HEALTH_FILE = {
  onboarding_completed: true,
  weight_kg: 62,
  height_cm: 168,
  blood_pressure_systolic: 118,
  blood_pressure_diastolic: 75,
  date_of_birth: '1990-05-15',
  sex: 'female',
  activity_level: 'moderate',
  smoking_status: 'never',
};

export const DEMO_APPOINTMENTS = [
  {
    id: 'demo-apt-1',
    appointment_date: '2026-04-18',
    appointment_time: '10:30',
    status: 'confirmed',
    provider: { name: 'Δρ. Νίκος Παπαδόπουλος', specialty: 'Παθολόγος' },
  },
  {
    id: 'demo-apt-2',
    appointment_date: '2026-04-22',
    appointment_time: '14:00',
    status: 'pending',
    provider: { name: 'Δρ. Ελένη Κωνσταντίνου', specialty: 'Δερματολόγος' },
  },
  {
    id: 'demo-apt-3',
    appointment_date: '2026-04-28',
    appointment_time: '09:00',
    status: 'confirmed',
    provider: { name: 'Διαγνωστικό Κέντρο Αθηνών', specialty: 'Αιματολογικός Έλεγχος' },
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'demo-notif-1',
    title: 'Υπενθύμιση Ραντεβού',
    message: 'Το ραντεβού σας με τον Δρ. Παπαδόπουλο είναι σε 2 ημέρες',
    type: 'appointment',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-notif-2',
    title: 'Αποτελέσματα Εξετάσεων',
    message: 'Τα αποτελέσματα του βιοχημικού ελέγχου είναι έτοιμα',
    type: 'medical',
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'demo-notif-3',
    title: 'Φάρμακο - Ώρα λήψης',
    message: 'Ώρα να πάρετε Βιταμίνη D 2000IU',
    type: 'medication',
    is_read: true,
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'demo-notif-4',
    title: 'Νέο Άρθρο Ακαδημίας',
    message: 'Πρόληψη καρδιαγγειακών παθήσεων — νέα κατευθυντήρια',
    type: 'education',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEMO_MEDICATIONS = [
  {
    id: 'demo-med-1',
    medication_name: 'Βιταμίνη D 2000IU',
    dosage: '1 κάψουλα',
    reminder_times: ['08:00'],
    is_active: true,
  },
  {
    id: 'demo-med-2',
    medication_name: 'Ωμέγα-3',
    dosage: '2 κάψουλες',
    reminder_times: ['08:00', '20:00'],
    is_active: true,
  },
  {
    id: 'demo-med-3',
    medication_name: 'Προβιοτικά',
    dosage: '1 κάψουλα',
    reminder_times: ['07:30'],
    is_active: true,
  },
];

export const DEMO_SYMPTOMS = [
  {
    id: 'demo-sym-1',
    ai_summary: 'Ήπιος πονοκέφαλος — πιθανή αιτία τάση/στρες. Συστάσεις: ξεκούραση, ενυδάτωση.',
    urgency_level: 'low',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'demo-sym-2',
    ai_summary: 'Εποχιακή αλλεργική ρινίτιδα — σύσταση για αντιισταμινικό.',
    urgency_level: 'low',
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
];

export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'maria@demo.medithos.com',
} as const;
