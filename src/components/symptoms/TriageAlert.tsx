import { Phone, AlertTriangle, Clock, ShieldCheck, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TriageInfo {
  code: "CODE_RED" | "CODE_ORANGE" | "CODE_YELLOW" | "CODE_GREEN";
  confidence: number;
  triggers: string;
}

// Parse triage code from AI response
export function parseTriageCode(content: string): TriageInfo | null {
  const match = content.match(/\[TRIAGE_CODE\]([\s\S]*?)\[\/TRIAGE_CODE\]/);
  if (!match) return null;

  const block = match[1];
  const codeMatch = block.match(/code:\s*(CODE_RED|CODE_ORANGE|CODE_YELLOW|CODE_GREEN)/i);
  const confMatch = block.match(/confidence:\s*([\d.]+)/i);
  const triggerMatch = block.match(/triggers:\s*(.+)/i);

  if (!codeMatch) return null;

  return {
    code: codeMatch[1].toUpperCase() as TriageInfo["code"],
    confidence: confMatch ? parseFloat(confMatch[1]) : 0.5,
    triggers: triggerMatch ? triggerMatch[1].trim() : "",
  };
}

// Remove triage block from display text
export function cleanTriageContent(content: string): string {
  return content.replace(/\[TRIAGE_CODE\][\s\S]*?\[\/TRIAGE_CODE\]/g, "").trim();
}

const triageConfig = {
  CODE_RED: {
    label: "🚨 ΕΚΤΑΚΤΗ ΑΝΑΓΚΗ",
    description: "Καλέστε ασθενοφόρο ΑΜΕΣΑ",
    bg: "bg-red-600/20 border-red-500",
    text: "text-red-500",
    badgeBg: "bg-red-600 text-white",
    icon: Siren,
    showEmergencyButtons: true,
  },
  CODE_ORANGE: {
    label: "⚠️ ΕΠΕΙΓΟΝ",
    description: "Απαιτείται άμεση ιατρική εξέταση",
    bg: "bg-orange-500/20 border-orange-400",
    text: "text-orange-400",
    badgeBg: "bg-orange-500 text-white",
    icon: AlertTriangle,
    showEmergencyButtons: true,
  },
  CODE_YELLOW: {
    label: "📋 ΕΚΤΙΜΗΣΗ 24H",
    description: "Προγραμματίστε ραντεβού σήμερα",
    bg: "bg-yellow-500/15 border-yellow-400/50",
    text: "text-yellow-500",
    badgeBg: "bg-yellow-500 text-white",
    icon: Clock,
    showEmergencyButtons: false,
  },
  CODE_GREEN: {
    label: "✅ ΑΥΤΟΦΡΟΝΤΙΔΑ",
    description: "Χαμηλός κίνδυνος — παρακολουθήστε",
    bg: "bg-green-500/15 border-green-400/50",
    text: "text-green-500",
    badgeBg: "bg-green-600 text-white",
    icon: ShieldCheck,
    showEmergencyButtons: false,
  },
};

interface TriageAlertProps {
  triage: TriageInfo;
  className?: string;
}

export function TriageAlert({ triage, className }: TriageAlertProps) {
  const config = triageConfig[triage.code];
  const Icon = config.icon;

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 space-y-3 animate-fade-in",
        config.bg,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6 shrink-0", config.text)} />
        <div className="flex-1">
          <Badge className={cn("text-sm font-bold", config.badgeBg)}>
            {config.label}
          </Badge>
          <p className={cn("text-sm mt-1 font-medium", config.text)}>
            {config.description}
          </p>
        </div>
      </div>

      {triage.triggers && (
        <p className="text-xs text-muted-foreground">
          {triage.triggers}
        </p>
      )}

      {config.showEmergencyButtons && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 gap-2 font-bold text-sm"
            onClick={() => handleCall("166")}
          >
            <Phone className="h-4 w-4" />
            Κλήση ΕΚΑΒ 166
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 gap-2 font-bold text-sm"
            onClick={() => handleCall("112")}
          >
            <Phone className="h-4 w-4" />
            Κλήση 112
          </Button>
        </div>
      )}

      {triage.code === "CODE_RED" && (
        <div className="text-xs text-red-400/80 font-medium text-center pt-1">
          Ψυχολογική Υποστήριξη: 1018
        </div>
      )}
    </div>
  );
}
