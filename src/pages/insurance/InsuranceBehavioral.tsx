import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Activity, Search, TrendingUp, TrendingDown, Eye,
  CheckCircle2, XCircle, Clock, ShieldAlert, HeartPulse, Pill, Footprints,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const mockMembers = [
  { id: '1', name: 'Maria Papadopoulou', member_code: 'MBR-001', compliance_score: 92, trend: 'stable', medication_adherence: 95, appointment_adherence: 88, lifestyle_score: 85, screening_adherence: 90, last_activity: '2024-02-20', alerts: 0 },
  { id: '2', name: 'Nikos Georgiou', member_code: 'MBR-002', compliance_score: 45, trend: 'declining', medication_adherence: 40, appointment_adherence: 50, lifestyle_score: 35, screening_adherence: 55, last_activity: '2024-01-28', alerts: 3 },
  { id: '3', name: 'Elena Dimitriou', member_code: 'MBR-003', compliance_score: 78, trend: 'improving', medication_adherence: 82, appointment_adherence: 75, lifestyle_score: 70, screening_adherence: 80, last_activity: '2024-02-18', alerts: 1 },
  { id: '4', name: 'Kostas Nikolaou', member_code: 'MBR-004', compliance_score: 31, trend: 'declining', medication_adherence: 25, appointment_adherence: 30, lifestyle_score: 28, screening_adherence: 40, last_activity: '2024-01-10', alerts: 5 },
  { id: '5', name: 'Sofia Antoniou', member_code: 'MBR-005', compliance_score: 88, trend: 'stable', medication_adherence: 90, appointment_adherence: 85, lifestyle_score: 82, screening_adherence: 92, last_activity: '2024-02-22', alerts: 0 },
  { id: '6', name: 'Dimitris Alexiou', member_code: 'MBR-006', compliance_score: 62, trend: 'declining', medication_adherence: 58, appointment_adherence: 65, lifestyle_score: 55, screening_adherence: 68, last_activity: '2024-02-05', alerts: 2 },
  { id: '7', name: 'Anna Vasiliou', member_code: 'MBR-007', compliance_score: 71, trend: 'improving', medication_adherence: 74, appointment_adherence: 70, lifestyle_score: 65, screening_adherence: 72, last_activity: '2024-02-15', alerts: 1 },
  { id: '8', name: 'Giorgos Makris', member_code: 'MBR-008', compliance_score: 55, trend: 'declining', medication_adherence: 50, appointment_adherence: 60, lifestyle_score: 48, screening_adherence: 58, last_activity: '2024-02-01', alerts: 2 },
];

const complianceTrend = [
  { month: 'Sep', avg: 72, medication: 75, appointments: 68 },
  { month: 'Oct', avg: 70, medication: 73, appointments: 66 },
  { month: 'Nov', avg: 68, medication: 70, appointments: 65 },
  { month: 'Dec', avg: 71, medication: 74, appointments: 67 },
  { month: 'Jan', avg: 69, medication: 72, appointments: 64 },
  { month: 'Feb', avg: 67, medication: 70, appointments: 63 },
];

const behavioralLogs = [
  { id: '1', member: 'Kostas Nikolaou', type: 'missed_medication', desc: 'Missed insulin dose 3 consecutive days', delta: -8, date: '2024-02-22', severity: 'critical' },
  { id: '2', member: 'Nikos Georgiou', type: 'missed_appointment', desc: 'No-show for cardiology follow-up', delta: -5, date: '2024-02-20', severity: 'high' },
  { id: '3', member: 'Dimitris Alexiou', type: 'lifestyle_decline', desc: 'Activity level dropped below threshold', delta: -3, date: '2024-02-18', severity: 'medium' },
  { id: '4', member: 'Elena Dimitriou', type: 'screening_completed', desc: 'Completed annual mammography screening', delta: 4, date: '2024-02-17', severity: 'positive' },
  { id: '5', member: 'Giorgos Makris', type: 'missed_medication', desc: 'Statins refill overdue by 2 weeks', delta: -6, date: '2024-02-15', severity: 'high' },
  { id: '6', member: 'Anna Vasiliou', type: 'appointment_kept', desc: 'Attended diabetes management session', delta: 3, date: '2024-02-14', severity: 'positive' },
  { id: '7', member: 'Kostas Nikolaou', type: 'er_visit', desc: 'Preventable ER visit — uncontrolled glucose', delta: -10, date: '2024-02-12', severity: 'critical' },
  { id: '8', member: 'Sofia Antoniou', type: 'lifestyle_improvement', desc: 'Walking goal exceeded for 4 weeks', delta: 5, date: '2024-02-10', severity: 'positive' },
];

