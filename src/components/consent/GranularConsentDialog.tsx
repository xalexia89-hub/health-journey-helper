import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Brain, FlaskConical, ExternalLink } from "lucide-react";
import { recordConsentBatch } from "@/lib/consent";
import { useToast } from "@/hooks/use-toast";

interface GranularConsentDialogProps {
  open: boolean;
  onComplete: () => void;
  language?: "el" | "en";
}

const COPY = {
  el: {
    title: "Συγκαταθέσεις Πιλοτικού",
    desc: "Πριν χρησιμοποιήσετε την πλατφόρμα, παρακαλώ επιβεβαιώστε τις συγκαταθέσεις σας.",
    step1Title: "1. Βασικοί Όροι",
    age: "Είμαι άνω των 18 ετών",
    terms: "Διάβασα και αποδέχομαι τους Όρους Χρήσης",
    privacy: "Διάβασα την Πολιτική Απορρήτου",
    step2Title: "2. Επεξεργασία Δεδομένων Υγείας (Άρθρο 9 GDPR)",
    step2Body:
      "Το Medithos θα επεξεργαστεί τα δεδομένα υγείας σας (ιστορικό, φάρμακα, αλλεργίες, εξετάσεις, lifestyle). Νομική βάση: ρητή συγκατάθεση. Μπορείτε να την ανακαλέσετε ανά πάσα στιγμή.",
    health: "Συμφωνώ με την επεξεργασία των δεδομένων υγείας μου",
    step3Title: "3. Επεξεργασία από Τεχνητή Νοημοσύνη",
    step3Body:
      "Το Medithos χρησιμοποιεί υπηρεσίες AI για ανάλυση των δεδομένων σας μέσω της Lovable AI Gateway. Τα δεδομένα μεταφέρονται κρυπτογραφημένα και δεν χρησιμοποιούνται για training.",
    ai: "Συμφωνώ με την AI επεξεργασία (προαιρετικό)",
    step4Title: "4. Πιλοτικό Πρόγραμμα",
    step4Body:
      "Συμμετέχετε στο Medithos Pilot v1.0 — BETA έκδοση. Ενδέχεται να υπάρξουν τεχνικά προβλήματα. Anonymized δεδομένα χρησιμοποιούνται για βελτίωση.",
    pilot: "Κατανοώ και αποδέχομαι τους όρους του πιλοτικού",
    button: "Καταχώρηση & Συνέχεια",
    saving: "Αποθήκευση...",
    successTitle: "Καταχωρήθηκαν",
    successDesc: "Οι συγκαταθέσεις σας αποθηκεύτηκαν.",
    errorTitle: "Σφάλμα",
    errorDesc: "Δεν ήταν δυνατή η αποθήκευση. Δοκιμάστε ξανά.",
  },
  en: {
    title: "Pilot Consents",
    desc: "Before using the platform, please confirm your consents.",
    step1Title: "1. Basic Terms",
    age: "I am over 18 years old",
    terms: "I have read and accept the Terms of Use",
    privacy: "I have read the Privacy Policy",
    step2Title: "2. Health Data Processing (GDPR Article 9)",
    step2Body:
      "Medithos will process your health data (history, medications, allergies, tests, lifestyle). Legal basis: explicit consent. You can revoke at any time.",
    health: "I agree to processing of my health data",
    step3Title: "3. AI Processing",
    step3Body:
      "Medithos uses AI services to analyze your data via Lovable AI Gateway. Data is transmitted encrypted and is not used for training.",
    ai: "I agree to AI processing (optional)",
    step4Title: "4. Pilot Program",
    step4Body:
      "You are joining Medithos Pilot v1.0 — BETA. There may be technical issues. Anonymized data is used for improvement.",
    pilot: "I understand and accept the pilot terms",
    button: "Save & Continue",
    saving: "Saving...",
    successTitle: "Saved",
    successDesc: "Your consents have been recorded.",
    errorTitle: "Error",
    errorDesc: "Could not save. Please try again.",
  },
};

export function GranularConsentDialog({
  open,
  onComplete,
  language = "el",
}: GranularConsentDialogProps) {
  const t = COPY[language];
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [health, setHealth] = useState(false);
  const [ai, setAi] = useState(false);
  const [pilot, setPilot] = useState(false);

  const requiredOk = age && terms && privacy && health && pilot;

  const submit = async () => {
    if (!requiredOk) return;
    setSaving(true);
    try {
      await recordConsentBatch([
        { type: "age_verification", granted: true },
        { type: "terms_of_service", granted: true },
        { type: "privacy_policy", granted: true },
        { type: "health_data_processing", granted: true },
        { type: "ai_processing", granted: ai },
        { type: "pilot_program", granted: true },
      ]);
      toast({ title: t.successTitle, description: t.successDesc });
      onComplete();
    } catch (e) {
      toast({
        title: t.errorTitle,
        description: t.errorDesc,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col glass-strong border-primary/30 [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <DialogTitle>{t.title}</DialogTitle>
          </div>
          <DialogDescription>{t.desc}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-5">
            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">{t.step1Title}</h4>
              <ConsentRow checked={age} onChange={setAge} id="c-age">
                {t.age}
              </ConsentRow>
              <ConsentRow checked={terms} onChange={setTerms} id="c-terms">
                <span className="inline-flex flex-wrap items-center gap-1">
                  {t.terms}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
              </ConsentRow>
              <ConsentRow checked={privacy} onChange={setPrivacy} id="c-privacy">
                <span className="inline-flex flex-wrap items-center gap-1">
                  {t.privacy}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
              </ConsentRow>
            </section>

            <section className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <h4 className="text-sm font-semibold text-destructive">{t.step2Title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{t.step2Body}</p>
              <ConsentRow checked={health} onChange={setHealth} id="c-health">
                <strong>{t.health}</strong>
              </ConsentRow>
            </section>

            <section className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-primary mt-0.5" />
                <h4 className="text-sm font-semibold text-primary">{t.step3Title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{t.step3Body}</p>
              <ConsentRow checked={ai} onChange={setAi} id="c-ai">
                {t.ai}
              </ConsentRow>
            </section>

            <section className="space-y-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="flex items-start gap-2">
                <FlaskConical className="h-4 w-4 text-warning mt-0.5" />
                <h4 className="text-sm font-semibold text-warning">{t.step4Title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{t.step4Body}</p>
              <ConsentRow checked={pilot} onChange={setPilot} id="c-pilot">
                <strong>{t.pilot}</strong>
              </ConsentRow>
            </section>
          </div>
        </ScrollArea>

        <Button onClick={submit} disabled={!requiredOk || saving} className="w-full" size="lg">
          {saving ? t.saving : t.button}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function ConsentRow({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const toggle = () => onChange(!checked);

  return (
    <div
      className="flex cursor-pointer items-start gap-3"
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
