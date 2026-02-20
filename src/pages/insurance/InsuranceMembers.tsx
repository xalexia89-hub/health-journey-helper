import { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  AlertTriangle,
  Shield,
  Heart,
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Link,
  Link2Off,
} from 'lucide-react';

// Demo members data
const demoMembers = [
  { id: '1', member_code: 'MBR-001', full_name: 'Μαρία Παπαδοπούλου', gender: 'F', date_of_birth: '1978-03-15', policy_type: 'Premium', risk_category: 'low', risk_score: 18, stability_score: 92, compliance_score: 95, chronic_conditions: ['Υπέρταση'], er_visits_ytd: 0, total_claims_amount: 1200, is_active: true, last_claim_date: '2026-01-10' },
  { id: '2', member_code: 'MBR-002', full_name: 'Γιώργος Αντωνίου', gender: 'M', date_of_birth: '1965-07-22', policy_type: 'Standard', risk_category: 'high', risk_score: 72, stability_score: 45, compliance_score: 58, chronic_conditions: ['Διαβήτης Τ2', 'Υπέρταση', 'Δυσλιπιδαιμία'], er_visits_ytd: 3, total_claims_amount: 18500, is_active: true, last_claim_date: '2026-02-05' },
  { id: '3', member_code: 'MBR-003', full_name: 'Ελένη Κωνσταντίνου', gender: 'F', date_of_birth: '1990-11-08', policy_type: 'Basic', risk_category: 'low', risk_score: 12, stability_score: 96, compliance_score: 88, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 350, is_active: true, last_claim_date: '2025-11-20' },
  { id: '4', member_code: 'MBR-004', full_name: 'Νίκος Δημητρίου', gender: 'M', date_of_birth: '1955-01-30', policy_type: 'Premium', risk_category: 'critical', risk_score: 89, stability_score: 28, compliance_score: 42, chronic_conditions: ['CHF', 'COPD', 'CKD Stage 3'], er_visits_ytd: 5, total_claims_amount: 45200, is_active: true, last_claim_date: '2026-02-12' },
  { id: '5', member_code: 'MBR-005', full_name: 'Αικατερίνη Βασιλείου', gender: 'F', date_of_birth: '1982-06-14', policy_type: 'Standard', risk_category: 'medium', risk_score: 45, stability_score: 68, compliance_score: 71, chronic_conditions: ['Άσθμα', 'Θυρεοειδοπάθεια'], er_visits_ytd: 1, total_claims_amount: 5800, is_active: true, last_claim_date: '2026-01-28' },
  { id: '6', member_code: 'MBR-006', full_name: 'Δημήτρης Σωτηρίου', gender: 'M', date_of_birth: '1972-09-03', policy_type: 'Premium', risk_category: 'medium', risk_score: 51, stability_score: 62, compliance_score: 65, chronic_conditions: ['Διαβήτης Τ2'], er_visits_ytd: 2, total_claims_amount: 9200, is_active: true, last_claim_date: '2026-02-01' },
  { id: '7', member_code: 'MBR-007', full_name: 'Σοφία Γεωργίου', gender: 'F', date_of_birth: '1995-04-21', policy_type: 'Basic', risk_category: 'low', risk_score: 8, stability_score: 98, compliance_score: 92, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 180, is_active: true, last_claim_date: '2025-09-15' },
  { id: '8', member_code: 'MBR-008', full_name: 'Κωνσταντίνος Μιχαήλ', gender: 'M', date_of_birth: '1960-12-11', policy_type: 'Standard', risk_category: 'high', risk_score: 68, stability_score: 50, compliance_score: 55, chronic_conditions: ['Υπέρταση', 'Αρρυθμία'], er_visits_ytd: 2, total_claims_amount: 14300, is_active: true, last_claim_date: '2026-02-08' },
  { id: '9', member_code: 'MBR-009', full_name: 'Αναστασία Λαζάρου', gender: 'F', date_of_birth: '1988-08-07', policy_type: 'Premium', risk_category: 'low', risk_score: 15, stability_score: 90, compliance_score: 87, chronic_conditions: ['Υποθυρεοειδισμός'], er_visits_ytd: 0, total_claims_amount: 2100, is_active: true, last_claim_date: '2025-12-20' },
  { id: '10', member_code: 'MBR-010', full_name: 'Παναγιώτης Θεοδώρου', gender: 'M', date_of_birth: '1950-02-19', policy_type: 'Premium', risk_category: 'critical', risk_score: 91, stability_score: 22, compliance_score: 38, chronic_conditions: ['CHF', 'Διαβήτης Τ2', 'CKD Stage 4', 'COPD'], er_visits_ytd: 7, total_claims_amount: 62800, is_active: true, last_claim_date: '2026-02-15' },
  { id: '11', member_code: 'MBR-011', full_name: 'Βασιλική Νικολάου', gender: 'F', date_of_birth: '1975-05-28', policy_type: 'Standard', risk_category: 'medium', risk_score: 40, stability_score: 72, compliance_score: 78, chronic_conditions: ['Υπέρταση'], er_visits_ytd: 1, total_claims_amount: 4500, is_active: true, last_claim_date: '2026-01-15' },
  { id: '12', member_code: 'MBR-012', full_name: 'Ιωάννης Αλεξίου', gender: 'M', date_of_birth: '1968-10-05', policy_type: 'Basic', risk_category: 'high', risk_score: 65, stability_score: 48, compliance_score: 52, chronic_conditions: ['Στεφανιαία νόσος', 'Δυσλιπιδαιμία'], er_visits_ytd: 3, total_claims_amount: 22100, is_active: false, last_claim_date: '2026-01-30' },
];

