import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Footprints, Activity, Stethoscope, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ManualWearableEntryDialog } from '@/components/settings/ManualWearableEntryDialog';

interface LatestData {
  heartRate: { bpm: number; type: string; at: string } | null;
  steps: { count: number; date: string } | null;
  spo2: { value: number; at: string } | null;
  bp: { systolic: number; diastolic: number; pulse: number | null; at: string } | null;
}

export const WearableDataWidgets = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LatestData>({ heartRate: null, steps: null, spo2: null, bp: null });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    const [hrRes, stepsRes, spo2Res, bpRes] = await Promise.all([
      supabase.from('wearable_heart_rate')
        .select('bpm, heart_rate_type, measured_at')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('wearable_steps')
        .select('step_count, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('wearable_spo2')
        .select('spo2_value, measured_at')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('wearable_blood_pressure')
        .select('systolic, diastolic, pulse, measured_at')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    setData({
      heartRate: hrRes.data ? { bpm: hrRes.data.bpm, type: hrRes.data.heart_rate_type || 'resting', at: hrRes.data.measured_at } : null,
      steps: stepsRes.data ? { count: stepsRes.data.step_count, date: stepsRes.data.date } : null,
      spo2: spo2Res.data ? { value: Number(spo2Res.data.spo2_value), at: spo2Res.data.measured_at } : null,
      bp: bpRes.data ? { systolic: bpRes.data.systolic, diastolic: bpRes.data.diastolic, pulse: bpRes.data.pulse, at: bpRes.data.measured_at } : null,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffH = Math.round((now.getTime() - d.getTime()) / 3600000);
    if (diffH < 1) return 'Μόλις τώρα';
    if (diffH < 24) return `${diffH}ω πριν`;
    return `${Math.round(diffH / 24)}ημ πριν`;
  };

  const getBpStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Φυσιολογική', color: 'text-emerald-500', icon: TrendingDown };
    if (sys < 140 && dia < 90) return { label: 'Ελαφρώς αυξημένη', color: 'text-amber-500', icon: Minus };
    return { label: 'Υψηλή', color: 'text-rose-500', icon: TrendingUp };
  };

  if (loading) return null;

  const hasAnyData = data.heartRate || data.steps || data.spo2 || data.bp;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Ζωτικά Σημεία
          </CardTitle>
          <ManualWearableEntryDialog onDataAdded={fetchData} />
        </div>
      </CardHeader>
      <CardContent>
        {!hasAnyData ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Δεν υπάρχουν δεδομένα. Συνδέστε μια συσκευή ή καταχωρήστε μετρήσεις χειροκίνητα.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Heart Rate */}
            {data.heartRate && (
              <div className="rounded-xl bg-rose-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-xs text-muted-foreground">Καρδιακοί</span>
                </div>
                <p className="text-2xl font-bold">{data.heartRate.bpm}</p>
                <p className="text-xs text-muted-foreground">
                  bpm · {formatTime(data.heartRate.at)}
                </p>
              </div>
            )}

            {/* Steps */}
            {data.steps && (
              <div className="rounded-xl bg-blue-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Footprints className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Βήματα</span>
                </div>
                <p className="text-2xl font-bold">{data.steps.count.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  σήμερα
                </p>
              </div>
            )}

            {/* SpO2 */}
            {data.spo2 && (
              <div className="rounded-xl bg-purple-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-muted-foreground">SpO2</span>
                </div>
                <p className="text-2xl font-bold">{data.spo2.value}%</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(data.spo2.at)}
                </p>
              </div>
            )}

            {/* Blood Pressure */}
            {data.bp && (() => {
              const status = getBpStatus(data.bp.systolic, data.bp.diastolic);
              const StatusIcon = status.icon;
              return (
                <div className="rounded-xl bg-teal-500/10 p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-teal-500" />
                    <span className="text-xs text-muted-foreground">Πίεση</span>
                  </div>
                  <p className="text-2xl font-bold">{data.bp.systolic}/{data.bp.diastolic}</p>
                  <div className="flex items-center gap-1">
                    <StatusIcon className={`h-3 w-3 ${status.color}`} />
                    <p className={`text-xs ${status.color}`}>{status.label}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
