import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, ShieldAlert, Activity, HelpCircle, Compass } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { ROUTING_LABELS_EL, URGENCY_LABELS_EL, UNCERTAINTY_LABELS_EL, scenarioLabel, missingInfoLabel, type NavigationSignal, type RoutingCategory } from "@/lib/healthNavigation";

interface RuleHit { id: string; label: string }

interface AuditEvent {
  id: string;
  scenario: string;
  routing_category: string;
  urgency: string;
  uncertainty: string;
  red_flags: RuleHit[];
  relationships: RuleHit[];
  missing_critical_info: string[];
  questions_asked: string[];
  context_used: Record<string, unknown>;
  routing_reason: string | null;
  emergency_triggered: boolean;
  created_at: string;
}

const urgencyVariant: Record<string, string> = {
  emergency: "bg-destructive text-destructive-foreground",
  urgent: "bg-warning text-warning-foreground",
  soon: "bg-primary text-primary-foreground",
  routine: "bg-secondary text-secondary-foreground",
};

/**
 * Developer / admin view of the Systemic Health Navigation reasoning layer.
 * Shows structured outputs only — never model chain-of-thought.
 */
export default function AdminNavigationAudit() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AuditEvent | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("navigation_audit_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      setEvents((data ?? []) as unknown as AuditEvent[]);
    } catch (e) {
      console.error(e);
      toast.error("Σφάλμα κατά τη φόρτωση των audit events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const emergencies = events.filter((e) => e.emergency_triggered).length;
  const highUncertainty = events.filter((e) => e.uncertainty === "HIGH").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            Πλοήγηση Υγείας — Έλεγχος Συλλογιστικής
          </h1>
          <p className="text-sm text-muted-foreground">
            Δομημένα αποτελέσματα του επιπέδου πλοήγησης υγείας (χωρίς εσωτερική συλλογιστική μοντέλου).
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading} className="gap-2">
          <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Ανανέωση
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4" /> Συνολικές καταγραφές</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{events.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Διαδρομή έκτακτης ανάγκης</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-destructive">{emergencies}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Υψηλή αβεβαιότητα</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{highUncertainty}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Αποφάσεις Δρομολόγησης</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ημερομηνία</TableHead>
                <TableHead>Σενάριο</TableHead>
                <TableHead>Δρομολόγηση</TableHead>
                <TableHead>Επείγον</TableHead>
                <TableHead>Αβεβαιότητα</TableHead>
                <TableHead>Κανόνες ασφαλείας</TableHead>
                <TableHead>Ελλείπουσες πληροφορίες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => setSelected(e)}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {format(new Date(e.created_at), "dd/MM/yyyy HH:mm", { locale: el })}
                  </TableCell>
                  <TableCell className="text-xs">{scenarioLabel(e.scenario)}</TableCell>
                  <TableCell className="text-xs">
                    {ROUTING_LABELS_EL[e.routing_category as RoutingCategory] ?? e.routing_category}
                  </TableCell>
                  <TableCell>
                    <Badge className={urgencyVariant[e.urgency] ?? ""}>{URGENCY_LABELS_EL[e.urgency as NavigationSignal["urgency"]] ?? e.urgency}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{UNCERTAINTY_LABELS_EL[e.uncertainty as NavigationSignal["uncertainty"]] ?? e.uncertainty}</TableCell>
                  <TableCell className="text-xs">{e.red_flags?.length ?? 0}</TableCell>
                  <TableCell className="text-xs">{e.missing_critical_info?.length ?? 0}</TableCell>
                </TableRow>
              ))}
              {!loading && events.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">Δεν υπάρχουν εγγραφές ακόμη.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="text-base">
              Λεπτομέρειες απόφασης — {format(new Date(selected.created_at), "dd/MM/yyyy HH:mm:ss", { locale: el })}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
            <section>
              <h3 className="font-semibold mb-1">Πλαίσιο ασθενούς (συγκεντρωτικά)</h3>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {JSON.stringify(selected.context_used, null, 2)}
              </pre>
            </section>
            <section>
              <h3 className="font-semibold mb-1">Κανόνες ασφαλείας που ενεργοποιήθηκαν</h3>
              <ul className="text-xs space-y-1">
                {(selected.red_flags ?? []).map((r) => <li key={r.id}>• {r.label}</li>)}
                {(selected.red_flags ?? []).length === 0 && <li className="text-muted-foreground">Κανένας κανόνας</li>}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold mb-1">Σχέσεις κινδύνου (συνδυασμοί)</h3>
              <ul className="text-xs space-y-1">
                {(selected.relationships ?? []).map((r) => <li key={r.id}>• {r.label}</li>)}
                {(selected.relationships ?? []).length === 0 && <li className="text-muted-foreground">Καμία</li>}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold mb-1">Κρίσιμες ελλείπουσες πληροφορίες</h3>
              <ul className="text-xs space-y-1">
                {(selected.missing_critical_info ?? []).map((m) => <li key={m}>• {missingInfoLabel(m)}</li>)}
                {(selected.missing_critical_info ?? []).length === 0 && <li className="text-muted-foreground">Καμία</li>}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold mb-1">Ερωτήσεις που τέθηκαν</h3>
              <ul className="text-xs space-y-1">
                {(selected.questions_asked ?? []).map((q) => <li key={q}>• {q}</li>)}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold mb-1">Απόφαση δρομολόγησης</h3>
              <p className="text-xs">
                {ROUTING_LABELS_EL[selected.routing_category as RoutingCategory] ?? selected.routing_category} · {URGENCY_LABELS_EL[selected.urgency as NavigationSignal["urgency"]] ?? selected.urgency} · αβεβαιότητα: {UNCERTAINTY_LABELS_EL[selected.uncertainty as NavigationSignal["uncertainty"]] ?? selected.uncertainty}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Αιτιολόγηση: {selected.routing_reason || "—"}</p>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
