import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FlaskConical, 
  ScanLine, 
  Stethoscope, 
  Plus, 
  Search,
  Calendar,
  Building,
  FileText,
  Paperclip,
  Eye,
  Trash2,
  Share2,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMedicalAuditLog } from '@/hooks/useMedicalAuditLog';
import { AddMedicalEntryDialog } from './AddMedicalEntryDialog';
import { MedicalEntryDetailDialog } from './MedicalEntryDetailDialog';
import { MedicalAccessGrantsDialog } from './MedicalAccessGrantsDialog';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

type EntryType = 'blood_test' | 'imaging' | 'diagnosis';

interface MedicalEntry {
  id: string;
  entry_type: EntryType;
  title: string;
  description: string | null;
  entry_date: string;
  provider_name: string | null;
  provider_id: string | null;
  symptom_session_id: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  created_at: string;
}

const ENTRY_TYPE_CONFIG: Record<EntryType, { label: string; icon: React.ReactNode; gradient: string }> = {
  blood_test: {
    label: 'Αιματολογικές',
    icon: <FlaskConical className="h-4 w-4" />,
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  imaging: {
    label: 'Απεικονιστικές',
    icon: <ScanLine className="h-4 w-4" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  diagnosis: {
    label: 'Διαγνώσεις',
    icon: <Stethoscope className="h-4 w-4" />,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
};

export function TestsDiagnosesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAction } = useMedicalAuditLog();
  
  const [entries, setEntries] = useState<MedicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | EntryType>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MedicalEntry | null>(null);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from('medical_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (entriesError) throw entriesError;

      // Fetch attachments for each entry
      const entriesWithAttachments = await Promise.all(
        (entriesData || []).map(async (entry) => {
          const { data: attachments } = await supabase
            .from('medical_entry_attachments')
            .select('*')
            .eq('entry_id', entry.id);
          
          return { ...entry, attachments: attachments || [] };
        })
      );

      setEntries(entriesWithAttachments as MedicalEntry[]);
    } catch (error) {
      console.error('Error fetching medical entries:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία φόρτωσης ιατρικών καταχωρήσεων',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewEntry = async (entry: MedicalEntry) => {
    if (user) {
      await logAction('view', user.id, 'medical_entry', entry.id, { title: entry.title });
    }
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('medical_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      await logAction('delete', user.id, 'medical_entry', entryId);

      toast({
        title: 'Επιτυχία',
        description: 'Η καταχώρηση διαγράφηκε',
      });
      
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία διαγραφής',
        variant: 'destructive',
      });
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesType = activeTab === 'all' || entry.entry_type === activeTab;
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const getEntryTypeStats = () => {
    return {
      blood_test: entries.filter(e => e.entry_type === 'blood_test').length,
      imaging: entries.filter(e => e.entry_type === 'imaging').length,
      diagnosis: entries.filter(e => e.entry_type === 'diagnosis').length,
    };
  };

  const stats = getEntryTypeStats();

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Εξετάσεις & Διαγνώσεις
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccessDialogOpen(true)}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Διαχείριση Πρόσβασης
            </Button>
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Προσθήκη
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {(Object.entries(ENTRY_TYPE_CONFIG) as [EntryType, typeof ENTRY_TYPE_CONFIG['blood_test']][]).map(([type, config]) => (
            <div
              key={type}
              className={`rounded-lg bg-gradient-to-br ${config.gradient} p-3 text-center`}
            >
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                {config.icon}
                <span className="text-xs">{config.label}</span>
              </div>
              <p className="text-xl font-bold mt-1">{stats[type]}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Αναζήτηση σε εξετάσεις..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="gap-1">
              <Filter className="h-3 w-3" />
              Όλα
            </TabsTrigger>
            <TabsTrigger value="blood_test" className="gap-1">
              <FlaskConical className="h-3 w-3" />
              Αιμ/κές
            </TabsTrigger>
            <TabsTrigger value="imaging" className="gap-1">
              <ScanLine className="h-3 w-3" />
              Απεικ/κές
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="gap-1">
              <Stethoscope className="h-3 w-3" />
              Διαγν.
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Δεν βρέθηκαν καταχωρήσεις</p>
                <Button
                  variant="link"
                  onClick={() => setAddDialogOpen(true)}
                  className="mt-2"
                >
                  Προσθέστε την πρώτη σας καταχώρηση
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <MedicalEntryCard
                    key={entry.id}
                    entry={entry}
                    onView={() => handleViewEntry(entry)}
                    onDelete={() => handleDeleteEntry(entry.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>

      <AddMedicalEntryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchEntries}
      />

      <MedicalEntryDetailDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onRefresh={fetchEntries}
      />

      <MedicalAccessGrantsDialog
        open={accessDialogOpen}
        onOpenChange={setAccessDialogOpen}
      />
    </Card>
  );
}

interface MedicalEntryCardProps {
  entry: MedicalEntry;
  onView: () => void;
  onDelete: () => void;
}

function MedicalEntryCard({ entry, onView, onDelete }: MedicalEntryCardProps) {
  const config = ENTRY_TYPE_CONFIG[entry.entry_type];

  return (
    <div
      className={`group rounded-lg border bg-gradient-to-br ${config.gradient} p-4 transition-all hover:shadow-md cursor-pointer`}
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 text-xs">
              {config.icon}
              {config.label}
            </Badge>
            {entry.attachments && entry.attachments.length > 0 && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Paperclip className="h-3 w-3" />
                {entry.attachments.length}
              </Badge>
            )}
          </div>
          
          <h4 className="font-medium text-foreground">{entry.title}</h4>
          
          {entry.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {entry.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(entry.entry_date), 'dd MMM yyyy', { locale: el })}
            </span>
            {entry.provider_name && (
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {entry.provider_name}
              </span>
            )}
          </div>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs py-0">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{entry.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
