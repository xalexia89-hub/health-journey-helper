import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  AlertTriangle, 
  Stethoscope, 
  Scissors, 
  Plus, 
  X,
  Save,
  FileText,
  Users,
  User,
  HeartPulse,
} from 'lucide-react';
import { PreventiveHealthTab } from '@/components/preventive/PreventiveHealthTab';
import { WearableDataWidgets } from '@/components/settings/WearableDataWidgets';
import { WearableHistoryCharts } from '@/components/settings/WearableHistoryCharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ShareRecordDialog } from '@/components/medical-records/ShareRecordDialog';
import { FamilyTreeDialog } from '@/components/medical-records/FamilyTreeDialog';
import { DocumentUploadDialog } from '@/components/medical-records/DocumentUploadDialog';
import { SymptomHistorySection } from '@/components/medical-records/SymptomHistorySection';
import { TestsDiagnosesSection } from '@/components/medical-records/TestsDiagnosesSection';
import { ExecutiveSummarySection } from '@/components/medical-records/ExecutiveSummarySection';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// SymptomEntry interface moved to SymptomHistorySection

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  conditions: string[];
  photoUrl?: string;
}

interface FamilyHistory {
  grandparents: FamilyMember[];
  parents: FamilyMember[];
  siblings: FamilyMember[];
}

interface MedicalRecord {
  id: string;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  current_medications: string[] | null;
  past_surgeries: string[] | null;
  notes: string | null;
  family_history: FamilyHistory | null;
}

type CategoryType = 'allergies' | 'conditions' | 'medications' | 'surgeries' | 'familyTree' | 'notes';

const categories = [
  { 
    id: 'allergies' as CategoryType, 
    label: 'Αλλεργίες', 
    icon: AlertTriangle, 
    field: 'allergies' as keyof MedicalRecord,
    placeholder: 'Προσθήκη αλλεργίας (π.χ., Πενικιλίνη)',
    emptyText: 'Δεν έχουν καταγραφεί αλλεργίες',
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/30',
    pattern: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)',
  },
  { 
    id: 'conditions' as CategoryType, 
    label: 'Παθήσεις', 
    icon: Stethoscope, 
    field: 'chronic_conditions' as keyof MedicalRecord,
    placeholder: 'Προσθήκη πάθησης (π.χ., Διαβήτης)',
    emptyText: 'Δεν έχουν καταγραφεί παθήσεις',
    gradient: 'from-blue-500 to-cyan-600',
    shadow: 'shadow-blue-500/30',
    pattern: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
  },
  { 
    id: 'medications' as CategoryType, 
    label: 'Φάρμακα', 
    icon: Pill, 
    field: 'current_medications' as keyof MedicalRecord,
    placeholder: 'Προσθήκη φαρμάκου (π.χ., Μετφορμίνη)',
    emptyText: 'Δεν έχουν καταγραφεί φάρμακα',
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/30',
    pattern: 'repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0px, rgba(16, 185, 129, 0.1) 2px, transparent 2px, transparent 8px)',
  },
  { 
    id: 'surgeries' as CategoryType, 
    label: 'Χειρουργεία', 
    icon: Scissors, 
    field: 'past_surgeries' as keyof MedicalRecord,
    placeholder: 'Προσθήκη χειρουργείου (π.χ., Σκωληκοειδεκτομή 2020)',
    emptyText: 'Δεν έχουν καταγραφεί χειρουργεία',
    gradient: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/30',
    pattern: 'conic-gradient(from 0deg at 50% 50%, rgba(244, 63, 94, 0.15) 0deg, transparent 60deg, rgba(244, 63, 94, 0.15) 120deg, transparent 180deg)',
  },
  { 
    id: 'familyTree' as CategoryType, 
    label: 'Γενεαλογικό', 
    icon: Users, 
    field: 'family_history' as keyof MedicalRecord,
    placeholder: '',
    emptyText: 'Δεν έχει καταγραφεί οικογενειακό ιστορικό',
    gradient: 'from-purple-500 to-indigo-600',
    shadow: 'shadow-purple-500/30',
    pattern: 'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
  },
];

const MedicalRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [notes, setNotes] = useState('');

  const inputStates: Record<string, { value: string; setter: (v: string) => void }> = {
    allergies: { value: newAllergy, setter: setNewAllergy },
    chronic_conditions: { value: newCondition, setter: setNewCondition },
    current_medications: { value: newMedication, setter: setNewMedication },
    past_surgeries: { value: newSurgery, setter: setNewSurgery },
  };

  useEffect(() => {
    if (user) {
      fetchMedicalRecord();
    }
  }, [user]);

  const defaultFamilyHistory: FamilyHistory = {
    grandparents: [],
    parents: [],
    siblings: [],
  };

  const fetchMedicalRecord = async () => {
    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data) {
      const familyHistory = data.family_history as unknown as FamilyHistory | null;
      setRecord({
        ...data,
        family_history: familyHistory || defaultFamilyHistory,
      });
      setNotes(data.notes || '');
    } else if (user) {
      // Auto-create a medical record for the user
      const { data: newRecord, error } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id,
          allergies: [],
          chronic_conditions: [],
          current_medications: [],
          past_surgeries: [],
          family_history: JSON.parse(JSON.stringify(defaultFamilyHistory)),
          notes: '',
        })
        .select()
        .single();

      if (newRecord && !error) {
        setRecord({
          ...newRecord,
          family_history: defaultFamilyHistory,
        });
      }
    }
    setLoading(false);
  };

  const addItem = (field: keyof MedicalRecord, value: string, setter: (v: string) => void) => {
    if (!value.trim() || !record) return;
    
    const currentArray = (record[field] as string[] | null) || [];
    if (!currentArray.includes(value.trim())) {
      setRecord({
        ...record,
        [field]: [...currentArray, value.trim()]
      });
    }
    setter('');
  };

  const removeItem = (field: keyof MedicalRecord, value: string) => {
    if (!record) return;
    const currentArray = (record[field] as string[] | null) || [];
    setRecord({
      ...record,
      [field]: currentArray.filter(item => item !== value)
    });
  };

  const handleSave = async () => {
    if (!record) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('medical_records')
      .update({
        allergies: record.allergies,
        chronic_conditions: record.chronic_conditions,
        current_medications: record.current_medications,
        past_surgeries: record.past_surgeries,
        notes: notes,
        family_history: JSON.parse(JSON.stringify(record.family_history))
      })
      .eq('id', record.id);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία αποθήκευσης ιατρικού ιστορικού',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Αποθηκεύτηκε',
        description: 'Το ιατρικό σας ιστορικό ενημερώθηκε'
      });
    }
    setSaving(false);
  };

  const handleFamilyTreeSave = (familyHistory: FamilyHistory) => {
    if (!record) return;
    setRecord({
      ...record,
      family_history: familyHistory
    });
    toast({
      title: 'Ενημερώθηκε',
      description: 'Το γενεαλογικό δέντρο ενημερώθηκε. Πατήστε αποθήκευση για να διατηρήσετε τις αλλαγές.'
    });
  };

  const getItemCount = (field: keyof MedicalRecord) => {
    if (!record) return 0;
    if (field === 'family_history') {
      const fh = record.family_history;
      if (!fh) return 0;
      return (fh.grandparents?.length || 0) + (fh.parents?.length || 0) + (fh.siblings?.length || 0);
    }
    const arr = record[field] as string[] | null;
    return arr?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Δεν βρέθηκε ιατρικό ιστορικό</p>
      </div>
    );
  }

  const activeConfig = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Ιατρικό Ιστορικό" showBack />
      
      <div className="px-4 py-6 pb-24">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <p className="text-muted-foreground text-sm flex-1 min-w-0">Διαχειριστείτε τις πληροφορίες υγείας σας</p>
          <TooltipProvider>
            <div className="flex gap-1.5 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShareRecordDialog />
                </TooltipTrigger>
                <TooltipContent>Διαμοιρασμός</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DocumentUploadDialog />
                </TooltipTrigger>
                <TooltipContent>Ανέβασμα Αρχείων</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className="h-8 w-8" onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{saving ? 'Αποθήκευση...' : 'Αποθήκευση'}</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ιστορικό
            </TabsTrigger>
            <TabsTrigger value="preventive" className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" />
              Πρόληψη & Lifestyle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-8">
            {/* Vital Signs from Wearables */}
            <WearableDataWidgets />
            <WearableHistoryCharts />

            {/* Central Hub with Orbiting Categories */}
            <div className="relative flex items-center justify-center h-[280px]">
              {/* Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl" />
              </div>

              {/* Orbital Rings */}
              <div className="absolute w-52 h-52 rounded-full border border-dashed border-primary/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-40 h-40 rounded-full border border-primary/10" />

              {/* Center Avatar */}
              <Avatar className="relative z-10 w-16 h-16 shadow-lg shadow-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70">
                  <User className="h-7 w-7 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>

              {/* Category Circles - Radial Layout */}
              <TooltipProvider>
                {categories.map((cat, index) => {
                  const Icon = cat.icon;
                  const angle = ((index * 72) - 90) * (Math.PI / 180);
                  const radius = 110;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const count = getItemCount(cat.field);
                  const isActive = activeCategory === cat.id;
                  const isFamilyTree = cat.id === 'familyTree';

                  const circleContent = (
                    <div
                      className="absolute z-20 transition-all duration-300 group"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-28px',
                        marginTop: '-28px',
                        transform: `translate(${x}px, ${y}px) scale(${isActive ? 1.15 : 1})`,
                      }}
                    >
                      <div 
                        className="absolute top-1/2 left-1/2 w-16 h-px bg-gradient-to-r from-primary/40 to-transparent -z-10"
                        style={{
                          transform: `rotate(${((index * 72) - 90) + 180}deg)`,
                          transformOrigin: '0 50%',
                        }}
                      />
                      <div 
                        className={`
                          w-14 h-14 rounded-full flex items-center justify-center cursor-pointer
                          bg-gradient-to-br ${cat.gradient}
                          shadow-lg ${cat.shadow}
                          transition-all duration-300
                          ${isActive ? 'ring-4 ring-white/30 scale-110' : 'hover:scale-105'}
                        `}
                        style={{ backgroundImage: cat.pattern }}
                      >
                        <Icon className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-current text-xs font-bold flex items-center justify-center shadow-md">
                          {count}
                        </span>
                      )}
                    </div>
                  );

                  if (isFamilyTree) {
                    return (
                      <Tooltip key={cat.id}>
                        <TooltipTrigger asChild>
                          <div>
                            <FamilyTreeDialog
                              familyHistory={record.family_history || defaultFamilyHistory}
                              onSave={handleFamilyTreeSave}
                              trigger={circleContent}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>{cat.label}</p></TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Tooltip key={cat.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveCategory(isActive ? null : cat.id)}
                          className="focus:outline-none"
                        >
                          {circleContent}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom"><p>{cat.label}</p></TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>

            {/* Active Category Content */}
            {activeConfig && activeConfig.id !== 'familyTree' && inputStates[activeConfig.field] && (
              <Card className="animate-fade-in overflow-hidden">
                <div 
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(to right, ${activeConfig.gradient.includes('amber') ? '#f59e0b' : activeConfig.gradient.includes('blue') ? '#3b82f6' : activeConfig.gradient.includes('emerald') ? '#10b981' : activeConfig.gradient.includes('purple') ? '#8b5cf6' : '#f43f5e'}, transparent)` }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <activeConfig.icon className="h-5 w-5" />
                    {activeConfig.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder={activeConfig.placeholder}
                      value={inputStates[activeConfig.field].value}
                      onChange={(e) => inputStates[activeConfig.field].setter(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem(activeConfig.field, inputStates[activeConfig.field].value, inputStates[activeConfig.field].setter)}
                    />
                    <Button onClick={() => addItem(activeConfig.field, inputStates[activeConfig.field].value, inputStates[activeConfig.field].setter)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {((record[activeConfig.field] as string[] | null) || []).map((item, i) => (
                      <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm">
                        {item}
                        <button
                          onClick={() => removeItem(activeConfig.field, item)}
                          className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {getItemCount(activeConfig.field) === 0 && (
                      <p className="text-sm text-muted-foreground">{activeConfig.emptyText}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <TestsDiagnosesSection />
            <SymptomHistorySection />
            <ExecutiveSummarySection notes={notes} onNotesChange={setNotes} />
          </TabsContent>

          <TabsContent value="preventive">
            <PreventiveHealthTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalRecords;
