import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Όροι Χρήσης</h1>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">Όροι Χρήσης Medithos</h1>
            <p className="text-sm text-muted-foreground mt-2">Πιλοτική Έκδοση - Τελευταία ενημέρωση: Ιανουάριος 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">1. Αποδοχή Όρων</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Με τη χρήση της εφαρμογής Medithos, αποδέχεστε τους παρόντες όρους χρήσης. 
              Αν δεν συμφωνείτε με κάποιον από αυτούς, παρακαλούμε μην χρησιμοποιήσετε την εφαρμογή.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">2. Περιγραφή Υπηρεσίας</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Το Medithos είναι μια πλατφόρμα καθοδήγησης υγείας που βοηθά τους χρήστες να κατανοήσουν 
              τα συμπτώματά τους και να συνδεθούν με παρόχους υγειονομικής περίθαλψης. Η εφαρμογή 
              βρίσκεται αυτή τη στιγμή σε <strong>πιλοτική φάση</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-destructive">3. Σημαντική Αποποίηση Ευθύνης</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                <strong>Το Medithos ΔΕΝ αποτελεί ιατρική συμβουλή.</strong> Οι πληροφορίες που παρέχονται 
                είναι καθοδηγητικού χαρακτήρα μόνο και δεν υποκαθιστούν την επαγγελματική ιατρική 
                διάγνωση, θεραπεία ή συμβουλή. Πάντα συμβουλευτείτε έναν εξειδικευμένο επαγγελματία 
                υγείας για οποιοδήποτε ιατρικό ζήτημα.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">4. Περιορισμοί Ηλικίας</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Η χρήση της εφαρμογής επιτρέπεται μόνο σε άτομα άνω των 18 ετών. Με τη χρήση της 
              εφαρμογής, επιβεβαιώνετε ότι πληροίτε αυτή την προϋπόθεση.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">5. Πιλοτική Φάση</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Κατά τη διάρκεια της πιλοτικής φάσης:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li>Οι λειτουργίες ενδέχεται να αλλάξουν χωρίς προειδοποίηση</li>
              <li>Τα δεδομένα ενδέχεται να διαγραφούν κατά τη μετάβαση σε production</li>
              <li>Οι πληρωμές είναι απενεργοποιημένες</li>
              <li>Η σύνδεση με παρόχους υγείας γίνεται χειροκίνητα</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">6. Υποχρεώσεις Χρήστη</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ο χρήστης δεσμεύεται:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-2">
              <li>Να παρέχει ακριβείς πληροφορίες</li>
              <li>Να μην χρησιμοποιεί την εφαρμογή για έκτακτες ανάγκες (καλέστε 112)</li>
              <li>Να συμβουλεύεται πάντα επαγγελματία υγείας για διάγνωση</li>
              <li>Να μην μοιράζεται τον λογαριασμό του με τρίτους</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">7. Καταστάσεις Έκτακτης Ανάγκης</h2>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                Σε περίπτωση ιατρικής έκτακτης ανάγκης, καλέστε αμέσως το <strong>112</strong> ή 
                το <strong>166</strong> (ΕΚΑΒ). Η εφαρμογή Medithos δεν προορίζεται για χρήση σε 
                καταστάσεις έκτακτης ανάγκης.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">8. Πνευματική Ιδιοκτησία</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Όλο το περιεχόμενο, τα γραφικά, ο κώδικας και τα εμπορικά σήματα της εφαρμογής 
              αποτελούν πνευματική ιδιοκτησία του Medithos και προστατεύονται από τη νομοθεσία.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">9. Τροποποιήσεις</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους ανά πάσα στιγμή. 
              Οι χρήστες θα ενημερώνονται για σημαντικές αλλαγές.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">10. Επικοινωνία</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Για ερωτήσεις σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας στο: 
              <a href="mailto:legal@medithos.com" className="text-primary hover:underline ml-1">
                legal@medithos.com
              </a>
            </p>
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
