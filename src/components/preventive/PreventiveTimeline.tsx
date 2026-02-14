import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Shield, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const SCREENING_TYPES = [
  'Αιματολογικές Εξετάσεις',
  'Λιπιδαιμικό Προφίλ',
  'Θυρεοειδής',
  'Γλυκοζυλιωμένη Αιμοσφαιρίνη',
  'PSA',
  'Μαστογραφία',
  'Τεστ Παπανικολάου',
  'Δερματολογικός Έλεγχος',
  'Οφθαλμολογικός Έλεγχος',
  'Οδοντιατρικός Έλεγχος',
  'Καρδιολογικός Έλεγχος',
  'Κολονοσκόπηση',
  'Οστική Πυκνομετρία',
  'Άλλο',
];

export const PreventiveTimeline = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [screenings, setScreenings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [screeningType, setScreeningType] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [nextDue, setNextDue] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => { if (user) fetchScreenings(); }, [user]);

  const fetchScreenings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('preventive_screenings')
      .select('*')
      .eq('user_id', user.id)
      .order('next_due', { ascending: true });
    setScreenings(data || []);
  };

  const addScreening = async () => {
    if (!user || !screeningType) return;
    await supabase.from('preventive_screenings').insert({
      user_id: user.id,
      screening_type: screeningType,
      completed_date: completedDate || null,
      next_due: nextDue || null,
      result: result || null,
    });
    toast({ title: 'Καταγράφηκε', description: 'Η εξέταση αποθηκεύτηκε' });
    setShowForm(false); setScreeningType(''); setCompletedDate(''); setNextDue(''); setResult('');
    fetchScreenings();
  };

  const isOverdue = (date: string) => date && new Date(date) < new Date();
  const isDueSoon = (date: string) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Προσθήκη Εξέτασης
      </Button>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Select value={screeningType} onValueChange={setScreeningType}>
              <SelectTrigger><SelectValue placeholder="Τύπος εξέτασης" /></SelectTrigger>
              <SelectContent>
                {SCREENING_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Ημ/νία Ολοκλήρωσης</label>
                <Input type="date" value={completedDate} onChange={e => setCompletedDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Επόμενη Εξέταση</label>
                <Input type="date" value={nextDue} onChange={e => setNextDue(e.target.value)} />
              </div>
            </div>
            <Input placeholder="Αποτέλεσμα (προαιρετικά)" value={result} onChange={e => setResult(e.target.value)} />
            <Button onClick={addScreening} className="w-full">Αποθήκευση</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Χρονολόγιο Εξετάσεων</h3>
        {screenings.length === 0 && <p className="text-sm text-muted-foreground">Δεν υπάρχουν καταγεγραμμένες εξετάσεις</p>}
        {screenings.map(s => (
          <Card key={s.id} className={`border-border/30 ${isOverdue(s.next_due) ? 'bg-destructive/10 border-destructive/30' : isDueSoon(s.next_due) ? 'bg-warning/10 border-warning/30' : 'bg-secondary/20'}`}>
            <CardContent className="p-3 flex items-center gap-3">
              {s.completed_date && !isOverdue(s.next_due) ? (
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
              ) : isOverdue(s.next_due) ? (
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.screening_type}</p>
                {s.result && <p className="text-xs text-muted-foreground truncate">{s.result}</p>}
              </div>
              {s.next_due && (
                <Badge variant={isOverdue(s.next_due) ? 'destructive' : isDueSoon(s.next_due) ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                  {new Date(s.next_due).toLocaleDateString('el-GR')}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
