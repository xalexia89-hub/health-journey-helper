import { ArrowLeft, Shield, Database, Users, Lock, Server, FileText, AlertTriangle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const Section = ({ icon: Icon, title, children, defaultOpen = false }: { icon: React.ElementType; title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border border-border rounded-lg overflow-hidden">
      <CollapsibleTrigger className="flex items-center gap-3 w-full p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
        <Icon className="h-5 w-5 text-primary shrink-0" />
        <h2 className="text-base font-semibold flex-1">{title}</h2>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function GDPRCompliance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">GDPR & Compliance Documentation</h1>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Medithos — GDPR Compliance Framework</h1>
            <p className="text-sm text-muted-foreground mt-2">Πιλοτική Φάση · Τελευταία ενημέρωση: Φεβρουάριος 2026</p>
          </div>

          {/* ── 1. DATA FLOW MAPPING ── */}
          <Section icon={Database} title="1. Χαρτογράφηση Ροών Δεδομένων (Data Flow Mapping)" defaultOpen>
            <h3 className="font-semibold text-foreground">1.1 Δεδομένα που συλλέγονται</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Κατηγορία</TableHead>
                  <TableHead>Δεδομένα</TableHead>
                  <TableHead className="w-[120px]">Νομική Βάση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Στοιχεία Λογαριασμού</TableCell>
                  <TableCell>Email, ονοματεπώνυμο, τηλέφωνο, avatar</TableCell>
                  <TableCell>Σύμβαση</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Δεδομένα Υγείας (Art. 9)</TableCell>
                  <TableCell>Συμπτώματα, ιστορικό, χρόνιες παθήσεις, φάρμακα, αλλεργίες, οικογενειακό ιστορικό</TableCell>
                  <TableCell>Ρητή Συγκατάθεση</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Βιομετρικά (Wearables)</TableCell>
                  <TableCell>Καρδιακός παλμός, βήματα, SpO2, αρτηριακή πίεση, ύπνος, stress</TableCell>
                  <TableCell>Ρητή Συγκατάθεση</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ιατρικά Αρχεία</TableCell>
                  <TableCell>Εξετάσεις, διαγνώσεις, ιατρικά έγγραφα (PDF/εικόνες), examary reports</TableCell>
                  <TableCell>Ρητή Συγκατάθεση</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Δεδομένα Χρήσης</TableCell>
                  <TableCell>Αλληλεπιδράσεις με την εφαρμογή, audit logs, doctor access logs</TableCell>
                  <TableCell>Έννομο Συμφέρον</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Τεχνικά Δεδομένα</TableCell>
                  <TableCell>IP, user agent, τύπος συσκευής</TableCell>
                  <TableCell>Έννομο Συμφέρον</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="font-semibold text-foreground mt-4">1.2 Πηγές Δεδομένων</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Πηγή</TableHead>
                  <TableHead>Δεδομένα</TableHead>
                  <TableHead className="w-[150px]">Μηχανισμός</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Ασθενής (Χρήστης)</TableCell>
                  <TableCell>Προφίλ, συμπτώματα, ιατρικό ιστορικό, manual wearable entry</TableCell>
                  <TableCell>App UI, AI Chat</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Σύμβουλος (Γιατρός)</TableCell>
                  <TableCell>Σημειώσεις πλοήγησης, outcome summary, εσωτερικές σημειώσεις</TableCell>
                  <TableCell>Advisor Portal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ασφαλιστική (B2B)</TableCell>
                  <TableCell>Στοιχεία μελών, claims, πολιτικές</TableCell>
                  <TableCell>Insurance Module</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Wearable APIs</TableCell>
                  <TableCell>Βιομετρικά (HR, steps, SpO2, BP)</TableCell>
                  <TableCell>Fitbit OAuth, Apple HealthKit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">AI Gateway</TableCell>
                  <TableCell>Symptom analysis, preventive advice (ephemeral)</TableCell>
                  <TableCell>Lovable AI Gateway</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="font-semibold text-foreground mt-4">1.3 Αποθήκευση, Πρόσβαση & Retention</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Αποθήκευση</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead className="w-[120px]">Retention</TableHead>
                  <TableHead className="w-[150px]">Πρόσβαση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Lovable Cloud DB</TableCell>
                  <TableCell>PostgreSQL με RLS — profiles, health_files, medical_records, symptom_entries, medication_*, wearable_*, insurance_*</TableCell>
                  <TableCell>Μέχρι διαγραφή λογαριασμού</TableCell>
                  <TableCell>Χρήστης (RLS), Γιατρός (consent-based), Admin</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Private Storage Buckets</TableCell>
                  <TableCell>Ιατρικά έγγραφα (medical-documents), avatars — signed URLs only</TableCell>
                  <TableCell>Μέχρι διαγραφή λογαριασμού</TableCell>
                  <TableCell>Χρήστης (RLS + signed URL)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Audit Logs</TableCell>
                  <TableCell>audit_logs, doctor_access_logs, medical_audit_logs</TableCell>
                  <TableCell>5 χρόνια (κανονιστικό)</TableCell>
                  <TableCell>Admin μόνο</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">AI Processing</TableCell>
                  <TableCell>Symptom chat context — ephemeral, δεν αποθηκεύεται μόνιμα από τον AI provider</TableCell>
                  <TableCell>Session-only</TableCell>
                  <TableCell>Μόνο κατά την επεξεργασία</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          {/* ── 2. CONTROLLER / PROCESSOR ROLES ── */}
          <Section icon={Users} title="2. Ρόλοι Controller / Processor ανά Use Case">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Use Case</TableHead>
                  <TableHead className="w-[130px]">Controller</TableHead>
                  <TableHead className="w-[130px]">Processor</TableHead>
                  <TableHead>Βάση / Σημείωση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>Χρήστης χρησιμοποιεί την εφαρμογή (symptom check, records, medications)</TableCell>
                  <TableCell className="font-medium text-primary">Medithos</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>Medithos αποφασίζει σκοπό & μέσα επεξεργασίας</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2</TableCell>
                  <TableCell>B2B — Ασφαλιστική αξιοποιεί aggregated data μελών</TableCell>
                  <TableCell className="font-medium text-primary">Ασφαλιστική</TableCell>
                  <TableCell className="text-accent">Medithos</TableCell>
                  <TableCell>Ασφαλιστική ορίζει σκοπό · Medithos επεξεργάζεται βάσει DPA (Art. 28)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">3</TableCell>
                  <TableCell>Γιατρός-Σύμβουλος αποκτά πρόσβαση σε ιατρικά δεδομένα ασθενή</TableCell>
                  <TableCell className="font-medium text-primary">Medithos</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>Γιατρός = authorized user υπό τον έλεγχο του Medithos, consent-based access</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">4</TableCell>
                  <TableCell>Wearable sync (Fitbit / Apple Health)</TableCell>
                  <TableCell className="font-medium text-primary">Medithos</TableCell>
                  <TableCell className="text-accent">Fitbit / Apple</TableCell>
                  <TableCell>Χρήστης εξουσιοδοτεί μέσω OAuth · δεδομένα αποθηκεύονται τοπικά</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">5</TableCell>
                  <TableCell>AI symptom analysis (Lovable AI Gateway)</TableCell>
                  <TableCell className="font-medium text-primary">Medithos</TableCell>
                  <TableCell className="text-accent">AI Provider</TableCell>
                  <TableCell>Ephemeral processing · κανένα δεδομένο δεν αποθηκεύεται από τον AI provider</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">6</TableCell>
                  <TableCell>Ασφαλιστική εισάγει insurance members / claims (κέντρο ελέγχου)</TableCell>
                  <TableCell className="font-medium text-primary">Ασφαλιστική</TableCell>
                  <TableCell className="text-accent">Medithos</TableCell>
                  <TableCell>Data import · αποθήκευση σε insurance_members/claims · DPA required</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          {/* ── 3. DPA TEMPLATE ── */}
          <Section icon={FileText} title="3. Data Processing Agreement (DPA) — Template (Art. 28 GDPR)">
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">ΣΥΜΦΩΝΙΑ ΕΠΕΞΕΡΓΑΣΙΑΣ ΔΕΔΟΜΕΝΩΝ</h3>
              <p className="text-xs text-muted-foreground italic">Μεταξύ [Ασφαλιστική Εταιρεία] ("Controller") και Medithos ("Processor")</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm">Άρθρο 1 — Αντικείμενο & Διάρκεια</h4>
                <p>Ο Processor επεξεργάζεται δεδομένα υγείας μελών του Controller μέσω της πλατφόρμας Medithos, για σκοπούς risk stratification, compliance monitoring και cost optimization. Η διάρκεια ισούται με τη σύμβαση συνεργασίας.</p>
                
                <h4 className="font-medium text-foreground text-sm">Άρθρο 2 — Τύπος Δεδομένων</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Aggregated risk scores & compliance metrics</li>
                  <li>ER-related symptom counts (υψηλής επικινδυνότητας)</li>
                  <li>Χρόνιες παθήσεις (λίστα, όχι λεπτομέρειες)</li>
                  <li>Wearable trends (μέσοι HR, βήματα, BP — aggregated, not raw)</li>
                  <li>Claims summary data (ποσά, κατηγορίες, ημερομηνίες)</li>
                </ul>

                <h4 className="font-medium text-foreground text-sm">Άρθρο 3 — Υποκείμενα Δεδομένων</h4>
                <p>Ασφαλισμένα μέλη του Controller που έχουν δώσει ρητή συγκατάθεση μέσω της πλατφόρμας (granular consent per data category).</p>

                <h4 className="font-medium text-foreground text-sm">Άρθρο 4 — Υποχρεώσεις Processor</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Επεξεργασία μόνο βάσει τεκμηριωμένων εντολών του Controller</li>
                  <li>Εφαρμογή τεχνικών & οργανωτικών μέτρων ασφαλείας (Art. 32)</li>
                  <li>Μη χρήση υπο-επεξεργαστών χωρίς γραπτή έγκριση</li>
                  <li>Διαγραφή δεδομένων κατά τη λήξη της σύμβασης</li>
                  <li>Συνδρομή στη διεκπεραίωση αιτημάτων data subjects</li>
                </ul>

                <h4 className="font-medium text-foreground text-sm">Άρθρο 5 — Υπο-Επεξεργαστές (Sub-Processors)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sub-Processor</TableHead>
                      <TableHead>Σκοπός</TableHead>
                      <TableHead>Τοποθεσία</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Lovable Cloud (Supabase)</TableCell>
                      <TableCell>Database hosting, authentication, storage</TableCell>
                      <TableCell>EU (Frankfurt)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lovable AI Gateway</TableCell>
                      <TableCell>AI processing (ephemeral)</TableCell>
                      <TableCell>EU-routed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fitbit (Google)</TableCell>
                      <TableCell>Wearable data sync (OAuth)</TableCell>
                      <TableCell>EU/US (SCCs)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h4 className="font-medium text-foreground text-sm">Άρθρο 6 — Μέτρα Ασφαλείας (Art. 32)</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Κρυπτογράφηση at-rest & in-transit (AES-256, TLS 1.3)</li>
                  <li>Row-Level Security (RLS) σε όλους τους πίνακες</li>
                  <li>Signed URLs για πρόσβαση σε αρχεία (no public URLs)</li>
                  <li>Audit logging κάθε πρόσβασης σε ιατρικά δεδομένα</li>
                  <li>Input validation (50 msg limit, 10K char limit per message)</li>
                  <li>SECURITY DEFINER functions for cross-table aggregation</li>
                </ul>

                <h4 className="font-medium text-foreground text-sm">Άρθρο 7 — Data Breach Notification</h4>
                <p>Ο Processor ειδοποιεί τον Controller εντός <strong>24 ωρών</strong> από τη στιγμή που λαμβάνει γνώση περιστατικού παραβίασης. Η ειδοποίηση περιλαμβάνει: φύση, κατηγορίες data subjects, πιθανές συνέπειες, μέτρα αντιμετώπισης.</p>
              </div>
            </div>
          </Section>

          {/* ── 4. DPIA DRAFT ── */}
          <Section icon={AlertTriangle} title="4. DPIA — Data Protection Impact Assessment (Draft)">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">4.1 Γιατί απαιτείται DPIA</h3>
              <p>Η πλατφόρμα επεξεργάζεται <strong>δεδομένα υγείας (Art. 9)</strong> σε μεγάλη κλίμακα, χρησιμοποιεί AI-based profiling για symptom analysis και ενσωματώνει wearable data. Αυτά αποτελούν high-risk processing (Art. 35(3)).</p>

              <h3 className="font-semibold text-foreground">4.2 Περιγραφή Επεξεργασίας</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Στοιχείο</TableHead>
                    <TableHead>Περιγραφή</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Σκοπός</TableCell>
                    <TableCell>Καθοδήγηση πλοήγησης υγείας (navigation, NOT diagnosis)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Δεδομένα</TableCell>
                    <TableCell>Συμπτώματα, ιστορικό, βιομετρικά, ιατρικά έγγραφα</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Υποκείμενα</TableCell>
                    <TableCell>Ασθενείς (18+), Σύμβουλοι-Γιατροί, Ασφαλισμένα μέλη</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Τεχνολογίες</TableCell>
                    <TableCell>PostgreSQL (RLS), Edge Functions, AI Gateway (ephemeral), OAuth APIs</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="font-semibold text-foreground">4.3 Κίνδυνοι & Μετριασμός</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Κίνδυνος</TableHead>
                    <TableHead className="w-[80px]">Σοβαρότητα</TableHead>
                    <TableHead>Μέτρο Μετριασμού</TableHead>
                    <TableHead className="w-[80px]">Υπολ. Κίνδ.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>R1</TableCell>
                    <TableCell>Μη εξουσιοδοτημένη πρόσβαση σε ιατρικά δεδομένα</TableCell>
                    <TableCell className="text-destructive font-medium">Υψηλή</TableCell>
                    <TableCell>RLS, consent-based access, audit logging, signed URLs</TableCell>
                    <TableCell className="text-success font-medium">Χαμηλός</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>R2</TableCell>
                    <TableCell>AI hallucination → λανθασμένη καθοδήγηση</TableCell>
                    <TableCell className="text-destructive font-medium">Υψηλή</TableCell>
                    <TableCell>Medical disclaimers, "NOT diagnosis" framing, emergency redirects (112)</TableCell>
                    <TableCell className="text-warning font-medium">Μέτριος</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>R3</TableCell>
                    <TableCell>Data breach — διαρροή ευαίσθητων δεδομένων</TableCell>
                    <TableCell className="text-destructive font-medium">Υψηλή</TableCell>
                    <TableCell>Encryption (AES-256/TLS 1.3), private buckets, no public URLs</TableCell>
                    <TableCell className="text-success font-medium">Χαμηλός</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>R4</TableCell>
                    <TableCell>Excessive data collection (wearables)</TableCell>
                    <TableCell className="text-warning font-medium">Μέτρια</TableCell>
                    <TableCell>Granular consent, aggregated-only sharing, user control</TableCell>
                    <TableCell className="text-success font-medium">Χαμηλός</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>R5</TableCell>
                    <TableCell>Insurance profiling → αθέμιτη μεταχείριση</TableCell>
                    <TableCell className="text-warning font-medium">Μέτρια</TableCell>
                    <TableCell>Aggregated data only, no raw health records, user can revoke consent</TableCell>
                    <TableCell className="text-success font-medium">Χαμηλός</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="font-semibold text-foreground">4.4 Αξιολόγηση Αναλογικότητας</h3>
              <p>Η επεξεργασία είναι <strong>αναγκαία και αναλογική</strong> για τον σκοπό της καθοδήγησης υγείας. Εφαρμόζεται η αρχή της ελαχιστοποίησης δεδομένων: μόνο τα απαραίτητα δεδομένα συλλέγονται, η πρόσβαση είναι consent-based, και τα δεδομένα που μοιράζονται με τρίτους είναι aggregated.</p>
            </div>
          </Section>

          {/* ── 5. DPO & GOVERNANCE ── */}
          <Section icon={Shield} title="5. DPO & Governance Model">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">5.1 Data Protection Officer (DPO)</h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p><strong>Τύπος:</strong> Εξωτερικός DPO (outsourced)</p>
                <p><strong>Λόγος:</strong> Η πλατφόρμα επεξεργάζεται ειδικές κατηγορίες δεδομένων (Art. 37(1)(c))</p>
                <p><strong>Επικοινωνία:</strong> <a href="mailto:dpo@medithos.com" className="text-primary hover:underline">dpo@medithos.com</a></p>
                <p><strong>Κριτήρια Επιλογής:</strong> Εξειδίκευση σε health-tech & GDPR, εμπειρία σε pilot/startup περιβάλλοντα</p>
              </div>

              <h3 className="font-semibold text-foreground">5.2 Πολιτική Data Breach</h3>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-2">
                <p className="font-medium text-foreground">Διαδικασία Αντιμετώπισης Παραβιάσεων:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><strong>Ανίχνευση (0-4h):</strong> Αυτόματοι έλεγχοι μέσω audit logs & monitoring</li>
                  <li><strong>Αξιολόγηση (4-12h):</strong> Εκτίμηση σοβαρότητας, εύρος παραβίασης, κατηγορίες δεδομένων</li>
                  <li><strong>Ειδοποίηση Controller (εντός 24h):</strong> Αν Medithos = processor, ειδοποίηση του controller (ασφαλιστική)</li>
                  <li><strong>Ειδοποίηση Αρχής (εντός 72h):</strong> Αν Medithos = controller, ειδοποίηση ΑΠΔΠΧ (Art. 33)</li>
                  <li><strong>Ειδοποίηση Data Subjects:</strong> Αν high risk, ειδοποίηση χρηστών (Art. 34)</li>
                  <li><strong>Post-incident review:</strong> Root cause analysis, corrective actions</li>
                </ol>
              </div>

              <h3 className="font-semibold text-foreground">5.3 Διεκπεραίωση Αιτημάτων Data Subjects</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Δικαίωμα</TableHead>
                    <TableHead>Μηχανισμός</TableHead>
                    <TableHead className="w-[100px]">Χρονοδιάγραμμα</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Πρόσβαση (Art. 15)</TableCell>
                    <TableCell>Settings → Εξαγωγή δεδομένων σε JSON</TableCell>
                    <TableCell>≤ 30 ημέρες</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Διόρθωση (Art. 16)</TableCell>
                    <TableCell>Profile & Medical Records UI editing</TableCell>
                    <TableCell>Άμεσα</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Διαγραφή (Art. 17)</TableCell>
                    <TableCell>Settings → Διαγραφή Λογαριασμού (cascade delete)</TableCell>
                    <TableCell>≤ 30 ημέρες</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Φορητότητα (Art. 20)</TableCell>
                    <TableCell>Settings → Εξαγωγή δεδομένων (JSON format)</TableCell>
                    <TableCell>≤ 30 ημέρες</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ανάκληση Συγκατάθεσης</TableCell>
                    <TableCell>Settings → Revoke Consent toggle (ανά κατηγορία)</TableCell>
                    <TableCell>Άμεσα</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* ── 6. ISO / SECURITY ROADMAP ── */}
          <Section icon={Lock} title="6. ISO 27001 & Security Roadmap (1-Pager)">
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Στόχος: ISO 27001 Alignment → Certification</h3>
                <p>Στόχος είναι η πλήρης ευθυγράμμιση με το ISO 27001 εντός 12 μηνών και η πιστοποίηση εντός 18–24 μηνών από τη λήξη του πιλότου.</p>
              </div>

              <h3 className="font-semibold text-foreground">Τι Έχουμε Ήδη ✅</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Secure Cloud Infrastructure:</strong> Lovable Cloud (EU-hosted), managed PostgreSQL, automatic backups</li>
                <li><strong>Identity & Access Management:</strong> Auth system με email verification, role-based access (patient/doctor/admin/insurance)</li>
                <li><strong>Data Encryption:</strong> At-rest (AES-256) & in-transit (TLS 1.3)</li>
                <li><strong>Row-Level Security:</strong> RLS σε όλους τους πίνακες με ευαίσθητα δεδομένα</li>
                <li><strong>Audit Logging:</strong> 3 audit tables (audit_logs, doctor_access_logs, medical_audit_logs)</li>
                <li><strong>Consent Management:</strong> Granular consent system (wearables, insurance data sharing, GDPR rights)</li>
                <li><strong>Input Validation:</strong> Rate limiting σε AI chat (50 msg, 10K chars), signed URLs for file access</li>
                <li><strong>Privacy by Design:</strong> Aggregated-only data sharing, no raw health data to insurance</li>
              </ul>

              <h3 className="font-semibold text-foreground">Τι Λείπει & Χρονοδιάγραμμα 📋</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Phase</TableHead>
                    <TableHead>Δράση</TableHead>
                    <TableHead className="w-[120px]">Timeline</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">P1</TableCell>
                    <TableCell>Formal Information Security Policy (ISMS scope document)</TableCell>
                    <TableCell>Q2 2026</TableCell>
                    <TableCell className="text-warning">Pending</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P1</TableCell>
                    <TableCell>Risk Assessment methodology & register</TableCell>
                    <TableCell>Q2 2026</TableCell>
                    <TableCell className="text-warning">Pending</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P1</TableCell>
                    <TableCell>Εξωτερικός DPO appointment</TableCell>
                    <TableCell>Q2 2026</TableCell>
                    <TableCell className="text-warning">Pending</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P2</TableCell>
                    <TableCell>Formal access control policy & review process</TableCell>
                    <TableCell>Q3 2026</TableCell>
                    <TableCell className="text-muted-foreground">Planned</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P2</TableCell>
                    <TableCell>Business Continuity & Disaster Recovery plan</TableCell>
                    <TableCell>Q3 2026</TableCell>
                    <TableCell className="text-muted-foreground">Planned</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P2</TableCell>
                    <TableCell>Vulnerability scanning & penetration testing</TableCell>
                    <TableCell>Q3 2026</TableCell>
                    <TableCell className="text-muted-foreground">Planned</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P3</TableCell>
                    <TableCell>Internal ISMS audit</TableCell>
                    <TableCell>Q4 2026</TableCell>
                    <TableCell className="text-muted-foreground">Planned</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P3</TableCell>
                    <TableCell>Εξωτερικό ISO 27001 audit (Stage 1)</TableCell>
                    <TableCell>Q1 2027</TableCell>
                    <TableCell className="text-muted-foreground">Planned</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P3</TableCell>
                    <TableCell>ISO 27001 Certification (Stage 2)</TableCell>
                    <TableCell>Q2 2027</TableCell>
                    <TableCell className="text-muted-foreground">Target</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* ── 7. HOSTING & ARCHITECTURE ── */}
          <Section icon={Server} title="7. System Architecture & Security Overview">
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-foreground text-lg mb-1">Medithos — Security Architecture</h3>
                <p className="text-xs">Investor-ready overview · Pilot Phase 2026</p>
              </div>

              <h3 className="font-semibold text-foreground">Hosting & Region</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Component</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="w-[120px]">Region</TableHead>
                    <TableHead>Certification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Database</TableCell>
                    <TableCell>Lovable Cloud (managed PostgreSQL)</TableCell>
                    <TableCell>EU (Frankfurt)</TableCell>
                    <TableCell>ISO 27001:2022 ✅ · SOC 2 Type II ✅</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Edge Functions</TableCell>
                    <TableCell>Lovable Cloud (Deno runtime)</TableCell>
                    <TableCell>EU</TableCell>
                    <TableCell>ISO 27001:2022 ✅ · SOC 2 Type II ✅</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Storage</TableCell>
                    <TableCell>Lovable Cloud (S3-compatible)</TableCell>
                    <TableCell>EU</TableCell>
                    <TableCell>ISO 27001:2022 ✅ · AES-256 at rest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Frontend CDN</TableCell>
                    <TableCell>Lovable Cloud</TableCell>
                    <TableCell>Global (EU primary)</TableCell>
                    <TableCell>TLS 1.3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Processing</TableCell>
                    <TableCell>Lovable AI Gateway</TableCell>
                    <TableCell>EU-routed</TableCell>
                    <TableCell>Ephemeral — no data retention</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="font-semibold text-foreground">Security Controls Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-foreground text-sm">🔐 Encryption</h4>
                  <p className="text-xs">At-rest: AES-256</p>
                  <p className="text-xs">In-transit: TLS 1.3</p>
                  <p className="text-xs">Files: Private buckets + signed URLs</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-foreground text-sm">🛡️ Access Control</h4>
                  <p className="text-xs">Row-Level Security (RLS) σε 30+ tables</p>
                  <p className="text-xs">Role-based: patient / doctor / admin / insurance</p>
                  <p className="text-xs">Consent-based: doctor access grants, insurance data consent</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-foreground text-sm">📝 Audit Trail</h4>
                  <p className="text-xs">audit_logs: Γενικές ενέργειες</p>
                  <p className="text-xs">doctor_access_logs: Πρόσβαση γιατρών σε δεδομένα ασθενών</p>
                  <p className="text-xs">medical_audit_logs: Κάθε αλλαγή σε ιατρικά δεδομένα</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-foreground text-sm">🔄 Backup & Retention</h4>
                  <p className="text-xs">Automatic daily backups (managed by Lovable Cloud)</p>
                  <p className="text-xs">Point-in-time recovery</p>
                  <p className="text-xs">Retention: Until account deletion (audit logs: 5 years)</p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground">Αρχιτεκτονικό Διάγραμμα (Simplified)</h3>
              <div className="bg-secondary/30 rounded-lg p-4 font-mono text-xs space-y-1">
                <p className="text-center text-primary font-semibold mb-2">[ User Devices ]</p>
                <p className="text-center">↓ HTTPS (TLS 1.3)</p>
                <p className="text-center text-primary font-semibold">[ Lovable Cloud CDN — EU ]</p>
                <p className="text-center">↓</p>
                <p className="text-center text-primary font-semibold">[ React SPA + Auth Layer ]</p>
                <p className="text-center">↓ JWT + RLS</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="border border-border rounded p-2 text-center">
                    <p className="text-primary font-semibold">PostgreSQL</p>
                    <p>30+ tables</p>
                    <p>RLS enabled</p>
                  </div>
                  <div className="border border-border rounded p-2 text-center">
                    <p className="text-primary font-semibold">Edge Functions</p>
                    <p>symptom-chat</p>
                    <p>insurance-aggregate</p>
                    <p>fitbit-sync</p>
                  </div>
                  <div className="border border-border rounded p-2 text-center">
                    <p className="text-primary font-semibold">Storage</p>
                    <p>Private buckets</p>
                    <p>Signed URLs</p>
                  </div>
                </div>
                <p className="text-center mt-2">↓ Ephemeral</p>
                <p className="text-center text-primary font-semibold">[ Lovable AI Gateway — EU-routed ]</p>
              </div>
            </div>
          </Section>

          <div className="pt-6 border-t border-border text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Αυτό το έγγραφο αποτελεί ζωντανή τεκμηρίωση και ενημερώνεται τακτικά.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026 Medithos. Με επιφύλαξη παντός δικαιώματος.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
