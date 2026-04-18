import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pill, ShieldCheck, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { DoctorMedicationDialog } from './DoctorMedicationDialog';
import { Database } from '@/integrations/supabase/types';

type Prescription = Database['public']['Tables']['medication_prescriptions']['Row'];

interface Props {
  patientUserId?: string; // if doctor viewing patient
}

const severityConfig: Record<string, { color: string; icon: any; label: string }> = {
  safe: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', icon: ShieldCheck, label: 'Ασφαλές' },
  caution: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/30', icon: AlertTriangle, label: 'Προσοχή' },
  warning: { color: 'bg-orange-500/10 text-orange-600 border-orange-500/30', icon: AlertTriangle, label: 'Προειδοποίηση' },
  danger: { color: 'bg-destructive/10 text-destructive border-destructive/30', icon: ShieldAlert, label: 'Κίνδυνος' },
};

export function PrescribedMedicationsSection({ patientUserId }: Props) {
  const { user, hasRole } = useAuth();
  const targetUserId = patientUserId ?? user?.id;
  const [items, setItems] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const isDoctor = hasRole('doctor') && patientUserId && patientUserId !== user?.id;

  const load = async () => {
    if (!targetUserId) return;
    setLoading(true);
    const { data } = await supabase
      .from('medication_prescriptions')
      .select('*')
      .eq('patient_user_id', targetUserId)
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [targetUserId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2"><Pill className="h-5 w-5 text-primary" />Συνταγογραφημένα Φάρμακα</span>
          {isDoctor && targetUserId && (
            <DoctorMedicationDialog patientUserId={targetUserId} onSaved={load} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Φόρτωση…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Δεν υπάρχουν συνταγογραφημένα φάρμακα.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {items.map((rx) => {
              const sev = severityConfig[rx.severity ?? 'safe'];
              const SevIcon = sev.icon;
              const interactions = (rx.drug_interactions as any[]) ?? [];
              const allergies = (rx.allergy_warnings as any[]) ?? [];
              return (
                <AccordionItem key={rx.id} value={rx.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 flex-1 text-left">
                      <Pill className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{rx.medication_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[rx.dosage, rx.frequency, rx.duration].filter(Boolean).join(' • ') || 'Χωρίς δοσολογία'}
                        </p>
                      </div>
                      <Badge variant="outline" className={sev.color}>
                        <SevIcon className="h-3 w-3 mr-1" />{sev.label}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    {rx.indication && <p><strong>Ένδειξη:</strong> {rx.indication}</p>}
                    {rx.doctor_notes && <p><strong>Σημειώσεις:</strong> {rx.doctor_notes}</p>}

                    {rx.ai_summary && (
                      <div className="p-2 rounded bg-primary/5 border border-primary/20">
                        <p className="flex items-center gap-1 text-xs font-semibold mb-1"><Sparkles className="h-3 w-3" />AI Σύνοψη</p>
                        <p className="text-xs">{rx.ai_summary}</p>
                      </div>
                    )}

                    {!!allergies.length && (
                      <div>
                        <p className="text-xs font-semibold text-destructive mb-1">⚠️ Αλλεργίες</p>
                        {allergies.map((a, i) => (
                          <div key={i} className="text-xs p-2 rounded bg-destructive/5 border border-destructive/20 mb-1">
                            <strong>{a.allergen}</strong> ({a.risk}) — {a.description}
                          </div>
                        ))}
                      </div>
                    )}

                    {!!interactions.length && (
                      <div>
                        <p className="text-xs font-semibold text-orange-600 mb-1">💊 Αλληλεπιδράσεις</p>
                        {interactions.map((d, i) => (
                          <div key={i} className="text-xs p-2 rounded bg-orange-500/5 border border-orange-500/20 mb-1">
                            <strong>{d.with}</strong> ({d.severity}) — {d.description}
                          </div>
                        ))}
                      </div>
                    )}

                    {!!rx.side_effects?.length && (
                      <div>
                        <p className="text-xs font-semibold mb-1">Παρενέργειες</p>
                        <div className="flex flex-wrap gap-1">
                          {rx.side_effects.map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}
                        </div>
                      </div>
                    )}

                    {!!rx.contraindications?.length && (
                      <div>
                        <p className="text-xs font-semibold mb-1">Αντενδείξεις</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {rx.contraindications.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground pt-2 border-t">
                      Συνταγογραφήθηκε: {format(new Date(rx.created_at), 'dd/MM/yyyy')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
