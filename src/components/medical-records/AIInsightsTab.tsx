import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  FileText,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedValue {
  name: string;
  value: string;
  unit?: string;
  reference_range?: string;
  status: "normal" | "low" | "high" | "unknown";
}

interface Flag {
  label: string;
  severity: "info" | "warning" | "critical";
  explanation: string;
}

interface Analysis {
  id: string;
  document_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  document_kind: string | null;
  summary: string | null;
  plain_explanation: string | null;
  extracted_values: ExtractedValue[];
  flags: Flag[];
  recommendations: string[];
  disclaimer: string;
  error_message: string | null;
  created_at: string;
  // joined
  file_name?: string;
  category?: string | null;
}

const KIND_LABELS: Record<string, string> = {
  blood_test: "Εξέταση αίματος",
  imaging: "Απεικονιστικό",
  prescription: "Συνταγή",
  diagnosis_report: "Γνωμάτευση",
  other: "Άλλο",
};

export function AIInsightsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    if (!user) return;
    setLoading(true);
    const { data: analyses } = await supabase
      .from("medical_document_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!analyses) {
      setItems([]);
      setLoading(false);
      return;
    }

    const docIds = analyses.map((a) => a.document_id);
    const { data: docs } = await supabase
      .from("medical_documents")
      .select("id, file_name, document_category")
      .in("id", docIds);

    const docMap = new Map(docs?.map((d) => [d.id, d]) || []);
    setItems(
      analyses.map((a) => ({
        ...(a as any),
        file_name: docMap.get(a.document_id)?.file_name,
        category: docMap.get(a.document_id)?.document_category,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalyses();

    if (!user) return;
    // Realtime updates while a doc is being processed
    const ch = supabase
      .channel("mda-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medical_document_analyses",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchAnalyses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const reanalyze = async (documentId: string) => {
    setReanalyzing(documentId);
    try {
      const { error } = await supabase.functions.invoke(
        "analyze-medical-document",
        { body: { document_id: documentId } }
      );
      if (error) throw error;
      toast({ title: "Επανανάλυση ξεκίνησε" });
      fetchAnalyses();
    } catch (err: any) {
      toast({
        title: "Σφάλμα",
        description: err.message || "Η ανάλυση απέτυχε.",
        variant: "destructive",
      });
    } finally {
      setReanalyzing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-3">
          <Sparkles className="h-10 w-10 text-primary mx-auto" />
          <p className="font-medium">Καμία AI ανάλυση ακόμα</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Ανεβάστε ένα έγγραφο εξετάσεων ή γνωμάτευσης και θα εμφανιστεί εδώ
            αυτόματη ανάλυση σε απλά Ελληνικά.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Aggregate flags across all completed analyses
  const allFlags = items
    .filter((i) => i.status === "completed")
    .flatMap((i) =>
      (i.flags || []).map((f) => ({ ...f, doc: i.file_name || "Έγγραφο" }))
    );
  const criticalCount = allFlags.filter((f) => f.severity === "critical").length;
  const warningCount = allFlags.filter((f) => f.severity === "warning").length;

  return (
    <div className="space-y-4">
      {/* Disclaimer banner */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-3 flex gap-3 items-start">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Οι αναλύσεις είναι <strong>πληροφοριακές</strong> και ΔΕΝ αποτελούν
            ιατρική διάγνωση. Συμβουλευτείτε πάντα γιατρό για ερμηνεία και
            θεραπεία.
          </p>
        </CardContent>
      </Card>

      {/* Summary tiles */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {criticalCount > 0 && (
            <Card className="border-destructive/40">
              <CardContent className="py-3">
                <p className="text-2xl font-bold text-destructive">
                  {criticalCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Κρίσιμες επισημάνσεις
                </p>
              </CardContent>
            </Card>
          )}
          {warningCount > 0 && (
            <Card className="border-amber-500/40">
              <CardContent className="py-3">
                <p className="text-2xl font-bold text-amber-600">
                  {warningCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Προσοχή χρειάζεται
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Accordion type="single" collapsible className="space-y-2">
        {items.map((a) => (
          <AccordionItem
            key={a.id}
            value={a.id}
            className="border rounded-lg px-3 bg-card"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <div className="p-2 rounded bg-primary/10 flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">
                    {a.file_name || "Έγγραφο"}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {a.document_kind && (
                      <Badge variant="outline" className="text-[10px] h-5">
                        {KIND_LABELS[a.document_kind] || a.document_kind}
                      </Badge>
                    )}
                    {a.status === "processing" && (
                      <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Ανάλυση...
                      </Badge>
                    )}
                    {a.status === "failed" && (
                      <Badge variant="destructive" className="text-[10px] h-5">
                        Απέτυχε
                      </Badge>
                    )}
                    {a.flags?.some((f) => f.severity === "critical") && (
                      <Badge variant="destructive" className="text-[10px] h-5 gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Κρίσιμο
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              {a.status === "failed" && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>{a.error_message || "Η ανάλυση απέτυχε."}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reanalyze(a.document_id)}
                    disabled={reanalyzing === a.document_id}
                  >
                    {reanalyzing === a.document_id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1" />
                    )}
                    Δοκιμή ξανά
                  </Button>
                </div>
              )}

              {a.status === "processing" && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Η AI αναλύει το έγγραφο...
                </p>
              )}

              {a.status === "completed" && (
                <>
                  {a.summary && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Σύνοψη
                      </p>
                      <p className="text-sm">{a.summary}</p>
                    </div>
                  )}

                  {a.plain_explanation && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Σε απλά Ελληνικά
                      </p>
                      <p className="text-sm whitespace-pre-wrap">
                        {a.plain_explanation}
                      </p>
                    </div>
                  )}

                  {a.flags && a.flags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        Επισημάνσεις
                      </p>
                      <div className="space-y-1.5">
                        {a.flags.map((f, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 p-2 rounded-md text-sm ${
                              f.severity === "critical"
                                ? "bg-destructive/10 border border-destructive/30"
                                : f.severity === "warning"
                                ? "bg-amber-500/10 border border-amber-500/30"
                                : "bg-muted/50 border border-border"
                            }`}
                          >
                            {f.severity === "critical" ? (
                              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                            ) : f.severity === "warning" ? (
                              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{f.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {f.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {a.extracted_values && a.extracted_values.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        Τιμές που εντοπίστηκαν
                      </p>
                      <ScrollArea className="max-h-48">
                        <div className="space-y-1">
                          {a.extracted_values.map((v, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-muted/40 text-xs"
                            >
                              <span className="font-medium truncate">
                                {v.name}
                              </span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span>
                                  {v.value} {v.unit || ""}
                                </span>
                                {v.reference_range && (
                                  <span className="text-muted-foreground hidden sm:inline">
                                    ({v.reference_range})
                                  </span>
                                )}
                                {v.status === "high" && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 px-1 border-amber-500/50 text-amber-600"
                                  >
                                    Υψηλό
                                  </Badge>
                                )}
                                {v.status === "low" && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 px-1 border-blue-500/50 text-blue-600"
                                  >
                                    Χαμηλό
                                  </Badge>
                                )}
                                {v.status === "normal" && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {a.recommendations && a.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Συστάσεις
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {a.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => reanalyze(a.document_id)}
                    disabled={reanalyzing === a.document_id}
                    className="text-xs"
                  >
                    {reanalyzing === a.document_id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1" />
                    )}
                    Επανανάλυση
                  </Button>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
