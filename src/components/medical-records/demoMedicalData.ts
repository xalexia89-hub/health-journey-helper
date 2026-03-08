
export interface DemoMedicalEntry {
  id: string;
  entry_type: 'blood_test' | 'imaging' | 'diagnosis';
  title: string;
  description: string | null;
  entry_date: string;
  provider_name: string | null;
  provider_id: string | null;
  symptom_session_id: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  attachments: never[];
}

// 4 blood tests with full realistic healthy values
export const DEMO_BLOOD_TESTS: DemoMedicalEntry[] = [
  {
    id: 'demo-blood-1',
    entry_type: 'blood_test',
    title: 'Γενική Αίματος (CBC)',
    description: 'Λευκά αιμοσφαίρια (WBC): 6.8 x10³/μL | Ερυθρά (RBC): 5.1 x10⁶/μL | Αιμοσφαιρίνη (Hb): 14.8 g/dL | Αιματοκρίτης (Hct): 44.2% | Αιμοπετάλια (PLT): 245 x10³/μL | MCV: 86.7 fL | MCH: 29.0 pg | MCHC: 33.5 g/dL | RDW: 12.8%',
    entry_date: '2026-03-01',
    provider_name: 'Διαγνωστικό Κέντρο Αθηνών',
    provider_id: null,
    symptom_session_id: null,
    tags: ['γενική αίματος', 'CBC', 'ετήσιος έλεγχος'],
    metadata: {
      results: {
        WBC: { value: 6.8, unit: 'x10³/μL', min: 4.0, max: 11.0, status: 'normal' },
        RBC: { value: 5.1, unit: 'x10⁶/μL', min: 4.5, max: 5.9, status: 'normal' },
        Hb: { value: 14.8, unit: 'g/dL', min: 13.5, max: 17.5, status: 'normal' },
        Hct: { value: 44.2, unit: '%', min: 38.0, max: 50.0, status: 'normal' },
        PLT: { value: 245, unit: 'x10³/μL', min: 150, max: 400, status: 'normal' },
        MCV: { value: 86.7, unit: 'fL', min: 80, max: 100, status: 'normal' },
        MCH: { value: 29.0, unit: 'pg', min: 27, max: 33, status: 'normal' },
        MCHC: { value: 33.5, unit: 'g/dL', min: 32, max: 36, status: 'normal' },
        RDW: { value: 12.8, unit: '%', min: 11.5, max: 14.5, status: 'normal' },
      }
    },
    created_at: '2026-03-01T10:00:00Z',
    attachments: [],
  },
  {
    id: 'demo-blood-2',
    entry_type: 'blood_test',
    title: 'Βιοχημικός Έλεγχος',
    description: 'Γλυκόζη: 92 mg/dL | Ουρία: 35 mg/dL | Κρεατινίνη: 0.95 mg/dL | Ουρικό οξύ: 5.2 mg/dL | Χοληστερόλη: 185 mg/dL | HDL: 58 mg/dL | LDL: 105 mg/dL | Τριγλυκερίδια: 110 mg/dL | SGOT/AST: 22 U/L | SGPT/ALT: 18 U/L | γ-GT: 25 U/L | ALP: 68 U/L',
    entry_date: '2026-03-01',
    provider_name: 'Διαγνωστικό Κέντρο Αθηνών',
    provider_id: null,
    symptom_session_id: null,
    tags: ['βιοχημικός', 'χοληστερόλη', 'ηπατικά'],
    metadata: {
      results: {
        Glucose: { value: 92, unit: 'mg/dL', min: 70, max: 100, status: 'normal' },
        Urea: { value: 35, unit: 'mg/dL', min: 17, max: 43, status: 'normal' },
        Creatinine: { value: 0.95, unit: 'mg/dL', min: 0.7, max: 1.3, status: 'normal' },
        UricAcid: { value: 5.2, unit: 'mg/dL', min: 3.4, max: 7.0, status: 'normal' },
        Cholesterol: { value: 185, unit: 'mg/dL', min: 0, max: 200, status: 'normal' },
        HDL: { value: 58, unit: 'mg/dL', min: 40, max: 60, status: 'normal' },
        LDL: { value: 105, unit: 'mg/dL', min: 0, max: 130, status: 'normal' },
        Triglycerides: { value: 110, unit: 'mg/dL', min: 0, max: 150, status: 'normal' },
        AST: { value: 22, unit: 'U/L', min: 5, max: 40, status: 'normal' },
        ALT: { value: 18, unit: 'U/L', min: 7, max: 56, status: 'normal' },
        GGT: { value: 25, unit: 'U/L', min: 9, max: 48, status: 'normal' },
        ALP: { value: 68, unit: 'U/L', min: 44, max: 147, status: 'normal' },
      }
    },
    created_at: '2026-03-01T10:00:00Z',
    attachments: [],
  },
  {
    id: 'demo-blood-3',
    entry_type: 'blood_test',
    title: 'Θυρεοειδικός Έλεγχος & Σίδηρος',
    description: 'TSH: 2.1 mIU/L | FT4: 1.2 ng/dL | FT3: 3.1 pg/mL | Σίδηρος: 95 μg/dL | Φερριτίνη: 80 ng/mL | TIBC: 320 μg/dL | Βιταμίνη B12: 450 pg/mL | Φυλλικό οξύ: 12.5 ng/mL',
    entry_date: '2026-02-15',
    provider_name: 'Μετροπόλιταν Νοσοκομείο',
    provider_id: null,
    symptom_session_id: null,
    tags: ['θυρεοειδής', 'σίδηρος', 'βιταμίνες'],
    metadata: {
      results: {
        TSH: { value: 2.1, unit: 'mIU/L', min: 0.4, max: 4.0, status: 'normal' },
        FT4: { value: 1.2, unit: 'ng/dL', min: 0.8, max: 1.8, status: 'normal' },
        FT3: { value: 3.1, unit: 'pg/mL', min: 2.3, max: 4.2, status: 'normal' },
        Iron: { value: 95, unit: 'μg/dL', min: 60, max: 170, status: 'normal' },
        Ferritin: { value: 80, unit: 'ng/mL', min: 20, max: 250, status: 'normal' },
        TIBC: { value: 320, unit: 'μg/dL', min: 250, max: 370, status: 'normal' },
        VitB12: { value: 450, unit: 'pg/mL', min: 200, max: 900, status: 'normal' },
        FolicAcid: { value: 12.5, unit: 'ng/mL', min: 3, max: 17, status: 'normal' },
      }
    },
    created_at: '2026-02-15T09:00:00Z',
    attachments: [],
  },
  {
    id: 'demo-blood-4',
    entry_type: 'blood_test',
    title: 'Ανοσολογικός & Φλεγμονώδεις Δείκτες',
    description: 'CRP: 0.8 mg/L | ΤΚΕ (ESR): 8 mm/h | Ανοσοσφαιρίνη IgG: 1100 mg/dL | IgA: 250 mg/dL | IgM: 120 mg/dL | Βιταμίνη D: 42 ng/mL | HbA1c: 5.2%',
    entry_date: '2026-01-20',
    provider_name: 'Ιατρικό Κέντρο Υγεία',
    provider_id: null,
    symptom_session_id: null,
    tags: ['CRP', 'ανοσολογικά', 'HbA1c', 'βιταμίνη D'],
    metadata: {
      results: {
        CRP: { value: 0.8, unit: 'mg/L', min: 0, max: 3, status: 'normal' },
        ESR: { value: 8, unit: 'mm/h', min: 0, max: 20, status: 'normal' },
        IgG: { value: 1100, unit: 'mg/dL', min: 700, max: 1600, status: 'normal' },
        IgA: { value: 250, unit: 'mg/dL', min: 70, max: 400, status: 'normal' },
        IgM: { value: 120, unit: 'mg/dL', min: 40, max: 230, status: 'normal' },
        VitD: { value: 42, unit: 'ng/mL', min: 30, max: 100, status: 'normal' },
        HbA1c: { value: 5.2, unit: '%', min: 4.0, max: 5.6, status: 'normal' },
      }
    },
    created_at: '2026-01-20T11:00:00Z',
    attachments: [],
  },
];

