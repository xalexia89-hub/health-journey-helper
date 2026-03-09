import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Database, Users, Shield, Layers, Server, Code, Lock, Eye, FileText, Activity, AlertTriangle, Key, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const SystemDocumentation = () => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    const element = document.querySelector('.documentation-body');
    if (!element) return;
    html2pdf().set({
      margin: [15, 15, 15, 15],
      filename: 'Medithos_System_Documentation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).from(element).save();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Navigation - Hidden in print */}
      <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-primary text-primary-foreground">
            <Download className="h-4 w-4 mr-2" />
            Λήψη PDF
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-12">
        
        {/* Cover Page */}
        <section className="text-center py-16 border-b border-border">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-primary mb-4">MEDITHOS</h1>
            <p className="text-2xl text-muted-foreground">Τεχνική Τεκμηρίωση Συστήματος</p>
            <p className="text-lg text-muted-foreground mt-2">Data Flows · Security · Access Control</p>
          </div>
          <div className="text-muted-foreground space-y-2">
            <p>Έκδοση: 2.0.0</p>
            <p>Ημερομηνία: {new Date().toLocaleDateString('el-GR')}</p>
            <p>Εμπιστευτικό Έγγραφο — Πλατφόρμα Υγείας Ελλάδας</p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📑 Περιεχόμενα
          </h2>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Επισκόπηση Συστήματος</li>
            <li>2. Αρχιτεκτονική</li>
            <li>3. Τεχνολογίες</li>
            <li>4. Ρόλοι Χρηστών & RBAC</li>
            <li>5. Βάση Δεδομένων</li>
            <li className="font-semibold text-primary">6. Ροές Δεδομένων (Data Flows)</li>
            <li className="font-semibold text-primary">7. Κρυπτογράφηση & Ασφάλεια Δεδομένων</li>
            <li className="font-semibold text-primary">8. Access Control & RLS Policies</li>
            <li className="font-semibold text-primary">9. Audit Logging & Compliance</li>
            <li className="font-semibold text-primary">10. Incident Management & Backups</li>
            <li>11. Λειτουργίες Ασθενών</li>
            <li>12. Λειτουργίες Γιατρών</li>
            <li>13. Λειτουργίες Διαχειριστή</li>
            <li>14. API & Edge Functions</li>
            <li>15. Αποθήκευση Αρχείων</li>
            <li>16. Χάρτης Εφαρμογής</li>
          </ol>
        </section>

        {/* 1. System Overview */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            1. Επισκόπηση Συστήματος
          </h2>
          <div className="prose prose-slate max-w-none space-y-4">
            <p>
              Το <strong>MEDITHOS</strong> είναι μια ολοκληρωμένη πλατφόρμα υγείας σχεδιασμένη 
              για την Ελλάδα, που συνδέει ασθενείς με γιατρούς, κλινικές και νοσοκομεία.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Βασικά Χαρακτηριστικά:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>AI-powered ανάλυση συμπτωμάτων</li>
                <li>Ηλεκτρονικό ραντεβού με πάροχους υγείας</li>
                <li>Διαχείριση ιατρικού ιστορικού</li>
                <li>Υπενθυμίσεις φαρμάκων</li>
                <li>Εκπαιδευτική ακαδημία υγείας</li>
                <li>Real-time ειδοποιήσεις</li>
                <li>Insurance Governance Layer (B2B)</li>
                <li>Mobile-ready (Capacitor)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Architecture */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            2. Αρχιτεκτονική
          </h2>
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Vite)                    │
├─────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Hooks & Context        │
│  - Dashboard    │  - UI (shadcn)   │  - useAuth              │
│  - Symptoms     │  - Layout        │  - useNotifications     │
│  - Providers    │  - Forms         │  - useMobile            │
│  - Appointments │  - Cards         │  - TanStack Query       │
│  - Insurance    │  - Dialogs       │  - useMedicalAuditLog   │
│  - Academy      │  - Medical       │  - useDoctorAccessLog   │
└─────────────────────────────────────────────────────────────┘
                              │ TLS 1.3
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              LOVABLE CLOUD (Backend — EU Frankfurt)          │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)     │  Edge Functions                │
│  - 40+ Tables with RLS    │  - symptom-chat (AI)           │
│  - Realtime subscriptions  │  - preventive-advisor          │
│  - AES-256 at rest         │  - insurance-aggregate         │
│                            │  - fitbit-auth / fitbit-sync   │
│  Authentication            │                                │
│  - Email/Password          │  Storage (Private Buckets)     │
│  - Role-based access       │  - medical-documents           │
│  - ISO 27001 / SOC 2       │  - avatars (signed URLs)       │
│                            │  - provider-documents          │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Technologies */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            3. Τεχνολογίες
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Frontend</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>React 18</strong> - UI Framework</li>
                <li><strong>Vite</strong> - Build Tool</li>
                <li><strong>TypeScript</strong> - Type Safety</li>
                <li><strong>Tailwind CSS</strong> - Styling</li>
                <li><strong>shadcn/ui</strong> - Components</li>
                <li><strong>TanStack Query</strong> - Data Fetching</li>
                <li><strong>React Router</strong> - Navigation</li>
                <li><strong>Recharts</strong> - Charts</li>
                <li><strong>Capacitor</strong> - Mobile Apps</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Backend & Security</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>PostgreSQL 15</strong> - Database (AES-256)</li>
                <li><strong>Row Level Security</strong> - Fine-grained Access</li>
                <li><strong>Edge Functions (Deno)</strong> - Serverless Logic</li>
                <li><strong>Lovable AI Gateway</strong> - AI Integration</li>
                <li><strong>Realtime</strong> - WebSocket Updates</li>
                <li><strong>Private Storage</strong> - Signed URL Access</li>
                <li><strong>TLS 1.3</strong> - Transit Encryption</li>
                <li><strong>JWT Tokens</strong> - Session Management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. User Roles & RBAC */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            4. Ρόλοι Χρηστών & RBAC
          </h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Ρόλος</th>
                    <th className="p-3 text-left">Περιγραφή</th>
                    <th className="p-3 text-left">Πρόσβαση</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">patient</td>
                    <td className="p-3">Ασθενής/Χρήστης</td>
                    <td className="p-3">Δικά του δεδομένα μόνο (RLS: <code>auth.uid() = user_id</code>)</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">doctor</td>
                    <td className="p-3">Γιατρός/Πάροχος</td>
                    <td className="p-3">Consent-based πρόσβαση μέσω <code>medical_access_grants</code></td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">insurance</td>
                    <td className="p-3">Ασφαλιστική Εταιρεία</td>
                    <td className="p-3">Aggregated data μέσω <code>insurance_data_consents</code></td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">admin</td>
                    <td className="p-3">Διαχειριστής</td>
                    <td className="p-3">Full access μέσω <code>has_role(uid, 'admin')</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">RBAC Architecture</h4>
              <ul className="text-sm space-y-1">
                <li>• Ρόλοι αποθηκεύονται σε ξεχωριστό πίνακα <code>user_roles</code> (αποφυγή privilege escalation)</li>
                <li>• Η function <code>has_role(uuid, app_role)</code> χρησιμοποιεί <code>SECURITY DEFINER</code> για αποφυγή recursive RLS</li>
                <li>• Η function <code>can_access_patient_medical_data()</code> ελέγχει consent + appointment context</li>
                <li>• Κάθε νέος χρήστης λαμβάνει αυτόματα τον ρόλο <code>patient</code> μέσω trigger</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Database Schema */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            5. Βάση Δεδομένων
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">40+ πίνακες με Row Level Security (RLS):</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Χρήστες & Ρόλοι</h4>
                <ul className="space-y-1">
                  <li><code>profiles</code> - Προφίλ χρηστών</li>
                  <li><code>user_roles</code> - Ρόλοι χρηστών (enum: patient, doctor, admin)</li>
                  <li><code>providers</code> - Πάροχοι υγείας</li>
                  <li><code>provider_documents</code> - Έγγραφα παρόχων</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ιατρικά Δεδομένα</h4>
                <ul className="space-y-1">
                  <li><code>medical_records</code> - Ιατρικό ιστορικό</li>
                  <li><code>medical_entries</code> - Ιατρικές εγγραφές</li>
                  <li><code>medical_entry_attachments</code> - Συνημμένα αρχεία</li>
                  <li><code>medical_documents</code> - Ιατρικά έγγραφα</li>
                  <li><code>health_files</code> - Αρχεία υγείας</li>
                  <li><code>symptom_intakes</code> - AI symptom sessions</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Access & Audit</h4>
                <ul className="space-y-1">
                  <li><code>medical_access_grants</code> - Παραχωρήσεις πρόσβασης</li>
                  <li><code>medical_record_shares</code> - Κοινοποιήσεις εγγραφών</li>
                  <li><code>medical_audit_logs</code> - Ιατρικό audit trail</li>
                  <li><code>doctor_access_logs</code> - Πρόσβαση γιατρών</li>
                  <li><code>audit_logs</code> - Γενικό audit log</li>
                  <li><code>consents</code> - Συγκαταθέσεις</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Insurance Layer</h4>
                <ul className="space-y-1">
                  <li><code>insurance_organizations</code> - Ασφαλιστικές</li>
                  <li><code>insurance_members</code> - Μέλη</li>
                  <li><code>insurance_claims</code> - Αξιώσεις</li>
                  <li><code>insurance_data_consents</code> - Data consent</li>
                  <li><code>insurance_risk_alerts</code> - Risk alerts</li>
                  <li><code>insurance_cost_metrics</code> - Cost metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 6. DATA FLOWS */}
        {/* ================================================================ */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            6. Ροές Δεδομένων (Data Flows)
          </h2>

          <div className="space-y-6">
            {/* 6.1 Patient Data Flow */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">6.1 Ροή Δεδομένων Ασθενούς</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-3">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Ασθενής (Browser/App)
    │
    ├─── Εγγραφή ──▶ auth.users ──▶ trigger: handle_new_user()
    │                                  ├── profiles (email, name)
    │                                  ├── user_roles (role: 'patient')
    │                                  ├── medical_records (empty record)
    │                                  ├── health_files (onboarding data)
    │                                  └── prevention_plans (empty plan)
    │
    ├─── Symptom Chat ──▶ Edge Function: symptom-chat
    │         │              ├── Input validation (50 msg, 10K chars)
    │         │              ├── AI Gateway (Gemini 2.5 Flash)
    │         │              └── Response → symptom_intakes
    │         │
    │         └──▶ Executive Summary ──▶ medical_entries
    │                                       └── medical_entry_attachments
    │
    ├─── Ιατρικός Φάκελος ──▶ medical_records (RLS: own data)
    │         │                  ├── medical_entries
    │         │                  ├── medical_documents (signed URLs)
    │         │                  └── medical_entry_attachments
    │         │
    │         └──▶ Κοινοποίηση ──▶ medical_access_grants
    │                              ├── medical_record_shares
    │                              └── medical_audit_logs (action: 'share')
    │
    ├─── Ραντεβού ──▶ appointments
    │                    ├── notifications (→ doctor)
    │                    └── audit_logs
    │
    └─── Wearables ──▶ wearable_heart_rate
                       ├── wearable_steps
                       ├── wearable_spo2
                       └── wearable_blood_pressure`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Κάθε ενέργεια ασθενούς φιλτράρεται μέσω RLS (<code>auth.uid() = user_id</code>) 
                και καταγράφεται σε αντίστοιχο audit table.
              </p>
            </div>

            {/* 6.2 Doctor Data Flow */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">6.2 Ροή Πρόσβασης Γιατρού</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-3">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Γιατρός (Browser)
    │
    ├─── Πρόσβαση σε ασθενή ──▶ can_access_patient_medical_data()
    │         │
    │         ├── Έλεγχος 1: Ο ίδιος ο ασθενής; → ✅ (self-access)
    │         ├── Έλεγχος 2: has_role('admin'); → ✅ (admin override)
    │         ├── Έλεγχος 3: medical_access_grants
    │         │     └── is_active = true AND (expires_at IS NULL OR > now())
    │         └── Έλεγχος 4: appointments
    │               └── status IN ('pending','confirmed') AND date >= -7 days
    │
    │    Εάν ✅ → Πρόσβαση ΜΕ logging
    │         └── doctor_access_logs.insert({
    │               doctor_user_id, patient_user_id,
    │               access_type, resource_type, resource_id
    │             })
    │
    │    Εάν ❌ → 403 Forbidden (RLS block)
    │
    └─── Διαχείριση Ραντεβού ──▶ appointments.update()
                                    └── notify_appointment_changes() trigger
                                         └── notifications (→ patient)`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Η πρόσβαση γιατρού σε ιατρικά δεδομένα απαιτεί πάντα ενεργή συγκατάθεση 
                ή πρόσφατο ραντεβού (≤7 ημέρες).
              </p>
            </div>

            {/* 6.3 Insurance Data Flow */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">6.3 Ροή Δεδομένων Ασφαλιστικών (B2B)</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-3">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Ασφαλιστική Εταιρεία
    │
    ├─── Dashboard Request ──▶ insurance_org_members (verify membership)
    │         │
    │         └──▶ get_insurance_member_aggregate(_member_id)
    │                  │
    │                  ├── 1. Εύρεση insurance_members.user_id
    │                  │
    │                  ├── 2. Έλεγχος insurance_data_consents
    │                  │     └── is_active = true AND org_id matches
    │                  │
    │                  ├── 3. Consent-based data collection:
    │                  │     ├── consent_risk_scores → medication_logs,
    │                  │     │     activity_logs, stress_logs (aggregated)
    │                  │     ├── consent_claims_summary → symptom_entries,
    │                  │     │     appointments (counts only)
    │                  │     ├── consent_chronic_conditions →
    │                  │     │     medical_records.chronic_conditions
    │                  │     └── consent_wearable_trends →
    │                  │           wearable_* tables (30-day averages)
    │                  │
    │                  └── 4. Return: aggregated JSONB (no PII)
    │
    └─── ⚠️ ΧΩΡΙΣ consent → Κενό JSON {}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Αρχή Ελάχιστης Πρόσβασης:</strong> Η ασφαλιστική λαμβάνει μόνο 
                aggregated metrics, ποτέ raw ιατρικά δεδομένα. Κάθε κατηγορία δεδομένων 
                απαιτεί ξεχωριστή συγκατάθεση.
              </p>
            </div>

            {/* 6.4 AI Data Flow */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">6.4 Ροή AI (Symptom Chat)</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-3">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Client (Browser)
    │
    ├── POST /functions/v1/symptom-chat
    │     Headers: Authorization: Bearer <JWT>
    │     Body: { messages: [...], healthContext: {...} }
    │
    ▼
Edge Function (Deno Runtime)
    │
    ├── 1. JWT Validation → auth.getUser()
    ├── 2. Input Validation:
    │     ├── messages.length ≤ 50
    │     ├── content.length ≤ 10,000 chars
    │     └── role ∈ ['user', 'assistant', 'system']
    │
    ├── 3. AI Gateway Request (EU-routed):
    │     ├── Model: google/gemini-2.5-flash
    │     ├── System Prompt: medical disclaimer
    │     └── Context: anonymized health data
    │
    ├── 4. Response Processing
    │     └── Structured output: symptoms, urgency, specialty
    │
    └── 5. Storage: symptom_intakes (RLS: user owns)
          └── Audit: medical_audit_logs`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Τα δεδομένα AI δεν αποθηκεύονται στον πάροχο AI. Η επεξεργασία γίνεται 
                μέσω EU-based AI Gateway χωρίς retention στο μοντέλο.
              </p>
            </div>

            {/* 6.5 File Upload Flow */}
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">6.5 Ροή Αρχείων (Upload/Download)</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Upload Flow:
    Client ──TLS 1.3──▶ Storage API ──▶ Private Bucket (AES-256)
      │                                    │
      └── RLS Policy: auth.uid() = owner   └── Path: user_id/filename
                                                └── medical_documents table

Download Flow:
    Client ──▶ supabase.storage.createSignedUrl(path, 3600)
      │           ├── RLS check: auth.uid() matches owner
      │           └── Returns: temporary URL (1-hour expiry)
      │
      └──▶ Signed URL ──▶ File (auto-expires)

⚠️ ΠΟΤΕ public URLs για ιατρικά αρχεία
⚠️ Signed URLs λήγουν μετά από 1 ώρα`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 7. ENCRYPTION & DATA SECURITY */}
        {/* ================================================================ */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            7. Κρυπτογράφηση & Ασφάλεια Δεδομένων
          </h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Επίπεδο</th>
                    <th className="p-3 text-left">Μέθοδος</th>
                    <th className="p-3 text-left">Λεπτομέρειες</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">Data at Rest</td>
                    <td className="p-3"><code>AES-256</code></td>
                    <td className="p-3">PostgreSQL volumes, Storage buckets, Backups — κρυπτογραφούνται αυτόματα στο filesystem level</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">Data in Transit</td>
                    <td className="p-3"><code>TLS 1.3</code></td>
                    <td className="p-3">Όλες οι συνδέσεις client→server, server→AI Gateway, server→storage</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">Authentication</td>
                    <td className="p-3"><code>JWT + bcrypt</code></td>
                    <td className="p-3">Passwords hashed με bcrypt, sessions μέσω signed JWT tokens</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">API Keys</td>
                    <td className="p-3"><code>Vault (encrypted)</code></td>
                    <td className="p-3">Edge function secrets αποθηκεύονται σε encrypted vault, ποτέ σε κώδικα</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">File Access</td>
                    <td className="p-3"><code>Signed URLs</code></td>
                    <td className="p-3">Temporary URLs (1h expiry) μέσω <code>createSignedUrl()</code></td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">Data Residency</td>
                    <td className="p-3"><code>EU (Frankfurt)</code></td>
                    <td className="p-3">Πλήρης αποθήκευση εντός ΕΕ, συμμόρφωση με GDPR Art. 44-49</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Πιστοποιήσεις Υποδομής</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>ISO 27001:2022</strong> — Information Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>SOC 2 Type II</strong> — Security & Availability</span>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Δεδομένα που ΔΕΝ συλλέγουμε
              </h4>
              <ul className="text-sm space-y-1">
                <li>• ΑΜΚΑ (Αριθμός Μητρώου Κοινωνικής Ασφάλισης)</li>
                <li>• ΑΦΜ ασθενών</li>
                <li>• Αριθμοί τραπεζικών λογαριασμών</li>
                <li>• Βιομετρικά δεδομένα ταυτοποίησης</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 8. ACCESS CONTROL & RLS */}
        {/* ================================================================ */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Key className="h-6 w-6 text-primary" />
            8. Access Control & RLS Policies
          </h2>

          <div className="space-y-6">
            {/* RLS Policy Matrix */}
            <div>
              <h3 className="text-lg font-semibold mb-3">8.1 RLS Policy Matrix</h3>
              <div className="border border-border rounded-lg overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Πίνακας</th>
                      <th className="p-2 text-center">Patient</th>
                      <th className="p-2 text-center">Doctor</th>
                      <th className="p-2 text-center">Admin</th>
                      <th className="p-2 text-left">Policy Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-2 font-medium">profiles</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>auth.uid() = id</code></td>
                    </tr>
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-2 font-medium">medical_records</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Consent</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>can_access_patient_medical_data()</code></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2 font-medium">medical_entries</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Consent</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>can_access_patient_medical_data()</code></td>
                    </tr>
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-2 font-medium">medical_documents</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2"><code>auth.uid() = user_id</code></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2 font-medium">medical_access_grants</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Granted</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>patient_user_id OR doctor_user_id</code></td>
                    </tr>
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-2 font-medium">appointments</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>patient_id OR provider.user_id</code></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2 font-medium">symptom_intakes</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">Consent</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2"><code>auth.uid() = user_id</code></td>
                    </tr>
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-2 font-medium">health_files</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2"><code>auth.uid() = user_id</code></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2 font-medium">insurance_members</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2 text-center">—</td>
                      <td className="p-2 text-center">Org</td>
                      <td className="p-2"><code>org_id via insurance_org_members</code></td>
                    </tr>
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-2 font-medium">providers</td>
                      <td className="p-2 text-center">Read</td>
                      <td className="p-2 text-center">Own</td>
                      <td className="p-2 text-center">All</td>
                      <td className="p-2"><code>is_active = true (public read)</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Access Control Functions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">8.2 Security Definer Functions</h3>
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2"><code>has_role(uuid, app_role) → boolean</code></h4>
                  <p className="text-xs text-muted-foreground">Ελέγχει εάν ο χρήστης έχει συγκεκριμένο ρόλο. Εκτελείται ως SECURITY DEFINER για αποφυγή infinite recursion στα RLS policies.</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2"><code>can_access_patient_medical_data(accessor_id, patient_id) → boolean</code></h4>
                  <p className="text-xs text-muted-foreground mb-2">Κεντρικός κόμβος ελέγχου πρόσβασης σε ιατρικά δεδομένα. Επιτρέπει πρόσβαση εάν:</p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>1. Ο accessor είναι ο ίδιος ο ασθενής</li>
                    <li>2. Ο accessor είναι admin</li>
                    <li>3. Ο accessor είναι γιατρός με ενεργό <code>medical_access_grant</code></li>
                    <li>4. Ο accessor είναι γιατρός με πρόσφατο ραντεβού (≤7 ημέρες)</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2"><code>get_insurance_member_aggregate(member_id) → jsonb</code></h4>
                  <p className="text-xs text-muted-foreground">Επιστρέφει aggregated δεδομένα υγείας μόνο εάν υπάρχει ενεργή συγκατάθεση. Κάθε κατηγορία δεδομένων ελέγχεται ξεχωριστά.</p>
                </div>
              </div>
            </div>

            {/* Consent Flow */}
            <div>
              <h3 className="text-lg font-semibold mb-3">8.3 Consent Management</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Ροή Συγκατάθεσης (Patient → Doctor):
═══════════════════════════════════════
1. Ασθενής αναζητά γιατρό → providers (public read)
2. Ασθενής παραχωρεί πρόσβαση → medical_access_grants
     ├── grant_type: 'temporary' | 'permanent'
     ├── expires_at: 7/30/90 days ή NULL
     └── is_active: true
3. Γιατρός προσπελαύνει δεδομένα → RLS → can_access_patient_medical_data()
4. Πρόσβαση καταγράφεται → doctor_access_logs
5. Ασθενής ανακαλεί → medical_access_grants.is_active = false
     └── medical_audit_logs (action: 'revoke_share')

Ροή Συγκατάθεσης (Patient → Insurance):
═══════════════════════════════════════
1. Ασθενής ενημερώνεται για κατηγορίες δεδομένων
2. Granular consent → insurance_data_consents
     ├── consent_risk_scores: boolean
     ├── consent_claims_summary: boolean
     ├── consent_chronic_conditions: boolean
     └── consent_wearable_trends: boolean
3. Ασφαλιστική ζητά δεδομένα → get_insurance_member_aggregate()
     └── Μόνο consented κατηγορίες επιστρέφονται
4. Ανάκληση → insurance_data_consents.is_active = false`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 9. AUDIT LOGGING */}
        {/* ================================================================ */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            9. Audit Logging & Compliance
          </h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Audit Table</th>
                    <th className="p-3 text-left">Καταγράφει</th>
                    <th className="p-3 text-left">Πεδία</th>
                    <th className="p-3 text-left">Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium"><code>audit_logs</code></td>
                    <td className="p-3">Γενικές ενέργειες (CRUD, login)</td>
                    <td className="p-3">user_id, action, table_name, old_data, new_data, ip</td>
                    <td className="p-3">5 έτη</td>
                  </tr>
                  <tr className="border-t border-border bg-muted/30">
                    <td className="p-3 font-medium"><code>medical_audit_logs</code></td>
                    <td className="p-3">Ιατρικές ενέργειες (view, upload, share, revoke)</td>
                    <td className="p-3">user_id, patient_user_id, action_type, resource_type, resource_id, metadata</td>
                    <td className="p-3">5 έτη</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium"><code>doctor_access_logs</code></td>
                    <td className="p-3">Πρόσβαση γιατρού σε δεδομένα ασθενούς</td>
                    <td className="p-3">doctor_user_id, patient_user_id, access_type, resource_type, resource_id, ip</td>
                    <td className="p-3">5 έτη</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Ενέργειες που Καταγράφονται</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">medical_audit_logs:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <code>view</code> — Προβολή ιατρικής εγγραφής</li>
                    <li>• <code>upload</code> — Μεταφόρτωση εγγράφου</li>
                    <li>• <code>edit</code> — Επεξεργασία εγγραφής</li>
                    <li>• <code>delete</code> — Διαγραφή</li>
                    <li>• <code>share</code> — Κοινοποίηση σε γιατρό</li>
                    <li>• <code>revoke_share</code> — Ανάκληση πρόσβασης</li>
                    <li>• <code>download</code> — Λήψη εγγράφου</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">doctor_access_logs:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <code>view_patient</code> — Προβολή ασθενούς</li>
                    <li>• <code>view_medical_record</code> — Προβολή φακέλου</li>
                    <li>• <code>view_appointment</code> — Προβολή ραντεβού</li>
                    <li>• <code>view_symptom_intake</code> — AI session</li>
                    <li>• <code>update_appointment</code> — Ενημέρωση ραντεβού</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Immutability & Integrity</h4>
              <ul className="text-sm space-y-1">
                <li>• Τα audit logs είναι <strong>append-only</strong> — δεν επιτρέπεται UPDATE ή DELETE</li>
                <li>• RLS policies αποτρέπουν τροποποίηση από μη-εξουσιοδοτημένους χρήστες</li>
                <li>• Τα logs περιλαμβάνουν timestamp, user_agent και IP (όπου διαθέσιμο)</li>
                <li>• Πολιτική διατήρησης: <strong>5 έτη</strong> για κανονιστική συμμόρφωση</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 10. INCIDENT MANAGEMENT & BACKUPS */}
        {/* ================================================================ */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            10. Incident Management & Backups
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">10.1 Backups & Disaster Recovery</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Τύπος</th>
                      <th className="p-3 text-left">Συχνότητα</th>
                      <th className="p-3 text-left">Retention</th>
                      <th className="p-3 text-left">Τοποθεσία</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-3 font-medium">Database Backup</td>
                      <td className="p-3">Καθημερινά (automated)</td>
                      <td className="p-3">30 ημέρες</td>
                      <td className="p-3">EU (Frankfurt)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 font-medium">Point-in-Time Recovery</td>
                      <td className="p-3">Continuous WAL archiving</td>
                      <td className="p-3">7 ημέρες</td>
                      <td className="p-3">EU (Frankfurt)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 font-medium">Storage Backup</td>
                      <td className="p-3">Automated replication</td>
                      <td className="p-3">Ongoing</td>
                      <td className="p-3">EU (Frankfurt)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 font-medium">Code Repository</td>
                      <td className="p-3">Git (κάθε αλλαγή)</td>
                      <td className="p-3">Πλήρες ιστορικό</td>
                      <td className="p-3">Lovable Cloud</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">10.2 Incident Response Plan (GDPR Art. 33-34)</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Timeline Διαχείρισης Περιστατικού Ασφαλείας:
════════════════════════════════════════════

T+0h    │ ΑΝΙΧΝΕΥΣΗ
        │ ├── Automated monitoring alerts
        │ ├── Audit log anomaly detection
        │ └── User/team report
        │
T+1h    │ ΑΞΙΟΛΟΓΗΣΗ
        │ ├── Severity classification (Low/Medium/High/Critical)
        │ ├── Scope analysis (affected data/users)
        │ ├── Evidence preservation (logs snapshot)
        │ └── Containment measures
        │
T+4h    │ ΠΕΡΙΟΡΙΣΜΟΣ
        │ ├── Isolate affected systems
        │ ├── Revoke compromised credentials
        │ ├── Block attack vectors
        │ └── Enable enhanced logging
        │
T+24h   │ ΕΙΔΟΠΟΙΗΣΗ (εσωτερική)
        │ ├── DPO notification
        │ ├── Technical team briefing
        │ └── Documentation of findings
        │
T+72h   │ ΕΙΔΟΠΟΙΗΣΗ ΑΡΧΗΣ (GDPR Art. 33)
        │ ├── Ελληνική Αρχή Προστασίας Δεδομένων (DPA)
        │ ├── Περιγραφή περιστατικού
        │ ├── Κατηγορίες & αριθμός υποκειμένων
        │ ├── Πιθανές συνέπειες
        │ └── Μέτρα αντιμετώπισης
        │
T+ASAP  │ ΕΙΔΟΠΟΙΗΣΗ ΥΠΟΚΕΙΜΕΝΩΝ (GDPR Art. 34)
        │ ├── Εάν υψηλός κίνδυνος για δικαιώματα
        │ ├── Σαφής περιγραφή σε απλή γλώσσα
        │ └── Συστάσεις μέτρων προστασίας
        │
T+Post  │ POST-INCIDENT
        │ ├── Root cause analysis
        │ ├── Security improvements
        │ ├── Policy updates
        │ └── Lessons learned documentation`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">10.3 Input Validation & DoS Prevention</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Edge Function Limits:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Max messages per session: <strong>50</strong></li>
                      <li>• Max chars per message: <strong>10,000</strong></li>
                      <li>• Role validation: <code>user | assistant | system</code></li>
                      <li>• JWT required: Κάθε request</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Database Limits:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Query row limit: <strong>1,000</strong> (default)</li>
                      <li>• Connection pooling: <strong>Ενεργό</strong></li>
                      <li>• Rate limiting: Edge function level</li>
                      <li>• File upload: Size limits per bucket</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Patient Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">11. Λειτουργίες Ασθενών</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Dashboard</h4>
              <p className="text-sm text-muted-foreground">Κεντρική σελίδα με επερχόμενα ραντεβού, υπενθυμίσεις φαρμάκων και quick actions.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Καταγραφή Συμπτωμάτων</h4>
              <p className="text-sm text-muted-foreground">AI-powered chat για ανάλυση συμπτωμάτων με body avatar selection, pain level και προτάσεις ειδικότητας.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Εύρεση Παρόχων</h4>
              <p className="text-sm text-muted-foreground">Λίστα γιατρών, κλινικών και νοσοκομείων με φίλτρα, αξιολογήσεις και gallery.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Ιατρικό Ιστορικό</h4>
              <p className="text-sm text-muted-foreground">Διαχείριση αλλεργιών, χρόνιων παθήσεων, φαρμάκων με consent-based κοινοποίηση.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Υπενθυμίσεις Φαρμάκων</h4>
              <p className="text-sm text-muted-foreground">Προγραμματισμός υπενθυμίσεων με δοσολογία, συχνότητα και tracking λήψης.</p>
            </div>
          </div>
        </section>

        {/* 12. Doctor Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">12. Λειτουργίες Γιατρών</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Doctor Dashboard</h4>
              <p className="text-sm text-muted-foreground">Στατιστικά, σημερινά ραντεβού, ειδοποιήσεις σε real-time.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Διαχείριση Ραντεβού</h4>
              <p className="text-sm text-muted-foreground">Επιβεβαίωση, ολοκλήρωση ή ακύρωση ραντεβού με πρόσβαση στα συμπτώματα ασθενούς.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Πρόγραμμα & Διαθεσιμότητα</h4>
              <p className="text-sm text-muted-foreground">Ορισμός slots διαθεσιμότητας ανά ημέρα και ώρα.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Ρυθμίσεις Προφίλ</h4>
              <p className="text-sm text-muted-foreground">Avatar, gallery (5 φωτογραφίες), βιογραφία, υπηρεσίες, προσόντα, τιμές.</p>
            </div>
          </div>
        </section>

        {/* 13. Admin Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">13. Λειτουργίες Διαχειριστή</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Admin Dashboard</h4>
              <p className="text-sm text-muted-foreground">Συνολικά στατιστικά πλατφόρμας, χρήστες, ραντεβού, έσοδα.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Διαχείριση Χρηστών & Παρόχων</h4>
              <p className="text-sm text-muted-foreground">Προβολή, αναζήτηση, επαλήθευση, ενεργοποίηση/απενεργοποίηση.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Content Moderation</h4>
              <p className="text-sm text-muted-foreground">Έλεγχος περιεχομένου κοινότητας, αναφορές, moderation actions.</p>
            </div>
          </div>
        </section>

        {/* 14. API & Edge Functions */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">14. API & Edge Functions</h2>
          <div className="space-y-4">
            {[
              { name: 'symptom-chat', desc: 'AI-powered συνομιλία για ανάλυση συμπτωμάτων', method: 'POST', model: 'google/gemini-2.5-flash' },
              { name: 'preventive-advisor', desc: 'AI σύμβουλος προληπτικής υγείας', method: 'POST', model: 'google/gemini-2.5-flash' },
              { name: 'insurance-aggregate', desc: 'Aggregation δεδομένων για ασφαλιστικές', method: 'POST', model: '—' },
              { name: 'fitbit-auth', desc: 'OAuth flow για Fitbit σύνδεση', method: 'GET/POST', model: '—' },
              { name: 'fitbit-sync', desc: 'Συγχρονισμός δεδομένων από Fitbit', method: 'POST', model: '—' },
            ].map((fn) => (
              <div key={fn.name} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{fn.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{fn.desc}</p>
                <div className="bg-muted p-2 rounded text-xs">
                  <code>{fn.method} /functions/v1/{fn.name}</code>
                  {fn.model !== '—' && <><br /><code>Model: {fn.model}</code></>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 15. Storage */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">15. Αποθήκευση Αρχείων</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Bucket</th>
                    <th className="p-3 text-left">Χρήση</th>
                    <th className="p-3 text-left">Public</th>
                    <th className="p-3 text-left">Πρόσβαση</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>medical-documents</code></td>
                    <td className="p-3">Ιατρικά αρχεία ασθενών</td>
                    <td className="p-3">❌ Private</td>
                    <td className="p-3">Signed URLs (1h expiry)</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>avatars</code></td>
                    <td className="p-3">Εικόνες προφίλ</td>
                    <td className="p-3">❌ Private</td>
                    <td className="p-3">Signed URLs</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>provider-documents</code></td>
                    <td className="p-3">Πτυχία, πιστοποιήσεις, άδειες</td>
                    <td className="p-3">❌ Private</td>
                    <td className="p-3">Admin review only</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>provider-gallery</code></td>
                    <td className="p-3">Φωτογραφίες ιατρείου</td>
                    <td className="p-3">✅ Public</td>
                    <td className="p-3">Direct URL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 16. Routes Map */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">16. Χάρτης Εφαρμογής</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Public Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/ — Landing Page (Pilot)</li>
                <li>/auth — Σύνδεση/Εγγραφή</li>
                <li>/pilot/enroll — Εγγραφή Pilot</li>
                <li>/doctor-signup — Εγγραφή Γιατρού</li>
                <li>/provider-signup — Εγγραφή Παρόχου</li>
                <li>/terms — Όροι Χρήσης</li>
                <li>/privacy — Πολιτική Απορρήτου</li>
                <li>/gdpr-compliance — GDPR Documentation</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Patient Routes (Protected)</h4>
              <ul className="space-y-1 font-mono">
                <li>/dashboard — Πίνακας ελέγχου</li>
                <li>/symptoms — AI Symptom Assistant</li>
                <li>/providers — Λίστα παρόχων</li>
                <li>/appointments — Ραντεβού</li>
                <li>/records — Ιατρικό ιστορικό</li>
                <li>/medications — Υπενθυμίσεις φαρμάκων</li>
                <li>/settings — Ρυθμίσεις (GDPR rights)</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Doctor / Admin / Insurance Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/doctor/* — Doctor Dashboard, Appointments, Patients, Schedule</li>
                <li>/admin/* — Admin Dashboard, Users, Providers, Analytics, Moderation</li>
                <li>/insurance/* — Dashboard, Members, Risk, Claims, Behavioral, Cost</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center pt-12 border-t border-border">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} MEDITHOS — Όλα τα δικαιώματα διατηρούνται
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Τεκμηρίωση v2.0 — Data Flows, Security & Access Control
          </p>
        </section>
      </div>
    </div>
  );
};

export default SystemDocumentation;
