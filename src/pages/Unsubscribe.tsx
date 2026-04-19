import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, MailX } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "validating" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid"; message: string }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "validating" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid", message: "Λείπει το token από το link." });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setState({ kind: "invalid", message: data.error || "Μη έγκυρο link." });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ kind: "already" });
          return;
        }
        if (data.valid) {
          setState({ kind: "valid" });
          return;
        }
        setState({ kind: "invalid", message: "Μη έγκυρο link." });
      } catch (e) {
        setState({ kind: "error", message: "Σφάλμα δικτύου. Δοκιμάστε ξανά." });
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) {
      setState({ kind: "error", message: "Δεν ήταν δυνατή η απεγγραφή." });
      return;
    }
    if (data?.success || data?.reason === "already_unsubscribed") {
      setState({ kind: "done" });
    } else {
      setState({ kind: "error", message: "Δεν ήταν δυνατή η απεγγραφή." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <MailX className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Απεγγραφή από emails</CardTitle>
          <CardDescription>Medithos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {state.kind === "validating" && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Έλεγχος συνδέσμου...
            </div>
          )}

          {state.kind === "valid" && (
            <>
              <p className="text-sm text-muted-foreground">
                Επιβεβαιώστε ότι θέλετε να σταματήσετε να λαμβάνετε emails από το Medithos.
              </p>
              <Button onClick={handleConfirm} className="w-full">
                Επιβεβαίωση απεγγραφής
              </Button>
            </>
          )}

          {state.kind === "submitting" && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Επεξεργασία...
            </div>
          )}

          {state.kind === "done" && (
            <div className="space-y-2">
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
              <p className="text-sm">Έχετε απεγγραφεί επιτυχώς. Δεν θα λαμβάνετε άλλα emails.</p>
            </div>
          )}

          {state.kind === "already" && (
            <div className="space-y-2">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Έχετε ήδη απεγγραφεί.</p>
            </div>
          )}

          {(state.kind === "invalid" || state.kind === "error") && (
            <div className="space-y-2">
              <XCircle className="h-10 w-10 text-destructive mx-auto" />
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