// 1 imaging entry - chest X-ray
export const DEMO_IMAGING: DemoMedicalEntry[] = [
  {
    id: 'demo-imaging-1',
    entry_type: 'imaging',
    title: 'Ακτινογραφία Θώρακος (PA & Lateral)',
    description: 'Φυσιολογική ακτινογραφία θώρακος. Πνευμονικά πεδία καθαρά χωρίς διηθήματα ή πυκνώσεις. Καρδιακή σιλουέτα εντός φυσιολογικών ορίων (CTR < 0.5). Μεσοθωράκιο κεντρικό. Πλευροδιαφραγματικές γωνίες ελεύθερες. Οστικές δομές χωρίς παθολογικά ευρήματα. Αορτικό τόξο φυσιολογικό.',
    entry_date: '2026-02-28',
    provider_name: 'Διαγνωστικό Κέντρο Αθηνών',
    provider_id: null,
    symptom_session_id: null,
    tags: ['ακτινογραφία', 'θώρακας', 'X-ray', 'πνεύμονες'],
    metadata: {
      modality: 'X-Ray',
      body_part: 'Θώρακας',
      findings: 'Φυσιολογική',
      CTR: '< 0.5',
    },
    created_at: '2026-02-28T14:00:00Z',
    attachments: [],
  },
];

