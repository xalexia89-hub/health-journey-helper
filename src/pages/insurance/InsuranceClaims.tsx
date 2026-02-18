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
  FileBarChart, Search, TrendingUp, TrendingDown, DollarSign, AlertTriangle,
  Clock, CheckCircle2, XCircle, Eye, Filter,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
} from 'recharts';

// --- Mock Data ---
const mockClaims = [
  { id: '1', claim_code: 'CLM-2024-001', member_name: 'Maria Papadopoulou', claim_type: 'hospitalization', amount: 12500, status: 'approved', diagnosis_code: 'I21.0', diagnosis_description: 'Acute myocardial infarction', submitted_at: '2024-01-15', resolved_at: '2024-01-28' },
  { id: '2', claim_code: 'CLM-2024-002', member_name: 'Nikos Georgiou', claim_type: 'outpatient', amount: 350, status: 'approved', diagnosis_code: 'J06.9', diagnosis_description: 'Upper respiratory infection', submitted_at: '2024-01-18', resolved_at: '2024-01-20' },
  { id: '3', claim_code: 'CLM-2024-003', member_name: 'Elena Dimitriou', claim_type: 'pharmacy', amount: 890, status: 'pending', diagnosis_code: 'E11.9', diagnosis_description: 'Type 2 diabetes mellitus', submitted_at: '2024-02-01', resolved_at: null },
  { id: '4', claim_code: 'CLM-2024-004', member_name: 'Kostas Nikolaou', claim_type: 'emergency', amount: 4200, status: 'approved', diagnosis_code: 'S72.0', diagnosis_description: 'Fracture of neck of femur', submitted_at: '2024-02-05', resolved_at: '2024-02-12' },
  { id: '5', claim_code: 'CLM-2024-005', member_name: 'Sofia Antoniou', claim_type: 'lab_tests', amount: 275, status: 'denied', diagnosis_code: 'Z00.0', diagnosis_description: 'General examination', submitted_at: '2024-02-10', resolved_at: '2024-02-15' },
  { id: '6', claim_code: 'CLM-2024-006', member_name: 'Dimitris Alexiou', claim_type: 'hospitalization', amount: 18900, status: 'under_review', diagnosis_code: 'C34.1', diagnosis_description: 'Malignant neoplasm of upper lobe, bronchus', submitted_at: '2024-02-12', resolved_at: null },
  { id: '7', claim_code: 'CLM-2024-007', member_name: 'Anna Vasiliou', claim_type: 'outpatient', amount: 180, status: 'approved', diagnosis_code: 'M54.5', diagnosis_description: 'Low back pain', submitted_at: '2024-02-14', resolved_at: '2024-02-16' },
  { id: '8', claim_code: 'CLM-2024-008', member_name: 'Giorgos Makris', claim_type: 'pharmacy', amount: 1250, status: 'flagged', diagnosis_code: 'E78.0', diagnosis_description: 'Pure hypercholesterolemia', submitted_at: '2024-02-18', resolved_at: null },
  { id: '9', claim_code: 'CLM-2024-009', member_name: 'Ioanna Katsarou', claim_type: 'emergency', amount: 3100, status: 'approved', diagnosis_code: 'K35.8', diagnosis_description: 'Acute appendicitis', submitted_at: '2024-02-20', resolved_at: '2024-02-25' },
  { id: '10', claim_code: 'CLM-2024-010', member_name: 'Panagiotis Stavrou', claim_type: 'hospitalization', amount: 8750, status: 'pending', diagnosis_code: 'I50.9', diagnosis_description: 'Heart failure', submitted_at: '2024-02-22', resolved_at: null },
];

const monthlyTrend = [
  { month: 'Sep', total: 42000, approved: 35000, denied: 4000, pending: 3000 },
  { month: 'Oct', total: 48000, approved: 40000, denied: 5000, pending: 3000 },
  { month: 'Nov', total: 39000, approved: 32000, denied: 3500, pending: 3500 },
  { month: 'Dec', total: 55000, approved: 45000, denied: 6000, pending: 4000 },
  { month: 'Jan', total: 51000, approved: 42000, denied: 5500, pending: 3500 },
  { month: 'Feb', total: 47000, approved: 38000, denied: 4800, pending: 4200 },
];

