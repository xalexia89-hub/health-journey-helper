import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  TrendingDown, TrendingUp, DollarSign, ShieldCheck, Activity,
  HeartPulse, AlertTriangle, Zap, Target,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';

const costTrend = [
  { month: 'Sep', actual: 420000, predicted: 480000, saved: 60000 },
  { month: 'Oct', actual: 455000, predicted: 510000, saved: 55000 },
  { month: 'Nov', actual: 390000, predicted: 470000, saved: 80000 },
  { month: 'Dec', actual: 510000, predicted: 580000, saved: 70000 },
  { month: 'Jan', actual: 475000, predicted: 540000, saved: 65000 },
  { month: 'Feb', actual: 440000, predicted: 520000, saved: 80000 },
];

const erAvoidance = [
  { month: 'Sep', avoided: 12, cost_saved: 48000 },
  { month: 'Oct', avoided: 15, cost_saved: 60000 },
  { month: 'Nov', avoided: 18, cost_saved: 72000 },
  { month: 'Dec', avoided: 10, cost_saved: 40000 },
  { month: 'Jan', avoided: 14, cost_saved: 56000 },
  { month: 'Feb', avoided: 20, cost_saved: 80000 },
];

const costByCategory = [
  { name: 'Hospitalization', value: 1200000, prev: 1450000, color: '#06b6d4' },
  { name: 'Emergency', value: 380000, prev: 520000, color: '#f43f5e' },
  { name: 'Pharmacy', value: 290000, prev: 310000, color: '#8b5cf6' },
  { name: 'Outpatient', value: 180000, prev: 195000, color: '#f59e0b' },
  { name: 'Lab & Diagnostics', value: 95000, prev: 105000, color: '#10b981' },
];

const interventions = [
  { id: '1', name: 'Chronic Disease Management Program', members: 145, cost_saved: 185000, roi: '4.2x', status: 'active', impact: 'high' },
  { id: '2', name: 'ER Diversion Protocol', members: 89, cost_saved: 356000, roi: '6.8x', status: 'active', impact: 'critical' },
  { id: '3', name: 'Medication Adherence Outreach', members: 210, cost_saved: 92000, roi: '2.1x', status: 'active', impact: 'medium' },
  { id: '4', name: 'Preventive Screening Campaign', members: 320, cost_saved: 78000, roi: '1.8x', status: 'active', impact: 'medium' },
  { id: '5', name: 'High-Risk Member Coaching', members: 34, cost_saved: 245000, roi: '5.5x', status: 'active', impact: 'high' },
  { id: '6', name: 'Telehealth First Initiative', members: 180, cost_saved: 120000, roi: '3.1x', status: 'pilot', impact: 'medium' },
];

const forecasts = [
  { quarter: 'Q1 2025', projected_cost: 1350000, optimized_cost: 1150000, savings: 200000 },
  { quarter: 'Q2 2025', projected_cost: 1420000, optimized_cost: 1180000, savings: 240000 },
  { quarter: 'Q3 2025', projected_cost: 1380000, optimized_cost: 1120000, savings: 260000 },
  { quarter: 'Q4 2025', projected_cost: 1500000, optimized_cost: 1200000, savings: 300000 },
];

const impactConfig: Record<string, { color: string }> = {
  critical: { color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  high: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  medium: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
};

const chartConfig = {
  actual: { label: 'Actual Cost', color: '#06b6d4' },
  predicted: { label: 'Without Optimization', color: '#475569' },
  saved: { label: 'Saved', color: '#10b981' },
  avoided: { label: 'ER Visits Avoided', color: '#f43f5e' },
  cost_saved: { label: 'Cost Saved', color: '#10b981' },
  projected_cost: { label: 'Projected', color: '#475569' },
  optimized_cost: { label: 'Optimized', color: '#06b6d4' },
  savings: { label: 'Savings', color: '#10b981' },
  value: { label: 'Cost', color: '#06b6d4' },
};

const totalSaved = costTrend.reduce((s, m) => s + m.saved, 0);
const totalERavoided = erAvoidance.reduce((s, m) => s + m.avoided, 0);
const avgReduction = Math.round((totalSaved / costTrend.reduce((s, m) => s + m.predicted, 0)) * 100);
const totalInterventionSaved = interventions.reduce((s, i) => s + i.cost_saved, 0);

const InsuranceCost = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-600/20 flex items-center justify-center">
          <TrendingDown className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Cost Optimization</h1>
          <p className="text-sm text-slate-500">Savings analytics, forecasting & intervention ROI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved (6mo)', value: `€${(totalSaved / 1000).toFixed(0)}K`, icon: DollarSign, accent: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
          { label: 'Cost Reduction', value: `${avgReduction}%`, icon: TrendingDown, accent: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5' },
          { label: 'ER Visits Avoided', value: totalERavoided.toString(), icon: ShieldCheck, accent: 'text-red-400', bg: 'from-red-500/10 to-red-600/5' },
          { label: 'Intervention ROI', value: `€${(totalInterventionSaved / 1000).toFixed(0)}K`, icon: Target, accent: 'text-violet-400', bg: 'from-violet-500/10 to-violet-600/5' },
        ].map((kpi) => (
          <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-[#1e2a4a]`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
              </div>
              <p className={`text-2xl font-bold ${kpi.accent}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="savings" className="space-y-4">
        <TabsList className="bg-[#0f1629] border border-[#1e2a4a]">
          <TabsTrigger value="savings" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">Savings Trend</TabsTrigger>
          <TabsTrigger value="er" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">ER Avoidance</TabsTrigger>
          <TabsTrigger value="category" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">By Category</TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="savings">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Actual vs Projected Cost (6 months)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={costTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v / 1000}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="predicted" fill="#475569" fillOpacity={0.1} stroke="#475569" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="actual" fill="#06b6d4" fillOpacity={0.2} stroke="#06b6d4" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="er">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">ER Visits Avoided & Cost Impact</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={erAvoidance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#475569" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v / 1000}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="avoided" fill="#f43f5e" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                  <Line yAxisId="right" type="monotone" dataKey="cost_saved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Cost by Category — Current vs Previous Period</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costByCategory.map((cat) => {
                  const reduction = Math.round(((cat.prev - cat.value) / cat.prev) * 100);
                  const maxVal = Math.max(...costByCategory.map(c => c.prev));
                  return (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm text-slate-300">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white font-semibold">€{(cat.value / 1000).toFixed(0)}K</span>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                            <TrendingDown className="h-3 w-3 mr-1" />-{reduction}%
                          </Badge>
                        </div>
                      </div>
                      <div className="relative h-2 bg-[#1e2a4a] rounded-full overflow-hidden">
                        <div className="absolute h-full rounded-full opacity-30" style={{ width: `${(cat.prev / maxVal) * 100}%`, backgroundColor: cat.color }} />
                        <div className="absolute h-full rounded-full" style={{ width: `${(cat.value / maxVal) * 100}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Quarterly Cost Forecast — 2025</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={forecasts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="quarter" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v / 1000000}M`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="projected_cost" fill="#475569" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimized_cost" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
        <CardHeader className="pb-3"><CardTitle className="text-sm text-slate-300">Active Cost Interventions & ROI</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1e2a4a] hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Intervention</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Members</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Cost Saved</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">ROI</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Impact</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((item) => (
                  <TableRow key={item.id} className="border-[#1e2a4a] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-white">{item.name}</TableCell>
                    <TableCell className="text-center text-sm text-slate-300">{item.members}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-emerald-400">€{(item.cost_saved / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-cyan-400">{item.roi}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`${impactConfig[item.impact].color} text-[10px]`}>{item.impact}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceCost;