// 4 diagnoses
export const DEMO_DIAGNOSES: DemoMedicalEntry[] = [
  {
    id: 'demo-diag-1',
    entry_type: 'diagnosis',
    title: 'Εξαιρετική Αιματολογική Εικόνα',
    description: 'Τα αποτελέσματα της γενικής αίματος και του βιοχημικού ελέγχου είναι εντός φυσιολογικών ορίων. Η αιμοσφαιρίνη, ο αιματοκρίτης και τα αιμοπετάλια δείχνουν υγιή αιμοποίηση. Δεν υπάρχουν ενδείξεις αναιμίας ή λοίμωξης.',
    entry_date: '2026-03-02',
    provider_name: 'Δρ. Παπαδόπουλος Νίκος',
    provider_id: null,
    symptom_session_id: null,
    tags: ['αιματολογικά', 'φυσιολογικά', 'υγιής'],
    metadata: { icd10: 'Z00.0', severity: 'normal' },
    created_at: '2026-03-02T09:00:00Z',
    attachments: [],
  },
  {
    id: 'demo-diag-2',
    entry_type: 'diagnosis',
    title: 'Φυσιολογικό Λιπιδαιμικό Προφίλ',
    description: 'Η ολική χοληστερόλη (185 mg/dL), η HDL (58 mg/dL), η LDL (105 mg/dL) και τα τριγλυκερίδια (110 mg/dL) βρίσκονται σε επιθυμητά επίπεδα. Ο λόγος LDL/HDL είναι 1.81 (στόχος < 3.0). Χαμηλός καρδιαγγειακός κίνδυνος.',
    entry_date: '2026-03-02',
    provider_name: 'Δρ. Παπαδόπουλος Νίκος',
    provider_id: null,
    symptom_session_id: null,
    tags: ['χοληστερόλη', 'καρδιαγγειακό', 'λιπίδια'],
    metadata: { icd10: 'Z13.6', severity: 'normal' },
    created_at: '2026-03-02T09:30:00Z',
    attachments: [],
  },
  {
    id: 'demo-diag-3',
    entry_type: 'diagnosis',
    title: 'Φυσιολογική Θυρεοειδική Λειτουργία',
    description: 'Η TSH (2.1 mIU/L), η FT4 (1.2 ng/dL) και η FT3 (3.1 pg/mL) δείχνουν ευθυρεοειδική κατάσταση. Ο σίδηρος, η φερριτίνη και η βιταμίνη B12 είναι σε φυσιολογικά επίπεδα. Επαρκείς αποθήκες σιδήρου.',
    entry_date: '2026-02-16',
    provider_name: 'Δρ. Αλεξίου Μαρία',
    provider_id: null,
    symptom_session_id: null,
    tags: ['θυρεοειδής', 'ευθυρεοειδισμός', 'σίδηρος'],
    metadata: { icd10: 'Z00.0', severity: 'normal' },
    created_at: '2026-02-16T12:00:00Z',
    attachments: [],
  },
  {
    id: 'demo-diag-4',
    entry_type: 'diagnosis',
    title: 'Καθαρή Ακτινογραφία Θώρακος & Χαμηλή Φλεγμονή',
    description: 'Η ακτινογραφία θώρακος δεν δείχνει παθολογικά ευρήματα. Ο CRP (0.8 mg/L) και η ΤΚΕ (8 mm/h) είναι χαμηλοί, αποκλείοντας ενεργή φλεγμονή. Η HbA1c (5.2%) δείχνει εξαιρετικό γλυκαιμικό έλεγχο. Η βιταμίνη D (42 ng/mL) σε ικανοποιητικά επίπεδα.',
    entry_date: '2026-03-01',
    provider_name: 'Δρ. Παπαδόπουλος Νίκος',
    provider_id: null,
    symptom_session_id: null,
    tags: ['φλεγμονή', 'HbA1c', 'ακτινογραφία', 'βιταμίνη D'],
    metadata: { icd10: 'Z00.0', severity: 'normal' },
    created_at: '2026-03-01T15:00:00Z',
    attachments: [],
  },
];

