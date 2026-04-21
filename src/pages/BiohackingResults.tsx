import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { ScoreGauge } from "@/components/biohacking/ScoreGauge";
import { BiohackingDisclaimer } from "@/components/biohacking/BiohackingDisclaimer";
import { PERSONAS } from "@/components/biohacking/constants";
import { toast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  sleep_score: number | null;
  energy_score: number | null;
  stress_score: number | null;
  overall_performance_score: number | null;
  persona_tag: string | null;
  key_findings: any;
  priority_domains: string[] | null;
}

export default function BiohackingResults() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!assessmentId) return;
    (async () => {
      const { data, error } = await supabase
        .from("biohacking_assessments")
        .select("id, sleep_score, energy_score, stress_score, overall_performance_score, persona_tag, key_findings, priority_domains")
        .eq("id", assessmentId)
        .maybeSingle();
      if (error) console.error(error);
      setAssessment(data as Assessment);
      setLoading(false);
    })();
  }, [assessmentId]);

  const generateProtocol = async () => {
    if (!assessmentId) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-biohacking-protocol",
        { body: { assessment_id: assessmentId, duration_weeks: 8 } }
      );
      if (error) throw error;
      navigate(`/biohacking/protocol/${data.protocol_id}`);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Σφάλμα", description: e.message ?? "Δοκιμάστε ξανά.", variant: "destructive" });
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Δεν βρέθηκε το assessment.</p>
        <Button onClick={() => navigate("/biohacking/assessment")} className="mt-4">Νέο Assessment</Button>
      </div>
    );
  }

  const persona = assessment.persona_tag ? PERSONAS[assessment.persona_tag] : null;
  const findings: string[] = Array.isArray(assessment.key_findings?.findings)
    ? assessment.key_findings.findings
    : [];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-5">
      <header className="space-y-3">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Πίσω
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Τα Αποτελέσματά σου</h1>
        </div>
        <BiohackingDisclaimer />
      </header>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <ScoreGauge label="Ύπνος" emoji="🌙" score={assessment.sleep_score} />
            <ScoreGauge label="Ενέργεια" emoji="⚡" score={assessment.energy_score} />
            <ScoreGauge label="Stress" emoji="🧘" score={assessment.stress_score} />
          </div>
          <div className="border-t border-border pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Συνολική Απόδοση</p>
            <p className="text-4xl font-bold text-primary">
              {assessment.overall_performance_score ?? "—"}<span className="text-lg text-muted-foreground">/100</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {persona && (
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Persona</p>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{persona.emoji}</span>
              {persona.label}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {assessment.key_findings?.persona_description ?? persona.description}
            </p>
          </CardContent>
        </Card>
      )}

      {findings.length > 0 && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold">Τι μας λένε τα δεδομένα σου</h3>
            <ul className="space-y-2">
              {findings.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Button className="w-full" size="lg" onClick={generateProtocol} disabled={generating}>
        {generating ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Δημιουργία πρωτοκόλλου...</>
        ) : (
          <>Δες το πρωτόκολλό σου <ArrowRight className="h-4 w-4 ml-1" /></>
        )}
      </Button>
    </div>
  );
}
