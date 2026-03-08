import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Apple, Activity, Moon, Brain, Heart, Shield } from 'lucide-react';

interface HealthDimension {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

export const HealthBalanceWheel = () => {
  const { user } = useAuth();
  const [dimensions, setDimensions] = useState<HealthDimension[]>([
    { label: 'Διατροφή', value: 0, icon: Apple, color: 'hsl(var(--success))' },
    { label: 'Κίνηση', value: 0, icon: Activity, color: 'hsl(var(--primary))' },
    { label: 'Ύπνος', value: 0, icon: Moon, color: 'hsl(var(--accent))' },
    { label: 'Στρες', value: 0, icon: Brain, color: 'hsl(var(--warning))' },
    { label: 'Καρδιαγγ.', value: 0, icon: Heart, color: 'hsl(var(--destructive))' },
    { label: 'Πρόληψη', value: 0, icon: Shield, color: 'hsl(185, 65%, 65%)' },
  ]);

  useEffect(() => {
    if (user) computeScores();
  }, [user]);

  const computeScores = async () => {
    if (!user) return;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [nutritionRes, activityRes, sleepRes, stressRes, screeningRes] = await Promise.all([
      supabase.from('nutrition_logs').select('id').eq('user_id', user.id).gte('logged_at', thirtyDaysAgo),
      supabase.from('activity_logs').select('id').eq('user_id', user.id).gte('logged_at', thirtyDaysAgo),
      supabase.from('sleep_logs').select('quality_rating').eq('user_id', user.id).gte('logged_at', thirtyDaysAgo),
      supabase.from('stress_logs').select('stress_level').eq('user_id', user.id).gte('logged_at', thirtyDaysAgo),
      supabase.from('preventive_screenings').select('id').eq('user_id', user.id),
    ]);

    const hasNutrition = (nutritionRes.data?.length || 0) > 0;
    const hasActivity = (activityRes.data?.length || 0) > 0;
    const hasSleep = (sleepRes.data?.length || 0) > 0;
    const hasStress = (stressRes.data?.length || 0) > 0;
    const hasScreening = (screeningRes.data?.length || 0) > 0;
    const hasAnyData = hasNutrition || hasActivity || hasSleep || hasStress || hasScreening;

    let nutritionScore: number, activityScore: number, sleepScore: number, stressScore: number, screeningScore: number, cardioScore: number;

    if (!hasAnyData) {
      // Demo values matching the user's scenario
      nutritionScore = 30; // Low cal intake
      activityScore = 92; // Very active
      sleepScore = 48;    // Only 5h sleep
      stressScore = 85;   // 15% stress = 85% good
      screeningScore = 60; // Some screenings done
      cardioScore = 69;
    } else {
      nutritionScore = Math.min(100, (nutritionRes.data?.length || 0) * 3.3);
      activityScore = Math.min(100, (activityRes.data?.length || 0) * 8);
      
      const sleepScores = sleepRes.data?.map(s => (s.quality_rating || 5) * 10) || [];
      sleepScore = sleepScores.length > 0 ? sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length : 0;
      
      const stressLevels = stressRes.data?.map(s => s.stress_level || 5) || [];
      stressScore = stressLevels.length > 0 ? 100 - (stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length) * 10 : 0;
      
      screeningScore = Math.min(100, (screeningRes.data?.length || 0) * 20);
      cardioScore = Math.round((nutritionScore + activityScore + stressScore) / 3);
    }

    setDimensions([
      { label: 'Διατροφή', value: Math.round(nutritionScore), icon: Apple, color: 'hsl(var(--success))' },
      { label: 'Κίνηση', value: Math.round(activityScore), icon: Activity, color: 'hsl(var(--primary))' },
      { label: 'Ύπνος', value: Math.round(sleepScore), icon: Moon, color: 'hsl(var(--accent))' },
      { label: 'Στρες', value: Math.round(stressScore), icon: Brain, color: 'hsl(var(--warning))' },
      { label: 'Καρδιαγγ.', value: cardioScore, icon: Heart, color: 'hsl(var(--destructive))' },
      { label: 'Πρόληψη', value: Math.round(screeningScore), icon: Shield, color: 'hsl(185, 65%, 65%)' },
    ]);
  };

  const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length);

  const size = 200;
  const center = size / 2;
  const radius = 75;

  const getPolygonPoints = (values: number[]) => {
    return values.map((val, i) => {
      const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
      const r = (val / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const getAxisEnd = (index: number) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card to-secondary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          Δείκτης Υγείας & Ισορροπίας
          <span className="ml-auto text-2xl font-bold text-primary">{overallScore}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* Radar Chart */}
          <svg width={size} height={size} className="drop-shadow-lg">
            {/* Grid circles */}
            {[25, 50, 75, 100].map(pct => (
              <circle
                key={pct}
                cx={center} cy={center}
                r={(pct / 100) * radius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
                opacity={0.5}
              />
            ))}
            {/* Axes */}
            {dimensions.map((_, i) => {
              const end = getAxisEnd(i);
              return (
                <line
                  key={i}
                  x1={center} y1={center}
                  x2={end.x} y2={end.y}
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  opacity={0.5}
                />
              );
            })}
            {/* Data polygon */}
            <polygon
              points={getPolygonPoints(dimensions.map(d => d.value))}
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
            {/* Data points */}
            {dimensions.map((d, i) => {
              const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
              const r = (d.value / 100) * radius;
              return (
                <circle
                  key={i}
                  cx={center + r * Math.cos(angle)}
                  cy={center + r * Math.sin(angle)}
                  r={4}
                  fill={d.color}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              );
            })}
          </svg>

          {/* Labels */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {dimensions.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-2 text-sm">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: d.color }} />
                  <span className="text-muted-foreground truncate">{d.label}</span>
                  <span className="ml-auto font-semibold text-foreground">{d.value}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
