import { useEffect, useState } from "react";
import { ArrowLeft, Download, Trash2, Shield, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveConsents, recordConsent, type ActiveConsent, type ConsentType } from "@/lib/consent";
import { format } from "date-fns";
import { el } from "date-fns/locale";

const CONSENT_LABELS: Record<ConsentType, string> = {
  terms_of_service: "Όροι Χρήσης",
  privacy_policy: "Πολιτική Απορρήτου",
  health_data_processing: "Επεξεργασία Δεδομένων Υγείας",
  ai_processing: "AI Επεξεργασία",
  pilot_program: "Πιλοτικό Πρόγραμμα",
  insurance_data_share: "Διαμοιρασμός με Ασφαλιστική",
  physician_data_share: "Διαμοιρασμός με Γιατρό",
  marketing: "Marketing Επικοινωνίες",
  age_verification: "Επιβεβαίωση Ηλικίας",
};

export default function PrivacyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [consents, setConsents] = useState<ActiveConsent[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<{ scheduled_deletion_at: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    void load();
  }, [user]);

  async function load() {
    setLoading(true);
    const [c, d] = await Promise.all([
      getActiveConsents(),
      supabase
        .from("data_deletion_requests")
        .select("scheduled_deletion_at")
        .eq("status", "pending")
        .maybeSingle(),
    ]);
    setConsents(c);
    setPendingDeletion(d.data);
    setLoading(false);
  }

  async function handleRevoke(type: ConsentType) {
    try {
      await recordConsent({ type, granted: false });
      toast({ title: "Ανακλήθηκε", description: `Η συγκατάθεση ${CONSENT_LABELS[type]} ανακλήθηκε.` });
      void load();
    } catch {
      toast({ title: "Σφάλμα", description: "Δοκιμάστε ξανά.", variant: "destructive" });
    }
  }

  async function handleGrant(type: ConsentType) {
    try {
      await recordConsent({ type, granted: true });
      toast({ title: "Ενεργοποιήθηκε", description: `${CONSENT_LABELS[type]}.` });
      void load();
    } catch {
      toast({ title: "Σφάλμα", description: "Δοκιμάστε ξανά.", variant: "destructive" });
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-user-data", { body: {} });
      if (error) throw error;
      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medithos-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Εξαγωγή ολοκληρώθηκε", description: "Τα δεδομένα σας κατέβηκαν." });
    } catch (e) {
      toast({ title: "Σφάλμα εξαγωγής", description: "Δοκιμάστε ξανά.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  async function handleRequestDeletion() {
    if (deleteConfirm !== "ΔΙΑΓΡΑΦΗ") {
      toast({ title: "Λάθος επιβεβαίωση", description: "Πληκτρολογήστε ακριβώς ΔΙΑΓΡΑΦΗ.", variant: "destructive" });
      return;
    }
    setDeleting(true);
    try {
      const { error } = await supabase.rpc("request_account_deletion", { _reason: null });
      if (error) throw error;
      toast({
        title: "Αίτημα καταχωρήθηκε",
        description: "Ο λογαριασμός σας θα διαγραφεί οριστικά σε 30 ημέρες.",
      });
      setDeleteOpen(false);
      setDeleteConfirm("");
      void load();
    } catch (e) {
      toast({ title: "Σφάλμα", description: "Δοκιμάστε ξανά.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  async function handleCancelDeletion() {
    try {
      const { error } = await supabase.rpc("cancel_account_deletion");
      if (error) throw error;
      toast({ title: "Ακυρώθηκε", description: "Το αίτημα διαγραφής ακυρώθηκε." });
      void load();
    } catch {
      toast({ title: "Σφάλμα", description: "Δοκιμάστε ξανά.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Τα δεδομένα μου</h1>
            <p className="text-xs text-muted-foreground">Δικαιώματα GDPR (Άρθρα 15–22)</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        {pendingDeletion && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle className="text-base">Εκκρεμεί διαγραφή λογαριασμού</CardTitle>
              </div>
              <CardDescription>
                Ο λογαριασμός σας θα διαγραφεί οριστικά στις{" "}
                <strong>{format(new Date(pendingDeletion.scheduled_deletion_at), "PPP", { locale: el })}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCancelDeletion} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Ακύρωση αιτήματος
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Εξαγωγή δεδομένων</CardTitle>
            </div>
            <CardDescription>
              Άρθρο 20 GDPR — Λάβετε όλα τα δεδομένα σας σε JSON μορφή.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={exporting} className="gap-2">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Κατέβασμα όλων των δεδομένων
            </Button>
          </CardContent>
        </Card>

        {/* Consents */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Διαχείριση συγκαταθέσεων</CardTitle>
            </div>
            <CardDescription>Άρθρο 7 GDPR — Ανακαλέστε ή ενεργοποιήστε επιμέρους συγκαταθέσεις.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : consents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Δεν υπάρχουν καταγεγραμμένες συγκαταθέσεις.</p>
            ) : (
              consents.map((c) => (
                <div key={c.type} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{CONSENT_LABELS[c.type] ?? c.type}</span>
                      {c.granted ? (
                        <Badge variant="default" className="text-[10px]">Ενεργή</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Ανακλημένη</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.granted ? "Δόθηκε" : "Ανακλήθηκε"}: {format(new Date(c.granted_at), "Pp", { locale: el })} · v{c.version}
                    </p>
                  </div>
                  {c.granted ? (
                    <Button size="sm" variant="outline" onClick={() => handleRevoke(c.type)}>
                      Ανάκληση
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleGrant(c.type)}>
                      Ενεργοποίηση
                    </Button>
                  )}
                </div>
              ))
            )}
            <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
              Σημείωση: Η ανάκληση της συγκατάθεσης για δεδομένα υγείας ή AI επεξεργασία περιορίζει τη λειτουργικότητα της εφαρμογής.
            </p>
          </CardContent>
        </Card>

        {/* Deletion */}
        {!pendingDeletion && (
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <CardTitle className="text-base">Διαγραφή λογαριασμού</CardTitle>
              </div>
              <CardDescription>
                Άρθρο 17 GDPR — Δικαίωμα στη λήθη. Ο λογαριασμός θα διαγραφεί οριστικά μετά από 30 ημέρες (περίοδος χάριτος).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDeleteOpen(true)} variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Διαγραφή λογαριασμού
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Επιβεβαίωση διαγραφής</AlertDialogTitle>
            <AlertDialogDescription>
              Όλα τα προσωπικά σας δεδομένα, ιατρικά αρχεία και αρχεία θα διαγραφούν οριστικά μετά από 30 ημέρες.
              Μπορείτε να ακυρώσετε το αίτημα οποιαδήποτε στιγμή πριν τη λήξη.
              <br /><br />
              Πληκτρολογήστε <strong>ΔΙΑΓΡΑΦΗ</strong> για επιβεβαίωση:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm">Επιβεβαίωση</Label>
            <Input
              id="confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="ΔΙΑΓΡΑΦΗ"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestDeletion}
              disabled={deleting || deleteConfirm !== "ΔΙΑΓΡΑΦΗ"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Επιβεβαίωση διαγραφής
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
