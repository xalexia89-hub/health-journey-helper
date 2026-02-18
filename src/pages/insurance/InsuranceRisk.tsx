import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  AlertTriangle, Search, Shield, TrendingUp, TrendingDown, Activity,
  ChevronRight, CheckCircle2, Clock, XCircle, Eye, Filter,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const riskDistribution = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 38, color: '#f97316' },
  { name: 'Medium', value: 95, color: '#eab308' },
  { name: 'Low', value: 187, color: '#22c55e' },
];

const riskTrend = [
  { month: 'Sep', critical: 18, high: 45, medium: 88, low: 170 },
  { month: 'Oct', critical: 16, high: 42, medium: 90, low: 175 },
  { month: 'Nov', critical: 15, high: 40, medium: 92, low: 180 },
  { month: 'Dec', critical: 14, high: 39, medium: 93, low: 182 },
  { month: 'Jan', critical: 13, high: 38, medium: 94, low: 185 },
  { month: 'Feb', critical: 12, high: 38, medium: 95, low: 187 },
];

const alerts = [
  { id: '1', member: 'Maria K.', code: 'MBR-0042', severity: 'critical', type: 'ER Spike', title: '3 ER visits in 30 days', description: 'Recurring chest pain episodes, no follow-up scheduled', time: '2h ago', resolved: false },
  { id: '2', member: 'Nikos P.', code: 'MBR-0078', severity: 'critical', type: 'Risk Escalation', title: 'Risk score jumped from 62 to 89', description: 'New diabetes diagnosis + uncontrolled hypertension', time: '5h ago', resolved: false },
  { id: '3', member: 'Elena S.', code: 'MBR-0156', severity: 'high', type: 'Compliance Drop', title: 'Compliance score dropped below 40%', description: 'Missed 4 consecutive medication refills', time: '1d ago', resolved: false },
  { id: '4', member: 'Giorgos M.', code: 'MBR-0203', severity: 'high', type: 'Cost Deviation', title: 'Claims 340% above cohort average', description: 'Multiple specialist visits without referral pathway', time: '1d ago', resolved: false },
  { id: '5', member: 'Dimitris T.', code: 'MBR-0091', severity: 'medium', type: 'Stability Warning', title: 'Stability score declining for 3 months', description: 'Chronic condition management deteriorating', time: '2d ago', resolved: false },
  { id: '6', member: 'Anna V.', code: 'MBR-0134', severity: 'medium', type: 'Gap in Care', title: 'Overdue preventive screening by 6 months', description: 'Recommended colonoscopy not scheduled', time: '3d ago', resolved: true },
];

const highRiskMembers = [
  { id: '1', name: 'Maria K.', code: 'MBR-0042', riskScore: 94, riskCategory: 'critical', conditions: ['CHF', 'COPD'], erVisits: 5, claimsAmount: 48200, complianceScore: 32, stabilityScore: 28, trend: 'up' },
  { id: '2', name: 'Nikos P.', code: 'MBR-0078', riskScore: 89, riskCategory: 'critical', conditions: ['Diabetes T2', 'Hypertension', 'CKD'], erVisits: 3, claimsAmount: 35600, complianceScore: 45, stabilityScore: 35, trend: 'up' },
  { id: '3', name: 'Kostas D.', code: 'MBR-0012', riskScore: 87, riskCategory: 'critical', conditions: ['CAD', 'Arrhythmia'], erVisits: 4, claimsAmount: 52100, complianceScore: 38, stabilityScore: 30, trend: 'stable' },
  { id: '4', name: 'Elena S.', code: 'MBR-0156', riskScore: 78, riskCategory: 'high', conditions: ['Asthma', 'Depression'], erVisits: 2, claimsAmount: 18900, complianceScore: 38, stabilityScore: 42, trend: 'up' },
  { id: '5', name: 'Giorgos M.', code: 'MBR-0203', riskScore: 76, riskCategory: 'high', conditions: ['Diabetes T2'], erVisits: 1, claimsAmount: 42300, complianceScore: 55, stabilityScore: 50, trend: 'down' },
  { id: '6', name: 'Sofia R.', code: 'MBR-0067', riskScore: 74, riskCategory: 'high', conditions: ['Lupus', 'Fibromyalgia'], erVisits: 2, claimsAmount: 28700, complianceScore: 62, stabilityScore: 48, trend: 'stable' },
  { id: '7', name: 'Petros L.', code: 'MBR-0189', riskScore: 71, riskCategory: 'high', conditions: ['COPD', 'Sleep Apnea'], erVisits: 3, claimsAmount: 22400, complianceScore: 48, stabilityScore: 45, trend: 'up' },
  { id: '8', name: 'Ioanna K.', code: 'MBR-0245', riskScore: 68, riskCategory: 'high', conditions: ['Hypertension', 'Obesity'], erVisits: 1, claimsAmount: 15200, complianceScore: 58, stabilityScore: 55, trend: 'down' },
];

