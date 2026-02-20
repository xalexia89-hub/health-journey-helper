import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Footprints, Activity, Stethoscope, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import { el } from 'date-fns/locale';

type Period = '7d' | '30d' | '90d';

interface HrPoint { date: string; bpm: number; }
interface StepsPoint { date: string; steps: number; }
interface Spo2Point { date: string; value: number; }
interface BpPoint { date: string; systolic: number; diastolic: number; }

export const WearableHistoryCharts = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('30d');
  const [hrData, setHrData] = useState<HrPoint[]>([]);
  const [stepsData, setStepsData] = useState<StepsPoint[]>([]);
  const [spo2Data, setSpo2Data] = useState<Spo2Point[]>([]);
  const [bpData, setBpData] = useState<BpPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const getStartDate = (p: Period) => {
    const now = new Date();
    if (p === '7d') return subDays(now, 7);
    if (p === '30d') return subDays(now, 30);
    return subMonths(now, 3);
  };

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    const start = getStartDate(period).toISOString();

    const [hrRes, stepsRes, spo2Res, bpRes] = await Promise.all([
      supabase.from('wearable_heart_rate')
        .select('bpm, measured_at')
        .eq('user_id', user.id)
        .gte('measured_at', start)
        .order('measured_at', { ascending: true }),
      supabase.from('wearable_steps')
        .select('step_count, date')
        .eq('user_id', user.id)
        .gte('date', start.split('T')[0])
        .order('date', { ascending: true }),
      supabase.from('wearable_spo2')
        .select('spo2_value, measured_at')
        .eq('user_id', user.id)
        .gte('measured_at', start)
        .order('measured_at', { ascending: true }),
      supabase.from('wearable_blood_pressure')
        .select('systolic, diastolic, measured_at')
        .eq('user_id', user.id)
        .gte('measured_at', start)
        .order('measured_at', { ascending: true }),
    ]);

    setHrData(
      (hrRes.data || []).map(d => ({
        date: format(new Date(d.measured_at), 'dd/MM', { locale: el }),
        bpm: d.bpm,
      }))
    );
    setStepsData(
      (stepsRes.data || []).map(d => ({
        date: format(new Date(d.date), 'dd/MM', { locale: el }),
        steps: d.step_count,
      }))
    );
    setSpo2Data(
      (spo2Res.data || []).map(d => ({
        date: format(new Date(d.measured_at), 'dd/MM', { locale: el }),
        value: Number(d.spo2_value),
      }))
    );
    setBpData(
      (bpRes.data || []).map(d => ({
        date: format(new Date(d.measured_at), 'dd/MM', { locale: el }),
        systolic: d.systolic,
        diastolic: d.diastolic,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [user, period]);

  const hasAny = hrData.length > 0 || stepsData.length > 0 || spo2Data.length > 0 || bpData.length > 0;

  if (loading) return null;
  if (!hasAny) return null;

  const chartHeight = 200;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Τάσεις Μετρήσεων
          </CardTitle>
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ημέρες</SelectItem>
              <SelectItem value="30d">30 ημέρες</SelectItem>
              <SelectItem value="90d">3 μήνες</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue={hrData.length > 0 ? 'hr' : stepsData.length > 0 ? 'steps' : spo2Data.length > 0 ? 'spo2' : 'bp'}>
          <TabsList className="w-full grid grid-cols-4 mb-3">
            <TabsTrigger value="hr" className="text-xs px-1" disabled={hrData.length === 0}>
              <Heart className="h-3 w-3 mr-1" />Καρδιά
            </TabsTrigger>
            <TabsTrigger value="steps" className="text-xs px-1" disabled={stepsData.length === 0}>
              <Footprints className="h-3 w-3 mr-1" />Βήματα
            </TabsTrigger>
            <TabsTrigger value="spo2" className="text-xs px-1" disabled={spo2Data.length === 0}>
              <Activity className="h-3 w-3 mr-1" />SpO2
            </TabsTrigger>
            <TabsTrigger value="bp" className="text-xs px-1" disabled={bpData.length === 0}>
              <Stethoscope className="h-3 w-3 mr-1" />Πίεση
            </TabsTrigger>
          </TabsList>

          {/* Heart Rate */}
          <TabsContent value="hr">
            {hrData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={hrData}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 10', 'dataMax + 10']} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`${v} bpm`, 'Παλμοί']}
                  />
                  <ReferenceLine y={60} stroke="hsl(142, 71%, 45%)" strokeDasharray="3 3" label={{ value: '60', position: 'left', fontSize: 10 }} />
                  <ReferenceLine y={100} stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" label={{ value: '100', position: 'left', fontSize: 10 }} />
                  <Area type="monotone" dataKey="bpm" stroke="hsl(0, 84%, 60%)" fill="url(#hrGrad)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Δεν υπάρχουν δεδομένα</p>
            )}
          </TabsContent>

          {/* Steps */}
          <TabsContent value="steps">
            {stepsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [v.toLocaleString(), 'Βήματα']}
                  />
                  <ReferenceLine y={10000} stroke="hsl(142, 71%, 45%)" strokeDasharray="3 3" label={{ value: 'Στόχος', position: 'top', fontSize: 10 }} />
                  <Bar dataKey="steps" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Δεν υπάρχουν δεδομένα</p>
            )}
          </TabsContent>

          {/* SpO2 */}
          <TabsContent value="spo2">
            {spo2Data.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={spo2Data}>
                  <defs>
                    <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} domain={[88, 100]} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, 'SpO2']}
                  />
                  <ReferenceLine y={95} stroke="hsl(45, 93%, 47%)" strokeDasharray="3 3" label={{ value: '95%', position: 'left', fontSize: 10 }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(271, 91%, 65%)" fill="url(#spo2Grad)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Δεν υπάρχουν δεδομένα</p>
            )}
          </TabsContent>

          {/* Blood Pressure */}
          <TabsContent value="bp">
            {bpData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 10', 'dataMax + 10']} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number, name: string) => [
                      `${v} mmHg`,
                      name === 'systolic' ? 'Συστολική' : 'Διαστολική',
                    ]}
                  />
                  <ReferenceLine y={120} stroke="hsl(45, 93%, 47%)" strokeDasharray="3 3" />
                  <ReferenceLine y={80} stroke="hsl(45, 93%, 47%)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="systolic" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 3 }} name="systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 3 }} name="diastolic" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Δεν υπάρχουν δεδομένα</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
