import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pill, AlertTriangle, ShieldCheck, ShieldAlert, Loader2, Sparkles } from 'lucide-react';

interface Props {
  patientUserId: string;
  trigger?: React.ReactNode;
  onSaved?: () => void;
}

interface SafetyResult {
  side_effects?: string[];
  contraindications?: string[];
  drug_interactions?: { with: string; severity: string; description: string }[];
  allergy_warnings?: { allergen: string; risk: string; description: string }[];
  severity?: 'safe' | 'caution' | 'warning' | 'danger';
  ai_summary?: string;
  ai_model?: string;
}

const severityConfig = {
  safe: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', icon: ShieldCheck, label: 'Ασφαλές' },
  caution: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/30', icon: AlertTriangle, label: 'Προσοχή' },
  warning: { color: 'bg-orange-500/10 text-orange-600 border-orange-500/30', icon: AlertTriangle, label: 'Προειδοποίηση' },
  danger: { color: 'bg-destructive/10 text-destructive border-destructive/30', icon: ShieldAlert, label: 'Κίνδυνος' },
};

export function DoctorMedicationDialog({ patientUserId, trigger, onSaved }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [indication, setIndication] = useState('');
  const [notes, setNotes] = useState('');
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [safety, setSafety] = useState<SafetyResult | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Live debounced safety check
  useEffect(() => {
    if (!name.trim() || name.trim().length < 3) {
      setSafety(null);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      runCheck();
    }, 800);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, dosage]);

  const runCheck = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('medication-safety-check', {
        body: { patient_user_id: patientUserId, medication_name: name.trim(), dosage: dosage.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSafety(data);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Σφάλμα ελέγχου', description: e.message, variant: 'destructive' });
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('medication_prescriptions').insert({
      patient_user_id: patientUserId,
      prescribed_by_user_id: user.id,
      medication_name: name.trim(),
      dosage: dosage.trim() || null,
      frequency: frequency.trim() || null,
      duration: duration.trim() || null,
      indication: indication.trim() || null,
      doctor_notes: notes.trim() || null,
      side_effects: safety?.side_effects ?? null,
      contraindications: safety?.contraindications ?? null,
      drug_interactions: safety?.drug_interactions ?? [],
      allergy_warnings: safety?.allergy_warnings ?? [],
      severity: safety?.severity ?? 'safe',
      ai_summary: safety?.ai_summary ?? null,
      ai_model: safety?.ai_model ?? null,
      safety_checked_at: safety ? new Date().toISOString() : null,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Σφάλμα', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Συνταγογραφήθηκε', description: 'Το φάρμακο προστέθηκε στον φάκελο' });
    setOpen(false);
    setName(''); setDosage(''); setFrequency(''); setDuration(''); setIndication(''); setNotes(''); setSafety(null);
    onSaved?.();
  };

  const sevConf = safety?.severity ? severityConfig[safety.severity] : null;
  const SevIcon = sevConf?.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button><Pill className="h-4 w-4 mr-2" />Συνταγογράφηση</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pill className="h-5 w-5" />Νέα Συνταγή</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="med-name">Φάρμακο *</Label>
            <Input id="med-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="π.χ. Αμοξικιλλίνη" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="med-dose">Δοσολογία</Label>
              <Input id="med-dose" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="500mg" />
            </div>
            <div>
              <Label htmlFor="med-freq">Συχνότητα</Label>
              <Input id="med-freq" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="3x/ημέρα" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="med-dur">Διάρκεια</Label>
              <Input id="med-dur" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="7 ημέρες" />
            </div>
            <div>
              <Label htmlFor="med-ind">Ένδειξη</Label>
              <Input id="med-ind" value={indication} onChange={(e) => setIndication(e.target.value)} placeholder="λοίμωξη" />
            </div>
          </div>
          <div>
            <Label htmlFor="med-notes">Σημειώσεις γιατρού</Label>
            <Textarea id="med-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>

          {/* AI Safety Panel */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Έλεγχος Ασφαλείας
                {checking && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                {sevConf && SevIcon && (
                  <Badge variant="outline" className={`ml-auto ${sevConf.color}`}>
                    <SevIcon className="h-3 w-3 mr-1" />{sevConf.label}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!safety && !checking && (
                <p className="text-muted-foreground text-xs">Πληκτρολογήστε το φάρμακο για αυτόματο έλεγχο αλλεργιών & αλληλεπιδράσεων…</p>
              )}
              {safety && (
                <>
                  {safety.ai_summary && <p className="font-medium">{safety.ai_summary}</p>}

                  {!!safety.allergy_warnings?.length && (
                    <div>
                      <p className="text-xs font-semibold text-destructive mb-1">⚠️ Αλλεργίες</p>
                      {safety.allergy_warnings.map((a, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-destructive/5 border border-destructive/20 mb-1">
                          <strong>{a.allergen}</strong> ({a.risk}) — {a.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {!!safety.drug_interactions?.length && (
                    <div>
                      <p className="text-xs font-semibold text-orange-600 mb-1">💊 Αλληλεπιδράσεις</p>
                      {safety.drug_interactions.map((d, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-orange-500/5 border border-orange-500/20 mb-1">
                          <strong>{d.with}</strong> ({d.severity}) — {d.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {!!safety.contraindications?.length && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Αντενδείξεις</p>
                      <ul className="list-disc list-inside text-xs text-muted-foreground">
                        {safety.contraindications.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {!!safety.side_effects?.length && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Συχνές παρενέργειες</p>
                      <div className="flex flex-wrap gap-1">
                        {safety.side_effects.map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground italic pt-2 border-t">
                    Πληροφοριακό AI — δεν υποκαθιστά την κλινική κρίση.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Άκυρο</Button>
          <Button onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Pill className="h-4 w-4 mr-2" />}
            Αποθήκευση συνταγής
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
