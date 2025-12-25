import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Database, Users, Shield, Layers, Server, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SystemDocumentation = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
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
          <Button onClick={handlePrint} className="bg-primary text-primary-foreground">
            <Printer className="h-4 w-4 mr-2" />
            Εκτύπωση PDF
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
          </div>
          <div className="text-muted-foreground space-y-2">
            <p>Έκδοση: 1.0.0</p>
            <p>Ημερομηνία: {new Date().toLocaleDateString('el-GR')}</p>
            <p>Πλατφόρμα Υγείας Ελλάδας</p>
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
            <li>4. Ρόλοι Χρηστών</li>
            <li>5. Βάση Δεδομένων</li>
            <li>6. Λειτουργίες Ασθενών</li>
            <li>7. Λειτουργίες Γιατρών</li>
            <li>8. Λειτουργίες Διαχειριστή</li>
            <li>9. Ασφάλεια</li>
            <li>10. API & Edge Functions</li>
            <li>11. Αποθήκευση Αρχείων</li>
            <li>12. Χάρτης Εφαρμογής</li>
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
│  - Academy      │  - Dialogs       │                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LOVABLE CLOUD (Backend)                   │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)     │  Edge Functions                │
│  - 20 Tables with RLS      │  - symptom-chat (AI)           │
│  - Realtime subscriptions  │  - Lovable AI Gateway          │
│                            │                                │
│  Authentication            │  Storage                       │
│  - Email/Password          │  - avatars                     │
│  - Role-based access       │  - provider-gallery            │
│  - Auto-confirm enabled    │  - provider-documents          │
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
                <li><strong>Radix UI</strong> - Primitives</li>
                <li><strong>TanStack Query</strong> - Data Fetching</li>
                <li><strong>React Router</strong> - Navigation</li>
                <li><strong>Recharts</strong> - Charts</li>
                <li><strong>Capacitor</strong> - Mobile Apps</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Backend</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>PostgreSQL</strong> - Database</li>
                <li><strong>Row Level Security</strong> - Data Protection</li>
                <li><strong>Edge Functions</strong> - Serverless Logic</li>
                <li><strong>Lovable AI Gateway</strong> - AI Integration</li>
                <li><strong>Realtime</strong> - Live Updates</li>
                <li><strong>Storage</strong> - File Management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. User Roles */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            4. Ρόλοι Χρηστών
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
                    <td className="p-3">Dashboard, Symptoms, Providers, Appointments, Records</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">doctor</td>
                    <td className="p-3">Γιατρός/Πάροχος</td>
                    <td className="p-3">Doctor Dashboard, Patients, Schedule, Settings</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">admin</td>
                    <td className="p-3">Διαχειριστής</td>
                    <td className="p-3">Admin Panel, Users, Providers, Analytics</td>
                  </tr>
                </tbody>
              </table>
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
            <p className="text-muted-foreground">20 πίνακες με Row Level Security (RLS):</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Χρήστες & Ρόλοι</h4>
                <ul className="space-y-1">
                  <li><code>profiles</code> - Προφίλ χρηστών</li>
                  <li><code>user_roles</code> - Ρόλοι χρηστών</li>
                  <li><code>providers</code> - Πάροχοι υγείας</li>
                  <li><code>provider_documents</code> - Έγγραφα παρόχων</li>
                  <li><code>provider_gallery</code> - Φωτογραφίες παρόχων</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ραντεβού & Πληρωμές</h4>
                <ul className="space-y-1">
                  <li><code>appointments</code> - Ραντεβού</li>
                  <li><code>availability_slots</code> - Διαθεσιμότητα</li>
                  <li><code>payments</code> - Πληρωμές</li>
                  <li><code>reviews</code> - Αξιολογήσεις</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ιατρικά Δεδομένα</h4>
                <ul className="space-y-1">
                  <li><code>medical_records</code> - Ιατρικό ιστορικό</li>
                  <li><code>medical_documents</code> - Ιατρικά έγγραφα</li>
                  <li><code>medical_record_shares</code> - Κοινοποιήσεις</li>
                  <li><code>symptom_intakes</code> - Καταγραφή συμπτωμάτων</li>
                  <li><code>medication_reminders</code> - Υπενθυμίσεις φαρμάκων</li>
                  <li><code>medication_logs</code> - Ιστορικό φαρμάκων</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ακαδημία & Άλλα</h4>
                <ul className="space-y-1">
                  <li><code>academy_videos</code> - Εκπαιδευτικά βίντεο</li>
                  <li><code>academy_publications</code> - Δημοσιεύσεις</li>
                  <li><code>academy_case_studies</code> - Μελέτες περιπτώσεων</li>
                  <li><code>notifications</code> - Ειδοποιήσεις</li>
                  <li><code>audit_logs</code> - Αρχείο καταγραφών</li>
                  <li><code>interest_expressions</code> - Εκδηλώσεις ενδιαφέροντος</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Patient Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">6. Λειτουργίες Ασθενών</h2>
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
              <p className="text-sm text-muted-foreground">Διαχείριση αλλεργιών, χρόνιων παθήσεων, φαρμάκων και χειρουργείων με δυνατότητα κοινοποίησης.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Υπενθυμίσεις Φαρμάκων</h4>
              <p className="text-sm text-muted-foreground">Προγραμματισμός υπενθυμίσεων με δοσολογία, συχνότητα και tracking λήψης.</p>
            </div>
          </div>
        </section>

        {/* 7. Doctor Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">7. Λειτουργίες Γιατρών</h2>
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

        {/* 8. Admin Features */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">8. Λειτουργίες Διαχειριστή</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Admin Dashboard</h4>
              <p className="text-sm text-muted-foreground">Συνολικά στατιστικά πλατφόρμας, χρήστες, ραντεβού, έσοδα.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Διαχείριση Χρηστών</h4>
              <p className="text-sm text-muted-foreground">Προβολή, αναζήτηση και διαχείριση όλων των χρηστών.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Διαχείριση Παρόχων</h4>
              <p className="text-sm text-muted-foreground">Επαλήθευση, ενεργοποίηση/απενεργοποίηση παρόχων.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Εκδηλώσεις Ενδιαφέροντος</h4>
              <p className="text-sm text-muted-foreground">Διαχείριση αιτημάτων εγγραφής νέων παρόχων.</p>
            </div>
          </div>
        </section>

        {/* 9. Security */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            9. Ασφάλεια
          </h2>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Row Level Security (RLS)</h4>
              <p className="text-sm">Όλοι οι πίνακες προστατεύονται με RLS policies που διασφαλίζουν ότι οι χρήστες έχουν πρόσβαση μόνο στα δικά τους δεδομένα.</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Authentication</h4>
              <p className="text-sm">Email/Password authentication με auto-confirm για ταχύτερη εγγραφή. Κάθε νέος χρήστης λαμβάνει αυτόματα τον ρόλο "patient".</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Role-Based Access Control</h4>
              <p className="text-sm">Τριών επιπέδων σύστημα ρόλων (patient, doctor, admin) με διαφορετικά δικαιώματα πρόσβασης.</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Audit Logging</h4>
              <p className="text-sm">Καταγραφή ενεργειών για παρακολούθηση και compliance.</p>
            </div>
          </div>
        </section>

        {/* 10. API & Edge Functions */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">10. API & Edge Functions</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">symptom-chat</h4>
              <p className="text-sm text-muted-foreground mb-2">AI-powered συνομιλία για ανάλυση συμπτωμάτων.</p>
              <div className="bg-muted p-2 rounded text-xs">
                <code>POST /functions/v1/symptom-chat</code>
                <br />
                <code>Body: {`{ messages: [{role, content}] }`}</code>
                <br />
                <code>Model: google/gemini-2.5-flash</code>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Storage */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">11. Αποθήκευση Αρχείων</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Bucket</th>
                    <th className="p-3 text-left">Χρήση</th>
                    <th className="p-3 text-left">Public</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>avatars</code></td>
                    <td className="p-3">Εικόνες προφίλ χρηστών και παρόχων</td>
                    <td className="p-3">✅ Ναι</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>provider-gallery</code></td>
                    <td className="p-3">Φωτογραφίες ιατρείου/κλινικής</td>
                    <td className="p-3">✅ Ναι</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3"><code>provider-documents</code></td>
                    <td className="p-3">Πτυχία, πιστοποιήσεις, άδειες</td>
                    <td className="p-3">❌ Όχι</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 12. Routes Map */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold mb-6">12. Χάρτης Εφαρμογής</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Public Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/intro - Αρχική σελίδα</li>
                <li>/welcome - Καλωσόρισμα</li>
                <li>/auth - Σύνδεση/Εγγραφή</li>
                <li>/doctor-registration - Εγγραφή γιατρού</li>
                <li>/interest-form - Φόρμα ενδιαφέροντος</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Patient Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/dashboard - Πίνακας ελέγχου</li>
                <li>/symptoms - Καταγραφή συμπτωμάτων</li>
                <li>/providers - Λίστα παρόχων</li>
                <li>/provider/:id - Προφίλ παρόχου</li>
                <li>/appointments - Ραντεβού</li>
                <li>/medical-records - Ιατρικό ιστορικό</li>
                <li>/medication-reminders - Υπενθυμίσεις</li>
                <li>/academy - Εκπαίδευση</li>
                <li>/feed - Feed</li>
                <li>/profile - Προφίλ</li>
                <li>/settings - Ρυθμίσεις</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Doctor Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/doctor/dashboard - Πίνακας ελέγχου γιατρού</li>
                <li>/doctor/appointments - Ραντεβού</li>
                <li>/doctor/patients - Ασθενείς</li>
                <li>/doctor/schedule - Πρόγραμμα</li>
                <li>/doctor/settings - Ρυθμίσεις</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Admin Routes</h4>
              <ul className="space-y-1 font-mono">
                <li>/admin/dashboard - Admin Dashboard</li>
                <li>/admin/users - Χρήστες</li>
                <li>/admin/providers - Πάροχοι</li>
                <li>/admin/analytics - Analytics</li>
                <li>/admin/interest-expressions - Αιτήματα</li>
                <li>/admin/settings - Ρυθμίσεις</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center pt-12 border-t border-border">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} MEDITHOS - Όλα τα δικαιώματα διατηρούνται
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Τεκμηρίωση δημιουργήθηκε αυτόματα
          </p>
        </section>
      </div>
    </div>
  );
};

export default SystemDocumentation;
