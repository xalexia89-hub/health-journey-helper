import { useState } from "react";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

type Lang = "el" | "en";

const content = {
  el: {
    headerTitle: "Όροι Χρήσης",
    pageTitle: "Όροι Χρήσης Medithos",
    updated: "Πιλοτική Έκδοση - Τελευταία ενημέρωση: Ιανουάριος 2026",
    sections: [
      {
        title: "1. Αποδοχή Όρων",
        body: "Με τη χρήση της εφαρμογής Medithos, αποδέχεστε τους παρόντες όρους χρήσης. Αν δεν συμφωνείτε με κάποιον από αυτούς, παρακαλούμε μην χρησιμοποιήσετε την εφαρμογή.",
      },
      {
        title: "2. Περιγραφή Υπηρεσίας",
        bodyHtml: "Το Medithos είναι μια πλατφόρμα καθοδήγησης υγείας που βοηθά τους χρήστες να κατανοήσουν τα συμπτώματά τους και να συνδεθούν με παρόχους υγειονομικής περίθαλψης. Η εφαρμογή βρίσκεται αυτή τη στιγμή σε <strong>πιλοτική φάση</strong>.",
      },
      {
        title: "3. Σημαντική Αποποίηση Ευθύνης",
        variant: "destructive" as const,
        calloutHtml: "<strong>Το Medithos ΔΕΝ αποτελεί ιατρική συμβουλή.</strong> Οι πληροφορίες που παρέχονται είναι καθοδηγητικού χαρακτήρα μόνο και δεν υποκαθιστούν την επαγγελματική ιατρική διάγνωση, θεραπεία ή συμβουλή. Πάντα συμβουλευτείτε έναν εξειδικευμένο επαγγελματία υγείας για οποιοδήποτε ιατρικό ζήτημα.",
      },
      {
        title: "4. Περιορισμοί Ηλικίας",
        body: "Η χρήση της εφαρμογής επιτρέπεται μόνο σε άτομα άνω των 18 ετών. Με τη χρήση της εφαρμογής, επιβεβαιώνετε ότι πληροίτε αυτή την προϋπόθεση.",
      },
      {
        title: "5. Πιλοτική Φάση",
        body: "Κατά τη διάρκεια της πιλοτικής φάσης:",
        list: [
          "Οι λειτουργίες ενδέχεται να αλλάξουν χωρίς προειδοποίηση",
          "Τα δεδομένα ενδέχεται να διαγραφούν κατά τη μετάβαση σε production",
          "Οι πληρωμές είναι απενεργοποιημένες",
          "Η σύνδεση με παρόχους υγείας γίνεται χειροκίνητα",
        ],
      },
      {
        title: "6. Υποχρεώσεις Χρήστη",
        body: "Ο χρήστης δεσμεύεται:",
        list: [
          "Να παρέχει ακριβείς πληροφορίες",
          "Να μην χρησιμοποιεί την εφαρμογή για έκτακτες ανάγκες (καλέστε 112)",
          "Να συμβουλεύεται πάντα επαγγελματία υγείας για διάγνωση",
          "Να μην μοιράζεται τον λογαριασμό του με τρίτους",
        ],
      },
      {
        title: "7. Καταστάσεις Έκτακτης Ανάγκης",
        variant: "warning" as const,
        calloutHtml: "Σε περίπτωση ιατρικής έκτακτης ανάγκης, καλέστε αμέσως το <strong>112</strong> ή το <strong>166</strong> (ΕΚΑΒ). Η εφαρμογή Medithos δεν προορίζεται για χρήση σε καταστάσεις έκτακτης ανάγκης.",
      },
      {
        title: "8. Πνευματική Ιδιοκτησία",
        body: "Όλο το περιεχόμενο, τα γραφικά, ο κώδικας και τα εμπορικά σήματα της εφαρμογής αποτελούν πνευματική ιδιοκτησία του Medithos και προστατεύονται από τη νομοθεσία.",
      },
      {
        title: "9. Τροποποιήσεις",
        body: "Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους ανά πάσα στιγμή. Οι χρήστες θα ενημερώνονται για σημαντικές αλλαγές.",
      },
      {
        title: "10. Επικοινωνία",
        bodyHtml: 'Για ερωτήσεις σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας στο: <a href="mailto:legal@medithos.com" class="text-primary hover:underline ml-1">legal@medithos.com</a>',
      },
    ],
    footer: "© 2026 Medithos. Με επιφύλαξη παντός δικαιώματος.",
  },
  en: {
    headerTitle: "Terms of Use",
    pageTitle: "Medithos Terms of Use",
    updated: "Pilot Version - Last updated: January 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: "By using the Medithos application, you accept these terms of use. If you do not agree with any of them, please do not use the application.",
      },
      {
        title: "2. Service Description",
        bodyHtml: "Medithos is a health navigation platform that helps users understand their symptoms and connect with healthcare providers. The application is currently in a <strong>pilot phase</strong>.",
      },
      {
        title: "3. Important Disclaimer",
        variant: "destructive" as const,
        calloutHtml: "<strong>Medithos is NOT medical advice.</strong> The information provided is for guidance purposes only and does not replace professional medical diagnosis, treatment or advice. Always consult a qualified healthcare professional for any medical issue.",
      },
      {
        title: "4. Age Restrictions",
        body: "Use of the application is only permitted for individuals over 18 years of age. By using the application, you confirm that you meet this requirement.",
      },
      {
        title: "5. Pilot Phase",
        body: "During the pilot phase:",
        list: [
          "Features may change without notice",
          "Data may be deleted upon transition to production",
          "Payments are disabled",
          "Connection to healthcare providers is done manually",
        ],
      },
      {
        title: "6. User Obligations",
        body: "The user agrees:",
        list: [
          "To provide accurate information",
          "Not to use the application for emergencies (call 112)",
          "To always consult a healthcare professional for diagnosis",
          "Not to share their account with third parties",
        ],
      },
      {
        title: "7. Emergency Situations",
        variant: "warning" as const,
        calloutHtml: "In case of a medical emergency, immediately call <strong>112</strong> or <strong>166</strong> (EKAV). The Medithos application is not intended for use in emergency situations.",
      },
      {
        title: "8. Intellectual Property",
        body: "All content, graphics, code and trademarks of the application are the intellectual property of Medithos and are protected by law.",
      },
      {
        title: "9. Modifications",
        body: "We reserve the right to modify these terms at any time. Users will be notified of significant changes.",
      },
      {
        title: "10. Contact",
        bodyHtml: 'For questions regarding the terms of use, contact us at: <a href="mailto:legal@medithos.com" class="text-primary hover:underline ml-1">legal@medithos.com</a>',
      },
    ],
    footer: "© 2026 Medithos. All rights reserved.",
  },
} as const;

export default function TermsOfUse() {
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

          {t.sections.map((section, idx) => {
            const variant = "variant" in section ? section.variant : null;
            const titleClass =
              variant === "destructive" ? "text-destructive" : "text-primary";
            const calloutClass =
              variant === "destructive"
                ? "bg-destructive/10 border border-destructive/30 rounded-lg p-4"
                : variant === "warning"
                ? "bg-warning/10 border border-warning/30 rounded-lg p-4"
                : "";

            return (
              <section key={idx} className="space-y-3">
                <h2 className={`text-lg font-semibold ${titleClass}`}>{section.title}</h2>
                {"calloutHtml" in section && section.calloutHtml && (
                  <div className={calloutClass}>
                    <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.calloutHtml }} />
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
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          <div className="pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">{t.footer}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
