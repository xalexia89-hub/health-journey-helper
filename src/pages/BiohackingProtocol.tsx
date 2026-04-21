import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, AlertTriangle, Sparkles, Calendar } from "lucide-react";
import { BiohackingDisclaimer } from "@/components/biohacking/BiohackingDisclaimer";
import { TIER_LABELS, EVIDENCE_LABELS, DOMAIN_ICONS } from "@/components/biohacking/constants";

interface Protocol {
  id: string;
  title: string;
  duration_weeks: number;
  domains: string[];
  start_date: string;
  end_date: string;
  protocol_data: any;
  ai_reasoning: string | null;
}

interface Intervention {
  id: string;
  domain: string;
  tier: number;
  title: string;
  description: string | null;
  mechanism: string | null;
  evidence_level: string | null;
  frequency: string | null;
  duration_minutes: number | null;
  week_start: number;
  week_end: number;
  is_mandatory: boolean;
  contraindications: string[] | null;
}

export default function BiohackingProtocol() {
  const { protocolId } = useParams<{ protocolId: string }>();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!protocolId) return;
    (async () => {
      const [pRes, iRes] = await Promise.all([
        supabase.from("biohacking_protocols").select("*").eq("id", protocolId).maybeSingle(),
        supabase.from("protocol_interventions").select("*").eq("protocol_id", protocolId).order("tier").order("week_start"),
      ]);
      if (pRes.error) console.error(pRes.error);
      if (iRes.error) console.error(iRes.error);
      setProtocol(pRes.data as Protocol);
      setInterventions((iRes.data as Intervention[]) ?? []);
      setLoading(false);
    })();
  }, [protocolId]);

  const phaseGroups = useMemo(() => {
    const phases = [
      { key: "foundation", label: "Φάση 1 · Foundation", weeks: "Εβδ. 1-2", filter: (i: Intervention) => i.week_start <= 2 },
      { key: "build", label: "Φάση 2 · Build", weeks: "Εβδ. 3-5", filter: (i: Intervention) => i.week_start >= 3 && i.week_start <= 5 },
      { key: "optimize", label: "Φάση 3 · Optimize", weeks: "Εβδ. 6-8", filter: (i: Intervention) => i.week_start >= 6 },
    ];
    return phases.map((p) => ({ ...p, items: interventions.filter(p.filter) }));
  }, [interventions]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Δεν βρέθηκε πρωτόκολλο.</p>
        <Button onClick={() => navigate("/biohacking/assessment")} className="mt-4">Νέο Assessment</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-5">
      <header className="space-y-3">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Πίσω
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold leading-tight">{protocol.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{protocol.duration_weeks} εβδομάδες · {protocol.domains.join(" · ")}</span>
        </div>
        <BiohackingDisclaimer />
      </header>

      {protocol.protocol_data?.summary && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm">{protocol.protocol_data.summary}</p>
            {protocol.ai_reasoning && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Γιατί αυτό το πρωτόκολλο;</summary>
                <p className="mt-2 leading-relaxed">{protocol.ai_reasoning}</p>
              </details>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="foundation" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {phaseGroups.map((p) => (
            <TabsTrigger key={p.key} value={p.key} className="text-xs">
              {p.weeks}
            </TabsTrigger>
          ))}
        </TabsList>
        {phaseGroups.map((p) => (
          <TabsContent key={p.key} value={p.key} className="space-y-3 mt-4">
            <h2 className="text-sm font-semibold text-muted-foreground">{p.label}</h2>
            {p.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Καμία παρέμβαση σε αυτή τη φάση.</p>
            ) : (
              p.items.map((i) => <InterventionCard key={i.id} item={i} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function InterventionCard({ item }: { item: Intervention }) {
  const tier = TIER_LABELS[item.tier];
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-xl">{DOMAIN_ICONS[item.domain] ?? "•"}</span>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight">{item.title}</h3>
              {item.frequency && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.frequency}{item.duration_minutes ? ` · ${item.duration_minutes}'` : ""}</p>
              )}
            </div>
          </div>
          <Badge className={tier.color} variant="secondary">{tier.label}</Badge>
        </div>

        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}

        {item.mechanism && (
          <div className="text-xs bg-muted/50 rounded-md p-2">
            <span className="font-semibold">Γιατί λειτουργεί: </span>
            <span className="text-muted-foreground">{item.mechanism}</span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {item.evidence_level && (
            <Badge variant="outline" className="text-xs">
              Τεκμηρίωση: {EVIDENCE_LABELS[item.evidence_level]}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">Εβδ. {item.week_start}-{item.week_end}</Badge>
        </div>

        {item.tier === 2 && (
          <div className="flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-md p-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Συμβουλευτείτε γιατρό αν λαμβάνετε φάρμακα.</span>
          </div>
        )}

        {item.tier === 3 && (
          <div className="flex gap-2 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-md p-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Απαιτεί ιατρική παρακολούθηση από εξειδικευμένο επαγγελματία.</span>
          </div>
        )}

        {item.contraindications && item.contraindications.length > 0 && (
          <div className="text-xs text-muted-foreground border-t border-border pt-2">
            <span className="font-semibold">Αντενδείξεις: </span>
            {item.contraindications.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