const distributionData = [
  { range: '0-30', count: 1, fill: '#ef4444' },
  { range: '31-50', count: 2, fill: '#f97316' },
  { range: '51-70', count: 2, fill: '#f59e0b' },
  { range: '71-85', count: 2, fill: '#06b6d4' },
  { range: '86-100', count: 2, fill: '#10b981' },
];

const trendLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  improving: { label: 'Improving', color: 'text-emerald-400', icon: TrendingUp },
  stable: { label: 'Stable', color: 'text-cyan-400', icon: Activity },
  declining: { label: 'Declining', color: 'text-red-400', icon: TrendingDown },
};

const severityConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  high: { label: 'High', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  medium: { label: 'Medium', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  positive: { label: 'Positive', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const logTypeIcons: Record<string, React.ElementType> = {
  missed_medication: Pill, missed_appointment: XCircle, lifestyle_decline: TrendingDown,
  screening_completed: CheckCircle2, appointment_kept: CheckCircle2, er_visit: ShieldAlert, lifestyle_improvement: Footprints,
};

const ScoreBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) => {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-cyan-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-slate-400" /><span className="text-xs text-slate-400">{label}</span></div>
        <span className="text-xs font-semibold text-white">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#1e2a4a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const chartConfig = {
  avg: { label: 'Average', color: '#06b6d4' },
  medication: { label: 'Medication', color: '#8b5cf6' },
  appointments: { label: 'Appointments', color: '#f59e0b' },
  count: { label: 'Members', color: '#06b6d4' },
};

const InsuranceBehavioral = () => {
  const [search, setSearch] = useState('');
  const [trendFilter, setTrendFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);

  const filtered = useMemo(() => {
    return mockMembers.filter(m => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.member_code.toLowerCase().includes(search.toLowerCase());
      const matchTrend = trendFilter === 'all' || m.trend === trendFilter;
      return matchSearch && matchTrend;
    });
  }, [search, trendFilter]);

  const avgCompliance = Math.round(mockMembers.reduce((s, m) => s + m.compliance_score, 0) / mockMembers.length);
  const decliningCount = mockMembers.filter(m => m.trend === 'declining').length;
  const criticalAlerts = behavioralLogs.filter(l => l.severity === 'critical').length;
  const improvingCount = mockMembers.filter(m => m.trend === 'improving').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400/20 to-purple-600/20 flex items-center justify-center">
          <Activity className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Behavioral Compliance</h1>
          <p className="text-sm text-slate-500">Adherence tracking, drift detection & intervention triggers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Compliance', value: `${avgCompliance}%`, icon: Activity, accent: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5' },
          { label: 'Declining Members', value: decliningCount.toString(), icon: TrendingDown, accent: 'text-red-400', bg: 'from-red-500/10 to-red-600/5' },
          { label: 'Critical Alerts', value: criticalAlerts.toString(), icon: ShieldAlert, accent: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5' },
          { label: 'Improving', value: improvingCount.toString(), icon: TrendingUp, accent: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
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

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="bg-[#0f1629] border border-[#1e2a4a]">
          <TabsTrigger value="trend" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400">Compliance Trend</TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400">Distribution</TabsTrigger>
          <TabsTrigger value="breakdown" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Compliance Score Trend (6 months)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} domain={[50, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="avg" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="medication" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="appointments" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Compliance Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="range" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300">Average Scores by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Medication Adherence', value: Math.round(mockMembers.reduce((s, m) => s + m.medication_adherence, 0) / mockMembers.length), icon: Pill, color: '#8b5cf6' },
                  { label: 'Appointment Adherence', value: Math.round(mockMembers.reduce((s, m) => s + m.appointment_adherence, 0) / mockMembers.length), icon: Clock, color: '#f59e0b' },
                  { label: 'Lifestyle Score', value: Math.round(mockMembers.reduce((s, m) => s + m.lifestyle_score, 0) / mockMembers.length), icon: HeartPulse, color: '#10b981' },
                  { label: 'Screening Adherence', value: Math.round(mockMembers.reduce((s, m) => s + m.screening_adherence, 0) / mockMembers.length), icon: CheckCircle2, color: '#f43f5e' },
                ].map((cat) => (
                  <div key={cat.label} className="p-4 rounded-xl bg-white/[0.02] border border-[#1e2a4a] text-center">
                    <cat.icon className="h-6 w-6 mx-auto mb-2" style={{ color: cat.color }} />
                    <p className="text-2xl font-bold text-white mb-1">{cat.value}%</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{cat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
        <CardHeader className="pb-3"><CardTitle className="text-sm text-slate-300">Recent Behavioral Events</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {behavioralLogs.map((log) => {
            const sev = severityConfig[log.severity];
            const LogIcon = logTypeIcons[log.type] || Activity;
            const isPositive = log.delta > 0;
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-[#1e2a4a] hover:bg-white/[0.04] transition-colors">
                <div className={`mt-0.5 p-1.5 rounded-lg ${isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <LogIcon className={`h-4 w-4 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{log.member}</span>
                    <Badge variant="outline" className={`${sev.color} text-[10px]`}>{sev.label}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{log.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{log.delta}</span>
                  <p className="text-[10px] text-slate-500">{new Date(log.date).toLocaleDateString('el-GR')}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <CardTitle className="text-sm text-slate-300">Member Compliance Overview</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-48 bg-[#0a0e1a] border-[#1e2a4a] text-white text-sm" />
              </div>
              <Select value={trendFilter} onValueChange={setTrendFilter}>
                <SelectTrigger className="h-9 w-36 bg-[#0a0e1a] border-[#1e2a4a] text-white text-sm"><SelectValue placeholder="Trend" /></SelectTrigger>
                <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
                  <SelectItem value="all">All Trends</SelectItem>
                  <SelectItem value="improving">Improving</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="declining">Declining</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1e2a4a] hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Member</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Score</TableHead>
                  <TableHead className="text-slate-400 text-xs">Trend</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Medication</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Appointments</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Alerts</TableHead>
                  <TableHead className="text-slate-400 text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((member) => {
                  const tr = trendLabels[member.trend];
                  const TrIcon = tr.icon;
                  const scoreColor = member.compliance_score >= 80 ? 'text-emerald-400' : member.compliance_score >= 60 ? 'text-cyan-400' : member.compliance_score >= 40 ? 'text-amber-400' : 'text-red-400';
                  return (
                    <TableRow key={member.id} className="border-[#1e2a4a] hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedMember(member)}>
                      <TableCell>
                        <p className="text-sm text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-500">{member.member_code}</p>
                      </TableCell>
                      <TableCell className={`text-center font-bold ${scoreColor}`}>{member.compliance_score}%</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 ${tr.color}`}><TrIcon className="h-3.5 w-3.5" /><span className="text-xs">{tr.label}</span></div>
                      </TableCell>
                      <TableCell className="text-center text-sm text-slate-300">{member.medication_adherence}%</TableCell>
                      <TableCell className="text-center text-sm text-slate-300">{member.appointment_adherence}%</TableCell>
                      <TableCell className="text-center">
                        {member.alerts > 0 ? <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">{member.alerts}</Badge> : <span className="text-emerald-400 text-xs">—</span>}
                      </TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white"><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="bg-[#0f1629] border-[#1e2a4a] text-white max-w-lg">
          {selectedMember && (() => {
            const tr = trendLabels[selectedMember.trend];
            const TrIcon = tr.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-400" />{selectedMember.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 ${tr.color}`}><TrIcon className="h-4 w-4" /><span className="text-sm font-medium">{tr.label}</span></div>
                    <span className={`text-3xl font-bold ${selectedMember.compliance_score >= 70 ? 'text-cyan-400' : 'text-red-400'}`}>{selectedMember.compliance_score}%</span>
                  </div>
                  <div className="space-y-3">
                    <ScoreBar label="Medication Adherence" value={selectedMember.medication_adherence} icon={Pill} />
                    <ScoreBar label="Appointment Adherence" value={selectedMember.appointment_adherence} icon={Clock} />
                    <ScoreBar label="Lifestyle Score" value={selectedMember.lifestyle_score} icon={HeartPulse} />
                    <ScoreBar label="Screening Adherence" value={selectedMember.screening_adherence} icon={CheckCircle2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-[#1e2a4a]">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Last Activity</p>
                      <p className="text-sm text-white">{new Date(selectedMember.last_activity).toLocaleDateString('el-GR')}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-[#1e2a4a]">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active Alerts</p>
                      <p className={`text-sm font-semibold ${selectedMember.alerts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{selectedMember.alerts > 0 ? selectedMember.alerts : 'None'}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceBehavioral;
