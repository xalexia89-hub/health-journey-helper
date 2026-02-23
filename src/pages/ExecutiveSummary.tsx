import { ArrowLeft, Printer, FileText, Shield, Brain, Database, Users, Building2, Heart, CheckCircle2, AlertTriangle, Lock, Server, Eye, RotateCcw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function ExecutiveSummary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border print:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Executive Summary</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Εκτύπωση PDF
          </Button>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="px-6 py-8 max-w-4xl mx-auto space-y-10 print:px-12 print:py-6 print:max-w-none">

          {/* Cover / Title */}
          <div className="text-center space-y-3 pb-6 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Εμπιστευτικό Έγγραφο</p>
            <h1 className="text-3xl font-bold text-primary">Medithos</h1>
            <p className="text-lg text-muted-foreground">Executive Summary — MVP Scope, Data Architecture & Compliance</p>
            <p className="text-sm text-muted-foreground">Φεβρουάριος 2026 · Πιλοτική Φάση</p>
          </div>

          {/* ─── SECTION 1: MVP SCOPE ─── */}
          <section className="space-y-5 print:break-before-page">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">1. Τι είναι το Medithos — MVP Scope</h2>
            </div>

            <div className="bg-muted/30 rounded-xl p-5 space-y-3">
              <p className="text-sm leading-relaxed text-foreground">
                Το <strong>Medithos</strong> είναι μια πλατφόρμα <strong>πλοήγησης υγείας</strong> (health navigation), 
                όχι ένα εργαλείο διάγνωσης. Βοηθά τον χρήστη να κατανοήσει τα συμπτώματά του, να βρει τον κατάλληλο 
                πάροχο υγείας και να οργανώσει το ιατρικό του ιστορικό — χωρίς ποτέ να υποκαθιστά τον γιατρό.
              </p>
            </div>

            <h3 className="text-base font-semibold text-foreground mt-4">Βασικά Modules του MVP</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: Brain, title: "AI Symptom Navigator", desc: "Καθοδηγημένη συνομιλία για κατανόηση συμπτωμάτων. Χρησιμοποιεί AI για triage scoring (χαμηλό/μέτριο/υψηλό) και προτείνει ειδικότητα γιατρού — ΔΕΝ διαγιγνώσκει." },
                { icon: FileText, title: "Living Medical Record", desc: "Ψηφιακός φάκελος υγείας στα χέρια του ασθενή. Αποθηκεύει ιστορικό, εξετάσεις, φάρμακα, οικογενειακό ιστορικό. Ο χρήστης ελέγχει ποιος βλέπει τι." },
                { icon: Users, title: "Provider Network", desc: "Κατάλογος γιατρών-συμβούλων (advisors), νοσηλευτών και εργαστηρίων. Κατά τη φάση pilot, η σύνδεση γίνεται χειροκίνητα." },
                { icon: Building2, title: "Insurance Governance", desc: "B2B module για ασφαλιστικές: παρακολούθηση risk scores, claims, compliance — με δεδομένα μόνο από ασθενείς που έδωσαν ρητή συγκατάθεση." },
              ].map((item, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Τι ΔΕΝ κάνει το MVP</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-0.5 list-disc list-inside">
                    <li>Δεν παρέχει ιατρική διάγνωση ή θεραπευτική συμβουλή</li>
                    <li>Δεν αντικαθιστά το 112/166 σε έκτακτες ανάγκες</li>
                    <li>Δεν δημιουργεί σχέση γιατρού-ασθενή</li>
                    <li>Δεν επεξεργάζεται πληρωμές (απενεργοποιημένες στο pilot)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* ─── SECTION 2: DATA & AI ARCHITECTURE ─── */}
          <section className="space-y-5 print:break-before-page">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">2. Αρχιτεκτονική Δεδομένων & AI</h2>
            </div>

            {/* Data Flow Summary */}
            <h3 className="text-base font-semibold text-foreground">2.1 Ροές Δεδομένων — Απλοποιημένη Επισκόπηση</h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Τύπος Δεδομένων</TableHead>
                    <TableHead className="text-xs">Πηγή</TableHead>
                    <TableHead className="text-xs">Πού αποθηκεύεται</TableHead>
                    <TableHead className="text-xs">Ποιος βλέπει</TableHead>
                    <TableHead className="text-xs">Πόσο κρατιέται</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Συμπτώματα & Triage", "Χρήστης → AI", "Cloud DB (EU)", "Χρήστης, γιατρός (με συγκατάθεση)", "Όσο ο λογαριασμός είναι ενεργός"],
                    ["Ιατρικό ιστορικό", "Χρήστης, γιατρός", "Cloud DB (EU)", "Χρήστης, γιατρός (με grant)", "Όσο ο λογαριασμός είναι ενεργός"],
                    ["Wearable data", "Apple Health, Fitbit", "Cloud DB (EU)", "Χρήστης, ασφαλιστική (με consent)", "Τελευταίες 90 ημέρες"],
                    ["Ασφαλιστικά aggregates", "Pipeline aggregation", "Cloud DB (EU)", "Ασφαλιστική (μόνο με consent)", "Ανά μήνα, 24 μήνες"],
                    ["Τεχνικά/Usage logs", "Αυτόματο", "Cloud DB (EU)", "Μόνο η ομάδα Medithos", "12 μήνες"],
                    ["Στοιχεία λογαριασμού", "Χρήστης", "Cloud Auth (EU)", "Χρήστης, Admin", "Μέχρι τη διαγραφή"],
                  ].map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-xs">{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* AI Architecture */}
            <h3 className="text-base font-semibold text-foreground mt-6">2.2 Πώς λειτουργεί το AI</h3>

            <div className="bg-muted/30 rounded-xl p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Μοντέλο: Lovable AI Gateway</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Το Medithos χρησιμοποιεί AI μοντέλα μέσω ασφαλούς gateway (Google Gemini, OpenAI). 
                  Τα δεδομένα δεν αποθηκεύονται στους παρόχους AI — στέλνονται μόνο για επεξεργασία 
                  και η απάντηση αποθηκεύεται τοπικά στη βάση μας.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "Symptom Chat", desc: "Ο χρήστης περιγράφει συμπτώματα → AI αναλύει → Triage Score + Πρόταση ειδικότητας. Κάθε απάντηση φέρει disclaimer." },
                  { title: "Preventive Advisor", desc: "Αξιολόγηση lifestyle (ύπνος, διατροφή, κίνηση, στρες) → εξατομικευμένες συμβουλές πρόληψης." },
                  { title: "Insurance Aggregation", desc: "Consent-based pipeline: συγκεντρώνει risk scores, wearable trends, ER visits — μόνο με ρητή συγκατάθεση." },
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-xs font-semibold text-primary mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Stack */}
            <h3 className="text-base font-semibold text-foreground mt-6">2.3 Τεχνική Ασφάλεια (Non-Technical View)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { check: true, text: "Πάροχος υποδομής (Lovable Cloud): ISO 27001:2022 ✅ & SOC 2 Type II ✅" },
                { check: true, text: "Κρυπτογράφηση σε μεταφορά (TLS 1.3) και ηρεμία (AES-256)" },
                { check: true, text: "Row-Level Security: κάθε χρήστης βλέπει μόνο τα δικά του δεδομένα" },
                { check: true, text: "Audit logs: κάθε πρόσβαση σε ιατρικά δεδομένα καταγράφεται" },
                { check: true, text: "EU-based hosting (Frankfurt, Γερμανία)" },
                { check: true, text: "Consent management: granular έλεγχος ανά κατηγορία δεδομένων" },
                { check: true, text: "GDPR data subject rights: εξαγωγή, διαγραφή, φορητότητα" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* ─── SECTION 3: COMPLIANCE PLAN ─── */}
          <section className="space-y-5 print:break-before-page">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">3. Πλάνο Κανονιστικής Συμμόρφωσης</h2>
            </div>

            {/* GDPR Roles */}
            <h3 className="text-base font-semibold text-foreground">3.1 Ρόλοι GDPR — Controller vs Processor</h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Use Case</TableHead>
                    <TableHead className="text-xs">Controller</TableHead>
                    <TableHead className="text-xs">Processor</TableHead>
                    <TableHead className="text-xs">Νομική Βάση</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Χρήστης → Medithos app (B2C)", "Medithos", "—", "Συγκατάθεση (Art. 9) + Σύμβαση (Art. 6.1.b)"],
                    ["Ασφαλιστική → Medithos (B2B)", "Ασφαλιστική εταιρεία", "Medithos", "DPA (Art. 28) + Consent ασθενή"],
                    ["Γιατρός-Σύμβουλος → Ασθενής", "Medithos", "—", "Advisor agreement + Consent ασθενή"],
                    ["Wearable data sync", "Medithos", "Apple / Fitbit (sub-processors)", "Συγκατάθεση (Art. 9)"],
                    ["AI processing (symptom chat)", "Medithos", "AI providers (sub-processors)", "Έννομο συμφέρον + Consent"],
                  ].map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-xs">{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Compliance Roadmap */}
            <h3 className="text-base font-semibold text-foreground mt-6">3.2 Roadmap Συμμόρφωσης</h3>

            <div className="space-y-3">
              {[
                { phase: "Ολοκληρωμένο ✅", items: [
                  "Privacy Policy & Terms of Use (ελληνικά, εντός εφαρμογής)",
                  "Consent modal κατά την πρώτη χρήση (GDPR Art. 9)",
                  "GDPR Data Subject Rights (εξαγωγή, διαγραφή, φορητότητα)",
                  "Row-Level Security σε 30+ πίνακες",
                  "Medical disclaimers σε κάθε AI οθόνη",
                  "Insurance consent management (granular κατηγορίες)",
                  "DPIA draft & DPA template (Art. 28)",
                ]},
                { phase: "Q2 2026 📋", items: [
                  "Εξωτερικός DPO (Data Protection Officer)",
                  "Επίσημη διαδικασία Data Breach Notification",
                  "ISO 27001 gap analysis",
                  "Penetration testing (εξωτερικό)",
                ]},
                { phase: "Q3–Q4 2026 🎯", items: [
                  "ISO 27001 alignment / πιστοποίηση",
                  "SOC 2 Type I αξιολόγηση",
                  "Formal ISMS (Information Security Management System)",
                  "Εξωτερικός audit GDPR compliance",
                ]},
              ].map((section, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{section.phase}</p>
                  <ul className="space-y-1">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* MDR Position */}
            <h3 className="text-base font-semibold text-foreground mt-6">3.3 Θέση για MDR (Medical Device Regulation)</h3>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Το Medithos <strong>δεν εμπίπτει στον κανονισμό MDR (EU 2017/745)</strong> καθώς λειτουργεί 
                αποκλειστικά ως εργαλείο <strong>πλοήγησης</strong> και όχι διάγνωσης ή θεραπείας. 
                Κάθε AI output φέρει ρητό disclaimer, οι γιατροί συμμετέχουν ως σύμβουλοι χωρίς σχέση 
                γιατρού-ασθενή, και δεν παράγεται κανένα κλινικό αποτέλεσμα. Η θέση αυτή τεκμηριώνεται 
                σε επίσημη νομική γνωμοδότηση.
              </p>
            </div>
          </section>

          <Separator />

          {/* ─── SECTION 4: SECURITY ARCHITECTURE ─── */}
          <section className="space-y-5 print:break-before-page">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">4. Αρχιτεκτονική Ασφάλειας — High-Level Overview</h2>
            </div>

            <div className="bg-muted/30 rounded-xl p-5 space-y-2">
              <p className="text-sm leading-relaxed text-foreground">
                Η υποδομή του Medithos φιλοξενείται στο <strong>Lovable Cloud</strong>, πάροχο με πιστοποιήσεις 
                <strong> ISO 27001:2022</strong> και <strong>SOC 2 Type II</strong>. Παρακάτω περιγράφεται η 
                αρχιτεκτονική ασφαλείας σε πέντε πυλώνες.
              </p>
            </div>

            {/* 4.1 Encryption */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">4.1 Κρυπτογράφηση (Encryption)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-primary mb-1">At Rest (Ηρεμία)</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>AES-256</strong> για όλα τα δεδομένα στη βάση (PostgreSQL)</li>
                    <li>Κρυπτογραφημένα storage buckets για ιατρικά έγγραφα</li>
                    <li>Encrypted backups — αδύνατη η ανάγνωση χωρίς κλειδί</li>
                  </ul>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-primary mb-1">In Transit (Μεταφορά)</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>TLS 1.3</strong> σε κάθε σύνδεση (client ↔ server, server ↔ DB)</li>
                    <li>HTTPS enforced — καμία μη κρυπτογραφημένη σύνδεση</li>
                    <li>Signed URLs για πρόσβαση σε αρχεία (χρονικά περιορισμένες)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4.2 Role-Based Access Control */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">4.2 Έλεγχος Πρόσβασης (Role-Based Access Control)</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Ρόλος</TableHead>
                      <TableHead className="text-xs">Πρόσβαση</TableHead>
                      <TableHead className="text-xs">Περιορισμοί</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Patient", "Δικά του δεδομένα (ιστορικό, συμπτώματα, φάρμακα, wearables)", "RLS: auth.uid() = user_id"],
                      ["Doctor (Advisor)", "Δεδομένα ασθενών μόνο με ρητή συγκατάθεση ή ενεργό ραντεβού", "Consent-based + time-limited access grants"],
                      ["Insurance", "Aggregated data μελών — μόνο με granular consent ανά κατηγορία", "DPA required + consent per data category"],
                      ["Admin", "Διαχείριση πλατφόρμας, audit logs, moderation", "Ξεχωριστός πίνακας ρόλων (user_roles)"],
                    ].map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-xs">{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Row-Level Security (RLS)</strong> ενεργό σε <strong>30+ πίνακες</strong>. 
                Κάθε query φιλτράρεται αυτόματα βάσει του JWT token του χρήστη — αδύνατη η πρόσβαση σε δεδομένα τρίτων.
              </p>
            </div>

            {/* 4.3 Logging & Audit Trail */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">4.3 Καταγραφή & Audit Trail</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "audit_logs", desc: "Γενικές ενέργειες χρηστών (login, settings changes, CRUD operations)" },
                  { title: "doctor_access_logs", desc: "Κάθε φορά που γιατρός-σύμβουλος αποκτά πρόσβαση σε δεδομένα ασθενή (resource type, IP, timestamp)" },
                  { title: "medical_audit_logs", desc: "Κάθε αλλαγή σε ιατρικά δεδομένα (create, view, update, share, delete) με πλήρες metadata" },
                ].map((item, i) => (
                  <div key={i} className="bg-muted/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Retention:</strong> Τα audit logs διατηρούνται για <strong>5 χρόνια</strong> (κανονιστική απαίτηση). 
                Τα logs είναι immutable — δεν μπορούν να τροποποιηθούν ή να διαγραφούν από κανέναν χρήστη.
              </p>
            </div>

            {/* 4.4 Backups & Recovery */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">4.4 Αντίγραφα Ασφαλείας & Ανάκτηση</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { check: true, text: "Αυτόματα daily backups (managed by Lovable Cloud)" },
                  { check: true, text: "Point-in-Time Recovery (PITR) — ανάκτηση σε οποιοδήποτε χρονικό σημείο" },
                  { check: true, text: "Κρυπτογραφημένα backups (AES-256 at rest)" },
                  { check: true, text: "Γεωγραφικά εντός ΕΕ — ίδιο region με την παραγωγική βάση" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4.5 Incident Management */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">4.5 Διαχείριση Περιστατικών (Incident Management)</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Διαδικασία Data Breach Notification (GDPR Art. 33 & 34)</p>
                  <div className="space-y-2">
                    {[
                      { time: "0–2h", action: "Ανίχνευση & αξιολόγηση — containment, ταυτοποίηση εύρους παραβίασης" },
                      { time: "2–24h", action: "Εσωτερική ενημέρωση ομάδας, DPO notification, τεχνική αποκατάσταση" },
                      { time: "≤72h", action: "Ειδοποίηση Αρχής Προστασίας Δεδομένων (ΑΠΔΠΧ) εάν υπάρχει κίνδυνος" },
                      { time: "Χωρίς καθυστέρηση", action: "Ενημέρωση υποκειμένων εάν υπάρχει υψηλός κίνδυνος για τα δικαιώματά τους" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-semibold text-destructive whitespace-nowrap min-w-[100px]">{step.time}</span>
                        <span className="text-xs text-muted-foreground">{step.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Στο πλαίσιο B2B (ασφαλιστική ως Controller), το Medithos ως Processor ειδοποιεί τον Controller 
                  εντός <strong>24 ωρών</strong> σύμφωνα με το DPA (Art. 28), ώστε εκείνος να ενημερώσει την Αρχή.
                </p>
              </div>
            </div>

            {/* Infrastructure Certifications Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-foreground mb-2">Πιστοποιήσεις Υποδομής (Lovable Cloud)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "ISO 27001:2022 ✅",
                  "SOC 2 Type II ✅",
                  "GDPR Compliant ✅",
                  "EU Hosting ✅",
                ].map((cert, i) => (
                  <div key={i} className="bg-background rounded-lg p-2 text-center">
                    <span className="text-xs font-semibold text-primary">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-border text-center print:pt-4">
            <p className="text-xs text-muted-foreground">
              © 2026 Medithos · Εμπιστευτικό Έγγραφο · Μη αναπαράγετε χωρίς άδεια
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Επικοινωνία: <a href="mailto:info@medithos.com" className="text-primary hover:underline">info@medithos.com</a>
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
