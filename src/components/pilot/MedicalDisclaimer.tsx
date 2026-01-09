import { AlertTriangle } from "lucide-react";

interface MedicalDisclaimerProps {
  variant?: "banner" | "inline" | "compact";
  className?: string;
}

export function MedicalDisclaimer({ variant = "banner", className = "" }: MedicalDisclaimerProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <AlertTriangle className="h-3 w-3 text-warning" />
        <span>Δεν αποτελεί ιατρική συμβουλή</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-sm ${className}`}>
        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
        <span className="text-muted-foreground">
          <strong className="text-warning">Σημαντικό:</strong> Δεν αποτελεί ιατρική συμβουλή. 
          Συμβουλευτείτε γιατρό για διάγνωση.
        </span>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className={`bg-warning/10 border-y border-warning/20 px-4 py-2 ${className}`}>
      <div className="flex items-center justify-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <span className="text-muted-foreground">
          <strong className="text-warning">Προσοχή:</strong> Το Medithos δεν αποτελεί ιατρική συμβουλή 
          και δεν παρέχει διαγνώσεις. Για κάθε ιατρικό ζήτημα, απευθυνθείτε σε γιατρό.
        </span>
      </div>
    </div>
  );
}
