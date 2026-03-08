import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Activity, Flame, Clock } from 'lucide-react';

const ACTIVITY_TYPES = [
  { value: 'walking', label: '🚶 Περπάτημα' },
  { value: 'running', label: '🏃 Τρέξιμο' },
  { value: 'cycling', label: '🚴 Ποδηλασία' },
  { value: 'swimming', label: '🏊 Κολύμβηση' },
  { value: 'gym', label: '🏋️ Γυμναστήριο' },
  { value: 'yoga', label: '🧘 Γιόγκα' },
  { value: 'other', label: '⚡ Άλλο' },
];

const INTENSITIES = [
  { value: 'light', label: 'Ελαφριά' },
  { value: 'moderate', label: 'Μέτρια' },
  { value: 'intense', label: 'Έντονη' },
];

export const ActivityModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState('walking');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('moderate');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  const DEMO_ACTIVITIES = [
    { id: 'demo-1', activity_type: 'walking', duration_minutes: 45, intensity: 'moderate', calories_burned: 210, heart_rate_avg: 105, notes: '⌚ Apple Watch — 8.420 βήματα', logged_at: new Date().toISOString() },
    { id: 'demo-2', activity_type: 'running', duration_minutes: 30, intensity: 'intense', calories_burned: 320, heart_rate_avg: 148, notes: '⌚ Apple Watch — 4.150 βήματα', logged_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'demo-3', activity_type: 'walking', duration_minutes: 55, intensity: 'moderate', calories_burned: 245, heart_rate_avg: 98, notes: '⌚ Apple Watch — 9.780 βήματα', logged_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'demo-4', activity_type: 'gym', duration_minutes: 60, intensity: 'intense', calories_burned: 380, heart_rate_avg: 135, notes: '⌚ Apple Watch — Strength Training', logged_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'demo-5', activity_type: 'walking', duration_minutes: 40, intensity: 'light', calories_burned: 165, heart_rate_avg: 92, notes: '⌚ Apple Watch — 6.900 βήματα', logged_at: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'demo-6', activity_type: 'cycling', duration_minutes: 35, intensity: 'moderate', calories_burned: 275, heart_rate_avg: 118, notes: '⌚ Apple Watch — Outdoor Cycle', logged_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'demo-7', activity_type: 'yoga', duration_minutes: 25, intensity: 'light', calories_burned: 85, heart_rate_avg: 78, notes: '⌚ Apple Watch — Mind & Body', logged_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  ];

  useEffect(() => { if (user) fetchLogs(); }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false });
    const realLogs = data || [];
    setLogs(realLogs.length > 0 ? realLogs : DEMO_ACTIVITIES);
  };

  const addLog = async () => {
    if (!user || !duration) return;
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      activity_type: activityType,
      duration_minutes: parseInt(duration),
      intensity,
      calories_burned: caloriesBurned ? parseInt(caloriesBurned) : null,
    });
    toast({ title: 'Καταγράφηκε', description: 'Η δραστηριότητα αποθηκεύτηκε' });
    setShowForm(false); setDuration(''); setCaloriesBurned('');
    fetchLogs();
  };

  const totalMinutes = logs.reduce((s, l) => s + (l.duration_minutes || 0), 0);
  const totalCalories = logs.reduce((s, l) => s + (l.calories_burned || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{totalMinutes}'</p>
            <p className="text-xs text-muted-foreground">αυτή τη βδομάδα</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Flame className="h-4 w-4 mx-auto mb-1 text-destructive" />
            <p className="text-lg font-bold">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">θερμίδες</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Προσθήκη Δραστηριότητας
      </Button>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Διάρκεια (λεπτά)" value={duration} onChange={e => setDuration(e.target.value)} />
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INTENSITIES.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Θερμίδες (προαιρετικά)" value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)} />
            <Button onClick={addLog} className="w-full">Αποθήκευση</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Πρόσφατες Δραστηριότητες</h3>
        {logs.length === 0 && <p className="text-sm text-muted-foreground">Δεν υπάρχουν καταγραφές</p>}
        {logs.map(log => (
          <Card key={log.id} className="bg-secondary/20 border-border/30">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm flex-1">{ACTIVITY_TYPES.find(a => a.value === log.activity_type)?.label || log.activity_type}</span>
                <Badge variant="secondary">{log.duration_minutes}'</Badge>
                <Badge variant="outline">{INTENSITIES.find(i => i.value === log.intensity)?.label}</Badge>
              </div>
              {log.notes && <p className="text-xs text-muted-foreground pl-7">{log.notes}</p>}
              {log.calories_burned && <p className="text-xs text-muted-foreground pl-7">🔥 {log.calories_burned} kcal • ❤️ {log.heart_rate_avg || '—'} bpm</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
