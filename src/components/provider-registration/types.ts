import { z } from "zod";

// Base object schema (without refine, so it can be extended)
const baseProviderObject = z.object({
  fullName: z.string().min(2, "Απαιτούνται τουλάχιστον 2 χαρακτήρες"),
  email: z.string().email("Μη έγκυρη διεύθυνση email"),
  password: z.string().min(8, "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Εισάγετε έγκυρο τηλέφωνο"),
  city: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε τους όρους"),
  privacyAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε την πολιτική"),
});

// Doctor-specific schema
export const doctorSchema = baseProviderObject.extend({
  specialty: z.string().min(1, "Επιλέξτε ειδικότητα"),
  licenseNumber: z.string().min(1, "Απαιτείται αριθμός αδείας"),
  clinicName: z.string().optional(),
  languages: z.array(z.string()).default(["Ελληνικά"]),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  volunteerAcknowledged: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  noPatientRelationship: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  navigationOnly: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  publicListing: z.boolean().default(true),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

// Hospital/Clinic schema
export const hospitalSchema = baseProviderObject.extend({
  organizationName: z.string().min(2, "Απαιτείται όνομα οργανισμού"),
  organizationType: z.enum(['hospital', 'clinic', 'medical_center']),
  licenseNumber: z.string().min(1, "Απαιτείται αριθμός αδείας λειτουργίας"),
  departments: z.array(z.string()).optional(),
  servicesOffered: z.array(z.string()).optional(),
  emergencyAvailable: z.boolean().default(false),
  parkingAvailable: z.boolean().default(false),
  accessibilityFeatures: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

// Nurse schema
export const nurseSchema = baseProviderObject.extend({
  specialty: z.string().optional(),
  licenseNumber: z.string().min(1, "Απαιτείται αριθμός αδείας"),
  yearsExperience: z.number().optional(),
  servicesOffered: z.array(z.string()).default([]),
  homeVisits: z.boolean().default(true),
  availability24h: z.boolean().default(false),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

// Lab schema  
export const labSchema = baseProviderObject.extend({
  organizationName: z.string().min(2, "Απαιτείται όνομα εργαστηρίου"),
  licenseNumber: z.string().min(1, "Απαιτείται αριθμός αδείας"),
  labType: z.enum(['blood_tests', 'imaging', 'pathology', 'microbiology', 'general']),
  testsOffered: z.array(z.string()).optional(),
  onlineResults: z.boolean().default(false),
  homeCollection: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

// Service type for all providers
export interface ProviderService {
  id: string;
  name: string;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: number; // in minutes
}

// Availability slot type
export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6, Sunday-Saturday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
}

// Document upload type
export interface ProviderDocument {
  id: string;
  type: 'license' | 'diploma' | 'id' | 'insurance' | 'other';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Greek specialties list
export const medicalSpecialties = [
  "Γενική Ιατρική",
  "Παθολογία",
  "Καρδιολογία",
  "Νευρολογία",
  "Ορθοπεδική",
  "Δερματολογία",
  "Παιδιατρική",
  "Ψυχιατρική",
  "Ουρολογία",
  "Γυναικολογία",
  "Οφθαλμολογία",
  "Ωτορινολαρυγγολογία",
  "Γαστρεντερολογία",
  "Πνευμονολογία",
  "Ενδοκρινολογία",
  "Ρευματολογία",
  "Αλλεργιολογία",
  "Ογκολογία",
  "Αναισθησιολογία",
  "Χειρουργική",
  "Πλαστική Χειρουργική",
  "Νεφρολογία",
  "Αιματολογία",
  "Φυσικοθεραπεία",
  "Διαιτολογία",
  "Ψυχολογία",
  "Άλλο"
];

// Nursing services
export const nursingServices = [
  "Περιποίηση τραυμάτων",
  "Ενέσεις",
  "Ορο-θεραπεία / IV therapy",
  "Φροντίδα ηλικιωμένων",
  "Μετεγχειρητική φροντίδα",
  "Παρακολούθηση ζωτικών σημείων",
  "Αλλαγή επιδέσμων",
  "Φροντίδα καθετήρα",
  "Φροντίδα στομίας",
  "Φαρμακευτική αγωγή",
  "Φυσιοθεραπεία κατ' οίκον",
  "Συνοδεία σε εξετάσεις"
];

// Hospital departments
export const hospitalDepartments = [
  "Παθολογικό",
  "Καρδιολογικό",
  "Νευρολογικό",
  "Ορθοπεδικό",
  "Χειρουργικό",
  "Μαιευτικό-Γυναικολογικό",
  "Παιδιατρικό",
  "Ψυχιατρικό",
  "Εντατική Θεραπεία (ΜΕΘ)",
  "Επείγοντα Περιστατικά",
  "Ακτινοδιαγνωστικό",
  "Μικροβιολογικό",
  "Αιμοδοσία",
  "Ογκολογικό",
  "Νεφρολογικό",
  "Οφθαλμολογικό",
  "ΩΡΛ",
  "Δερματολογικό"
];

// Lab test types
export const labTestTypes = [
  "Γενική αίματος",
  "Βιοχημικές εξετάσεις",
  "Ορμονολογικές",
  "Θυρεοειδής",
  "Διαβητικό προφίλ",
  "Λιπιδαιμικό προφίλ",
  "Ηπατικές",
  "Νεφρικές",
  "Καρδιακοί δείκτες",
  "Καρκινικοί δείκτες",
  "Αλλεργιολογικές",
  "Μικροβιολογικές καλλιέργειες",
  "Ούρων",
  "PCR / Μοριακές",
  "Γενετικές"
];

// Greek cities
export const greekCities = [
  "Αθήνα",
  "Θεσσαλονίκη",
  "Πάτρα",
  "Ηράκλειο",
  "Λάρισα",
  "Βόλος",
  "Ιωάννινα",
  "Χανιά",
  "Ρόδος",
  "Κέρκυρα",
  "Καβάλα",
  "Σέρρες",
  "Αλεξανδρούπολη",
  "Κομοτηνή",
  "Ξάνθη",
  "Τρίκαλα",
  "Καλαμάτα",
  "Χαλκίδα",
  "Λαμία",
  "Κοζάνη"
];

export type DoctorFormData = z.infer<typeof doctorSchema>;
export type HospitalFormData = z.infer<typeof hospitalSchema>;
export type NurseFormData = z.infer<typeof nurseSchema>;
export type LabFormData = z.infer<typeof labSchema>;
