import { ArrowLeft, Printer, Download, Shield, Scale, FileText, AlertTriangle, CheckCircle2, Globe, Lock, Users, Brain, Heart, Eye, Building2, Gavel, BookOpen, ShieldCheck, Fingerprint, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function LegalReport() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('legal-report-content');
      if (!element) return;
      
      const opt = {
        margin: [18, 20, 18, 20],
        filename: 'Medithos_Legal_Report_2026.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
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
        }
        @media screen {
          .legal-body { background: white; color: #1a1a1a; }
        }
      `}</style>

      {/* Navigation */}
      <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} disabled={isGenerating} className="bg-primary text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Δημιουργία PDF...' : 'Λήψη PDF'}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Εκτύπωση
            </Button>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="legal-body max-w-5xl mx-auto px-8 py-12 space-y-14">

        {/* ══════════════ COVER ══════════════ */}
        <section className="text-center py-20 border-b-2 border-emerald-600">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Εμπιστευτικό Έγγραφο · Legal & Compliance Edition</p>
          <h1 className="text-6xl font-bold text-emerald-700 mb-3">MEDITHOS</h1>
          <p className="text-2xl text-gray-600 mb-2">Νομική & Κανονιστική Τεκμηρίωση</p>
          <p className="text-base text-gray-500">GDPR · MDR · EU AI Act · ePrivacy · Πνευματική Ιδιοκτησία</p>
          <div className="mt-8 text-sm text-gray-400 space-y-1">
            <p>Έκδοση 1.0 · Μάρτιος 2026</p>
            <p>Εφευρέτρια & Ιδιοκτήτρια: Χαλβατζάκου Αλεξάνδρα</p>
          </div>
        </section>

        {/* ══════════════ TABLE OF CONTENTS ══════════════ */}
        <section className="print-avoid-break">
          <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Πίνακας Περιεχομένων
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {[
              "1. Εκτελεστική Σύνοψη",
              "2. Κανονιστικό Πλαίσιο — Επισκόπηση",
              "3. GDPR — Πλήρης Ανάλυση",
              "4. MDR (EU 2017/745) — Εξαίρεση & Τεκμηρίωση",
              "5. EU AI Act — Ταξινόμηση Κινδύνου",
              "6. ePrivacy & Ηλεκτρονικές Επικοινωνίες",
              "7. Σύγκριση με Άλλα AI — Γιατί το Medithos Είναι Διαφορετικό",
              "8. Πνευματική Ιδιοκτησία & Εμπορικά Σήματα",
              "9. Συμβατικό Πλαίσιο — DPA, ToS, BAA",
              "10. Διαχείριση Κινδύνου & Ασφάλιση",
              "11. Διαχείριση Περιστατικών Ασφαλείας",
              "12. Δικαιώματα Υποκειμένων Δεδομένων",
              "13. Ρόλοι & Ευθύνες Συμμόρφωσης",
              "14. Roadmap Κανονιστικής Εξέλιξης",
              "15. Δήλωση Πνευματικής Ιδιοκτησίας",
            ].map((item, i) => (
              <p key={i} className="py-1 border-b border-gray-100">{item}</p>
            ))}
          </div>
        </section>

        {/* ══════════════ 1. EXECUTIVE SUMMARY ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Shield className="h-5 w-5" />} number="01" title="Εκτελεστική Σύνοψη" />
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-sm leading-relaxed text-gray-700 space-y-3">
            <p>
              Το <strong>Medithos</strong> είναι η πρώτη ελληνική πλατφόρμα πλοήγησης υγείας που σχεδιάστηκε 
              <strong> εξ αρχής με βάση τη νομική συμμόρφωση</strong> (compliance-by-design). Σε αντίθεση με άλλες 
              πλατφόρμες AI υγείας που προσπαθούν να προσαρμοστούν εκ των υστέρων στους κανονισμούς, 
              το Medithos ενσωματώνει τη νομική αρχιτεκτονική στον πυρήνα του.
            </p>
            <p>
              Η πλατφόρμα λειτουργεί ως <strong>σύστημα πλοήγησης</strong> (navigation co-pilot) και όχι ως 
              διαγνωστικό εργαλείο, γεγονός που την τοποθετεί <strong>εκτός πεδίου εφαρμογής του MDR</strong> και 
              στη <strong>χαμηλή κατηγορία κινδύνου του EU AI Act</strong>.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <StatusCard label="GDPR" status="Πλήρης Συμμόρφωση" color="green" />
              <StatusCard label="MDR" status="Εκτός Πεδίου" color="green" />
              <StatusCard label="EU AI Act" status="Χαμηλός Κίνδυνος" color="green" />
            </div>
          </div>
        </section>

        {/* ══════════════ 2. REGULATORY LANDSCAPE ══════════════ */}
        <section>
          <SectionHeader icon={<Globe className="h-5 w-5" />} number="02" title="Κανονιστικό Πλαίσιο — Επισκόπηση" />
          <div className="grid grid-cols-2 gap-4">
            <RegulationCard
              title="GDPR (EU 2016/679)"
              scope="Προστασία προσωπικών δεδομένων"
              status="Πλήρης Συμμόρφωση"
              articles={["Art. 6 — Νόμιμη βάση επεξεργασίας", "Art. 9 — Ειδικές κατηγορίες (υγεία)", "Art. 25 — Privacy by Design", "Art. 28 — Σχέση Controller/Processor", "Art. 35 — DPIA (Εκτίμηση Αντικτύπου)"]}
            />
            <RegulationCard
              title="MDR (EU 2017/745)"
              scope="Ιατροτεχνολογικά προϊόντα"
              status="Εκτός Πεδίου Εφαρμογής"
              articles={["Art. 2 — Ορισμός ιατροτεχνολογικού", "Annex VIII — Κανόνες ταξινόμησης", "Rule 11 — Λογισμικό & διάγνωση", "Recital 19 — Εργαλεία ευεξίας"]}
            />
            <RegulationCard
              title="EU AI Act (2024/1689)"
              scope="Ρύθμιση συστημάτων AI"
              status="Minimal Risk — Χαμηλός"
              articles={["Art. 6 — Ταξινόμηση κινδύνου", "Art. 52 — Υποχρεώσεις διαφάνειας", "Annex III — High-risk AI systems", "Art. 69 — Εθελοντικοί κώδικες"]}
            />
            <RegulationCard
              title="ePrivacy (2002/58/EC)"
              scope="Ηλεκτρονικές επικοινωνίες"
              status="Συμμόρφωση"
              articles={["Art. 5 — Εμπιστευτικότητα", "Art. 6 — Δεδομένα κίνησης", "Art. 9 — Μη κλήσεις τρίτων", "Cookies: Μόνο απαραίτητα"]}
            />
          </div>
        </section>

        {/* ══════════════ 3. GDPR FULL ANALYSIS ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Lock className="h-5 w-5" />} number="03" title="GDPR — Πλήρης Ανάλυση Συμμόρφωσης" />
          
          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">3.1 Νόμιμη Βάση Επεξεργασίας</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Κατηγορία Δεδομένων</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Νόμιμη Βάση</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Άρθρο GDPR</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Μηχανισμός</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Στοιχεία λογαριασμού", "Εκτέλεση σύμβασης", "Art. 6(1)(b)", "Εγγραφή χρήστη"],
                  ["Δεδομένα υγείας", "Ρητή συγκατάθεση", "Art. 9(2)(a)", "Consent modal + timestamp"],
                  ["Ιστορικό συμπτωμάτων", "Ρητή συγκατάθεση", "Art. 9(2)(a)", "Per-session consent"],
                  ["Δεδομένα wearables", "Ρητή συγκατάθεση", "Art. 9(2)(a)", "Explicit opt-in"],
                  ["Δεδομένα χρήσης (analytics)", "Έννομο συμφέρον", "Art. 6(1)(f)", "Ανωνυμοποιημένα"],
                  ["Τεχνικά logs", "Νομική υποχρέωση", "Art. 6(1)(c)", "Audit trail / 5 έτη"],
                  ["B2B ασφαλιστικά δεδομένα", "Εκτέλεση σύμβασης", "Art. 6(1)(b)", "DPA + consent cascade"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-3 py-1.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">3.2 Privacy by Design & Default (Art. 25)</h3>
          <div className="grid grid-cols-2 gap-4">
            <LegalPillar title="Data Minimization" items={[
              "Δεν συλλέγεται ΑΜΚΑ ή ΑΦΜ",
              "Μόνο τα απολύτως απαραίτητα πεδία",
              "Pseudonymization σε AI queries",
              "Αυτόματη λήξη sessions",
            ]} />
            <LegalPillar title="Purpose Limitation" items={[
              "Κάθε δεδομένο συνδέεται με σαφή σκοπό",
              "Δεν πωλούνται δεδομένα σε τρίτους",
              "Δεν γίνεται profiling για διαφήμιση",
              "Απαγόρευση secondary use χωρίς consent",
            ]} />
            <LegalPillar title="Storage Limitation" items={[
              "Δεδομένα υγείας: Όσο ο λογαριασμός είναι ενεργός",
              "Audit logs: 5 έτη (νομική υποχρέωση)",
              "Session data: Αυτόματη διαγραφή",
              "Δικαίωμα διαγραφής ανά πάσα στιγμή",
            ]} />
            <LegalPillar title="Integrity & Confidentiality" items={[
              "AES-256 encryption at rest",
              "TLS 1.3 encryption in transit",
              "Row-Level Security (RLS) σε 30+ πίνακες",
              "Immutable audit logs",
            ]} />
          </div>

          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">3.3 DPIA — Εκτίμηση Αντικτύπου (Art. 35)</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm space-y-2">
            <p className="font-semibold text-amber-800">Απαιτείται DPIA λόγω επεξεργασίας ειδικών κατηγοριών δεδομένων (υγεία).</p>
            <p className="text-gray-700">Το Medithos έχει εκπονήσει πλήρη DPIA που καλύπτει:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Περιγραφή επεξεργασίας & σκοπών</li>
              <li>Αξιολόγηση αναγκαιότητας & αναλογικότητας</li>
              <li>Αξιολόγηση κινδύνων για τα υποκείμενα</li>
              <li>Μέτρα μετριασμού κινδύνων (RLS, encryption, consent)</li>
              <li>Αναθεώρηση ανά 12 μήνες ή σε σημαντικές αλλαγές</li>
            </ul>
          </div>
        </section>

        {/* ══════════════ 4. MDR EXEMPTION ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<ShieldCheck className="h-5 w-5" />} number="04" title="MDR (EU 2017/745) — Εξαίρεση & Τεκμηρίωση" />
          
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 text-sm mb-6">
            <p className="font-bold text-emerald-800 mb-2">Συμπέρασμα: Το Medithos ΔΕΝ αποτελεί ιατροτεχνολογικό προϊόν</p>
            <p className="text-gray-700">
              Σύμφωνα με το Art. 2(1) του MDR, ιατροτεχνολογικό προϊόν είναι εκείνο που προορίζεται για 
              <em> διάγνωση, πρόληψη, παρακολούθηση, θεραπεία ή ανακούφιση ασθενειών</em>. 
              Το Medithos δεν εκτελεί καμία από αυτές τις λειτουργίες.
            </p>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mb-3">4.1 Ανάλυση Rule 11 — Λογισμικό</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Κριτήριο MDR</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Medithos</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Αποτέλεσμα</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Παρέχει διάγνωση;", "Όχι — Πλοήγηση μόνο", "✓ Εκτός πεδίου"],
                  ["Προτείνει θεραπεία;", "Όχι — Σύνδεση με γιατρό", "✓ Εκτός πεδίου"],
                  ["Παρακολουθεί παραμέτρους υγείας;", "Μόνο wearable wellness data", "✓ Ευεξία, όχι κλινική"],
                  ["Λαμβάνει κλινικές αποφάσεις;", "Ποτέ — Ο γιατρός αποφασίζει", "✓ Εκτός πεδίου"],
                  ["Χρησιμοποιεί AI για triage;", "Ναι — Κατεύθυνση, όχι διάγνωση", "✓ Navigation tool"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-3 py-1.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">4.2 Safeguards που Διατηρούν την Εξαίρεση</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Medical Disclaimers", desc: "Σε κάθε οθόνη AI εμφανίζεται ρητή δήλωση: «Δεν αποτελεί ιατρική συμβουλή»" },
              { title: "Navigation-Only Framing", desc: "Όλα τα outputs περιγράφονται ως «πλοήγηση» και όχι ως «διάγνωση» ή «θεραπεία»" },
              { title: "Doctor as Advisor", desc: "Οι γιατροί συμμετέχουν ως σύμβουλοι πλοήγησης — δεν δημιουργείται σχέση γιατρού-ασθενή" },
              { title: "No Prescriptions", desc: "Η πλατφόρμα δεν εκδίδει συνταγές, δεν προτείνει φάρμακα, δεν παρέχει δοσολογίες" },
              { title: "Consent Per Session", desc: "Κάθε αλληλεπίδραση με το AI απαιτεί επιβεβαίωση ότι ο χρήστης κατανοεί τους περιορισμούς" },
              { title: "Audit Trail", desc: "Κάθε AI output καταγράφεται για regulatory review αν απαιτηθεί" },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 text-xs print-avoid-break">
                <p className="font-semibold text-emerald-700 mb-1">{item.title}</p>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 5. EU AI ACT ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Brain className="h-5 w-5" />} number="05" title="EU AI Act — Ταξινόμηση & Συμμόρφωση" />

          <h3 className="font-semibold text-base text-gray-800 mb-3">5.1 Κατηγοριοποίηση Κινδύνου</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { level: "Απαράδεκτος", color: "bg-red-100 border-red-300", applies: false, desc: "Social scoring, manipulation" },
              { level: "Υψηλός", color: "bg-orange-100 border-orange-300", applies: false, desc: "Ιατρική διάγνωση, κλινικές αποφάσεις" },
              { level: "Περιορισμένος", color: "bg-yellow-100 border-yellow-300", applies: true, desc: "Chatbots, AI-generated content" },
              { level: "Ελάχιστος", color: "bg-green-100 border-green-300", applies: true, desc: "Εργαλεία πλοήγησης, wellness" },
            ].map((item, i) => (
              <div key={i} className={`border rounded-lg p-3 text-xs print-avoid-break ${item.color}`}>
                <p className="font-bold mb-1">{item.level}</p>
                <p className="text-gray-600 mb-2">{item.desc}</p>
                <p className={`font-semibold ${item.applies ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {item.applies ? '→ Medithos εδώ' : 'Δεν εφαρμόζεται'}
                </p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-base text-gray-800 mb-3">5.2 Υποχρεώσεις Διαφάνειας (Art. 52)</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
            <p className="text-gray-700">Παρόλο που το Medithos κατατάσσεται σε <strong>χαμηλό/περιορισμένο κίνδυνο</strong>, 
            εφαρμόζουμε proactively τις υποχρεώσεις διαφάνειας:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li><strong>Σαφής ενημέρωση</strong> ότι ο χρήστης αλληλεπιδρά με AI</li>
              <li><strong>Εξήγηση λειτουργίας:</strong> «Το AI αναλύει τα συμπτώματα για πλοήγηση, όχι διάγνωση»</li>
              <li><strong>Human-in-the-loop:</strong> Ο γιατρός-σύμβουλος επαληθεύει κρίσιμες κατευθύνσεις</li>
              <li><strong>Δικαίωμα εξήγησης:</strong> Ο χρήστης μπορεί να ζητήσει γιατί το AI πρότεινε συγκεκριμένη κατεύθυνση</li>
              <li><strong>Opt-out:</strong> Δυνατότητα πλοήγησης χωρίς AI (manual search providers)</li>
            </ul>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">5.3 Γιατί ΔΕΝ Είμαστε High-Risk (Annex III)</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Το Annex III του EU AI Act ορίζει ως high-risk τα AI συστήματα που:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Αποτελούν <strong>ιατροτεχνολογικά προϊόντα</strong> (MDR) → Medithos εκτός MDR</li>
              <li>Λαμβάνουν <strong>κλινικές αποφάσεις</strong> → Medithos: μόνο πλοήγηση</li>
              <li>Επηρεάζουν <strong>πρόσβαση σε υγειονομική περίθαλψη</strong> → Medithos: διευκολύνει, δεν αποκλείει</li>
            </ul>
          </div>
        </section>

        {/* ══════════════ 6. ePRIVACY ══════════════ */}
        <section>
          <SectionHeader icon={<Fingerprint className="h-5 w-5" />} number="06" title="ePrivacy & Ηλεκτρονικές Επικοινωνίες" />
          <div className="grid grid-cols-2 gap-4">
            <LegalPillar title="Cookies & Tracking" items={[
              "Μόνο απαραίτητα cookies (session, auth)",
              "Κανένα cookie παρακολούθησης ή διαφήμισης",
              "Κανένα third-party tracking (Google Analytics, Facebook Pixel)",
              "Δεν χρησιμοποιείται fingerprinting",
            ]} />
            <LegalPillar title="Επικοινωνίες" items={[
              "Email μόνο για transactional (appointment reminders)",
              "Opt-in για marketing (αν εφαρμοστεί στο μέλλον)",
              "Δεν πωλούνται email lists",
              "Unsubscribe σε κάθε επικοινωνία",
            ]} />
          </div>
        </section>

        {/* ══════════════ 7. AI COMPARISON ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Scale className="h-5 w-5" />} number="07" title="Σύγκριση με Άλλα AI — Γιατί το Medithos Είναι Διαφορετικό" />
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm mb-6">
            <p className="font-bold text-emerald-800 mb-2">Η Θεμελιώδης Διαφορά</p>
            <p className="text-gray-700">
              Τα περισσότερα AI υγείας (Ada Health, Babylon, K Health) λειτουργούν ως <strong>διαγνωστικά εργαλεία</strong> — 
              αναλύουν συμπτώματα και παράγουν πιθανές διαγνώσεις. Αυτό τα τοποθετεί <strong>εντός MDR</strong> και 
              στην <strong>υψηλή κατηγορία κινδύνου</strong> του EU AI Act. Το Medithos λειτουργεί ως 
              <strong> σύστημα πλοήγησης</strong> — δεν διαγιγνώσκει, αλλά κατευθύνει.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Κριτήριο</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Ada / Babylon / K Health</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-bold text-emerald-700">Medithos</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Σκοπός AI", "Διάγνωση & πιθανές ασθένειες", "Πλοήγηση & κατεύθυνση σε γιατρό"],
                  ["Output", "«Πιθανή διάγνωση: X με 73%»", "«Σας προτείνουμε να επισκεφθείτε καρδιολόγο»"],
                  ["MDR Status", "Εντός πεδίου (Class IIa+)", "Εκτός πεδίου (wellness/navigation)"],
                  ["EU AI Act Risk", "Υψηλός (Annex III, §5)", "Ελάχιστος / Περιορισμένος"],
                  ["CE Marking", "Απαιτείται (κόστος €100K+)", "Δεν απαιτείται"],
                  ["Clinical Validation", "Απαιτούνται κλινικές μελέτες", "Δεν απαιτείται — pilot validation"],
                  ["Notified Body", "Απαιτείται αξιολόγηση", "Δεν απαιτείται"],
                  ["Ευθύνη σε λάθος", "Product liability (MDR)", "Περιορισμένη (navigation aid)"],
                  ["Hosting δεδομένων", "Συχνά USA/Global", "EU-only (Frankfurt, ISO 27001)"],
                  ["GDPR Compliance", "Μερική (data transfers)", "Πλήρης by-design"],
                  ["Σχέση γιατρού-ασθενή", "Υποκατάσταση γιατρού", "Σύνδεση με γιατρό"],
                  ["Human oversight", "Περιορισμένο", "Doctor-advisor validation"],
                  ["Κόστος συμμόρφωσης", "€200K-500K (CE + clinical)", "€15K-30K (GDPR + DPA)"],
                  ["Time-to-market", "18-36 μήνες (CE process)", "3-6 μήνες (pilot ready)"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-200 px-3 py-1.5 font-medium">{row[0]}</td>
                    <td className="border border-gray-200 px-3 py-1.5 text-red-600">{row[1]}</td>
                    <td className="border border-gray-200 px-3 py-1.5 text-emerald-700 font-medium">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mt-6 mb-3">7.1 Στρατηγικό Πλεονέκτημα</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 print-avoid-break">
              <h4 className="font-semibold text-sm text-emerald-700 mb-2">✓ Πλεονεκτήματα Medithos</h4>
              {[
                "Ταχύτερη είσοδος στην αγορά (no CE delay)",
                "Χαμηλότερο κόστος συμμόρφωσης (10x λιγότερο)",
                "Μικρότερη νομική ευθύνη (navigation vs diagnosis)",
                "EU-first data governance — ανταγωνιστικό πλεονέκτημα",
                "Scalable χωρίς per-country medical approval",
                "Δυνατότητα εξέλιξης σε MDR αν χρειαστεί",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 py-0.5">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 print-avoid-break">
              <h4 className="font-semibold text-sm text-red-700 mb-2">✗ Αδυναμίες Ανταγωνισμού</h4>
              {[
                "CE marking process: 18-36 μήνες καθυστέρηση",
                "Κλινικές μελέτες: €100K-300K κόστος",
                "Product liability: Υψηλός κίνδυνος αγωγών",
                "GDPR violations: Πολλές πλατφόρμες σε US servers",
                "Data transfers: Schrems II compliance issues",
                "Vendor lock-in: Εξάρτηση από ρυθμιστικές αρχές",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 py-0.5">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ 8. INTELLECTUAL PROPERTY ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<ScrollText className="h-5 w-5" />} number="08" title="Πνευματική Ιδιοκτησία & Εμπορικά Σήματα" />
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="font-bold text-emerald-800 mb-2">Ιδιοκτησία</p>
              <p>Όλα τα δικαιώματα πνευματικής ιδιοκτησίας, συμπεριλαμβανομένου του source code, 
              της αρχιτεκτονικής, του brand identity, των αλγορίθμων πλοήγησης και της μεθοδολογίας 
              AI triage, ανήκουν αποκλειστικά στην <strong>Χαλβατζάκου Αλεξάνδρα (Chalvatzakou Alexandra)</strong>.</p>
            </div>
            
            <h3 className="font-semibold text-base text-gray-800 mt-4">8.1 Προστατευόμενα Στοιχεία</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Εμπορικό Σήμα", items: ["Medithos™ (λεκτικό)", "Logo & visual identity", "UI/UX design system"] },
                { title: "Πνευματική Ιδιοκτησία", items: ["Source code & αρχιτεκτονική", "AI navigation algorithms", "Methodology & processes"] },
                { title: "Trade Secrets", items: ["Triage logic & scoring", "Data flow architecture", "Compliance framework design"] },
              ].map((group, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 text-xs print-avoid-break">
                  <p className="font-semibold text-emerald-700 mb-2">{group.title}</p>
                  {group.items.map((item, j) => (
                    <p key={j} className="text-gray-600 py-0.5">• {item}</p>
                  ))}
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-base text-gray-800 mt-4">8.2 Στρατηγική Κατοχύρωσης</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 text-sm">
              <li>Κατάθεση εμπορικού σήματος <strong>Medithos</strong> σε EUIPO (European Union Intellectual Property Office)</li>
              <li>Copyright registration για τον source code</li>
              <li>NDA agreements με όλους τους συνεργάτες και συμβούλους</li>
              <li>IP assignment clauses σε συμβάσεις εργασίας/συνεργασίας</li>
            </ul>
          </div>
        </section>

        {/* ══════════════ 9. CONTRACTUAL FRAMEWORK ══════════════ */}
        <section>
          <SectionHeader icon={<FileText className="h-5 w-5" />} number="09" title="Συμβατικό Πλαίσιο" />
          <div className="grid grid-cols-2 gap-4">
            <ContractCard
              title="Όροι Χρήσης (Terms of Service)"
              status="Ενεργό"
              items={[
                "Σαφής ορισμός υπηρεσίας: πλοήγηση, όχι διάγνωση",
                "Αποποίηση ιατρικής ευθύνης",
                "Ηλικιακός περιορισμός: 18+",
                "Ρήτρα pilot phase & δοκιμαστικής λειτουργίας",
                "Δικαιοδοσία: Ελληνικά δικαστήρια",
              ]}
            />
            <ContractCard
              title="Πολιτική Απορρήτου (Privacy Policy)"
              status="Ενεργό"
              items={[
                "Αναλυτική περιγραφή δεδομένων που συλλέγονται",
                "Νόμιμη βάση ανά κατηγορία δεδομένων",
                "Δικαιώματα υποκειμένων (GDPR Art. 15-22)",
                "Στοιχεία DPO & επικοινωνίας",
                "Πολιτική cookies & data retention",
              ]}
            />
            <ContractCard
              title="DPA — Data Processing Agreement (Art. 28)"
              status="Έτοιμο για B2B"
              items={[
                "Ρόλοι Controller/Processor σαφώς ορισμένοι",
                "Sub-processor list (Lovable Cloud, AI Gateway)",
                "Security obligations & breach notification",
                "Data return/deletion upon termination",
                "Audit rights για τον Controller",
              ]}
            />
            <ContractCard
              title="Doctor Advisor Agreement"
              status="Ενεργό"
              items={[
                "Ρόλος: Σύμβουλος πλοήγησης, ΟΧΙ θεράπων γιατρός",
                "Αποποίηση σχέσης γιατρού-ασθενή",
                "Εθελοντική συμμετοχή (pilot phase)",
                "Υποχρεώσεις εχεμύθειας & GDPR",
                "Δικαίωμα αποχώρησης ανά πάσα στιγμή",
              ]}
            />
          </div>
        </section>

        {/* ══════════════ 10. RISK MANAGEMENT ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<AlertTriangle className="h-5 w-5" />} number="10" title="Διαχείριση Κινδύνου & Ασφάλιση" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Κίνδυνος</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Πιθανότητα</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Αντίκτυπος</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Μετριασμός</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Χρήστης ακολουθεί AI αντί γιατρού", "Μέτρια", "Υψηλός", "Disclaimers, human-in-the-loop, forced doctor referral"],
                  ["Data breach", "Χαμηλή", "Κρίσιμος", "AES-256, RLS, 72h notification, incident plan"],
                  ["Ρυθμιστική αλλαγή (MDR expansion)", "Χαμηλή", "Υψηλός", "Modular architecture, CE-ready design"],
                  ["AI hallucination / λάθος κατεύθυνση", "Μέτρια", "Μέτριος", "Conservative triage, emergency detection, audit trail"],
                  ["GDPR complaint", "Χαμηλή", "Μέτριος", "DPIA, consent management, DPO appointed"],
                  ["IP dispute", "Χαμηλή", "Υψηλός", "Copyright registration, NDA framework, EUIPO filing"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-3 py-1.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════ 11. INCIDENT MANAGEMENT ══════════════ */}
        <section>
          <SectionHeader icon={<Eye className="h-5 w-5" />} number="11" title="Διαχείριση Περιστατικών Ασφαλείας" />
          <div className="grid grid-cols-4 gap-3">
            {[
              { step: "1", title: "Εντοπισμός", time: "T+0", desc: "Αυτόματη ανίχνευση ή αναφορά χρήστη" },
              { step: "2", title: "Αξιολόγηση", time: "T+4h", desc: "Severity assessment, scope identification" },
              { step: "3", title: "Ειδοποίηση DPA", time: "T+72h", desc: "Ενημέρωση ΑΠΔΠΧ αν απαιτείται (Art. 33)" },
              { step: "4", title: "Ενημέρωση Χρηστών", time: "T+72h", desc: "Αν ο κίνδυνος είναι υψηλός (Art. 34)" },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 text-xs text-center print-avoid-break">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">{item.step}</div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-emerald-600 font-mono text-[10px] mt-1">{item.time}</p>
                <p className="text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 12. DATA SUBJECT RIGHTS ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Users className="h-5 w-5" />} number="12" title="Δικαιώματα Υποκειμένων Δεδομένων" />
          <div className="grid grid-cols-2 gap-4">
            {[
              { right: "Πρόσβαση (Art. 15)", impl: "Εξαγωγή δεδομένων σε JSON από Ρυθμίσεις", time: "< 30 ημέρες" },
              { right: "Διόρθωση (Art. 16)", impl: "Επεξεργασία προφίλ & ιατρικού ιστορικού", time: "Άμεσα" },
              { right: "Διαγραφή (Art. 17)", impl: "Κουμπί «Διαγραφή Λογαριασμού» — cascade delete", time: "< 72 ώρες" },
              { right: "Περιορισμός (Art. 18)", impl: "Δυνατότητα freeze λογαριασμού", time: "< 72 ώρες" },
              { right: "Φορητότητα (Art. 20)", impl: "JSON export όλων των δεδομένων", time: "< 30 ημέρες" },
              { right: "Εναντίωση (Art. 21)", impl: "Opt-out AI processing, analytics", time: "Άμεσα" },
              { right: "Ανάκληση Συγκατάθεσης", impl: "Κουμπί «Ανάκληση» στις Ρυθμίσεις", time: "Άμεσα" },
              { right: "Μη αυτοματοποιημένη λήψη αποφάσεων (Art. 22)", impl: "Πάντα human-in-the-loop για κρίσιμες αποφάσεις", time: "By design" },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 text-xs print-avoid-break">
                <p className="font-semibold text-emerald-700">{item.right}</p>
                <p className="text-gray-600 mt-1">{item.impl}</p>
                <p className="text-gray-400 mt-1 font-mono text-[10px]">Χρόνος απόκρισης: {item.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 13. COMPLIANCE ROLES ══════════════ */}
        <section>
          <SectionHeader icon={<Building2 className="h-5 w-5" />} number="13" title="Ρόλοι & Ευθύνες Συμμόρφωσης" />
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                role: "Data Protection Officer (DPO)",
                responsibilities: [
                  "Εποπτεία GDPR compliance",
                  "Σημείο επαφής με ΑΠΔΠΧ",
                  "Αναθεώρηση DPIA",
                  "Εκπαίδευση προσωπικού",
                  "Επαφή: privacy@medithos.com",
                ],
              },
              {
                role: "Regulatory Affairs",
                responsibilities: [
                  "Παρακολούθηση κανονιστικών αλλαγών",
                  "MDR monitoring (σε περίπτωση αλλαγής scope)",
                  "EU AI Act compliance tracking",
                  "Coordination με νομικούς συμβούλους",
                ],
              },
              {
                role: "Security Officer",
                responsibilities: [
                  "Incident response management",
                  "Penetration testing coordination",
                  "Access control management",
                  "Audit log monitoring",
                  "Business continuity planning",
                ],
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 text-xs print-avoid-break">
                <p className="font-semibold text-emerald-700 mb-2">{item.role}</p>
                {item.responsibilities.map((r, j) => (
                  <p key={j} className="text-gray-600 py-0.5">• {r}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 14. ROADMAP ══════════════ */}
        <section className="print-break">
          <SectionHeader icon={<Gavel className="h-5 w-5" />} number="14" title="Roadmap Κανονιστικής Εξέλιξης" />
          <div className="space-y-4">
            {[
              {
                phase: "Φάση 1 — Pilot (Τρέχουσα)",
                period: "Q1-Q2 2026",
                items: [
                  "✓ GDPR compliance by-design",
                  "✓ Terms of Use & Privacy Policy",
                  "✓ Pilot consent mechanism",
                  "✓ Medical disclaimers σε κάθε AI screen",
                  "→ DPIA finalization",
                  "→ DPO appointment",
                ],
              },
              {
                phase: "Φάση 2 — Market Entry",
                period: "Q3-Q4 2026",
                items: [
                  "Κατάθεση εμπορικού σήματος EUIPO",
                  "DPA templates για B2B partners",
                  "Insurance governance compliance pack",
                  "NIS2 assessment (αν εφαρμόζεται)",
                  "Cyber insurance acquisition",
                ],
              },
              {
                phase: "Φάση 3 — Scale",
                period: "2027",
                items: [
                  "ISO 27001 certification",
                  "SOC 2 Type II audit",
                  "CE marking preparation (αν εξελιχθεί σε MDR scope)",
                  "Cross-border GDPR coordination (multi-EU)",
                  "AI Act compliance audit",
                ],
              },
            ].map((phase, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 print-avoid-break">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm text-emerald-700">{phase.phase}</h4>
                  <span className="text-xs font-mono text-gray-400">{phase.period}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {phase.items.map((item, j) => (
                    <p key={j} className="text-xs text-gray-600 py-0.5">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 15. COPYRIGHT ══════════════ */}
        <section className="print-break">
          <Separator className="mb-8" />
          <div className="text-center space-y-4 py-12">
            <h2 className="text-2xl font-bold text-emerald-700">Δήλωση Πνευματικής Ιδιοκτησίας</h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                Όλα τα δικαιώματα πνευματικής ιδιοκτησίας, συμπεριλαμβανομένου αλλά χωρίς να περιορίζεται 
                στον πηγαίο κώδικα, την αρχιτεκτονική συστήματος, τους αλγορίθμους AI, το σχεδιαστικό σύστημα, 
                την εμπορική ταυτότητα και τη μεθοδολογία πλοήγησης υγείας του <strong>Medithos</strong>, 
                ανήκουν αποκλειστικά στην εφευρέτρια:
              </p>
              <p className="text-lg font-bold text-emerald-800 mt-4">
                Χαλβατζάκου Αλεξάνδρα<br />
                <span className="text-sm font-normal text-gray-500">Chalvatzakou Alexandra</span>
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Απαγορεύεται αυστηρά η αναπαραγωγή, αντιγραφή, διανομή ή χρήση οποιουδήποτε μέρους 
                του παρόντος εγγράφου ή της πλατφόρμας χωρίς τη ρητή γραπτή άδεια της ιδιοκτήτριας.
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-8">
              © 2026 Medithos. All Rights Reserved. | Confidential — For Investor Review Only
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ═══════════════ HELPER COMPONENTS ═══════════════ */

function SectionHeader({ icon, number, title }: { icon: React.ReactNode; number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider">Section {number}</p>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
    </div>
  );
}

function StatusCard({ label, status, color }: { label: string; status: string; color: string }) {
  const bg = color === "green" ? "bg-emerald-100 border-emerald-300" : "bg-amber-100 border-amber-300";
  const text = color === "green" ? "text-emerald-800" : "text-amber-800";
  return (
    <div className={`border rounded-lg p-3 text-center text-xs print-avoid-break ${bg}`}>
      <p className="font-bold text-sm">{label}</p>
      <p className={`font-semibold mt-1 ${text}`}>{status}</p>
    </div>
  );
}

function RegulationCard({ title, scope, status, articles }: { title: string; scope: string; status: string; articles: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-xs print-avoid-break">
      <p className="font-bold text-emerald-700 text-sm">{title}</p>
      <p className="text-gray-500 mb-2">{scope}</p>
      <p className="text-emerald-600 font-semibold mb-2">→ {status}</p>
      {articles.map((a, i) => (
        <p key={i} className="text-gray-600 py-0.5">• {a}</p>
      ))}
    </div>
  );
}

function LegalPillar({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 print-avoid-break">
      <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        {title}
      </h4>
      {items.map((item, i) => (
        <p key={i} className="text-xs text-gray-600 py-0.5">• {item}</p>
      ))}
    </div>
  );
}

function ContractCard({ title, status, items }: { title: string; status: string; items: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 print-avoid-break">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm text-emerald-700">{title}</h4>
        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{status}</span>
      </div>
      {items.map((item, i) => (
        <p key={i} className="text-xs text-gray-600 py-0.5">• {item}</p>
      ))}
    </div>
  );
}
