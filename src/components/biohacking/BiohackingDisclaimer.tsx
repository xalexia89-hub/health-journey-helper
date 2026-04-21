import { AlertTriangle } from "lucide-react";
import { DISCLAIMER } from "./constants";

export function BiohackingDisclaimer() {
  return (
    <div className="flex gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
      <p className="leading-relaxed">{DISCLAIMER}</p>
    </div>
  );
}
