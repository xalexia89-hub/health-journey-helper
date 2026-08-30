import { Phone, Siren, AlertTriangle, Stethoscope, Video, CalendarClock, ShieldCheck, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ROUTING_DESCRIPTIONS_EL,
  ROUTING_LABELS_EL,
  UNCERTAINTY_LABELS_EL,
  URGENCY_LABELS_EL,
  scenarioLabel,
  missingInfoLabel,
  type NavigationSignal,
  type RoutingCategory,
} from "@/lib/healthNavigation";


const styles: Record<RoutingCategory, { icon: typeof Siren; bg: string; text: string; badge: string; emergency: boolean }> = {
  EMERGENCY: { icon: Siren, bg: "bg-destructive/15 border-destructive", text: "text-destructive", badge: "bg-destructive text-destructive-foreground", emergency: true },
  URGENT_ASSESSMENT: { icon: AlertTriangle, bg: "bg-warning/15 border-warning/60", text: "text-warning", badge: "bg-warning text-warning-foreground", emergency: true },
  SPECIALIST: { icon: Stethoscope, bg: "bg-primary/10 border-primary/50", text: "text-primary", badge: "bg-primary text-primary-foreground", emergency: false },
  DOCTOR_PRIMARY_CARE: { icon: Stethoscope, bg: "bg-primary/10 border-primary/40", text: "text-primary", badge: "bg-primary text-primary-foreground", emergency: false },
  TELEMEDICINE: { icon: Video, bg: "bg-accent/15 border-accent/50", text: "text-accent-foreground", badge: "bg-accent text-accent-foreground", emergency: false },
  SCHEDULED_CARE: { icon: CalendarClock, bg: "bg-muted border-border", text: "text-foreground", badge: "bg-secondary text-secondary-foreground", emergency: false },
  SELF_CARE_MONITORING: { icon: ShieldCheck, bg: "bg-muted border-border", text: "text-foreground", badge: "bg-secondary text-secondary-foreground", emergency: false },
};

interface NextStepCardProps {
  signal: NavigationSignal;
  className?: string;
}

/**
 * Explanation layer UI. Shows only: next action, urgency, safety net and
 * disclaimer. Never exposes internal reasoning or rule identifiers.
 */
export function NextStepCard({ signal, className }: NextStepCardProps) {
  const config = styles[signal.routing] ?? styles.SELF_CARE_MONITORING;
  const Icon = config.icon;

  const call = (n: string) => { window.location.href = `tel:${n}`; };

  return (
    <div className={cn("rounded-xl border-2 p-4 space-y-3 animate-fade-in", config.bg, className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-6 w-6 shrink-0 mt-0.5", config.text)} />
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Επόμενο βήμα</span>
            <Badge className={cn("text-xs font-bold", config.badge)}>
              {ROUTING_LABELS_EL[signal.routing]}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              Χρονικό πλαίσιο: {URGENCY_LABELS_EL[signal.urgency]}
            </Badge>
          </div>
          <p className={cn("text-sm font-medium", config.text)}>
            {ROUTING_DESCRIPTIONS_EL[signal.routing]}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Θεματική: {scenarioLabel(signal.scenario)}
          </p>
        </div>

      </div>

      {config.emergency && (
        <div className="flex gap-2">
          <Button size="sm" variant="destructive" className="flex-1 gap-2 font-bold" onClick={() => call("166")}>
            <Phone className="h-4 w-4" /> ΕΚΑΒ 166
          </Button>
          <Button size="sm" variant="destructive" className="flex-1 gap-2 font-bold" onClick={() => call("112")}>
            <Phone className="h-4 w-4" /> 112
          </Button>
        </div>
      )}

      {signal.safetyNet?.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Πότε να κλιμακώσετε</p>
          <ul className="space-y-1">
            {signal.safetyNet.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className={config.text}>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {signal.uncertainty !== "LOW" && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" />
          {UNCERTAINTY_LABELS_EL[signal.uncertainty]} — η πρόταση είναι συντηρητική για λόγους ασφάλειας.
        </p>
      )}

      <p className="text-[11px] leading-snug text-muted-foreground border-t border-border/50 pt-2">
        Πλοήγηση υγείας — δεν αποτελεί διάγνωση ούτε ιατρική συμβουλή. Δεν αντικαθιστά την εκτίμηση από επαγγελματία υγείας.
      </p>
    </div>
  );
}
