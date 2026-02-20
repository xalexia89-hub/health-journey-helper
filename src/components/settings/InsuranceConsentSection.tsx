import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Activity, Heart, FileText, Loader2 } from 'lucide-react';

interface ConsentState {
  id?: string;
  org_id?: string;
  org_name?: string;
  consent_risk_scores: boolean;
  consent_claims_summary: boolean;
  consent_chronic_conditions: boolean;
  consent_wearable_trends: boolean;
  is_active: boolean;
}

export function InsuranceConsentSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [consents, setConsents] = useState<ConsentState[]>([]);

  useEffect(() => {
    if (user) fetchConsents();
  }, [user]);

  const fetchConsents = async () => {
    if (!user) return;
    try {
      // Check if user is linked to any insurance member
      const { data: members } = await supabase
        .from('insurance_members')
        .select('id, org_id, full_name, insurance_organizations(name)')
        .eq('user_id', user.id);

      if (!members || members.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch existing consents
      const { data: existingConsents } = await supabase
        .from('insurance_data_consents')
        .select('*')
        .eq('user_id', user.id);

      const consentMap = new Map(
        (existingConsents || []).map(c => [c.org_id, c])
      );

      const merged = members.map(m => {
        const existing = consentMap.get(m.org_id);
        return {
          id: existing?.id,
          org_id: m.org_id,
          org_name: (m as any).insurance_organizations?.name || 'Ασφαλιστική',
          consent_risk_scores: existing?.consent_risk_scores || false,
          consent_claims_summary: existing?.consent_claims_summary || false,
          consent_chronic_conditions: existing?.consent_chronic_conditions || false,
          consent_wearable_trends: existing?.consent_wearable_trends || false,
          is_active: existing?.is_active || false,
        };
      });

      setConsents(merged);
    } catch (err) {
      console.error('Error fetching insurance consents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    index: number,
    field: keyof Omit<ConsentState, 'id' | 'org_id' | 'org_name'>
  ) => {
    if (!user) return;
    setSaving(true);

    const consent = consents[index];
    const newValue = !consent[field];

    // Calculate new is_active state
    const updatedConsent = { ...consent, [field]: newValue };
    if (field !== 'is_active') {
      updatedConsent.is_active =
        updatedConsent.consent_risk_scores ||
        updatedConsent.consent_claims_summary ||
        updatedConsent.consent_chronic_conditions ||
        updatedConsent.consent_wearable_trends;
    } else {
      // If toggling is_active off, turn off all
      if (!newValue) {
        updatedConsent.consent_risk_scores = false;
        updatedConsent.consent_claims_summary = false;
        updatedConsent.consent_chronic_conditions = false;
        updatedConsent.consent_wearable_trends = false;
      }
    }

    try {
      const payload = {
        user_id: user.id,
        org_id: consent.org_id!,
        consent_risk_scores: updatedConsent.consent_risk_scores,
        consent_claims_summary: updatedConsent.consent_claims_summary,
        consent_chronic_conditions: updatedConsent.consent_chronic_conditions,
        consent_wearable_trends: updatedConsent.consent_wearable_trends,
        is_active: updatedConsent.is_active,
        ...(updatedConsent.is_active ? {} : { revoked_at: new Date().toISOString() }),
      };

      if (consent.id) {
        await supabase
          .from('insurance_data_consents')
          .update(payload)
          .eq('id', consent.id);
      } else {
        const { data } = await supabase
          .from('insurance_data_consents')
          .insert(payload)
          .select()
          .single();
        if (data) updatedConsent.id = data.id;
      }

      const newConsents = [...consents];
      newConsents[index] = updatedConsent;
      setConsents(newConsents);

      toast({
        title: 'Ενημερώθηκε',
        description: updatedConsent.is_active
          ? 'Η κοινοποίηση δεδομένων ενεργοποιήθηκε.'
          : 'Η κοινοποίηση δεδομένων απενεργοποιήθηκε.',
      });
    } catch (err) {
      console.error('Error updating consent:', err);
      toast({
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η ενημέρωση.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Don't show section if user isn't linked to any insurance org
  if (consents.length === 0) return null;

  return (
    <Card className="border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-500" />
          Κοινοποίηση Δεδομένων σε Ασφαλιστική
        </CardTitle>
        <CardDescription>
          Ελέγξτε ποια δεδομένα κοινοποιούνται στην ασφαλιστική σας εταιρεία.
          Μόνο αθροιστικά στοιχεία — ποτέ raw data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {consents.map((consent, idx) => (
          <div key={consent.org_id} className="space-y-4">
            {consents.length > 1 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-cyan-500 border-cyan-500/30">
                  {consent.org_name}
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <Label>Risk Scores & Compliance</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Δείκτες κινδύνου, συμμόρφωσης, στρες
                </p>
              </div>
              <Switch
                checked={consent.consent_risk_scores}
                onCheckedChange={() => handleToggle(idx, 'consent_risk_scores')}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label>ER & Claims Summary</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Αριθμός επισκέψεων ΤΕΠ, σύνοψη ραντεβού
                </p>
              </div>
              <Switch
                checked={consent.consent_claims_summary}
                onCheckedChange={() => handleToggle(idx, 'consent_claims_summary')}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <Label>Χρόνιες Παθήσεις</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Λίστα χρόνιων παθήσεων από τον ιατρικό σας φάκελο
                </p>
              </div>
              <Switch
                checked={consent.consent_chronic_conditions}
                onCheckedChange={() => handleToggle(idx, 'consent_chronic_conditions')}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <Label>Wearable Trends</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Μέσοι δείκτες (HR, βήματα, SpO2, BP) — χωρίς raw data
                </p>
              </div>
              <Switch
                checked={consent.consent_wearable_trends}
                onCheckedChange={() => handleToggle(idx, 'consent_wearable_trends')}
                disabled={saving}
              />
            </div>

            {consents.length > 1 && idx < consents.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}

        <div className="bg-muted/30 rounded-lg p-3 mt-2">
          <p className="text-xs text-muted-foreground">
            🔒 Μόνο αθροιστικά δεδομένα κοινοποιούνται. Η ασφαλιστική δεν βλέπει
            ποτέ τις ατομικές σας μετρήσεις ή τα ιατρικά σας έγγραφα.
            Μπορείτε να ανακαλέσετε τη συγκατάθεση ανά πάσα στιγμή.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
