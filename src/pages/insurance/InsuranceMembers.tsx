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

// Demo members data — 50 members for pilot (anonymized for GDPR compliance)
const demoMembers = [
  { id: '1', member_code: 'MBR-001', full_name: 'Μέλος #001', gender: 'F', date_of_birth: '1978-03-15', policy_type: 'Premium', risk_category: 'low', risk_score: 18, stability_score: 92, compliance_score: 95, chronic_conditions: ['Υπέρταση'], er_visits_ytd: 0, total_claims_amount: 1200, is_active: true, last_claim_date: '2026-01-10' },
  { id: '2', member_code: 'MBR-002', full_name: 'Μέλος #002', gender: 'M', date_of_birth: '1965-07-22', policy_type: 'Standard', risk_category: 'high', risk_score: 72, stability_score: 45, compliance_score: 58, chronic_conditions: ['Διαβήτης Τ2', 'Υπέρταση', 'Δυσλιπιδαιμία'], er_visits_ytd: 3, total_claims_amount: 18500, is_active: true, last_claim_date: '2026-02-05' },
  { id: '3', member_code: 'MBR-003', full_name: 'Μέλος #003', gender: 'F', date_of_birth: '1990-11-08', policy_type: 'Basic', risk_category: 'low', risk_score: 12, stability_score: 96, compliance_score: 88, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 350, is_active: true, last_claim_date: '2025-11-20' },
  { id: '4', member_code: 'MBR-004', full_name: 'Μέλος #004', gender: 'M', date_of_birth: '1955-01-30', policy_type: 'Premium', risk_category: 'critical', risk_score: 89, stability_score: 28, compliance_score: 42, chronic_conditions: ['CHF', 'COPD', 'CKD Stage 3'], er_visits_ytd: 5, total_claims_amount: 45200, is_active: true, last_claim_date: '2026-02-12' },
  { id: '5', member_code: 'MBR-005', full_name: 'Μέλος #005', gender: 'F', date_of_birth: '1982-06-14', policy_type: 'Standard', risk_category: 'medium', risk_score: 45, stability_score: 68, compliance_score: 71, chronic_conditions: ['Άσθμα', 'Θυρεοειδοπάθεια'], er_visits_ytd: 1, total_claims_amount: 5800, is_active: true, last_claim_date: '2026-01-28' },
  { id: '6', member_code: 'MBR-006', full_name: 'Μέλος #006', gender: 'M', date_of_birth: '1972-09-03', policy_type: 'Premium', risk_category: 'medium', risk_score: 51, stability_score: 62, compliance_score: 65, chronic_conditions: ['Διαβήτης Τ2'], er_visits_ytd: 2, total_claims_amount: 9200, is_active: true, last_claim_date: '2026-02-01' },
  { id: '7', member_code: 'MBR-007', full_name: 'Μέλος #007', gender: 'F', date_of_birth: '1995-04-21', policy_type: 'Basic', risk_category: 'low', risk_score: 8, stability_score: 98, compliance_score: 92, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 180, is_active: true, last_claim_date: '2025-09-15' },
  { id: '8', member_code: 'MBR-008', full_name: 'Μέλος #008', gender: 'M', date_of_birth: '1960-12-11', policy_type: 'Standard', risk_category: 'high', risk_score: 68, stability_score: 50, compliance_score: 55, chronic_conditions: ['Υπέρταση', 'Αρρυθμία'], er_visits_ytd: 2, total_claims_amount: 14300, is_active: true, last_claim_date: '2026-02-08' },
  { id: '9', member_code: 'MBR-009', full_name: 'Μέλος #009', gender: 'F', date_of_birth: '1988-08-07', policy_type: 'Premium', risk_category: 'low', risk_score: 15, stability_score: 90, compliance_score: 87, chronic_conditions: ['Υποθυρεοειδισμός'], er_visits_ytd: 0, total_claims_amount: 2100, is_active: true, last_claim_date: '2025-12-20' },
  { id: '10', member_code: 'MBR-010', full_name: 'Μέλος #010', gender: 'M', date_of_birth: '1950-02-19', policy_type: 'Premium', risk_category: 'critical', risk_score: 91, stability_score: 22, compliance_score: 38, chronic_conditions: ['CHF', 'Διαβήτης Τ2', 'CKD Stage 4', 'COPD'], er_visits_ytd: 7, total_claims_amount: 62800, is_active: true, last_claim_date: '2026-02-15' },
  { id: '11', member_code: 'MBR-011', full_name: 'Μέλος #011', gender: 'F', date_of_birth: '1975-05-28', policy_type: 'Standard', risk_category: 'medium', risk_score: 40, stability_score: 72, compliance_score: 78, chronic_conditions: ['Υπέρταση'], er_visits_ytd: 1, total_claims_amount: 4500, is_active: true, last_claim_date: '2026-01-15' },
  { id: '12', member_code: 'MBR-012', full_name: 'Μέλος #012', gender: 'M', date_of_birth: '1968-10-05', policy_type: 'Basic', risk_category: 'high', risk_score: 65, stability_score: 48, compliance_score: 52, chronic_conditions: ['Στεφανιαία νόσος', 'Δυσλιπιδαιμία'], er_visits_ytd: 3, total_claims_amount: 22100, is_active: false, last_claim_date: '2026-01-30' },
  { id: '13', member_code: 'MBR-013', full_name: 'Μέλος #013', gender: 'F', date_of_birth: '1992-02-14', policy_type: 'Basic', risk_category: 'low', risk_score: 10, stability_score: 95, compliance_score: 91, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 220, is_active: true, last_claim_date: '2025-10-05' },
  { id: '14', member_code: 'MBR-014', full_name: 'Μέλος #014', gender: 'M', date_of_birth: '1970-06-30', policy_type: 'Premium', risk_category: 'medium', risk_score: 48, stability_score: 65, compliance_score: 70, chronic_conditions: ['Υπέρταση', 'Δυσλιπιδαιμία'], er_visits_ytd: 1, total_claims_amount: 6700, is_active: true, last_claim_date: '2026-01-20' },
  { id: '15', member_code: 'MBR-015', full_name: 'Μέλος #015', gender: 'F', date_of_birth: '1985-09-12', policy_type: 'Standard', risk_category: 'low', risk_score: 14, stability_score: 91, compliance_score: 89, chronic_conditions: ['Αλλεργικό άσθμα'], er_visits_ytd: 0, total_claims_amount: 1800, is_active: true, last_claim_date: '2025-12-10' },
  { id: '16', member_code: 'MBR-016', full_name: 'Μέλος #016', gender: 'M', date_of_birth: '1958-04-08', policy_type: 'Premium', risk_category: 'high', risk_score: 74, stability_score: 42, compliance_score: 50, chronic_conditions: ['Διαβήτης Τ2', 'CHF'], er_visits_ytd: 4, total_claims_amount: 28900, is_active: true, last_claim_date: '2026-02-10' },
  { id: '17', member_code: 'MBR-017', full_name: 'Μέλος #017', gender: 'F', date_of_birth: '1980-01-25', policy_type: 'Standard', risk_category: 'low', risk_score: 16, stability_score: 88, compliance_score: 85, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 900, is_active: true, last_claim_date: '2025-11-30' },
  { id: '18', member_code: 'MBR-018', full_name: 'Μέλος #018', gender: 'M', date_of_birth: '1974-11-17', policy_type: 'Basic', risk_category: 'medium', risk_score: 42, stability_score: 70, compliance_score: 74, chronic_conditions: ['Γαστροοισοφαγική παλινδρόμηση'], er_visits_ytd: 1, total_claims_amount: 3800, is_active: true, last_claim_date: '2026-01-05' },
  { id: '19', member_code: 'MBR-019', full_name: 'Μέλος #019', gender: 'F', date_of_birth: '1993-07-02', policy_type: 'Basic', risk_category: 'low', risk_score: 7, stability_score: 97, compliance_score: 94, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 150, is_active: true, last_claim_date: '2025-08-22' },
  { id: '20', member_code: 'MBR-020', full_name: 'Μέλος #020', gender: 'M', date_of_birth: '1962-03-28', policy_type: 'Premium', risk_category: 'high', risk_score: 70, stability_score: 47, compliance_score: 56, chronic_conditions: ['COPD', 'Υπέρταση'], er_visits_ytd: 3, total_claims_amount: 19800, is_active: true, last_claim_date: '2026-02-03' },
  { id: '21', member_code: 'MBR-021', full_name: 'Μέλος #021', gender: 'F', date_of_birth: '1987-12-09', policy_type: 'Standard', risk_category: 'low', risk_score: 11, stability_score: 93, compliance_score: 90, chronic_conditions: ['Υποθυρεοειδισμός'], er_visits_ytd: 0, total_claims_amount: 1400, is_active: true, last_claim_date: '2025-12-15' },
  { id: '22', member_code: 'MBR-022', full_name: 'Μέλος #022', gender: 'M', date_of_birth: '1976-08-20', policy_type: 'Premium', risk_category: 'medium', risk_score: 44, stability_score: 69, compliance_score: 73, chronic_conditions: ['Διαβήτης Τ2'], er_visits_ytd: 1, total_claims_amount: 5200, is_active: true, last_claim_date: '2026-01-18' },
  { id: '23', member_code: 'MBR-023', full_name: 'Μέλος #023', gender: 'F', date_of_birth: '1969-05-11', policy_type: 'Standard', risk_category: 'medium', risk_score: 47, stability_score: 66, compliance_score: 68, chronic_conditions: ['Υπέρταση', 'Οστεοπόρωση'], er_visits_ytd: 1, total_claims_amount: 6100, is_active: true, last_claim_date: '2026-01-22' },
  { id: '24', member_code: 'MBR-024', full_name: 'Μέλος #024', gender: 'M', date_of_birth: '1953-10-14', policy_type: 'Premium', risk_category: 'critical', risk_score: 85, stability_score: 30, compliance_score: 40, chronic_conditions: ['CHF', 'Διαβήτης Τ2', 'CKD Stage 3'], er_visits_ytd: 6, total_claims_amount: 52300, is_active: true, last_claim_date: '2026-02-14' },
  { id: '25', member_code: 'MBR-025', full_name: 'Μέλος #025', gender: 'F', date_of_birth: '1991-04-03', policy_type: 'Basic', risk_category: 'low', risk_score: 9, stability_score: 96, compliance_score: 93, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 280, is_active: true, last_claim_date: '2025-10-18' },
  { id: '26', member_code: 'MBR-026', full_name: 'Μέλος #026', gender: 'M', date_of_birth: '1979-01-07', policy_type: 'Standard', risk_category: 'low', risk_score: 19, stability_score: 89, compliance_score: 86, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 950, is_active: true, last_claim_date: '2025-11-25' },
  { id: '27', member_code: 'MBR-027', full_name: 'Μέλος #027', gender: 'F', date_of_birth: '1966-08-15', policy_type: 'Premium', risk_category: 'medium', risk_score: 50, stability_score: 63, compliance_score: 67, chronic_conditions: ['Ρευματοειδής αρθρίτιδα', 'Υπέρταση'], er_visits_ytd: 2, total_claims_amount: 8400, is_active: true, last_claim_date: '2026-01-25' },
  { id: '28', member_code: 'MBR-028', full_name: 'Μέλος #028', gender: 'M', date_of_birth: '1983-06-22', policy_type: 'Basic', risk_category: 'low', risk_score: 13, stability_score: 94, compliance_score: 88, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 420, is_active: true, last_claim_date: '2025-09-30' },
  { id: '29', member_code: 'MBR-029', full_name: 'Μέλος #029', gender: 'F', date_of_birth: '1973-12-01', policy_type: 'Standard', risk_category: 'medium', risk_score: 43, stability_score: 71, compliance_score: 75, chronic_conditions: ['Θυρεοειδοπάθεια'], er_visits_ytd: 1, total_claims_amount: 4100, is_active: true, last_claim_date: '2026-01-12' },
  { id: '30', member_code: 'MBR-030', full_name: 'Μέλος #030', gender: 'M', date_of_birth: '1957-09-19', policy_type: 'Premium', risk_category: 'high', risk_score: 66, stability_score: 49, compliance_score: 54, chronic_conditions: ['Διαβήτης Τ2', 'Υπέρταση', 'Αρρυθμία'], er_visits_ytd: 2, total_claims_amount: 16200, is_active: true, last_claim_date: '2026-02-06' },
  { id: '31', member_code: 'MBR-031', full_name: 'Μέλος #031', gender: 'F', date_of_birth: '1996-03-08', policy_type: 'Basic', risk_category: 'low', risk_score: 6, stability_score: 99, compliance_score: 96, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 120, is_active: true, last_claim_date: '2025-07-14' },
  { id: '32', member_code: 'MBR-032', full_name: 'Μέλος #032', gender: 'M', date_of_birth: '1971-07-26', policy_type: 'Standard', risk_category: 'medium', risk_score: 46, stability_score: 67, compliance_score: 72, chronic_conditions: ['Δυσλιπιδαιμία'], er_visits_ytd: 1, total_claims_amount: 5500, is_active: true, last_claim_date: '2026-01-08' },
  { id: '33', member_code: 'MBR-033', full_name: 'Μέλος #033', gender: 'F', date_of_birth: '1984-10-30', policy_type: 'Premium', risk_category: 'low', risk_score: 17, stability_score: 91, compliance_score: 86, chronic_conditions: ['Αλλεργίες'], er_visits_ytd: 0, total_claims_amount: 1600, is_active: true, last_claim_date: '2025-12-28' },
  { id: '34', member_code: 'MBR-034', full_name: 'Μέλος #034', gender: 'M', date_of_birth: '1963-02-18', policy_type: 'Premium', risk_category: 'high', risk_score: 71, stability_score: 46, compliance_score: 57, chronic_conditions: ['Στεφανιαία νόσος', 'Υπέρταση'], er_visits_ytd: 3, total_claims_amount: 21400, is_active: true, last_claim_date: '2026-02-09' },
  { id: '35', member_code: 'MBR-035', full_name: 'Μέλος #035', gender: 'F', date_of_birth: '1989-05-25', policy_type: 'Standard', risk_category: 'low', risk_score: 11, stability_score: 94, compliance_score: 90, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 600, is_active: true, last_claim_date: '2025-11-05' },
  { id: '36', member_code: 'MBR-036', full_name: 'Μέλος #036', gender: 'M', date_of_birth: '1977-04-12', policy_type: 'Basic', risk_category: 'medium', risk_score: 39, stability_score: 73, compliance_score: 77, chronic_conditions: ['Γαστρίτιδα'], er_visits_ytd: 1, total_claims_amount: 3200, is_active: true, last_claim_date: '2026-01-02' },
  { id: '37', member_code: 'MBR-037', full_name: 'Μέλος #037', gender: 'F', date_of_birth: '1994-08-16', policy_type: 'Basic', risk_category: 'low', risk_score: 8, stability_score: 97, compliance_score: 93, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 200, is_active: true, last_claim_date: '2025-08-10' },
  { id: '38', member_code: 'MBR-038', full_name: 'Μέλος #038', gender: 'M', date_of_birth: '1959-11-04', policy_type: 'Premium', risk_category: 'high', risk_score: 69, stability_score: 48, compliance_score: 53, chronic_conditions: ['COPD', 'Δυσλιπιδαιμία'], er_visits_ytd: 2, total_claims_amount: 15800, is_active: true, last_claim_date: '2026-02-02' },
  { id: '39', member_code: 'MBR-039', full_name: 'Μέλος #039', gender: 'F', date_of_birth: '1981-01-21', policy_type: 'Standard', risk_category: 'low', risk_score: 14, stability_score: 90, compliance_score: 87, chronic_conditions: ['Υποθυρεοειδισμός'], er_visits_ytd: 0, total_claims_amount: 1900, is_active: true, last_claim_date: '2025-12-18' },
  { id: '40', member_code: 'MBR-040', full_name: 'Μέλος #040', gender: 'M', date_of_birth: '1967-06-09', policy_type: 'Standard', risk_category: 'medium', risk_score: 49, stability_score: 64, compliance_score: 69, chronic_conditions: ['Υπέρταση', 'Διαβήτης Τ2'], er_visits_ytd: 1, total_claims_amount: 7300, is_active: true, last_claim_date: '2026-01-28' },
  { id: '41', member_code: 'MBR-041', full_name: 'Μέλος #041', gender: 'F', date_of_birth: '1986-09-27', policy_type: 'Premium', risk_category: 'low', risk_score: 13, stability_score: 93, compliance_score: 89, chronic_conditions: ['Αλλεργίες'], er_visits_ytd: 0, total_claims_amount: 1100, is_active: true, last_claim_date: '2025-11-12' },
  { id: '42', member_code: 'MBR-042', full_name: 'Μέλος #042', gender: 'M', date_of_birth: '1952-12-23', policy_type: 'Premium', risk_category: 'critical', risk_score: 87, stability_score: 25, compliance_score: 41, chronic_conditions: ['CHF', 'CKD Stage 3', 'Διαβήτης Τ2'], er_visits_ytd: 5, total_claims_amount: 48700, is_active: true, last_claim_date: '2026-02-13' },
  { id: '43', member_code: 'MBR-043', full_name: 'Μέλος #043', gender: 'F', date_of_birth: '1997-03-06', policy_type: 'Basic', risk_category: 'low', risk_score: 5, stability_score: 98, compliance_score: 95, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 100, is_active: true, last_claim_date: '2025-06-20' },
  { id: '44', member_code: 'MBR-044', full_name: 'Μέλος #044', gender: 'M', date_of_birth: '1975-08-14', policy_type: 'Standard', risk_category: 'medium', risk_score: 41, stability_score: 71, compliance_score: 76, chronic_conditions: ['Δυσλιπιδαιμία'], er_visits_ytd: 1, total_claims_amount: 4800, is_active: true, last_claim_date: '2026-01-16' },
  { id: '45', member_code: 'MBR-045', full_name: 'Μέλος #045', gender: 'F', date_of_birth: '1983-11-19', policy_type: 'Premium', risk_category: 'low', risk_score: 16, stability_score: 90, compliance_score: 88, chronic_conditions: ['Μιγράνα'], er_visits_ytd: 0, total_claims_amount: 2400, is_active: true, last_claim_date: '2025-12-22' },
  { id: '46', member_code: 'MBR-046', full_name: 'Μέλος #046', gender: 'M', date_of_birth: '1964-05-02', policy_type: 'Premium', risk_category: 'high', risk_score: 67, stability_score: 50, compliance_score: 55, chronic_conditions: ['Υπέρταση', 'Στεφανιαία νόσος'], er_visits_ytd: 2, total_claims_amount: 17600, is_active: true, last_claim_date: '2026-02-07' },
  { id: '47', member_code: 'MBR-047', full_name: 'Μέλος #047', gender: 'F', date_of_birth: '1990-07-31', policy_type: 'Basic', risk_category: 'low', risk_score: 10, stability_score: 95, compliance_score: 91, chronic_conditions: [], er_visits_ytd: 0, total_claims_amount: 320, is_active: true, last_claim_date: '2025-09-08' },
  { id: '48', member_code: 'MBR-048', full_name: 'Μέλος #048', gender: 'M', date_of_birth: '1972-02-11', policy_type: 'Standard', risk_category: 'medium', risk_score: 44, stability_score: 68, compliance_score: 72, chronic_conditions: ['Διαβήτης Τ2'], er_visits_ytd: 1, total_claims_amount: 5900, is_active: true, last_claim_date: '2026-01-20' },
  { id: '49', member_code: 'MBR-049', full_name: 'Μέλος #049', gender: 'F', date_of_birth: '1988-04-17', policy_type: 'Standard', risk_category: 'low', risk_score: 12, stability_score: 92, compliance_score: 87, chronic_conditions: ['Θυρεοειδοπάθεια'], er_visits_ytd: 0, total_claims_amount: 1500, is_active: true, last_claim_date: '2025-12-05' },
  { id: '50', member_code: 'MBR-050', full_name: 'Μέλος #050', gender: 'M', date_of_birth: '1956-10-28', policy_type: 'Premium', risk_category: 'high', risk_score: 73, stability_score: 44, compliance_score: 51, chronic_conditions: ['COPD', 'Υπέρταση', 'Αρρυθμία'], er_visits_ytd: 3, total_claims_amount: 20500, is_active: true, last_claim_date: '2026-02-11' },
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
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Κωδικός Μέλους</p>
              <p className="text-sm text-white font-medium mt-0.5">{member.member_code}</p>
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
            placeholder="Αναζήτηση κωδικού μέλους..."
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
              <TableHead className="text-slate-400 text-xs">Προφίλ</TableHead>
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