const claimsByType = [
  { name: 'Hospitalization', value: 40200, count: 3, color: '#06b6d4' },
  { name: 'Emergency', value: 7300, count: 2, color: '#f43f5e' },
  { name: 'Outpatient', value: 530, count: 2, color: '#8b5cf6' },
  { name: 'Pharmacy', value: 2140, count: 2, color: '#f59e0b' },
  { name: 'Lab Tests', value: 275, count: 1, color: '#10b981' },
];

const topDiagnoses = [
  { code: 'I21.0', desc: 'Acute MI', claims: 8, amount: 45000 },
  { code: 'E11.9', desc: 'T2 Diabetes', claims: 12, amount: 18500 },
  { code: 'I50.9', desc: 'Heart Failure', claims: 6, amount: 32000 },
  { code: 'C34.1', desc: 'Lung Neoplasm', claims: 3, amount: 52000 },
  { code: 'S72.0', desc: 'Hip Fracture', claims: 4, amount: 21000 },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  denied: { label: 'Denied', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
  under_review: { label: 'Under Review', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Eye },
  flagged: { label: 'Flagged', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: AlertTriangle },
};

const typeLabels: Record<string, string> = {
  hospitalization: 'Hospitalization',
  emergency: 'Emergency',
  outpatient: 'Outpatient',
  pharmacy: 'Pharmacy',
  lab_tests: 'Lab Tests',
};

const trendConfig = {
  total: { label: 'Total', color: '#94a3b8' },
  approved: { label: 'Approved', color: '#10b981' },
  denied: { label: 'Denied', color: '#f43f5e' },
  pending: { label: 'Pending', color: '#f59e0b' },
};

const InsuranceClaims = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<typeof mockClaims[0] | null>(null);

  const filtered = useMemo(() => {
    return mockClaims.filter(c => {
      const matchSearch = !search || c.claim_code.toLowerCase().includes(search.toLowerCase()) || c.member_name.toLowerCase().includes(search.toLowerCase()) || c.diagnosis_description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchType = typeFilter === 'all' || c.claim_type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const totalAmount = mockClaims.reduce((s, c) => s + c.amount, 0);
  const approvedCount = mockClaims.filter(c => c.status === 'approved').length;
  const pendingAmount = mockClaims.filter(c => c.status === 'pending' || c.status === 'under_review').reduce((s, c) => s + c.amount, 0);
  const flaggedCount = mockClaims.filter(c => c.status === 'flagged').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center">
          <FileBarChart className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Claims Analytics</h1>
          <p className="text-sm text-slate-500">Intelligence, pattern detection & cost analysis</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Claims Value', value: `€${(totalAmount / 1000).toFixed(1)}K`, icon: DollarSign, accent: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5' },
          { label: 'Approval Rate', value: `${Math.round((approvedCount / mockClaims.length) * 100)}%`, icon: TrendingUp, accent: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
          { label: 'Pending Amount', value: `€${(pendingAmount / 1000).toFixed(1)}K`, icon: Clock, accent: 'text-amber-400', bg: 'from-amber-500/10 to-amber-600/5' },
          { label: 'Flagged Claims', value: flaggedCount.toString(), icon: AlertTriangle, accent: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5' },
        ].map((kpi) => (
          <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-[#1e2a4a] backdrop-blur-sm`}>
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

      {/* Charts */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="bg-[#0f1629] border border-[#1e2a4a]">
          <TabsTrigger value="trend" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Monthly Trend</TabsTrigger>
          <TabsTrigger value="type" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">By Type</TabsTrigger>
          <TabsTrigger value="diagnoses" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Top Diagnoses</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Claims Cost Trend (6 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trendConfig} className="h-[300px] w-full">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v / 1000}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="approved" stackId="1" fill="#10b981" fillOpacity={0.3} stroke="#10b981" />
                  <Area type="monotone" dataKey="denied" stackId="1" fill="#f43f5e" fillOpacity={0.3} stroke="#f43f5e" />
                  <Area type="monotone" dataKey="pending" stackId="1" fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="type">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Claims Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row items-center gap-6">
              <ChartContainer config={{ claims: { label: 'Claims', color: '#06b6d4' } }} className="h-[280px] w-full lg:w-1/2">
                <PieChart>
                  <Pie data={claimsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {claimsByType.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="flex-1 space-y-3 w-full">
                {claimsByType.map((t) => (
                  <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-[#1e2a4a]">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-sm text-slate-300">{t.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">€{t.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{t.count} claims</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses">
          <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Top Diagnoses by Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ amount: { label: 'Cost', color: '#06b6d4' } }} className="h-[300px] w-full">
                <BarChart data={topDiagnoses} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
                  <XAxis type="number" stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v / 1000}K`} />
                  <YAxis type="category" dataKey="desc" stroke="#475569" fontSize={12} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Claims Table */}
      <Card className="bg-[#0f1629]/80 border-[#1e2a4a]">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <CardTitle className="text-sm text-slate-300">All Claims</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search claims..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-48 bg-[#0a0e1a] border-[#1e2a4a] text-white text-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 bg-[#0a0e1a] border-[#1e2a4a] text-white text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-40 bg-[#0a0e1a] border-[#1e2a4a] text-white text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
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
                  <TableHead className="text-slate-400 text-xs">Claim Code</TableHead>
                  <TableHead className="text-slate-400 text-xs">Member</TableHead>
                  <TableHead className="text-slate-400 text-xs">Type</TableHead>
                  <TableHead className="text-slate-400 text-xs">Diagnosis</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Amount</TableHead>
                  <TableHead className="text-slate-400 text-xs">Status</TableHead>
                  <TableHead className="text-slate-400 text-xs">Submitted</TableHead>
                  <TableHead className="text-slate-400 text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((claim) => {
                  const st = statusConfig[claim.status];
                  const StIcon = st.icon;
                  return (
                    <TableRow key={claim.id} className="border-[#1e2a4a] hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                      <TableCell className="text-cyan-400 font-mono text-xs">{claim.claim_code}</TableCell>
                      <TableCell className="text-white text-sm">{claim.member_name}</TableCell>
                      <TableCell className="text-slate-400 text-xs">{typeLabels[claim.claim_type]}</TableCell>
                      <TableCell>
                        <span className="text-slate-300 text-xs">{claim.diagnosis_code}</span>
                        <span className="text-slate-500 text-xs ml-1.5">— {claim.diagnosis_description}</span>
                      </TableCell>
                      <TableCell className="text-right text-white font-semibold text-sm">€{claim.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${st.color} text-[10px] gap-1`}>
                          <StIcon className="h-3 w-3" />{st.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(claim.submitted_at).toLocaleDateString('el-GR')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow className="border-[#1e2a4a]">
                    <TableCell colSpan={8} className="text-center text-slate-500 py-8">No claims found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Claim Detail Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="bg-[#0f1629] border-[#1e2a4a] text-white max-w-lg">
          {selectedClaim && (() => {
            const st = statusConfig[selectedClaim.status];
            const StIcon = st.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <FileBarChart className="h-5 w-5 text-cyan-400" />
                    {selectedClaim.claim_code}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`${st.color} gap-1`}>
                      <StIcon className="h-3 w-3" />{st.label}
                    </Badge>
                    <span className="text-2xl font-bold text-cyan-400">€{selectedClaim.amount.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Member', selectedClaim.member_name],
                      ['Type', typeLabels[selectedClaim.claim_type]],
                      ['Submitted', new Date(selectedClaim.submitted_at).toLocaleDateString('el-GR')],
                      ['Resolved', selectedClaim.resolved_at ? new Date(selectedClaim.resolved_at).toLocaleDateString('el-GR') : '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 rounded-lg bg-white/[0.03] border border-[#1e2a4a]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-sm text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-[#1e2a4a]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm text-white">{selectedClaim.diagnosis_code} — {selectedClaim.diagnosis_description}</p>
                  </div>
                  {selectedClaim.resolved_at && (
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-[#1e2a4a]">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Resolution Time</p>
                      <p className="text-sm text-white">
                        {Math.ceil((new Date(selectedClaim.resolved_at).getTime() - new Date(selectedClaim.submitted_at).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceClaims;