const costByRisk = [
  { category: 'Critical', avgCost: 45200, members: 12 },
  { category: 'High', avgCost: 28100, members: 38 },
  { category: 'Medium', avgCost: 12400, members: 95 },
  { category: 'Low', avgCost: 4800, members: 187 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const severityConfig: Record<string, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Clock },
  low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: CheckCircle2 },
};

const ScoreBar = ({ value, max = 100, label, color }: { value: number; max?: number; label: string; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}/{max}</span>
    </div>
    <div className="h-2 bg-[#1e2a4a] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </div>
  </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

const InsuranceRisk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [alertStatusFilter, setAlertStatusFilter] = useState('active');
  const [selectedMember, setSelectedMember] = useState<typeof highRiskMembers[0] | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (alertStatusFilter === 'active' && a.resolved) return false;
      if (alertStatusFilter === 'resolved' && !a.resolved) return false;
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      return true;
    });
  }, [severityFilter, alertStatusFilter]);

  const filteredMembers = useMemo(() => {
    return highRiskMembers.filter(m => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !m.code.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [searchQuery]);

  const chartConfig = {
    critical: { label: 'Critical', color: '#ef4444' },
    high: { label: 'High', color: '#f97316' },
    medium: { label: 'Medium', color: '#eab308' },
    low: { label: 'Low', color: '#22c55e' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-orange-400" />
          Risk Stratification
        </h1>
        <p className="text-slate-400 text-sm mt-1">Deviation monitoring, early warnings and risk intelligence</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical Members', value: '12', sub: '+2 this month', icon: XCircle, accent: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'High Risk Members', value: '38', sub: '-3 vs last month', icon: AlertTriangle, accent: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Active Alerts', value: alerts.filter(a => !a.resolved).length.toString(), sub: '5 unresolved', icon: Activity, accent: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Avg Risk Score', value: '34.2', sub: '↓ 2.1 vs Q3', icon: Shield, accent: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-[#0f1629] border-[#1e2a4a]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className={`text-xs mt-1 ${kpi.accent}`}>{kpi.sub}</p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Risk Distribution Pie */}
        <Card className="bg-[#0f1629] border-[#1e2a4a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Risk Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-500">Current member stratification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0f1629] border border-[#1e2a4a] rounded-lg px-3 py-2 text-xs">
                          <p className="text-white font-medium">{d.name}</p>
                          <p className="text-slate-400">{d.value} members</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {riskDistribution.map(r => (
                <div key={r.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                  <span className="text-slate-400">{r.name}</span>
                  <span className="text-white font-medium ml-auto">{r.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend */}
        <Card className="bg-[#0f1629] border-[#1e2a4a] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Risk Trend (6 months)</CardTitle>
            <CardDescription className="text-xs text-slate-500">Member count by risk category over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <AreaChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="critical" stackId="1" fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" />
                <Area type="monotone" dataKey="high" stackId="1" fill="#f97316" fillOpacity={0.3} stroke="#f97316" />
                <Area type="monotone" dataKey="medium" stackId="1" fill="#eab308" fillOpacity={0.2} stroke="#eab308" />
                <Area type="monotone" dataKey="low" stackId="1" fill="#22c55e" fillOpacity={0.1} stroke="#22c55e" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost per Risk Category */}
      <Card className="bg-[#0f1629] border-[#1e2a4a]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Average Cost per Risk Category</CardTitle>
          <CardDescription className="text-xs text-slate-500">Annual claims cost by stratification tier</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={costByRisk} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} width={60} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#0f1629] border border-[#1e2a4a] rounded-lg px-3 py-2 text-xs">
                      <p className="text-white font-medium">{d.category}</p>
                      <p className="text-slate-400">Avg Cost: €{d.avgCost.toLocaleString()}</p>
                      <p className="text-slate-400">Members: {d.members}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="avgCost" radius={[0, 4, 4, 0]}>
                {costByRisk.map((entry, i) => (
                  <Cell key={i} fill={riskDistribution.find(r => r.name === entry.category)?.color || '#64748b'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card className="bg-[#0f1629] border-[#1e2a4a]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-sm text-white">Risk Alerts & Early Warnings</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">Real-time deviation monitoring</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={alertStatusFilter} onValueChange={setAlertStatusFilter}>
                <SelectTrigger className="w-28 h-8 text-xs bg-[#0a0e1a] border-[#1e2a4a] text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-28 h-8 text-xs bg-[#0a0e1a] border-[#1e2a4a] text-slate-300">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredAlerts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No alerts match filters</p>
          ) : (
            filteredAlerts.map(alert => {
              const cfg = severityConfig[alert.severity];
              const Icon = cfg.icon;
              return (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{alert.title}</span>
                      <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current`}>{alert.type}</Badge>
                      {alert.resolved && <Badge className="bg-green-500/20 text-green-400 text-[10px]">Resolved</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span>{alert.member} ({alert.code})</span>
                      <span>·</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 shrink-0">
                      Resolve
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* High-Risk Members Table */}
      <Card className="bg-[#0f1629] border-[#1e2a4a]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-sm text-white">High-Risk Member Profiles</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">Members requiring intervention</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search member..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs bg-[#0a0e1a] border-[#1e2a4a] text-slate-300 placeholder:text-slate-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1e2a4a] hover:bg-transparent">
                <TableHead className="text-slate-500 text-xs">Member</TableHead>
                <TableHead className="text-slate-500 text-xs">Risk Score</TableHead>
                <TableHead className="text-slate-500 text-xs">Category</TableHead>
                <TableHead className="text-slate-500 text-xs hidden md:table-cell">Conditions</TableHead>
                <TableHead className="text-slate-500 text-xs hidden lg:table-cell">ER Visits</TableHead>
                <TableHead className="text-slate-500 text-xs hidden lg:table-cell">Claims (YTD)</TableHead>
                <TableHead className="text-slate-500 text-xs">Trend</TableHead>
                <TableHead className="text-slate-500 text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map(member => {
                const cfg = severityConfig[member.riskCategory] || severityConfig.high;
                return (
                  <TableRow key={member.id} className="border-[#1e2a4a] hover:bg-white/5 cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <TableCell>
                      <div>
                        <p className="text-sm text-white font-medium">{member.name}</p>
                        <p className="text-[11px] text-slate-500">{member.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[#1e2a4a] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${member.riskScore}%`, backgroundColor: cfg.color.includes('red') ? '#ef4444' : cfg.color.includes('orange') ? '#f97316' : '#eab308' }} />
                        </div>
                        <span className={`text-sm font-mono font-semibold ${cfg.color}`}>{member.riskScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current`}>
                        {member.riskCategory.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {member.conditions.map(c => (
                          <Badge key={c} className="text-[10px] bg-[#1e2a4a] text-slate-300 border-0">{c}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-white">{member.erVisits}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-white font-mono">€{member.claimsAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {member.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-400" />}
                      {member.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-400" />}
                      {member.trend === 'stable' && <Activity className="h-4 w-4 text-yellow-400" />}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="bg-[#0f1629] border-[#1e2a4a] text-white max-w-lg">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${severityConfig[selectedMember.riskCategory]?.bg}`}>
                    <AlertTriangle className={`h-5 w-5 ${severityConfig[selectedMember.riskCategory]?.color}`} />
                  </div>
                  <div>
                    <span className="text-white">{selectedMember.name}</span>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">{selectedMember.code}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Risk Score */}
                <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1e2a4a]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Risk Score</span>
                    <Badge variant="outline" className={`${severityConfig[selectedMember.riskCategory]?.color} border-current`}>
                      {selectedMember.riskCategory.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className={`text-4xl font-bold font-mono ${severityConfig[selectedMember.riskCategory]?.color}`}>
                      {selectedMember.riskScore}
                    </span>
                    <span className="text-slate-500 text-sm mb-1">/ 100</span>
                    <div className="ml-auto flex items-center gap-1">
                      {selectedMember.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-400" />}
                      {selectedMember.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-400" />}
                      {selectedMember.trend === 'stable' && <Activity className="h-4 w-4 text-yellow-400" />}
                      <span className="text-xs text-slate-400">{selectedMember.trend === 'up' ? 'Increasing' : selectedMember.trend === 'down' ? 'Decreasing' : 'Stable'}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#1e2a4a] rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${selectedMember.riskScore}%`,
                        background: `linear-gradient(90deg, ${selectedMember.riskScore > 80 ? '#ef4444' : '#f97316'}, ${selectedMember.riskScore > 80 ? '#dc2626' : '#ea580c'})`,
                      }}
                    />
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-3">
                  <ScoreBar value={selectedMember.complianceScore} label="Compliance Score" color={selectedMember.complianceScore > 60 ? '#22c55e' : selectedMember.complianceScore > 40 ? '#eab308' : '#ef4444'} />
                  <ScoreBar value={selectedMember.stabilityScore} label="Stability Score" color={selectedMember.stabilityScore > 60 ? '#22c55e' : selectedMember.stabilityScore > 40 ? '#eab308' : '#ef4444'} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1e2a4a]">
                    <p className="text-xs text-slate-500">ER Visits (YTD)</p>
                    <p className="text-xl font-bold text-white mt-1">{selectedMember.erVisits}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1e2a4a]">
                    <p className="text-xs text-slate-500">Total Claims</p>
                    <p className="text-xl font-bold text-white mt-1">€{selectedMember.claimsAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.conditions.map(c => (
                      <Badge key={c} className="bg-[#1e2a4a] text-slate-300 border-0 text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceRisk;
