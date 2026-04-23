import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PatternInsightCard } from "./PatternInsightCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Insight {
  pattern_type: "health_anxiety" | "real_concern" | "mixed" | "normal";
  confidence: number;
  ai_summary: string;
  empathetic_message: string;
  ai_recommendation: string;
  search_count_7d: number;
  recurring_symptoms: string[];
  generated_at: string;
}

interface Props {
  /** If true, automatically request a fresh analysis when none exists or it's old (>24h). */
  autoAnalyze?: boolean;
  /** Compact card variant (used inline in symptom assistant). */
  compact?: boolean;
}

export const PatternInsightWidget = ({ autoAnalyze = true, compact = false }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLatest = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("symptom_pattern_insights")
      .select("*")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setInsight(data as unknown as Insight);
    return data;
  };

  const runAnalysis = async () => {
    if (!user || loading) return;
    // Ensure we have an active session token before invoking (avoids 401 from anon-only requests)
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.access_token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptom-patterns", {
        body: {},
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });
      if (error) throw error;
      setInsight({
        pattern_type: data.pattern_type,
        confidence: data.confidence,
        ai_summary: data.ai_summary,
        empathetic_message: data.empathetic_message,
        ai_recommendation: data.ai_recommendation,
        search_count_7d: data.signals?.search_count_7d ?? 0,
        recurring_symptoms: data.signals?.recurring_symptoms ?? [],
        generated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const latest = await fetchLatest();
      if (autoAnalyze) {
        const stale = !latest || (Date.now() - new Date((latest as any).generated_at).getTime() > 24 * 3600 * 1000);
        if (stale) await runAnalysis();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  if (loading && !insight) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <div>
            <p className="text-sm font-medium">Αναλύω τα μοτίβα σας...</p>
            <p className="text-xs text-muted-foreground">Το AI εξετάζει το ιστορικό αναζητήσεων</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insight) {
    if (compact) return null;
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm">Δεν υπάρχει ακόμα ανάλυση μοτίβων.</span>
          </div>
          <Button size="sm" variant="outline" onClick={runAnalysis}>
            Ανάλυση
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <PatternInsightCard
        pattern_type={insight.pattern_type}
        confidence={insight.confidence}
        ai_summary={insight.ai_summary}
        empathetic_message={insight.empathetic_message}
        ai_recommendation={insight.ai_recommendation}
        search_count_7d={insight.search_count_7d}
        recurring_symptoms={insight.recurring_symptoms}
        onAction={() => {
          if (insight.pattern_type === "real_concern" || insight.pattern_type === "mixed") {
            navigate("/providers");
          } else {
            navigate("/preventive");
          }
        }}
      />
      {!compact && (
        <Button
          size="sm"
          variant="ghost"
          className="text-xs h-7 w-full"
          onClick={runAnalysis}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
          Νέα ανάλυση
        </Button>
      )}
    </div>
  );
};
