import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  AlertTriangle,
  TrendingDown,
  Activity,
  Shield,
  Heart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Demo data — 50 members, realistic Medithos pilot usage
const costData = [
  { month: 'Jul', actual: 28500, predicted: 32000 },
  { month: 'Aug', actual: 26200, predicted: 31500 },
  { month: 'Sep', actual: 24800, predicted: 31000 },
  { month: 'Oct', actual: 22400, predicted: 30500 },
  { month: 'Nov', actual: 20100, predicted: 30000 },
  { month: 'Dec', actual: 18600, predicted: 29500 },
  { month: 'Jan', actual: 17200, predicted: 29000 },
  { month: 'Feb', actual: 15800, predicted: 28500 },
];

const riskDistribution = [
  { name: 'Low', value: 28, color: '#10b981' },
  { name: 'Medium', value: 14, color: '#f59e0b' },
  { name: 'High', value: 6, color: '#f97316' },
  { name: 'Critical', value: 2, color: '#ef4444' },
];

const claimsData = [
  { month: 'Jul', claims: 18, amount: 14200 },
  { month: 'Aug', claims: 16, amount: 12800 },
  { month: 'Sep', claims: 14, amount: 11500 },
  { month: 'Oct', claims: 12, amount: 9800 },
  { month: 'Nov', claims: 10, amount: 8400 },
  { month: 'Dec', claims: 9, amount: 7600 },
  { month: 'Jan', claims: 8, amount: 6900 },
  { month: 'Feb', claims: 7, amount: 5800 },
];

const recentAlerts = [
  { id: 1, title: 'Risk spike detected — Member #M-032', severity: 'critical', time: '12 min ago', type: 'risk_spike' },
  { id: 2, title: 'Behavioral drift — Member #M-017', severity: 'high', time: '1h ago', type: 'behavioral_drift' },
  { id: 3, title: 'ER pattern detected — Member #M-045', severity: 'high', time: '3h ago', type: 'er_pattern' },
  { id: 4, title: 'Compliance drop — Member #M-008', severity: 'medium', time: '6h ago', type: 'compliance_drop' },
  { id: 5, title: 'Chronic destabilization — Member #M-041', severity: 'medium', time: '1d ago', type: 'chronic_destabilization' },
];

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'cyan',
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}) => {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    cyan: { bg: 'from-cyan-500/10 to-cyan-600/5', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20' },
    green: { bg: 'from-emerald-500/10 to-emerald-600/5', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    amber: { bg: 'from-amber-500/10 to-amber-600/5', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
    blue: { bg: 'from-blue-500/10 to-blue-600/5', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    purple: { bg: 'from-purple-500/10 to-purple-600/5', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    red: { bg: 'from-red-500/10 to-red-600/5', text: 'text-red-400', iconBg: 'bg-red-500/20' },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`rounded-xl border border-[#1e2a4a] bg-gradient-to-br ${c.bg} p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${c.iconBg}`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === 'down' ? (
            <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />
          )}
          <span className={`text-xs font-medium ${trend === 'down' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendValue}
          </span>
          <span className="text-xs text-slate-600">vs last period</span>
        </div>
      )}
    </div>
  );
};

const InsuranceDashboard = () => {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Behavioral Health Governance — Real-time Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">System Active</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Members"
          value="50"
          subtitle="Active policyholders"
          icon={Users}
          trend="up"
          trendValue="+6.4%"
          color="cyan"
        />
        <KPICard
          title="Active Risk Index"
          value="28.6"
          subtitle="Score 0-100"
          icon={AlertTriangle}
          trend="down"
          trendValue="-14.2%"
          color="amber"
        />
        <KPICard
          title="Stability Score"
          value="84.7"
          subtitle="Population health"
          icon={Heart}
          trend="up"
          trendValue="+9.3%"
          color="green"
        />
        <KPICard
          title="Compliance Score"
          value="88.5"
          subtitle="Behavioral adherence"
          icon={Shield}
          trend="up"
          trendValue="+11.2%"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Claims Reduction"
          value="18.4%"
          subtitle="YoY improvement"
          icon={TrendingDown}
          trend="down"
          trendValue="-18.4%"
          color="green"
        />
        <KPICard
          title="ER Avoidance"
          value="342"
          subtitle="Visits prevented YTD"
          icon={Activity}
          trend="down"
          trendValue="-22.1%"
          color="purple"
        />
        <KPICard
          title="Chronic Stabilization"
          value="71.3%"
          subtitle="Condition management"
          icon={Heart}
          trend="up"
          trendValue="+6.7%"
          color="cyan"
        />
        <KPICard
          title="Cost Saved"
          value="€1.2M"
          subtitle="Cumulative savings"
          icon={DollarSign}
          trend="down"
          trendValue="-€240K/mo"
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Optimization Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Cost Optimization Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Actual vs Predicted claims cost</p>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              ↓ 29.8% reduction
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => `€${v / 1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1629', border: '1px solid #1e2a4a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value: number) => [`€${(value / 1000).toFixed(0)}K`, '']}
              />
              <Area type="monotone" dataKey="predicted" stroke="#6366f1" fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              <Area type="monotone" dataKey="actual" stroke="#06b6d4" fill="url(#colorActual)" strokeWidth={2} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Risk Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Member segmentation by risk</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1629', border: '1px solid #1e2a4a', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Claims Trend */}
        <div className="lg:col-span-2 rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Claims Volume & Cost</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly claims analysis</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={claimsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} />
              <YAxis yAxisId="left" stroke="#475569" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={11} tickFormatter={(v) => `€${v / 1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1629', border: '1px solid #1e2a4a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar yAxisId="left" dataKey="claims" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Claims Count" />
              <Bar yAxisId="right" dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.5} name="Cost (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
            </div>
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
              {recentAlerts.length} active
            </Badge>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-[#1e2a4a] bg-[#0a0e1a]/50 hover:bg-[#0a0e1a] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-300 font-medium leading-tight">{alert.title}</p>
                  <Badge className={`${severityColors[alert.severity]} text-[10px] px-1.5 py-0 shrink-0 border`}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Compliance Overview */}
      <div className="rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Behavioral Compliance Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Screening Adherence', value: 87, color: 'bg-emerald-500' },
            { label: 'Medication Compliance', value: 74, color: 'bg-blue-500' },
            { label: 'Appointment Attendance', value: 91, color: 'bg-cyan-500' },
            { label: 'Lifestyle Program', value: 62, color: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{item.label}</p>
                <span className="text-sm font-bold text-white">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1e2a4a] overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
