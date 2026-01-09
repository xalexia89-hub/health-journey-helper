import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Shield, 
  Download, 
  Trash2, 
  XCircle, 
  Loader2,
  FileDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const CONSENT_KEY = "medithos_pilot_consent_v1";
const AGE_KEY = "medithos_age_confirmed_v1";

export function GDPRSection() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleRevokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(AGE_KEY);
    toast({
      title: "Συγκατάθεση Ανακλήθηκε",
      description: "Θα αποσυνδεθείτε και θα πρέπει να αποδεχτείτε ξανά τους όρους για να συνεχίσετε."
    });
    signOut();
    navigate('/');
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);

    try {
      // Fetch all user data from various tables
      const [
        profileResult,
        healthFileResult,
        medicalRecordResult,
        symptomIntakesResult,
        symptomEntriesResult,
        appointmentsResult,
        medicationRemindersResult,
        notificationsResult
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('health_files').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('medical_records').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('symptom_intakes').select('*').eq('user_id', user.id),
        supabase.from('symptom_entries').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*, provider:providers(name, specialty)').eq('patient_id', user.id),
        supabase.from('medication_reminders').select('*').eq('user_id', user.id),
        supabase.from('notifications').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        profile: profileResult.data,
        healthFile: healthFileResult.data,
        medicalRecord: medicalRecordResult.data,
        symptomIntakes: symptomIntakesResult.data,
        symptomEntries: symptomEntriesResult.data,
        appointments: appointmentsResult.data,
        medicationReminders: medicationRemindersResult.data,
        notifications: notificationsResult.data
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medithos-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Εξαγωγή Επιτυχής",
        description: "Τα δεδομένα σας έχουν ληφθεί."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Σφάλμα Εξαγωγής",
        description: "Δεν ήταν δυνατή η εξαγωγή των δεδομένων σας.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);

    try {
      // Delete user data from all tables (order matters due to potential foreign keys)
      const deletions = [
        supabase.from('medication_logs').delete().eq('user_id', user.id),
        supabase.from('medication_reminders').delete().eq('user_id', user.id),
        supabase.from('symptom_intakes').delete().eq('user_id', user.id),
        supabase.from('symptom_entries').delete().eq('user_id', user.id),
        supabase.from('medical_record_shares').delete().eq('patient_id', user.id),
        supabase.from('consents').delete().eq('patient_id', user.id),
        supabase.from('reviews').delete().eq('user_id', user.id),
        supabase.from('payments').delete().eq('user_id', user.id),
        supabase.from('payments_sandbox').delete().eq('user_id', user.id),
        supabase.from('examary_reports').delete().eq('user_id', user.id),
        supabase.from('prevention_plans').delete().eq('user_id', user.id),
        supabase.from('medical_documents').delete().eq('user_id', user.id),
        supabase.from('health_files').delete().eq('user_id', user.id),
      ];

      await Promise.all(deletions);

      // Delete appointments (patient_id)
      await supabase.from('appointments').delete().eq('patient_id', user.id);

      // Clear local storage
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(AGE_KEY);

      toast({
        title: "Αίτημα Διαγραφής Υποβλήθηκε",
        description: "Τα δεδομένα σας έχουν διαγραφεί. Ο λογαριασμός σας θα απενεργοποιηθεί."
      });

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Σφάλμα Διαγραφής",
        description: "Δεν ήταν δυνατή η διαγραφή όλων των δεδομένων. Επικοινωνήστε μαζί μας στο privacy@medithos.com",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          GDPR & Προστασία Δεδομένων
        </CardTitle>
        <CardDescription>
          Διαχειριστείτε τη συγκατάθεση και τα δεδομένα σας σύμφωνα με τον GDPR.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Data */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Εξαγωγή Δεδομένων</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Κατεβάστε ένα αντίγραφο όλων των δεδομένων σας (JSON).
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Separator />

        {/* Revoke Consent */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-warning" />
              <span className="font-medium">Ανάκληση Συγκατάθεσης</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ανακαλέστε τη συγκατάθεση για τους όρους χρήσης του pilot.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-warning border-warning/50 hover:bg-warning/10">
                Ανάκληση
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Ανάκληση Συγκατάθεσης
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Με την ανάκληση της συγκατάθεσης:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Θα αποσυνδεθείτε αμέσως</li>
                    <li>Θα πρέπει να αποδεχτείτε ξανά τους όρους για να συνεχίσετε</li>
                    <li>Τα δεδομένα σας δεν θα διαγραφούν</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevokeConsent} className="bg-warning hover:bg-warning/90">
                  Ανάκληση Συγκατάθεσης
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator />

        {/* Delete Account & Data */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">Διαγραφή Λογαριασμού</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Διαγράψτε μόνιμα τον λογαριασμό και όλα τα δεδομένα σας.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Διαγραφή
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Οριστική Διαγραφή Λογαριασμού
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    <strong>Προσοχή:</strong> Αυτή η ενέργεια είναι μη αναστρέψιμη!
                  </p>
                  <p>Θα διαγραφούν μόνιμα:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Το προφίλ και τα στοιχεία σας</li>
                    <li>Το ιατρικό ιστορικό</li>
                    <li>Τα συμπτώματα και οι καταγραφές</li>
                    <li>Τα ραντεβού</li>
                    <li>Οι υπενθυμίσεις φαρμάκων</li>
                    <li>Όλα τα δεδομένα υγείας σας</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount} 
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Διαγραφή...
                    </>
                  ) : (
                    "Διαγραφή Οριστικά"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Info */}
        <div className="bg-muted/30 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p>
              Για ερωτήσεις σχετικά με τα δεδομένα σας ή άσκηση δικαιωμάτων GDPR, 
              επικοινωνήστε στο{" "}
              <a href="mailto:privacy@medithos.com" className="text-primary hover:underline">
                privacy@medithos.com
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
