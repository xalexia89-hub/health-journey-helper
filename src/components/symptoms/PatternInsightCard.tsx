import { Card, CardContent } from "@/components/ui/card";
import { Heart, Activity, AlertCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PatternInsightCardProps {
  pattern_type: "health_anxiety" | "real_concern" | "mixed" | "normal";
  confidence: number;
  ai_summary?: string;
  empathetic_message?: string;
  ai_recommendation?: string;
  search_count_7d?: number;
  recurring_symptoms?: string[];
  onDismiss?: () => void;
  onAction?: () => void;
}

const config = {
  health_anxiety: {
    icon: Heart,
    label: "Άγχος υγείας",
    color: "from-amber-500/15 to-rose-500/10 border-amber-500/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    actionLabel: "Δείτε τεχνικές ηρεμίας",
  },
  real_concern: {
    icon: AlertCircle,
    label: "Πιθανό κλινικό θέμα",
    color: "from-rose-500/15 to-red-500/10 border-rose-500/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    actionLabel: "Κλείστε ραντεβού",
  },
  mixed: {
    icon: Activity,
    label: "Μικτό μοτίβο",
    color: "from-violet-500/15 to-indigo-500/10 border-violet-500/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    actionLabel: "Δείτε προτάσεις",
  },
  normal: {
    icon: Sparkles,
    label: "Φυσιολογική χρήση",
    color: "from-emerald-500/15 to-teal-500/10 border-emerald-500/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    actionLabel: "Συνεχίστε",
  },
};

export const PatternInsightCard = ({
  pattern_type,
  confidence,
  ai_summary,
  empathetic_message,
  ai_recommendation,
  search_count_7d,
  recurring_symptoms,
  onDismiss,
  onAction,
}: PatternInsightCardProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const c = config[pattern_type] ?? config.normal;
  const Icon = c.icon;

  return (
    <Card className={`bg-gradient-to-br ${c.color} relative overflow-hidden`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-background/50 ${c.iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">AI Pattern Insight</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.badge}`}>
                  {c.label}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Εμπιστοσύνη: {Math.round(confidence * 100)}%
                {search_count_7d !== undefined && ` · ${search_count_7d} αναζητήσεις τις τελευταίες 7 μέρες`}
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-1 -mt-1"
              onClick={() => {
                setDismissed(true);
                onDismiss?.();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {empathetic_message && (
          <p className="text-sm leading-relaxed">{empathetic_message}</p>
        )}

        {ai_summary && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-current/20 pl-2">
            {ai_summary}
          </p>
        )}

        {recurring_symptoms && recurring_symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] text-muted-foreground">Επαναλαμβανόμενα:</span>
            {recurring_symptoms.slice(0, 4).map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/60">
                {s}
              </span>
            ))}
          </div>
        )}

        {ai_recommendation && (
          <div className="bg-background/50 rounded-lg p-2.5 text-xs">
            <span className="font-medium">💡 Πρόταση: </span>
            {ai_recommendation}
          </div>
        )}

        {onAction && pattern_type !== "normal" && (
          <Button size="sm" variant="secondary" className="w-full" onClick={onAction}>
            {c.actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
