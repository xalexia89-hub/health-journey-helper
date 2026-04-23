import { useState } from "react";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

type Lang = "el" | "en";

const content = {
  el: {
    headerTitle: "Πολιτική Απορρήτου",
    pageTitle: "Πολιτική Απορρήτου Medithos",
    updated: "Τελευταία ενημέρωση: Ιανουάριος 2026",
    sections: [
      {
        title: "1. Εισαγωγή",
        body: "Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Η παρούσα πολιτική εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).",
      },
      {
        title: "2. Υπεύθυνος Επεξεργασίας",
        bodyHtml: 'Υπεύθυνος επεξεργασίας είναι η Medithos. Για θέματα προστασίας δεδομένων, επικοινωνήστε στο: <a href="mailto:privacy@medithos.com" class="text-primary hover:underline ml-1">privacy@medithos.com</a>',
      },
      {
        title: "3. Δεδομένα που Συλλέγουμε",
        body: "Συλλέγουμε τα ακόλουθα δεδομένα:",
        list: [
          "<strong>Στοιχεία λογαριασμού:</strong> Email, όνομα, τηλέφωνο",
          "<strong>Δεδομένα υγείας:</strong> Συμπτώματα, ιστορικό, φάρμακα (με τη συγκατάθεσή σας)",
          "<strong>Δεδομένα χρήσης:</strong> Αλληλεπιδράσεις με την εφαρμογή",
          "<strong>Τεχνικά δεδομένα:</strong> Τύπος συσκευής, IP διεύθυνση",
        ],
      },
      {
        title: "4. Ειδικές Κατηγορίες Δεδομένων",
        callout: "Τα δεδομένα υγείας αποτελούν ειδική κατηγορία δεδομένων. Τα επεξεργαζόμαστε <strong>μόνο με τη ρητή συγκατάθεσή σας</strong> και για τους σκοπούς παροχής των υπηρεσιών μας.",
      },
      {
        title: "5. Σκοπός Επεξεργασίας",
        body: "Χρησιμοποιούμε τα δεδομένα σας για:",
        list: [
          "Παροχή υπηρεσιών καθοδήγησης υγείας",
          "Σύνδεση με παρόχους υγειονομικής περίθαλψης",
          "Βελτίωση της εφαρμογής",
          "Επικοινωνία για τον λογαριασμό σας",
        ],
      },
      {
        title: "6. Νομική Βάση",
        body: "Επεξεργαζόμαστε τα δεδομένα σας βάσει:",
        list: [
          "<strong>Συγκατάθεση:</strong> Για δεδομένα υγείας και επικοινωνία",
          "<strong>Εκτέλεση σύμβασης:</strong> Για παροχή υπηρεσιών",
          "<strong>Έννομο συμφέρον:</strong> Για ασφάλεια και βελτίωση",
        ],
      },
      {
        title: "7. Διατήρηση Δεδομένων",
        body: "Διατηρούμε τα δεδομένα σας για όσο διάστημα είναι απαραίτητο για τους σκοπούς επεξεργασίας ή όπως απαιτείται από τον νόμο. Κατά τη διάρκεια της πιλοτικής φάσης, τα δεδομένα ενδέχεται να διαγραφούν κατά τη μετάβαση σε production.",
      },
      {
        title: "8. Τα Δικαιώματά Σας (GDPR)",
        body: "Έχετε τα ακόλουθα δικαιώματα:",
        list: [
          "<strong>Πρόσβαση:</strong> Να ζητήσετε αντίγραφο των δεδομένων σας",
          "<strong>Διόρθωση:</strong> Να διορθώσετε ανακριβή δεδομένα",
          "<strong>Διαγραφή:</strong> Να ζητήσετε διαγραφή των δεδομένων σας",
          "<strong>Περιορισμός:</strong> Να περιορίσετε την επεξεργασία",
          "<strong>Φορητότητα:</strong> Να λάβετε τα δεδομένα σας σε κοινή μορφή",
          "<strong>Εναντίωση:</strong> Να αντιταχθείτε στην επεξεργασία",
          "<strong>Ανάκληση συγκατάθεσης:</strong> Ανά πάσα στιγμή",
        ],
      },
      {
        title: "9. Ασφάλεια Δεδομένων",
        body: "Εφαρμόζουμε τεχνικά και οργανωτικά μέτρα ασφαλείας, όπως:",
        list: [
          "Κρυπτογράφηση δεδομένων (SSL/TLS)",
          "Ασφαλής αποθήκευση σε πιστοποιημένα data centers",
          "Έλεγχος πρόσβασης και authentication",
          "Row Level Security (RLS) σε βάση δεδομένων",
        ],
      },
      {
        title: "10. Κοινοποίηση σε Τρίτους",
        body: "Δεν πουλάμε τα δεδομένα σας. Ενδέχεται να τα μοιραστούμε με:",
        list: [
          "Παρόχους υγείας (με τη συγκατάθεσή σας)",
          "Τεχνικούς παρόχους (υπεργολάβοι επεξεργασίας)",
          "Αρχές (αν απαιτείται από τον νόμο)",
        ],
      },
      {
        title: "11. Cookies",
        body: "Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία της εφαρμογής. Δεν χρησιμοποιούμε cookies παρακολούθησης ή διαφήμισης.",
      },
      {
        title: "12. Επικοινωνία",
        body: "Για ερωτήσεις ή άσκηση δικαιωμάτων:",
        contact: {
          email: "privacy@medithos.com",
          note: "Έχετε δικαίωμα υποβολής καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr)",
        },
      },
    ],
    footer: "© 2026 Medithos. Με επιφύλαξη παντός δικαιώματος.",
  },
  en: {
    headerTitle: "Privacy Policy",
    pageTitle: "Medithos Privacy Policy",
    updated: "Last updated: January 2026",
    sections: [
      {
        title: "1. Introduction",
        body: "Protecting your personal data is our priority. This policy explains how we collect, use and protect your data in accordance with the General Data Protection Regulation (GDPR).",
      },
      {
        title: "2. Data Controller",
        bodyHtml: 'The data controller is Medithos. For data protection matters, contact us at: <a href="mailto:privacy@medithos.com" class="text-primary hover:underline ml-1">privacy@medithos.com</a>',
      },
      {
        title: "3. Data We Collect",
        body: "We collect the following data:",
        list: [
          "<strong>Account information:</strong> Email, name, phone",
          "<strong>Health data:</strong> Symptoms, history, medications (with your consent)",
          "<strong>Usage data:</strong> Interactions with the app",
          "<strong>Technical data:</strong> Device type, IP address",
        ],
      },
      {
        title: "4. Special Categories of Data",
        callout: "Health data constitutes a special category of data. We process it <strong>only with your explicit consent</strong> and for the purposes of providing our services.",
      },
      {
        title: "5. Purpose of Processing",
        body: "We use your data to:",
        list: [
          "Provide health navigation services",
          "Connect you with healthcare providers",
          "Improve the application",
          "Communicate about your account",
        ],
      },
      {
        title: "6. Legal Basis",
        body: "We process your data based on:",
        list: [
          "<strong>Consent:</strong> For health data and communications",
          "<strong>Contract performance:</strong> For service delivery",
          "<strong>Legitimate interest:</strong> For security and improvement",
        ],
      },
      {
        title: "7. Data Retention",
        body: "We retain your data for as long as necessary for processing purposes or as required by law. During the pilot phase, data may be deleted upon transition to production.",
      },
      {
        title: "8. Your Rights (GDPR)",
        body: "You have the following rights:",
        list: [
          "<strong>Access:</strong> Request a copy of your data",
          "<strong>Rectification:</strong> Correct inaccurate data",
          "<strong>Erasure:</strong> Request deletion of your data",
          "<strong>Restriction:</strong> Restrict processing",
          "<strong>Portability:</strong> Receive your data in a common format",
          "<strong>Objection:</strong> Object to processing",
          "<strong>Withdraw consent:</strong> At any time",
        ],
      },
      {
        title: "9. Data Security",
        body: "We implement technical and organizational security measures, such as:",
        list: [
          "Data encryption (SSL/TLS)",
          "Secure storage in certified data centers",
          "Access control and authentication",
          "Row Level Security (RLS) in the database",
        ],
      },
      {
        title: "10. Sharing with Third Parties",
        body: "We do not sell your data. We may share it with:",
        list: [
          "Healthcare providers (with your consent)",
          "Technical providers (processing sub-contractors)",
          "Authorities (if required by law)",
        ],
      },
      {
        title: "11. Cookies",
        body: "We use essential cookies for the operation of the application. We do not use tracking or advertising cookies.",
      },
      {
        title: "12. Contact",
        body: "For questions or to exercise your rights:",
        contact: {
          email: "privacy@medithos.com",
          note: "You have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr)",
        },
      },
    ],
    footer: "© 2026 Medithos. All rights reserved.",
  },
} as const;

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("el");
  const t = content[lang];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{t.headerTitle}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "el" ? "en" : "el")}
            className="gap-1.5"
          >
            <Languages className="h-4 w-4" />
            {lang === "el" ? "EN" : "ΕΛ"}
          </Button>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">{t.pageTitle}</h1>
            <p className="text-sm text-muted-foreground mt-2">{t.updated}</p>
          </div>

          {t.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              {"callout" in section && section.callout && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.callout }} />
                </div>
              )}
              {"body" in section && section.body && (
                <p className="text-muted-foreground text-sm leading-relaxed">{section.body}</p>
              )}
              {"bodyHtml" in section && section.bodyHtml && (
                <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
              )}
              {"list" in section && section.list && (
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
                  {section.list.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              )}
              {"contact" in section && section.contact && (
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  <p>
                    Email:{" "}
                    <a href={`mailto:${section.contact.email}`} className="text-primary hover:underline">
                      {section.contact.email}
                    </a>
                  </p>
                  <p className="mt-2">{section.contact.note}</p>
                </div>
              )}
            </section>
          ))}

          <div className="pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">{t.footer}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
