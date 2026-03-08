import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Moon, Star } from 'lucide-react';

export const SleepModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');
  const [quality, setQuality] = useState([7]);
  const [interruptions, setInterruptions] = useState('0');

  const makeSleepDate = (daysAgo: number, startH: string, endH: string) => {
    const d = new Date(Date.now() - daysAgo * 86400000);
    const prev = new Date(d.getTime() - 86400000);
    return {
      sleep_start: `${prev.toISOString().split('T')[0]}T${startH}:00`,
      sleep_end: `${d.toISOString().split('T')[0]}T${endH}:00`,
      logged_at: d.toISOString(),
    };
  };

  const DEMO_SLEEP = [
    { id: 'demo-1', quality_rating: 5, interruptions: 2, ...makeSleepDate(0, '02:30', '07:30'), notes: '⌚ Apple Watch — 5.0h ύπνου' },
    { id: 'demo-2', quality_rating: 4, interruptions: 3, ...makeSleepDate(1, '03:00', '07:45'), notes: '⌚ Apple Watch — 4.75h ύπνου' },
    { id: 'demo-3', quality_rating: 5, interruptions: 1, ...makeSleepDate(2, '02:00', '07:00'), notes: '⌚ Apple Watch — 5.0h ύπνου' },
    { id: 'demo-4', quality_rating: 6, interruptions: 1, ...makeSleepDate(3, '01:30', '07:00'), notes: '⌚ Apple Watch — 5.5h ύπνου' },
    { id: 'demo-5', quality_rating: 4, interruptions: 2, ...makeSleepDate(4, '03:15', '07:30'), notes: '⌚ Apple Watch — 4.25h ύπνου' },
    { id: 'demo-6', quality_rating: 5, interruptions: 2, ...makeSleepDate(5, '02:45', '07:45'), notes: '⌚ Apple Watch — 5.0h ύπνου' },
    { id: 'demo-7', quality_rating: 5, interruptions: 1, ...makeSleepDate(6, '02:00', '07:15'), notes: '⌚ Apple Watch — 5.25h ύπνου' },
  ];

  useEffect(() => { if (user) fetchLogs(); }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false });
    const realLogs = data || [];
    setLogs(realLogs.length > 0 ? realLogs : DEMO_SLEEP);
  };

  const addLog = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    await supabase.from('sleep_logs').insert({
      user_id: user.id,
      sleep_start: `${yesterday}T${sleepStart}:00`,
      sleep_end: `${today}T${sleepEnd}:00`,
      quality_rating: quality[0],
      interruptions: parseInt(interruptions),
    });
    toast({ title: 'Καταγράφηκε', description: 'Η καταγραφή ύπνου αποθηκεύτηκε' });
    setShowForm(false);
    fetchLogs();
  };

  const avgQuality = logs.length > 0 ? (logs.reduce((s, l) => s + (l.quality_rating || 0), 0) / logs.length).toFixed(1) : '—';

  const getDurationHours = (start: string, end: string) => {
    if (!start || !end) return '—';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const hours = (e - s) / (1000 * 60 * 60);
    return hours > 0 ? hours.toFixed(1) : '—';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Moon className="h-4 w-4 mx-auto mb-1 text-accent" />
            <p className="text-lg font-bold">{logs.length}</p>
            <p className="text-xs text-muted-foreground">καταγραφές βδομάδας</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Star className="h-4 w-4 mx-auto mb-1 text-warning" />
            <p className="text-lg font-bold">{avgQuality}/10</p>
            <p className="text-xs text-muted-foreground">μέση ποιότητα</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Καταγραφή Ύπνου
      </Button>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Ώρα Ύπνου</label>
                <Input type="time" value={sleepStart} onChange={e => setSleepStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Ώρα Αφύπνισης</label>
                <Input type="time" value={sleepEnd} onChange={e => setSleepEnd(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Ποιότητα Ύπνου: {quality[0]}/10</label>
              <Slider value={quality} onValueChange={setQuality} min={1} max={10} step={1} className="mt-2" />
            </div>
            <Input type="number" placeholder="Αφυπνίσεις" value={interruptions} onChange={e => setInterruptions(e.target.value)} />
            <Button onClick={addLog} className="w-full">Αποθήκευση</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Πρόσφατες Καταγραφές</h3>
        {logs.length === 0 && <p className="text-sm text-muted-foreground">Δεν υπάρχουν καταγραφές</p>}
        {logs.map(log => (
          <Card key={log.id} className="bg-secondary/20 border-border/30">
            <CardContent className="p-3 flex items-center gap-3">
              <Moon className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-sm flex-1">{getDurationHours(log.sleep_start, log.sleep_end)}h ύπνου</span>
              <span className="text-xs text-muted-foreground">⭐ {log.quality_rating}/10</span>
              {log.interruptions > 0 && <span className="text-xs text-warning">{log.interruptions} αφυπν.</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