type Member = typeof demoMembers[0];

const riskColors: Record<string, string> = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const riskLabels: Record<string, string> = {
  low: 'Χαμηλό',
  medium: 'Μέτριο',
  high: 'Υψηλό',
  critical: 'Κρίσιμο',
};

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-[#1e2a4a] overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const MemberDetailDialog = ({ member, open, onClose, aggregate }: { member: Member | null; open: boolean; onClose: () => void; aggregate?: any }) => {
  if (!member) return null;

  const age = new Date().getFullYear() - new Date(member.date_of_birth).getFullYear();
  const hasAggregate = aggregate && Object.keys(aggregate).length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0f1629] border-[#1e2a4a] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Προφίλ Μέλους — {member.member_code}</span>
              {(member as any).user_id && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 border text-[10px]">
                  Linked
                </Badge>
              )}
            </div>
            <Badge className={`${riskColors[member.risk_category]} border text-xs`}>
              {riskLabels[member.risk_category]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Basic info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ονοματεπώνυμο</p>
              <p className="text-sm text-white font-medium mt-0.5">{member.full_name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ηλικία / Φύλο</p>
              <p className="text-sm text-white font-medium mt-0.5">{age} / {member.gender === 'M' ? 'Άνδρας' : 'Γυναίκα'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ασφαλιστικό Πρόγραμμα</p>
              <p className="text-sm text-white font-medium mt-0.5">{member.policy_type}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Κατάσταση</p>
              <Badge className={member.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border' : 'bg-slate-500/20 text-slate-400 border-slate-500/30 border'}>
                {member.is_active ? 'Ενεργό' : 'Ανενεργό'}
              </Badge>
            </div>
          </div>

          {/* Scores */}
          <div className="rounded-xl border border-[#1e2a4a] bg-[#0a0e1a]/50 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Δείκτες Υγείας</h4>
            <ScoreBar label="Risk Score" value={member.risk_score} color={member.risk_score > 70 ? 'bg-red-500' : member.risk_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'} />
            <ScoreBar label="Stability Score" value={member.stability_score} color={member.stability_score > 70 ? 'bg-emerald-500' : member.stability_score > 40 ? 'bg-amber-500' : 'bg-red-500'} />
            <ScoreBar label="Compliance Score" value={member.compliance_score} color={member.compliance_score > 70 ? 'bg-cyan-500' : member.compliance_score > 40 ? 'bg-amber-500' : 'bg-red-500'} />
          </div>

          {/* Consent-based Real Data */}
          {hasAggregate && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Link className="h-3.5 w-3.5" />
                Live Data (Consent-Based)
              </h4>
              
              {aggregate.wearable_trends && (
                <div className="grid grid-cols-2 gap-3">
                  {aggregate.wearable_trends.avg_heart_rate_30d > 0 && (
                    <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-500 uppercase">Μ.Ο. HR (30d)</p>
                      <p className="text-lg font-bold text-white">{aggregate.wearable_trends.avg_heart_rate_30d} <span className="text-xs text-slate-400">bpm</span></p>
                    </div>
                  )}
                  {aggregate.wearable_trends.avg_daily_steps_30d > 0 && (
                    <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-500 uppercase">Μ.Ο. Βήματα (30d)</p>
                      <p className="text-lg font-bold text-white">{Number(aggregate.wearable_trends.avg_daily_steps_30d).toLocaleString()}</p>
                    </div>
                  )}
                  {aggregate.wearable_trends.avg_spo2_30d > 0 && (
                    <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-500 uppercase">Μ.Ο. SpO2</p>
                      <p className="text-lg font-bold text-white">{aggregate.wearable_trends.avg_spo2_30d}%</p>
                    </div>
                  )}
                  {aggregate.wearable_trends.latest_bp?.systolic && (
                    <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-500 uppercase">Τελ. BP</p>
                      <p className="text-lg font-bold text-white">{aggregate.wearable_trends.latest_bp.systolic}/{aggregate.wearable_trends.latest_bp.diastolic}</p>
                    </div>
                  )}
                </div>
              )}

              {aggregate.risk_data && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Medication</p>
                    <p className="text-sm font-bold text-white">{aggregate.risk_data.medication_adherence}%</p>
                  </div>
                  <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Activity</p>
                    <p className="text-sm font-bold text-white">{aggregate.risk_data.activity_score} min</p>
                  </div>
                  <div className="bg-[#0a0e1a]/60 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Stress</p>
                    <p className="text-sm font-bold text-white">{aggregate.risk_data.stress_avg}/10</p>
                  </div>
                </div>
              )}

              {aggregate.claims_summary && (
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-400">ER-Related Symptoms (YTD)</span>
                  <span className="font-bold text-white">{aggregate.claims_summary.er_related_symptoms}</span>
                </div>
              )}
            </div>
          )}

          {/* Chronic & Claims */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#1e2a4a] bg-[#0a0e1a]/50 p-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Χρόνιες Παθήσεις</h4>
              {(aggregate?.chronic_conditions?.length > 0 ? aggregate.chronic_conditions : member.chronic_conditions).length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {(aggregate?.chronic_conditions?.length > 0 ? aggregate.chronic_conditions : member.chronic_conditions).map((c: string) => (
                    <Badge key={c} variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Καμία καταγεγραμμένη</p>
              )}
            </div>
            <div className="rounded-xl border border-[#1e2a4a] bg-[#0a0e1a]/50 p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Claims & ER</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Σύνολο Claims</span>
                <span className="text-sm font-bold text-white">€{member.total_claims_amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">ER Επισκέψεις (YTD)</span>
                <span className={`text-sm font-bold ${member.er_visits_ytd > 2 ? 'text-red-400' : 'text-white'}`}>{member.er_visits_ytd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Τελευταίο Claim</span>
                <span className="text-sm text-slate-300">{member.last_claim_date || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ITEMS_PER_PAGE = 8;

const InsuranceMembers = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [policyFilter, setPolicyFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dbMembers, setDbMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregateData, setAggregateData] = useState<Record<string, any>>({});

  // Fetch real members from DB
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('insurance_members')
          .select('*')
          .order('risk_score', { ascending: false });

        if (data && data.length > 0) {
          setDbMembers(data.map(m => ({
            id: m.id,
            member_code: m.member_code,
            full_name: m.full_name,
            gender: m.gender || 'M',
            date_of_birth: m.date_of_birth || '1980-01-01',
            policy_type: m.policy_type || 'Standard',
            risk_category: m.risk_category || 'low',
            risk_score: m.risk_score || 0,
            stability_score: m.stability_score || 50,
            compliance_score: m.compliance_score || 50,
            chronic_conditions: m.chronic_conditions || [],
            er_visits_ytd: m.er_visits_ytd || 0,
            total_claims_amount: m.total_claims_amount || 0,
            is_active: m.is_active ?? true,
            last_claim_date: m.last_claim_date || '',
            user_id: (m as any).user_id || null,
          })));
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Use DB members if available, fallback to demo
  const allMembers = dbMembers.length > 0 ? dbMembers : demoMembers;

  const filtered = useMemo(() => {
    return allMembers.filter((m) => {
      const matchesSearch = m.full_name.toLowerCase().includes(search.toLowerCase()) || m.member_code.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = riskFilter === 'all' || m.risk_category === riskFilter;
      const matchesPolicy = policyFilter === 'all' || m.policy_type === policyFilter;
      return matchesSearch && matchesRisk && matchesPolicy;
    });
  }, [search, riskFilter, policyFilter, allMembers]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: allMembers.length,
    critical: allMembers.filter(m => m.risk_category === 'critical').length,
    high: allMembers.filter(m => m.risk_category === 'high').length,
    avgCompliance: Math.round(allMembers.reduce((s, m) => s + m.compliance_score, 0) / allMembers.length),
  }), [allMembers]);

  // Fetch aggregate data for a member (consent-based)
  const fetchAggregate = useCallback(async (member: Member) => {
    if (aggregateData[member.id]) return;
    if (!(member as any).user_id) return;

    try {
      const { data } = await supabase.functions.invoke('insurance-aggregate', {
        body: { member_id: member.id },
      });
      if (data?.data) {
        setAggregateData(prev => ({ ...prev, [member.id]: data.data }));
      }
    } catch (err) {
      console.error('Aggregate fetch error:', err);
    }
  }, [aggregateData]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Members Management</h1>
        <p className="text-sm text-slate-500 mt-1">Διαχείριση μελών, risk profiles & behavioral tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#1e2a4a] bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Σύνολο Μελών</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#1e2a4a] bg-gradient-to-br from-red-500/10 to-red-600/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Κρίσιμα</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.critical}</p>
        </div>
        <div className="rounded-xl border border-[#1e2a4a] bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Υψηλού Κινδύνου</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.high}</p>
        </div>
        <div className="rounded-xl border border-[#1e2a4a] bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Μ.Ο. Compliance</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgCompliance}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Αναζήτηση ονόματος ή κωδικού..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 bg-[#0f1629] border-[#1e2a4a] text-white placeholder:text-slate-600"
          />
        </div>
        <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 bg-[#0f1629] border-[#1e2a4a] text-slate-300">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
            <SelectItem value="all">Όλα τα επίπεδα</SelectItem>
            <SelectItem value="low">Χαμηλό</SelectItem>
            <SelectItem value="medium">Μέτριο</SelectItem>
            <SelectItem value="high">Υψηλό</SelectItem>
            <SelectItem value="critical">Κρίσιμο</SelectItem>
          </SelectContent>
        </Select>
        <Select value={policyFilter} onValueChange={(v) => { setPolicyFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 bg-[#0f1629] border-[#1e2a4a] text-slate-300">
            <SelectValue placeholder="Policy Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1629] border-[#1e2a4a]">
            <SelectItem value="all">Όλα τα προγράμματα</SelectItem>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1e2a4a] bg-[#0f1629]/80 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1e2a4a] hover:bg-transparent">
              <TableHead className="text-slate-400 text-xs">Κωδικός</TableHead>
              <TableHead className="text-slate-400 text-xs">Μέλος</TableHead>
              <TableHead className="text-slate-400 text-xs hidden md:table-cell">Πρόγραμμα</TableHead>
              <TableHead className="text-slate-400 text-xs">Risk</TableHead>
              <TableHead className="text-slate-400 text-xs hidden lg:table-cell">Stability</TableHead>
              <TableHead className="text-slate-400 text-xs hidden lg:table-cell">Compliance</TableHead>
              <TableHead className="text-slate-400 text-xs hidden xl:table-cell">Claims (€)</TableHead>
              <TableHead className="text-slate-400 text-xs hidden xl:table-cell">ER</TableHead>
              <TableHead className="text-slate-400 text-xs text-right">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((member) => (
              <TableRow
                key={member.id}
                className="border-[#1e2a4a] hover:bg-[#1e2a4a]/30 cursor-pointer transition-colors"
                onClick={() => { setSelectedMember(member); fetchAggregate(member); }}
              >
                <TableCell className="text-xs text-slate-400 font-mono">{member.member_code}</TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-white font-medium">{member.full_name}</p>
                      {(member as any).user_id && (
                        <Link className="h-3 w-3 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {member.chronic_conditions.length > 0 ? member.chronic_conditions.slice(0, 2).join(', ') : 'Χωρίς χρόνιες'}
                      {member.chronic_conditions.length > 2 && ` +${member.chronic_conditions.length - 2}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="bg-slate-500/10 text-slate-300 border-slate-500/20 text-xs">
                    {member.policy_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${riskColors[member.risk_category]} border text-xs`}>
                    {member.risk_score}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#1e2a4a] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${member.stability_score > 70 ? 'bg-emerald-500' : member.stability_score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${member.stability_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{member.stability_score}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#1e2a4a] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${member.compliance_score > 70 ? 'bg-cyan-500' : member.compliance_score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${member.compliance_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{member.compliance_score}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-slate-300">
                  €{member.total_claims_amount.toLocaleString()}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className={`text-xs font-medium ${member.er_visits_ytd > 2 ? 'text-red-400' : 'text-slate-400'}`}>
                    {member.er_visits_ytd}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-cyan-400"
                    onClick={(e) => { e.stopPropagation(); setSelectedMember(member); fetchAggregate(member); }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-slate-500 py-12">
                  Δεν βρέθηκαν μέλη με τα επιλεγμένα φίλτρα.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{filtered.length} μέλη — Σελίδα {page}/{totalPages}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <MemberDetailDialog
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        aggregate={selectedMember ? aggregateData[selectedMember.id] : undefined}
      />
    </div>
  );
};

export default InsuranceMembers;
