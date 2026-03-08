import { ArrowLeft, Download, Server, Database, Brain, Shield, Lock, Eye, FileText, Activity, Network, Cpu, Globe, Layers, Users, AlertTriangle, CheckCircle2, Zap, Heart, Building2, Key, RotateCcw, Bell } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function TechnicalStudy() {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    const element = document.querySelector('.study-body');
    if (!element) return;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'Medithos_Technical_Study.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        @media print {
          @page { size: A4; margin: 18mm 20mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-size: 11px; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          * { color: #1a1a1a !important; }
          .bg-gradient-to-r { background: #f0f9ff !important; }
        }
        @media screen {
          .study-body { background: white; color: #1a1a1a; }
        }
      `}</style>

      {/* Navigation */}
      <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-primary text-primary-foreground">
            <Download className="h-4 w-4 mr-2" />
            Λήψη PDF
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="study-body max-w-5xl mx-auto px-8 py-12 space-y-14">

        {/* ══════════════ COVER ══════════════ */}
        <section className="text-center py-20 border-b-2 border-cyan-600">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Εμπιστευτικό Έγγραφο · Investor Edition</p>
          <h1 className="text-6xl font-bold text-cyan-700 mb-3">MEDITHOS</h1>
          <p className="text-2xl text-gray-600 mb-2">Πλήρης Τεχνολογική Μελέτη</p>
          <p className="text-base text-gray-500">Technology Stack · Data Architecture · AI Engine · Compliance Framework</p>
          <div className="mt-8 text-sm text-gray-400 space-y-1">
            <p>Έκδοση 3.0 · Μάρτιος 2026</p>
            <p>Health Navigation Platform — Ελλάδα & Ευρώπη</p>
          </div>
        </section>

        {/* ══════════════ TOC ══════════════ */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-cyan-700 mb-6">Περιεχόμενα</h2>
          <div className="grid grid-cols-2 gap-1 text-sm text-gray-700">
            {[
              "1. Executive Overview",
              "2. Technology Stack",
              "3. Αρχιτεκτονική Συστήματος",
              "4. Βάση Δεδομένων & Αποθήκευση",
              "5. AI Engine — Τι Κάνει Διαφορετικά",
              "6. Τεχνητή Νοημοσύνη & Μοντέλα",
              "7. Ασφάλεια & Κρυπτογράφηση",
              "8. GDPR Compliance",
              "9. MDR (Medical Device Regulation)",
              "10. Κανονιστικό Πλαίσιο AI (EU AI Act)",
              "11. Data Flows & Access Control",
              "12. Scalability & Μελλοντική Αρχιτεκτονική",
              "13. Ανταγωνιστικό Πλεονέκτημα AI",
              "14. Roadmap & Τεχνική Εξέλιξη",
            ].map((item, i) => (
              <p key={i} className="py-1 border-b border-gray-100">{item}</p>
            ))}
          </div>
        </section>

        {/* ══════════════ 1. EXECUTIVE OVERVIEW ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Heart} num="1" title="Executive Overview" />
          <p className="text-sm leading-relaxed">
            Το <strong>Medithos</strong> είναι μια <strong>πρωτότυπη πλατφόρμα πλοήγησης υγείας (health navigation)</strong> που 
            χρησιμοποιεί τεχνητή νοημοσύνη για να βοηθήσει τους πολίτες να κατανοήσουν τα συμπτώματά τους, να βρουν 
            τον κατάλληλο πάροχο υγείας και να οργανώσουν το ιατρικό τους ιστορικό. <strong>Δεν διαγιγνώσκει</strong> — 
            πλοηγεί. Αυτή η αρχιτεκτονική απόφαση μας τοποθετεί <strong>εκτός MDR</strong> και μας δίνει ρυθμιστικό πλεονέκτημα.
          </p>
          <InfoBox color="cyan">
            <strong>Αγορά-Στόχος:</strong> Ευρώπη (450M πληθυσμός) — Pilot launch από Ελλάδα (11M). B2C χρήστες + B2B ασφαλιστικές εταιρείες &amp; πάροχοι υγείας.
          </InfoBox>
        </section>

        {/* ══════════════ 2. TECHNOLOGY STACK ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Cpu} num="2" title="Technology Stack" />
          
          <h3 className="text-base font-semibold text-gray-800">2.1 Frontend</h3>
          <TechTable rows={[
            ["React 18.3", "UI Framework", "Component-based, Virtual DOM, μεγάλο ecosystem"],
            ["TypeScript 5.8", "Type Safety", "Compile-time error detection, καλύτερη αξιοπιστία κώδικα"],
            ["Vite 5.4", "Build Tool", "Instant HMR, <500ms cold start, tree-shaking"],
            ["Tailwind CSS 3.4", "Styling", "Utility-first, zero runtime CSS, design system tokens"],
            ["shadcn/ui + Radix", "Component Library", "Accessible, headless, fully customizable"],
            ["React Router 6.30", "Routing", "Nested layouts, protected routes, lazy loading"],
            ["TanStack Query 5", "Data Fetching", "Cache, retry, optimistic updates, background sync"],
            ["Recharts 2.15", "Data Visualization", "Charts για health metrics, insurance analytics"],
            ["react-markdown", "Content Rendering", "AI responses με rich text formatting"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">2.2 Backend (Lovable Cloud)</h3>
          <TechTable rows={[
            ["PostgreSQL 15", "Database", "Enterprise-grade RDBMS, ACID, JSON support"],
            ["PostgREST", "API Layer", "Auto-generated REST API από DB schema"],
            ["Edge Functions (Deno)", "Serverless Logic", "AI chat, Fitbit sync, data aggregation"],
            ["Row-Level Security", "Data Access", "Granular policy-based access control"],
            ["Realtime Engine", "WebSockets", "Live updates, presence, broadcast channels"],
            ["Storage (S3-compatible)", "File Storage", "Signed URLs, private buckets, CDN"],
            ["GoTrue", "Authentication", "JWT, email/password, OAuth ready"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">2.3 AI & Machine Learning</h3>
          <TechTable rows={[
            ["Google Gemini 3 Flash", "Primary AI Model", "Multimodal, fast inference, medical reasoning"],
            ["Lovable AI Gateway", "API Proxy", "Rate limiting, key management, model switching"],
            ["Custom System Prompts", "AI Behavior", "Triage logic, safety rails, Greek language"],
            ["Streaming (SSE)", "Real-time AI", "Token-by-token response, low latency UX"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">2.4 Mobile</h3>
          <TechTable rows={[
            ["Capacitor 8", "Native Bridge", "iOS/Android from single codebase"],
            ["HealthKit Plugin", "Apple Health", "Heart rate, steps, SpO2, blood pressure"],
            ["Fitbit OAuth", "Wearable Sync", "Automated data sync via Edge Functions"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">2.5 Infrastructure</h3>
          <TechTable rows={[
            ["EU Data Centers (Frankfurt)", "Hosting", "GDPR-compliant, low latency Europe"],
            ["TLS 1.3", "Transport Security", "End-to-end encryption in transit"],
            ["AES-256", "Storage Encryption", "Data at rest encryption"],
            ["Daily Backups + PITR", "Disaster Recovery", "Point-in-Time Recovery, 30-day retention"],
          ]} />
        </section>

        {/* ══════════════ 3. ΑΡΧΙΤΕΚΤΟΝΙΚΗ ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Layers} num="3" title="Αρχιτεκτονική Συστήματος" />
          
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-xs leading-relaxed border border-gray-200">
            <pre className="whitespace-pre-wrap">{`
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│  React 18 + TypeScript + Tailwind + shadcn/ui               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Patient  │ │ Doctor   │ │ Admin    │ │Insurance │       │
│  │ Portal   │ │ Portal   │ │ Portal   │ │ Portal   │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴─────────────┴─────────────┘           │
│                         │                                    │
├─────────────────────────┼────────────────────────────────────┤
│              API GATEWAY (PostgREST + GoTrue)               │
│              JWT Auth · Rate Limiting · RLS                  │
├─────────────────────────┼────────────────────────────────────┤
│                 EDGE FUNCTIONS (Deno)                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ symptom-chat │ │ preventive-  │ │ fitbit-sync  │        │
│  │ (AI Triage)  │ │ advisor      │ │              │        │
│  └──────┬───────┘ └──────┬───────┘ └──────────────┘        │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────────────────────┐                            │
│  │   Lovable AI Gateway        │                            │
│  │   (Gemini 3 Flash Preview)  │                            │
│  └─────────────────────────────┘                            │
├──────────────────────────────────────────────────────────────┤
│                 DATABASE LAYER                               │
│  PostgreSQL 15 · 30+ Tables · RLS Policies                  │
│  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐          │
│  │Profiles│ │Medical  │ │Appoint-  │ │Insurance│          │
│  │& Auth  │ │Records  │ │ments     │ │Members  │          │
│  └────────┘ └─────────┘ └──────────┘ └─────────┘          │
├──────────────────────────────────────────────────────────────┤
│                 STORAGE LAYER                                │
│  Private Buckets · Signed URLs · CDN                        │
│  medical-documents │ avatars │ provider-documents            │
└──────────────────────────────────────────────────────────────┘
            `}</pre>
          </div>
        </section>

        {/* ══════════════ 4. DATABASE ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Database} num="4" title="Βάση Δεδομένων & Αποθήκευση" />
          
          <h3 className="text-base font-semibold text-gray-800">4.1 Database Schema (30+ πίνακες)</h3>
          <div className="grid grid-cols-2 gap-4">
            <SchemaGroup title="Χρήστες & Ταυτοποίηση" tables={[
              "profiles — Βασικά στοιχεία χρηστών",
              "user_roles — RBAC (patient, doctor, admin)",
              "health_files — Βιομετρικά & lifestyle data",
              "pilot_enrollments — Διαχείριση pilot phase",
            ]} />
            <SchemaGroup title="Ιατρικά Δεδομένα" tables={[
              "medical_records — Ιστορικό, αλλεργίες, φάρμακα",
              "medical_entries — Timeline entries (εξετάσεις, διαγνώσεις)",
              "medical_documents — Ανεβασμένα αρχεία (private storage)",
              "symptom_intakes — AI triage sessions",
            ]} />
            <SchemaGroup title="Υπηρεσίες Υγείας" tables={[
              "providers — Γιατροί, νοσηλευτές, εργαστήρια",
              "appointments — Ραντεβού (in-person & τηλεϊατρική)",
              "availability_slots — Διαθεσιμότητα παρόχων",
              "reviews — Αξιολογήσεις παρόχων",
            ]} />
            <SchemaGroup title="Wearables & Monitoring" tables={[
              "wearable_heart_rate — BPM data",
              "wearable_steps — Βηματομετρητής",
              "wearable_spo2 — Οξυγόνο αίματος",
              "wearable_blood_pressure — Αρτηριακή πίεση",
            ]} />
            <SchemaGroup title="Ασφαλιστικές (B2B)" tables={[
              "insurance_organizations — Εταιρείες",
              "insurance_members — Ασφαλισμένοι",
              "insurance_claims — Αιτήματα αποζημίωσης",
              "insurance_data_consents — Ρητή συγκατάθεση",
            ]} />
            <SchemaGroup title="Audit & Compliance" tables={[
              "audit_logs — Γενικά logs",
              "doctor_access_logs — Πρόσβαση γιατρών",
              "medical_audit_logs — Ιατρικά audit trails",
              "consents — Συγκαταθέσεις χρηστών",
            ]} />
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">4.2 Αποθήκευση Αρχείων</h3>
          <TechTable rows={[
            ["medical-documents", "Private", "Ιατρικά αρχεία, εξετάσεις, PDF — Signed URLs μόνο"],
            ["avatars", "Private", "Profile photos — Signed URLs"],
            ["provider-documents", "Private", "Πτυχία, πιστοποιήσεις γιατρών"],
            ["provider-gallery", "Public", "Gallery εικόνες ιατρείων"],
          ]} />

          <InfoBox color="amber">
            <strong>Σημαντικό:</strong> Κανένα ευαίσθητο αρχείο δεν είναι δημόσια προσβάσιμο. Χρησιμοποιούμε αποκλειστικά 
            <code className="bg-gray-100 px-1 mx-1 rounded text-xs">createSignedUrl()</code> με χρονικό περιορισμό (60 sec expiry).
          </InfoBox>
        </section>

        {/* ══════════════ 5. AI DIFFERENTIATOR ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Brain} num="5" title="AI Engine — Τι Κάνει το Medithos Διαφορετικό" />
          
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
            <h3 className="text-lg font-bold text-cyan-800 mb-3">Γιατί το AI μας είναι μοναδικό</h3>
            <p className="text-sm leading-relaxed text-gray-700 mb-4">
              Τα περισσότερα health AI apps (Ada Health, Babylon, K Health) <strong>προσπαθούν να διαγνώσουν</strong>. 
              Αυτό τα φέρνει αντιμέτωπα με τον κανονισμό <strong>MDR (EU 2017/745)</strong> ως ιατροτεχνολογικά προϊόντα, 
              απαιτώντας CE marking, κλινικές δοκιμές και χρόνια αδειοδότησης. 
              Το Medithos <strong>αποφεύγει εσκεμμένα τη διάγνωση</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <ComparisonCard 
              title="Ανταγωνισμός" 
              color="red"
              items={[
                "Διαγιγνώσκει ασθένειες → MDR Class IIa",
                "Απαιτεί CE marking & κλινικές δοκιμές",
                "Generic chatbot χωρίς ελληνική ειδίκευση",
                "Δεν συνδέεται με ιατρικό φάκελο",
                "Μία λειτουργία (symptom check)",
                "Αγγλικά/μετάφραση — όχι native",
              ]}
            />
            <ComparisonCard 
              title="Medithos AI" 
              color="green"
              items={[
                "Πλοήγηση & Triage → Εκτός MDR",
                "Ταχεία κυκλοφορία, χωρίς CE delays",
                "Native ελληνικό — κατανοεί ελληνικό υγειονομικό σύστημα",
                "Ενσωματωμένο Living Medical Record",
                "Full ecosystem (triage + booking + records + preventive)",
                "Συστημική σκέψη — συνδέει lifestyle, ιστορικό, wearables",
              ]}
            />
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">5.1 Τα 4 AI Modules</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "AI Symptom Navigator (Triage)",
                desc: "Αξιολογεί συμπτώματα σε 4 επίπεδα κινδύνου (CODE RED → CODE GREEN). Ενεργοποιεί κλήση 166/112 σε επείγοντα. Δεν διαγιγνώσκει — κατευθύνει.",
                model: "Gemini 3 Flash · Streaming"
              },
              {
                title: "Preventive Health Advisor",
                desc: "Αναλύει μοτίβα τρόπου ζωής (ύπνος, διατροφή, άσκηση, στρες) και προτείνει προληπτικές εξετάσεις βάσει ηλικίας/φύλου/ιστορικού.",
                model: "Gemini 3 Flash · Context-aware"
              },
              {
                title: "Emergency Triage System",
                desc: "Real-time ανίχνευση red flags (εγκεφαλικό, έμφραγμα, αναφυλαξία). Αυτόματα κουμπιά κλήσης ΕΚΑΒ. Zero-delay response.",
                model: "Structured output · Confidence scoring"
              },
              {
                title: "Insurance Analytics AI",
                desc: "B2B module: προβλεπτική ανάλυση κινδύνου, behavioral drift detection, claims optimization — μόνο με ρητή συγκατάθεση ασθενή.",
                model: "Aggregated data · No PII exposure"
              },
            ].map((m, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 print-avoid-break">
                <h4 className="font-semibold text-sm text-cyan-700">{m.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{m.desc}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">{m.model}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">5.2 AI Safety Architecture</h3>
          <div className="space-y-2">
            {[
              "Ρητή απαγόρευση διάγνωσης σε system prompt level",
              "Structured triage output με confidence scores (0.0-1.0)",
              "Input validation: max 50 μηνύματα, 10K χαρακτήρες/μήνυμα",
              "Sanitization: αφαίρεση control characters, role validation",
              "Rate limiting: 429 responses για abuse prevention",
              "Human-in-the-loop: κλιμάκωση σε γιατρό για confidence 0.70-0.84",
              "Mandatory disclaimers σε κάθε AI interaction",
              "Αυτοκτονικός ιδεασμός → Αυτόματο CODE RED + Γραμμή 1018",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 6. AI MODELS ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Zap} num="6" title="Τεχνητή Νοημοσύνη — Μοντέλα & Pipeline" />
          
          <h3 className="text-base font-semibold text-gray-800">6.1 AI Pipeline</h3>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-sm space-y-3">
            <p><strong>1. Input →</strong> Μήνυμα χρήστη + ιατρικό ιστορικό (context injection)</p>
            <p><strong>2. Validation →</strong> Size limits, role check, sanitization</p>
            <p><strong>3. System Prompt →</strong> Εξειδικευμένο ιατρικό prompt (~3,500 tokens) με triage protocol</p>
            <p><strong>4. AI Gateway →</strong> Lovable AI Gateway → Google Gemini 3 Flash Preview</p>
            <p><strong>5. Streaming →</strong> Server-Sent Events (SSE) για real-time token streaming</p>
            <p><strong>6. Parsing →</strong> Εξαγωγή [TRIAGE_CODE] και [SPECIALTY_RECOMMENDATION] blocks</p>
            <p><strong>7. UI Render →</strong> Markdown + color-coded triage alerts + action buttons</p>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">6.2 Γιατί Google Gemini 3 Flash</h3>
          <TechTable rows={[
            ["Speed", "~200ms first token", "Κρίσιμο για triage — κάθε δευτερόλεπτο μετράει"],
            ["Multilingual", "Native ελληνικά", "Κατανοεί ιατρική ορολογία στα ελληνικά"],
            ["Context Window", "1M+ tokens", "Χωράει ολόκληρο ιατρικό ιστορικό"],
            ["Reasoning", "Advanced medical reasoning", "Πολυπαραγοντική ανάλυση συμπτωμάτων"],
            ["Cost", "Χαμηλό cost per token", "Sustainable στο B2C μοντέλο"],
            ["EU Routing", "EU data processing", "GDPR-compliant inference"],
          ]} />
        </section>

        {/* ══════════════ 7. SECURITY ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Lock} num="7" title="Ασφάλεια & Κρυπτογράφηση" />
          
          <div className="grid grid-cols-2 gap-4">
            <SecurityPillar title="Κρυπτογράφηση" items={[
              "AES-256 encryption at rest",
              "TLS 1.3 encryption in transit",
              "Signed URLs με 60sec expiry",
              "JWT tokens για authentication",
              "bcrypt password hashing",
            ]} />
            <SecurityPillar title="Access Control" items={[
              "Row-Level Security σε 30+ πίνακες",
              "RBAC: patient, doctor, admin roles",
              "SECURITY DEFINER functions",
              "can_access_patient_medical_data()",
              "medical_access_grants system",
            ]} />
            <SecurityPillar title="Audit & Monitoring" items={[
              "audit_logs — κάθε database action",
              "doctor_access_logs — πρόσβαση γιατρών",
              "medical_audit_logs — ιατρικά δεδομένα",
              "IP tracking & user agent logging",
              "5-year retention policy",
            ]} />
            <SecurityPillar title="Infrastructure" items={[
              "EU Data Centers (Frankfurt)",
              "ISO 27001:2022 certified infra",
              "SOC 2 Type II compliance",
              "Daily automated backups",
              "Point-in-Time Recovery (PITR)",
            ]} />
          </div>
        </section>

        {/* ══════════════ 8. GDPR ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Shield} num="8" title="GDPR Compliance (EU 2016/679)" />
          
          <InfoBox color="blue">
            Τα δεδομένα υγείας αποτελούν <strong>ειδική κατηγορία</strong> (Art. 9) και απαιτούν <strong>ρητή συγκατάθεση</strong>. 
            Το Medithos εφαρμόζει <strong>Privacy by Design & by Default</strong>.
          </InfoBox>

          <h3 className="text-base font-semibold text-gray-800">8.1 Νομική Βάση Επεξεργασίας</h3>
          <TechTable rows={[
            ["Art. 6(1)(a)", "Συγκατάθεση", "Ρητή αποδοχή κατά την εγγραφή (Pilot Consent Modal)"],
            ["Art. 9(2)(a)", "Ρητή Συγκατάθεση", "Ειδική συγκατάθεση για δεδομένα υγείας"],
            ["Art. 6(1)(b)", "Εκτέλεση Σύμβασης", "Παροχή υπηρεσιών πλοήγησης υγείας"],
            ["Art. 6(1)(f)", "Έννομο Συμφέρον", "Ασφάλεια, fraud prevention, analytics"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">8.2 Δικαιώματα Υποκειμένων (Art. 15-22)</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { right: "Πρόσβαση (Art. 15)", impl: "Export JSON με όλα τα δεδομένα μέσω Settings" },
              { right: "Διόρθωση (Art. 16)", impl: "Inline editing σε Profile & Medical Records" },
              { right: "Διαγραφή (Art. 17)", impl: "Delete Account → cascade delete σε όλους τους πίνακες" },
              { right: "Ανάκληση (Art. 7(3))", impl: "Revoke Consent button → ακύρωση επεξεργασίας" },
              { right: "Φορητότητα (Art. 20)", impl: "JSON export σε machine-readable format" },
              { right: "Εναντίωση (Art. 21)", impl: "Opt-out από analytics & insurance sharing" },
            ].map((r, i) => (
              <div key={i} className="border border-gray-200 rounded p-3 text-xs print-avoid-break">
                <p className="font-semibold text-cyan-700">{r.right}</p>
                <p className="text-gray-600 mt-1">{r.impl}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">8.3 Ρόλοι Controller / Processor</h3>
          <TechTable rows={[
            ["B2C (Χρήστες)", "Controller", "Medithos ως Υπεύθυνος Επεξεργασίας"],
            ["B2B (Ασφαλιστικές)", "Processor", "Medithos ως Εκτελών — DPA (Art. 28) required"],
            ["AI Gateway", "Sub-processor", "EU-based processing, DPA covered"],
            ["Hosting (Cloud)", "Sub-processor", "Frankfurt DC, ISO 27001, SOC 2"],
          ]} />
        </section>

        {/* ══════════════ 9. MDR ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={FileText} num="9" title="MDR — Medical Device Regulation (EU 2017/745)" />
          
          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Νομική Γνωμοδότηση: ΕΚΤΟΣ MDR</h4>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  Το Medithos MVP <strong>δεν αποτελεί ιατροτεχνολογικό προϊόν</strong> σύμφωνα με τον MDR (EU 2017/745), 
                  καθώς περιορίζεται αυστηρά σε <strong>πλοήγηση υγείας</strong> και <strong>δεν παρέχει</strong>:
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { title: "Δεν Διαγιγνώσκει", desc: "Το AI δεν παράγει ιατρικές διαγνώσεις. Προτείνει ειδικότητα γιατρού — δεν αντικαθιστά." },
              { title: "Δεν Θεραπεύει", desc: "Δεν συνταγογραφεί φάρμακα, δεν προτείνει θεραπευτικά πρωτόκολλα." },
              { title: "Δεν Προβλέπει", desc: "Δεν κάνει prognostic claims. Το triage είναι ένδειξη κινδύνου, όχι πρόβλεψη." },
            ].map((item, i) => (
              <div key={i} className="border border-green-200 bg-green-50/50 rounded-lg p-3 text-xs print-avoid-break">
                <p className="font-semibold text-green-800">{item.title}</p>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">9.1 Safeguards για MDR Exemption</h3>
          <div className="space-y-2">
            {[
              "Ρητό medical disclaimer σε κάθε AI οθόνη",
              "System prompt: «Δεν διαγιγνώσκεις ποτέ ασθένειες»",
              "Γιατροί ως «Health Navigation Advisors» — όχι θεράπων ιατρός",
              "Απενεργοποιημένες πληρωμές στο pilot (μη εμπορικό)",
              "Pilot Consent Modal: ρητή αποδοχή ότι δεν αντικαθιστά γιατρό",
              "Κανένα σταθερό ICD-10 mapping ή prognostic scoring",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 10. EU AI ACT ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Globe} num="10" title="Κανονιστικό Πλαίσιο AI — EU AI Act (2024/1689)" />
          
          <InfoBox color="cyan">
            Ο EU AI Act κατηγοριοποιεί τα AI systems σε 4 επίπεδα κινδύνου. Τα health-related AI μπορεί να θεωρηθούν <strong>High Risk</strong> (Annex III, §5). 
            Η αρχιτεκτονική μας είναι σχεδιασμένη για <strong>proactive compliance</strong>.
          </InfoBox>

          <h3 className="text-base font-semibold text-gray-800">10.1 Ταξινόμηση Κινδύνου</h3>
          <TechTable rows={[
            ["Symptom Navigator", "Πιθανό High Risk", "Triage/navigation — υπό αξιολόγηση, designed for compliance"],
            ["Preventive Advisor", "Limited Risk", "Lifestyle suggestions, no clinical decisions"],
            ["Insurance Analytics", "Limited Risk", "Aggregated data analysis, no individual decisions"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">10.2 Compliance Measures (Art. 9-15)</h3>
          <div className="space-y-2">
            {[
              "Risk Management System: τεκμηριωμένη εκτίμηση κινδύνου (DPIA + AI risk assessment)",
              "Data Governance: GDPR compliance, data minimization, purpose limitation",
              "Technical Documentation: πλήρης τεκμηρίωση αρχιτεκτονικής & AI behavior",
              "Record-Keeping: audit logs, model versioning, prompt tracking",
              "Transparency: users ενημερώνονται ρητά ότι αλληλεπιδρούν με AI",
              "Human Oversight: κλιμάκωση σε γιατρό, mandatory disclaimers",
              "Accuracy & Robustness: input validation, safety rails, confidence thresholds",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 11. DATA FLOWS ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Network} num="11" title="Data Flows & Access Control" />
          
          <h3 className="text-base font-semibold text-gray-800">11.1 Ροή Δεδομένων Ασθενή</h3>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-sm space-y-2 font-mono">
            <p>User → [TLS 1.3] → API Gateway → [JWT Verify] → PostgREST</p>
            <p>PostgREST → [RLS Policy Check] → PostgreSQL → [AES-256 at rest]</p>
            <p>User → [Auth Header] → Edge Function → [API Key] → AI Gateway → Gemini</p>
            <p>Gemini Response → [SSE Stream] → Edge Function → [Parse Triage] → User</p>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mt-6">11.2 Access Control Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border-b font-semibold">Resource</th>
                  <th className="text-center p-2 border-b font-semibold">Patient</th>
                  <th className="text-center p-2 border-b font-semibold">Doctor</th>
                  <th className="text-center p-2 border-b font-semibold">Admin</th>
                  <th className="text-center p-2 border-b font-semibold">Insurance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Own Medical Records", "✅ Full", "✅ With Grant", "✅ Full", "❌"],
                  ["Other Patient Records", "❌", "✅ With Grant", "✅ Full", "❌"],
                  ["Wearable Data", "✅ Full", "✅ With Grant", "✅ Full", "✅ Aggregated*"],
                  ["Appointments", "✅ Own", "✅ Own Patients", "✅ Full", "❌"],
                  ["Insurance Claims", "❌", "❌", "✅ Full", "✅ Own Org"],
                  ["Audit Logs", "❌", "❌", "✅ Full", "❌"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 ${j === 0 ? 'font-medium text-left' : 'text-center'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1">* Μόνο με ρητή συγκατάθεση ασθενή (insurance_data_consents)</p>
          </div>
        </section>

        {/* ══════════════ 12. SCALABILITY ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Server} num="12" title="Scalability & Μελλοντική Αρχιτεκτονική" />
          
          <h3 className="text-base font-semibold text-gray-800">12.1 Τρέχουσα Χωρητικότητα</h3>
          <TechTable rows={[
            ["Database", "500MB → 8GB", "Αυτόματο scaling, connection pooling"],
            ["Edge Functions", "Serverless", "Auto-scale per request, 0 idle cost"],
            ["Storage", "1GB → 100GB", "S3-compatible, CDN acceleration"],
            ["Concurrent Users", "~10K", "Connection pooling, CDN caching"],
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mt-6">12.2 Μελλοντικές Αναβαθμίσεις</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "HL7 FHIR Integration", desc: "Interoperability με νοσοκομεία & ΗΔΙΚΑ μέσω FHIR R4 resources" },
              { title: "Dedicated AI Models", desc: "Fine-tuned μοντέλα για ελληνικό ιατρικό λεξιλόγιο" },
              { title: "IoT Gateway", desc: "Real-time wearable streaming, continuous monitoring" },
              { title: "Multi-region Deploy", desc: "Edge computing σε πολλαπλά EU data centers" },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 text-xs print-avoid-break">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 13. COMPETITIVE ADVANTAGE ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Activity} num="13" title="Ανταγωνιστικό Πλεονέκτημα AI" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200">
              <thead>
                <tr className="bg-cyan-50">
                  <th className="text-left p-2 border-b font-semibold">Feature</th>
                  <th className="text-center p-2 border-b font-semibold">Medithos</th>
                  <th className="text-center p-2 border-b font-semibold">Ada Health</th>
                  <th className="text-center p-2 border-b font-semibold">Babylon</th>
                  <th className="text-center p-2 border-b font-semibold">DoctorAnytime</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI Triage", "✅ 4-level", "✅ Diagnosis", "✅ Diagnosis", "❌"],
                  ["MDR Exempt", "✅", "❌ Class IIa", "❌ Class IIa", "N/A"],
                  ["Greek Native AI", "✅", "❌", "❌", "❌"],
                  ["Medical Record", "✅ Full", "❌", "Limited", "❌"],
                  ["Wearable Integration", "✅", "❌", "❌", "❌"],
                  ["Preventive Health", "✅", "❌", "Limited", "❌"],
                  ["B2B Insurance", "✅", "✅", "✅", "❌"],
                  ["Emergency Triage", "✅ Auto-detect", "❌", "❌", "❌"],
                  ["Provider Booking", "✅", "❌", "✅", "✅"],
                  ["EU Data Hosting", "✅ Frankfurt", "✅", "✅", "✅"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 ${j === 0 ? 'font-medium text-left' : 'text-center'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════ 14. ROADMAP ══════════════ */}
        <section className="print-break space-y-5">
          <SectionHeader icon={Layers} num="14" title="Technical Roadmap" />
          
          <div className="space-y-4">
            {[
              {
                phase: "Phase 1 — Pilot (Τρέχουσα)",
                period: "Q1 2026",
                items: ["50-100 χρήστες, 5-10 γιατροί-σύμβουλοι", "AI Triage + Medical Record + Booking", "Fitbit & Apple Health integration", "GDPR consent flows + audit logging"]
              },
              {
                phase: "Phase 2 — Market Entry",
                period: "Q2-Q3 2026",
                items: ["5,000+ χρήστες, 100+ providers", "Τηλεϊατρική (video calls integration)", "HL7 FHIR readiness", "B2B Insurance module production", "Mobile app (iOS/Android) launch"]
              },
              {
                phase: "Phase 3 — Scale",
                period: "Q4 2026 - 2027",
                items: ["50,000+ χρήστες", "Custom AI model fine-tuning", "Multi-language (EN, DE)", "ΗΔΙΚΑ integration", "Real-time IoT monitoring", "CE marking preparation (if needed)"]
              },
            ].map((p, i) => (
              <div key={i} className="border-l-4 border-cyan-500 pl-4 print-avoid-break">
                <h4 className="font-semibold text-sm text-cyan-700">{p.phase}</h4>
                <p className="text-xs text-gray-500">{p.period}</p>
                <ul className="mt-2 space-y-1">
                  {p.items.map((item, j) => (
                    <li key={j} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-cyan-500 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <section className="print-break text-center py-12 border-t-2 border-cyan-600">
          <h2 className="text-3xl font-bold text-cyan-700 mb-2">MEDITHOS</h2>
          <p className="text-sm text-gray-500">Health Navigation Platform</p>
          <p className="text-xs text-gray-400 mt-4">
            Εμπιστευτικό Έγγραφο — Μάρτιος 2026 · v3.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Για περισσότερες πληροφορίες: info@medithos.com
          </p>
          <Separator className="my-6 bg-cyan-200" />
          <p className="text-xs text-gray-500 font-semibold">
            © 2026 Medithos. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Όλα τα δικαιώματα πνευματικής ιδιοκτησίας ανήκουν στην εφευρέτρια του Medithos,{" "}
            <span className="font-bold text-cyan-700">Χαλβατζάκου Αλεξάνδρα (Chalvatzakou Alexandra)</span>.
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            Απαγορεύεται η αναπαραγωγή, αντιγραφή, τροποποίηση ή διανομή οποιουδήποτε μέρους 
            του παρόντος εγγράφου χωρίς τη γραπτή συγκατάθεση της δικαιούχου.
          </p>
        </section>
      </div>
    </div>
  );
}

// ═══ Helper Components ═══

function SectionHeader({ icon: Icon, num, title }: { icon: any; num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-cyan-600 pb-3">
      <div className="p-2 rounded-lg bg-cyan-50">
        <Icon className="h-5 w-5 text-cyan-700" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{num}. {title}</h2>
    </div>
  );
}

function TechTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-gray-200 print-avoid-break">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-2 font-semibold text-cyan-700 border-b border-gray-100 w-1/4">{row[0]}</td>
              <td className="p-2 text-gray-700 border-b border-gray-100 w-1/4">{row[1]}</td>
              <td className="p-2 text-gray-600 border-b border-gray-100">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
  };
  return (
    <div className={`rounded-lg p-4 border text-sm leading-relaxed ${colors[color] || colors.cyan}`}>
      {children}
    </div>
  );
}

function SchemaGroup({ title, tables }: { title: string; tables: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 text-xs print-avoid-break">
      <p className="font-semibold text-cyan-700 mb-2">{title}</p>
      {tables.map((t, i) => (
        <p key={i} className="text-gray-600 py-0.5 font-mono text-[10px]">• {t}</p>
      ))}
    </div>
  );
}

function SecurityPillar({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 print-avoid-break">
      <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5 text-cyan-600" />
        {title}
      </h4>
      {items.map((item, i) => (
        <p key={i} className="text-xs text-gray-600 py-0.5">• {item}</p>
      ))}
    </div>
  );
}

function ComparisonCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  const isRed = color === "red";
  return (
    <div className={`border rounded-lg p-4 print-avoid-break ${isRed ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'}`}>
      <h4 className={`font-semibold text-sm mb-3 ${isRed ? 'text-red-700' : 'text-green-700'}`}>{title}</h4>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 py-0.5">
          <span className={`mt-0.5 ${isRed ? 'text-red-500' : 'text-green-500'}`}>{isRed ? '✗' : '✓'}</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
