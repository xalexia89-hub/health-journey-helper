import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Heart, Footprints, Activity, Stethoscope, Loader2
} from 'lucide-react';

interface ManualEntryDialogProps {
  onDataAdded?: () => void;
}

export const ManualWearableEntryDialog = ({ onDataAdded }: ManualEntryDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Heart rate
  const [bpm, setBpm] = useState('');
  const [hrType, setHrType] = useState('resting');

  // Steps
  const [steps, setSteps] = useState('');
  const [distance, setDistance] = useState('');

  // SpO2
  const [spo2, setSpo2] = useState('');

  // Blood Pressure
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [bpNotes, setBpNotes] = useState('');

  const resetForm = () => {
    setBpm(''); setHrType('resting');
    setSteps(''); setDistance('');
    setSpo2('');
    setSystolic(''); setDiastolic(''); setPulse(''); setBpNotes('');
  };

  const saveHeartRate = async () => {
    if (!bpm || !user) return;
    setSaving(true);
    const { error } = await supabase.from('wearable_heart_rate').insert({
      user_id: user.id,
      source: 'manual',
      bpm: parseInt(bpm),
      heart_rate_type: hrType,
      measured_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Σφάλμα', description: 'Αποτυχία αποθήκευσης', variant: 'destructive' });
    } else {
      toast({ title: 'Αποθηκεύτηκε', description: `Καρδιακοί παλμοί: ${bpm} bpm` });
      resetForm();
      setOpen(false);
      onDataAdded?.();
    }
  };

  const saveSteps = async () => {
    if (!steps || !user) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('wearable_steps').upsert({
      user_id: user.id,
      source: 'manual',
      step_count: parseInt(steps),
      distance_meters: distance ? parseFloat(distance) * 1000 : null,
      date: today,
    }, { onConflict: 'user_id,source,date' });
    setSaving(false);
    if (error) {
      toast({ title: 'Σφάλμα', description: 'Αποτυχία αποθήκευσης', variant: 'destructive' });
    } else {
      toast({ title: 'Αποθηκεύτηκε', description: `Βήματα: ${parseInt(steps).toLocaleString()}` });
      resetForm();
      setOpen(false);
      onDataAdded?.();
    }
  };

  const saveSpo2 = async () => {
    if (!spo2 || !user) return;
    setSaving(true);
    const { error } = await supabase.from('wearable_spo2').insert({
      user_id: user.id,
      source: 'manual',
      spo2_value: parseFloat(spo2),
      measured_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Σφάλμα', description: 'Αποτυχία αποθήκευσης', variant: 'destructive' });
    } else {
      toast({ title: 'Αποθηκεύτηκε', description: `SpO2: ${spo2}%` });
      resetForm();
      setOpen(false);
      onDataAdded?.();
    }
  };

  const saveBloodPressure = async () => {
    if (!systolic || !diastolic || !user) return;
    setSaving(true);
    const { error } = await supabase.from('wearable_blood_pressure').insert({
      user_id: user.id,
      source: 'manual',
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : null,
      notes: bpNotes || null,
      measured_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Σφάλμα', description: 'Αποτυχία αποθήκευσης', variant: 'destructive' });
    } else {
      toast({ title: 'Αποθηκεύτηκε', description: `Πίεση: ${systolic}/${diastolic} mmHg` });
      resetForm();
      setOpen(false);
      onDataAdded?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Χειροκίνητη Καταχώρηση
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Καταχώρηση Μέτρησης</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="heart" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="heart" className="text-xs px-1">
              <Heart className="h-3.5 w-3.5 mr-1" />Καρδιά
            </TabsTrigger>
            <TabsTrigger value="steps" className="text-xs px-1">
              <Footprints className="h-3.5 w-3.5 mr-1" />Βήματα
            </TabsTrigger>
            <TabsTrigger value="spo2" className="text-xs px-1">
              <Activity className="h-3.5 w-3.5 mr-1" />SpO2
            </TabsTrigger>
            <TabsTrigger value="bp" className="text-xs px-1">
              <Stethoscope className="h-3.5 w-3.5 mr-1" />Πίεση
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heart" className="space-y-4 mt-4">
            <div>
              <Label>Καρδιακοί Παλμοί (bpm)</Label>
              <Input 
                type="number" placeholder="π.χ. 72" 
                value={bpm} onChange={e => setBpm(e.target.value)}
                min={30} max={250}
              />
            </div>
            <div>
              <Label>Τύπος</Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={hrType} onChange={e => setHrType(e.target.value)}
              >
                <option value="resting">Ηρεμίας</option>
                <option value="active">Δραστηριότητας</option>
                <option value="peak">Μέγιστοι</option>
              </select>
            </div>
            <Button onClick={saveHeartRate} disabled={!bpm || saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Αποθήκευση
            </Button>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4 mt-4">
            <div>
              <Label>Βήματα Σήμερα</Label>
              <Input 
                type="number" placeholder="π.χ. 8500" 
                value={steps} onChange={e => setSteps(e.target.value)}
              />
            </div>
            <div>
              <Label>Απόσταση (km) — προαιρετικό</Label>
              <Input 
                type="number" placeholder="π.χ. 5.2" step="0.1"
                value={distance} onChange={e => setDistance(e.target.value)}
              />
            </div>
            <Button onClick={saveSteps} disabled={!steps || saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Αποθήκευση
            </Button>
          </TabsContent>

          <TabsContent value="spo2" className="space-y-4 mt-4">
            <div>
              <Label>Κορεσμός Οξυγόνου (%)</Label>
              <Input 
                type="number" placeholder="π.χ. 98" 
                value={spo2} onChange={e => setSpo2(e.target.value)}
                min={70} max={100}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Φυσιολογικές τιμές: 95-100%. Κάτω από 90% μπορεί να απαιτεί ιατρική αξιολόγηση.
            </p>
            <Button onClick={saveSpo2} disabled={!spo2 || saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Αποθήκευση
            </Button>
          </TabsContent>

          <TabsContent value="bp" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Συστολική (mmHg)</Label>
                <Input 
                  type="number" placeholder="π.χ. 120" 
                  value={systolic} onChange={e => setSystolic(e.target.value)}
                />
              </div>
              <div>
                <Label>Διαστολική (mmHg)</Label>
                <Input 
                  type="number" placeholder="π.χ. 80" 
                  value={diastolic} onChange={e => setDiastolic(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Παλμοί — προαιρετικό</Label>
              <Input 
                type="number" placeholder="π.χ. 72" 
                value={pulse} onChange={e => setPulse(e.target.value)}
              />
            </div>
            <div>
              <Label>Σημειώσεις — προαιρετικό</Label>
              <Textarea 
                placeholder="π.χ. Μετά από περπάτημα" rows={2}
                value={bpNotes} onChange={e => setBpNotes(e.target.value)}
              />
            </div>
            <Button onClick={saveBloodPressure} disabled={!systolic || !diastolic || saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Αποθήκευση
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
