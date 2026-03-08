import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Brain, TrendingDown } from 'lucide-react';

const COMMON_TRIGGERS = ['Εργασία', 'Οικογένεια', 'Οικονομικά', 'Υγεία', 'Κοινωνικά', 'Αϋπνία'];
const COPING_METHODS = ['Αναπνοές', 'Περπάτημα', 'Διαλογισμός', 'Μουσική', 'Φίλοι', 'Γυμναστική'];

export const StressModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [stressLevel, setStressLevel] = useState([5]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedCoping, setSelectedCoping] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const DEMO_STRESS = [
    { id: 'demo-1', stress_level: 2, triggers: ['Εργασία'], coping_methods: ['Περπάτημα', 'Μουσική'], notes: 'Ήρεμη μέρα, ελαφρύ άγχος εργασίας', logged_at: new Date().toISOString() },
    { id: 'demo-2', stress_level: 1, triggers: [], coping_methods: ['Αναπνοές', 'Διαλογισμός'], notes: 'Πολύ χαλαρά', logged_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'demo-3', stress_level: 2, triggers: ['Αϋπνία'], coping_methods: ['Γυμναστική'], notes: 'Λίγο κουρασμένος λόγω ύπνου', logged_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'demo-4', stress_level: 1, triggers: [], coping_methods: ['Περπάτημα', 'Φίλοι'], notes: null, logged_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'demo-5', stress_level: 2, triggers: ['Εργασία', 'Αϋπνία'], coping_methods: ['Αναπνοές'], notes: 'Deadline αλλά διαχειρίσιμο', logged_at: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'demo-6', stress_level: 1, triggers: [], coping_methods: ['Μουσική', 'Διαλογισμός'], notes: null, logged_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'demo-7', stress_level: 2, triggers: ['Κοινωνικά'], coping_methods: ['Φίλοι'], notes: null, logged_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  ];

  useEffect(() => { if (user) fetchLogs(); }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('stress_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false });
    const realLogs = data || [];
    setLogs(realLogs.length > 0 ? realLogs : DEMO_STRESS);
  };

  const toggleItem = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addLog = async () => {
    if (!user) return;
    await supabase.from('stress_logs').insert({
      user_id: user.id,
      stress_level: stressLevel[0],
      triggers: selectedTriggers,
      coping_methods: selectedCoping,
      notes: notes || null,
    });
    toast({ title: 'Καταγράφηκε', description: 'Η καταγραφή στρες αποθηκεύτηκε' });
    setShowForm(false); setSelectedTriggers([]); setSelectedCoping([]); setNotes('');
    fetchLogs();
  };

  const avgStress = logs.length > 0 ? (logs.reduce((s, l) => s + (l.stress_level || 0), 0) / logs.length).toFixed(1) : '—';

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-success';
    if (level <= 6) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-secondary/30 border-border/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-warning" />
            <div>
              <p className="text-sm font-semibold">Μέσο Στρες Βδομάδας</p>
              <p className="text-xs text-muted-foreground">{logs.length} καταγραφές</p>
            </div>
          </div>
          <span className={`text-2xl font-bold ${getStressColor(parseFloat(avgStress) || 5)}`}>{avgStress}/10</span>
        </CardContent>
      </Card>

      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Καταγραφή Στρες
      </Button>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Επίπεδο Στρες: {stressLevel[0]}/10</label>
              <Slider value={stressLevel} onValueChange={setStressLevel} min={1} max={10} step={1} className="mt-2" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Αιτίες</label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TRIGGERS.map(t => (
                  <Badge
                    key={t}
                    variant={selectedTriggers.includes(t) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleItem(t, selectedTriggers, setSelectedTriggers)}
                  >{t}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Τρόπος Διαχείρισης</label>
              <div className="flex flex-wrap gap-1.5">
                {COPING_METHODS.map(c => (
                  <Badge
                    key={c}
                    variant={selectedCoping.includes(c) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleItem(c, selectedCoping, setSelectedCoping)}
                  >{c}</Badge>
                ))}
              </div>
            </div>
            <Textarea placeholder="Σημειώσεις (προαιρετικά)..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
            <Button onClick={addLog} className="w-full">Αποθήκευση</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Πρόσφατες Καταγραφές</h3>
        {logs.map(log => (
          <Card key={log.id} className="bg-secondary/20 border-border/30">
            <CardContent className="p-3 flex items-center gap-3">
              <span className={`text-lg font-bold ${getStressColor(log.stress_level)}`}>{log.stress_level}</span>
              <div className="flex-1 flex flex-wrap gap-1">
                {(log.triggers || []).map((t: string) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(log.logged_at).toLocaleDateString('el-GR')}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
