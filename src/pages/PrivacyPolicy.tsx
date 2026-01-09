import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Πολιτική Απορρήτου</h1>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">Πολιτική Απορρήτου Medithos</h1>
            <p className="text-sm text-muted-foreground mt-2">Τελευταία ενημέρωση: Ιανουάριος 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">1. Εισαγωγή</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Η παρούσα πολιτική 
              εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας σύμφωνα με 
              τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">2. Υπεύθυνος Επεξεργασίας</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Υπεύθυνος επεξεργασίας είναι η Medithos. Για θέματα προστασίας δεδομένων, 
              επικοινωνήστε στο: 
              <a href="mailto:privacy@medithos.com" className="text-primary hover:underline ml-1">
                privacy@medithos.com
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">3. Δεδομένα που Συλλέγουμε</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Συλλέγουμε τα ακόλουθα δεδομένα:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li><strong>Στοιχεία λογαριασμού:</strong> Email, όνομα, τηλέφωνο</li>
              <li><strong>Δεδομένα υγείας:</strong> Συμπτώματα, ιστορικό, φάρμακα (με τη συγκατάθεσή σας)</li>
              <li><strong>Δεδομένα χρήσης:</strong> Αλληλεπιδράσεις με την εφαρμογή</li>
              <li><strong>Τεχνικά δεδομένα:</strong> Τύπος συσκευής, IP διεύθυνση</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">4. Ειδικές Κατηγορίες Δεδομένων</h2>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                Τα δεδομένα υγείας αποτελούν ειδική κατηγορία δεδομένων. Τα επεξεργαζόμαστε 
                <strong> μόνο με τη ρητή συγκατάθεσή σας</strong> και για τους σκοπούς παροχής 
                των υπηρεσιών μας.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">5. Σκοπός Επεξεργασίας</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Χρησιμοποιούμε τα δεδομένα σας για:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li>Παροχή υπηρεσιών καθοδήγησης υγείας</li>
              <li>Σύνδεση με παρόχους υγειονομικής περίθαλψης</li>
              <li>Βελτίωση της εφαρμογής</li>
              <li>Επικοινωνία για τον λογαριασμό σας</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">6. Νομική Βάση</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Επεξεργαζόμαστε τα δεδομένα σας βάσει:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li><strong>Συγκατάθεση:</strong> Για δεδομένα υγείας και επικοινωνία</li>
              <li><strong>Εκτέλεση σύμβασης:</strong> Για παροχή υπηρεσιών</li>
              <li><strong>Έννομο συμφέρον:</strong> Για ασφάλεια και βελτίωση</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">7. Διατήρηση Δεδομένων</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Διατηρούμε τα δεδομένα σας για όσο διάστημα είναι απαραίτητο για τους σκοπούς 
              επεξεργασίας ή όπως απαιτείται από τον νόμο. Κατά τη διάρκεια της πιλοτικής φάσης, 
              τα δεδομένα ενδέχεται να διαγραφούν κατά τη μετάβαση σε production.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">8. Τα Δικαιώματά Σας (GDPR)</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Έχετε τα ακόλουθα δικαιώματα:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li><strong>Πρόσβαση:</strong> Να ζητήσετε αντίγραφο των δεδομένων σας</li>
              <li><strong>Διόρθωση:</strong> Να διορθώσετε ανακριβή δεδομένα</li>
              <li><strong>Διαγραφή:</strong> Να ζητήσετε διαγραφή των δεδομένων σας</li>
              <li><strong>Περιορισμός:</strong> Να περιορίσετε την επεξεργασία</li>
              <li><strong>Φορητότητα:</strong> Να λάβετε τα δεδομένα σας σε κοινή μορφή</li>
              <li><strong>Εναντίωση:</strong> Να αντιταχθείτε στην επεξεργασία</li>
              <li><strong>Ανάκληση συγκατάθεσης:</strong> Ανά πάσα στιγμή</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">9. Ασφάλεια Δεδομένων</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Εφαρμόζουμε τεχνικά και οργανωτικά μέτρα ασφαλείας, όπως:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li>Κρυπτογράφηση δεδομένων (SSL/TLS)</li>
              <li>Ασφαλής αποθήκευση σε πιστοποιημένα data centers</li>
              <li>Έλεγχος πρόσβασης και authentication</li>
              <li>Row Level Security (RLS) σε βάση δεδομένων</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">10. Κοινοποίηση σε Τρίτους</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Δεν πουλάμε τα δεδομένα σας. Ενδέχεται να τα μοιραστούμε με:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li>Παρόχους υγείας (με τη συγκατάθεσή σας)</li>
              <li>Τεχνικούς παρόχους (υπεργολάβοι επεξεργασίας)</li>
              <li>Αρχές (αν απαιτείται από τον νόμο)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">11. Cookies</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία της εφαρμογής. 
              Δεν χρησιμοποιούμε cookies παρακολούθησης ή διαφήμισης.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">12. Επικοινωνία</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Για ερωτήσεις ή άσκηση δικαιωμάτων:
            </p>
            <div className="bg-muted/30 rounded-lg p-4 text-sm">
              <p>Email: <a href="mailto:privacy@medithos.com" className="text-primary hover:underline">privacy@medithos.com</a></p>
              <p className="mt-2">Έχετε δικαίωμα υποβολής καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr)</p>
            </div>
          </section>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 Medithos. Με επιφύλαξη παντός δικαιώματος.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