export const ALL_DEMO_ENTRIES: DemoMedicalEntry[] = [
  ...DEMO_BLOOD_TESTS,
  ...DEMO_IMAGING,
  ...DEMO_DIAGNOSES,
].sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());

// Historical data for charts (simulating 6 months of tracking)
export const BLOOD_TEST_HISTORY = [
  { month: 'Οκτ 25', glucose: 88, cholesterol: 192, hb: 14.5, creatinine: 0.92, tsh: 2.3, hba1c: 5.3, crp: 1.1, vitD: 35 },
  { month: 'Νοε 25', glucose: 90, cholesterol: 190, hb: 14.6, creatinine: 0.90, tsh: 2.2, hba1c: 5.3, crp: 0.9, vitD: 37 },
  { month: 'Δεκ 25', glucose: 95, cholesterol: 188, hb: 14.7, creatinine: 0.93, tsh: 2.0, hba1c: 5.2, crp: 1.2, vitD: 33 },
  { month: 'Ιαν 26', glucose: 91, cholesterol: 187, hb: 14.9, creatinine: 0.94, tsh: 2.1, hba1c: 5.2, crp: 0.8, vitD: 38 },
  { month: 'Φεβ 26', glucose: 89, cholesterol: 186, hb: 14.8, creatinine: 0.95, tsh: 2.1, hba1c: 5.2, crp: 0.7, vitD: 40 },
  { month: 'Μαρ 26', glucose: 92, cholesterol: 185, hb: 14.8, creatinine: 0.95, tsh: 2.1, hba1c: 5.2, crp: 0.8, vitD: 42 },
];

export const LIPID_PROFILE_HISTORY = [
  { month: 'Οκτ 25', total: 192, hdl: 55, ldl: 115, triglycerides: 120 },
  { month: 'Νοε 25', total: 190, hdl: 56, ldl: 112, triglycerides: 118 },
  { month: 'Δεκ 25', total: 188, hdl: 57, ldl: 110, triglycerides: 115 },
  { month: 'Ιαν 26', total: 187, hdl: 57, ldl: 108, triglycerides: 112 },
  { month: 'Φεβ 26', total: 186, hdl: 58, ldl: 106, triglycerides: 111 },
  { month: 'Μαρ 26', total: 185, hdl: 58, ldl: 105, triglycerides: 110 },
];

export const CBC_HISTORY = [
  { month: 'Οκτ 25', wbc: 7.0, rbc: 5.0, plt: 240, hb: 14.5 },
  { month: 'Νοε 25', wbc: 6.9, rbc: 5.1, plt: 242, hb: 14.6 },
  { month: 'Δεκ 25', wbc: 7.1, rbc: 5.0, plt: 238, hb: 14.7 },
  { month: 'Ιαν 26', wbc: 6.7, rbc: 5.1, plt: 248, hb: 14.9 },
  { month: 'Φεβ 26', wbc: 6.8, rbc: 5.1, plt: 244, hb: 14.8 },
  { month: 'Μαρ 26', wbc: 6.8, rbc: 5.1, plt: 245, hb: 14.8 },
];
