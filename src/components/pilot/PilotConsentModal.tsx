import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, AlertTriangle, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "medithos_pilot_consent_v1";
const AGE_KEY = "medithos_age_confirmed_v1";

interface PilotConsentModalProps {
  onConsentGiven: () => void;
}

export function PilotConsentModal({ onConsentGiven }: PilotConsentModalProps) {
  const [open, setOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem(CONSENT_KEY);
    const hasAgeConfirmed = localStorage.getItem(AGE_KEY);
    if (!hasConsented || !hasAgeConfirmed) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (termsAccepted && disclaimerAccepted && ageConfirmed) {
      localStorage.setItem(CONSENT_KEY, new Date().toISOString());
      localStorage.setItem(AGE_KEY, "true");
      setOpen(false);
      onConsentGiven();
    }
  };

  const canAccept = termsAccepted && disclaimerAccepted && ageConfirmed;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden glass-strong border-primary/30 [&>button]:hidden flex flex-col">
        <DialogHeader className="space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-6 w-6" />
            <DialogTitle className="text-xl">Καλώς ήρθατε στο Medithos Pilot</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Παρακαλώ διαβάστε και αποδεχτείτε τους παρακάτω όρους πριν συνεχίσετε.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto pr-4">
          <div className="space-y-4">
            {/* Pilot Notice */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning">Πιλοτική Έκδοση</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Αυτή είναι μια πειραματική έκδοση του Medithos για δοκιμαστική χρήση.
                    Τα δεδομένα και οι λειτουργίες ενδέχεται να αλλάξουν.
                  </p>
                </div>
              </div>
            </div>

            {/* Health Disclaimer */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">Σημαντική Ειδοποίηση Υγείας</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Το Medithos <strong>ΔΕΝ αποτελεί ιατρική συμβουλή</strong> και <strong>ΔΕΝ παρέχει διαγνώσεις</strong>.
                    Οι πληροφορίες είναι καθοδηγητικού χαρακτήρα μόνο. Για οποιοδήποτε ιατρικό ζήτημα,
                    συμβουλευτείτε πάντα έναν εξειδικευμένο επαγγελματία υγείας.
                  </p>
                </div>
              </div>
            </div>


            {/* Checkboxes inside scroll area */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Age Confirmation */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="age-confirm"
                  checked={ageConfirmed}
                  onCheckedChange={(checked) => setAgeConfirmed(checked === true)}
                />
                <label htmlFor="age-confirm" className="text-sm leading-relaxed cursor-pointer">
                  Επιβεβαιώνω ότι είμαι <strong>άνω των 18 ετών</strong>.
                </label>
              </div>

              {/* Health Disclaimer Acceptance */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="disclaimer-accept"
                  checked={disclaimerAccepted}
                  onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                />
                <label htmlFor="disclaimer-accept" className="text-sm leading-relaxed cursor-pointer">
                  Κατανοώ ότι το Medithos <strong>δεν αποτελεί ιατρική συμβουλή</strong> και δεν υποκαθιστά
                  την επίσκεψη σε γιατρό.
                </label>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms-accept"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <label htmlFor="terms-accept" className="text-sm leading-relaxed cursor-pointer">
                  Αποδέχομαι τους{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Όρους Χρήσης
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  {" "}και την{" "}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Πολιτική Απορρήτου
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  {" "}της πιλοτικής έκδοσης.
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-border">
          <Button 
            onClick={handleAccept} 
            disabled={!canAccept}
            className="w-full"
            size="lg"
          >
            Αποδοχή & Συνέχεια
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function hasPilotConsent(): boolean {
  return !!localStorage.getItem(CONSENT_KEY) && !!localStorage.getItem(AGE_KEY);
}
