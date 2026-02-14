import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Droplets, Apple } from 'lucide-react';

interface NutritionLog {
  id: string;
  meal_type: string;
  meal_description: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  water_ml: number | null;
  logged_at: string;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Πρωινό' },
  { value: 'lunch', label: 'Μεσημεριανό' },
  { value: 'dinner', label: 'Βραδινό' },
  { value: 'snack', label: 'Σνακ' },
];

const DIETARY_PATTERNS = [
  { value: 'balanced', label: 'Ισορροπημένη' },
  { value: 'mediterranean', label: 'Μεσογειακή' },
  { value: 'plant_based', label: 'Φυτική' },
  { value: 'low_carb', label: 'Χαμηλών Υδατανθράκων' },
  { value: 'high_protein', label: 'Υψηλής Πρωτεΐνης' },
];

export const NutritionModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [waterMl, setWaterMl] = useState('');

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', today)
      .order('logged_at', { ascending: false });
    setLogs((data as NutritionLog[]) || []);
  };

  const addLog = async () => {
    if (!user || !description.trim()) return;
    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      meal_type: mealType,
      meal_description: description,
      calories: calories ? parseInt(calories) : null,
      protein_g: protein ? parseFloat(protein) : null,
      carbs_g: carbs ? parseFloat(carbs) : null,
      fat_g: fat ? parseFloat(fat) : null,
      water_ml: waterMl ? parseInt(waterMl) : null,
    });
    if (!error) {
      toast({ title: 'Καταγράφηκε', description: 'Το γεύμα αποθηκεύτηκε' });
      setDescription(''); setCalories(''); setProtein(''); setCarbs(''); setFat(''); setWaterMl('');
      setShowForm(false);
      fetchLogs();
    }
  };

  const addWater = async () => {
    if (!user) return;
    await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      meal_type: 'snack',
      meal_description: 'Νερό',
      water_ml: 250,
    });
    toast({ title: '💧', description: '+250ml νερό' });
    fetchLogs();
  };

  const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);
  const totalWater = logs.reduce((s, l) => s + (l.water_ml || 0), 0);
  const totalProtein = logs.reduce((s, l) => s + (Number(l.protein_g) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Daily Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Apple className="h-4 w-4 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold text-foreground">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">θερμίδες</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-foreground">{totalWater}ml</p>
            <p className="text-xs text-muted-foreground">νερό</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/30">
          <CardContent className="p-3 text-center">
            <span className="text-sm">🥩</span>
            <p className="text-lg font-bold text-foreground">{totalProtein.toFixed(0)}g</p>
            <p className="text-xs text-muted-foreground">πρωτεΐνη</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button onClick={() => setShowForm(!showForm)} className="flex-1">
          <Plus className="h-4 w-4 mr-1" /> Γεύμα
        </Button>
        <Button variant="outline" onClick={addWater} className="flex-1">
          <Droplets className="h-4 w-4 mr-1" /> +250ml
        </Button>
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Περιγραφή γεύματος..." value={description} onChange={e => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Θερμίδες" value={calories} onChange={e => setCalories(e.target.value)} />
              <Input type="number" placeholder="Πρωτεΐνη (g)" value={protein} onChange={e => setProtein(e.target.value)} />
              <Input type="number" placeholder="Υδατάνθρ. (g)" value={carbs} onChange={e => setCarbs(e.target.value)} />
              <Input type="number" placeholder="Λίπος (g)" value={fat} onChange={e => setFat(e.target.value)} />
            </div>
            <Button onClick={addLog} className="w-full">Αποθήκευση</Button>
          </CardContent>
        </Card>
      )}

      {/* Today's Meals */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Σημερινά Γεύματα</h3>
        {logs.length === 0 && <p className="text-sm text-muted-foreground">Δεν έχουν καταγραφεί γεύματα σήμερα</p>}
        {logs.map(log => (
          <Card key={log.id} className="bg-secondary/20 border-border/30">
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {MEAL_TYPES.find(m => m.value === log.meal_type)?.label || log.meal_type}
              </Badge>
              <span className="text-sm flex-1 truncate">{log.meal_description}</span>
              {log.calories && <span className="text-xs text-muted-foreground">{log.calories} kcal</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
