import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Send,
  Search,
  X,
  CheckCircle2,
  Clock,
  User,
  Loader2,
  Share2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMedicalAuditLog } from '@/hooks/useMedicalAuditLog';
import { format, addDays } from 'date-fns';

interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  avatar_url: string | null;
}

interface SummaryShare {
  id: string;
  doctor_user_id: string;
  shared_at: string;
  expires_at: string | null;
  is_active: boolean;
  doctor?: {
    name: string;
    specialty: string;
    avatar_url: string | null;
  };
}

interface ExecutiveSummarySectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const DURATION_OPTIONS = [
  { value: '7', label: '7 ημέρες' },
  { value: '30', label: '30 ημέρες' },
  { value: '90', label: '3 μήνες' },
  { value: 'permanent', label: 'Μόνιμη' },
];

export function ExecutiveSummarySection({ notes, onNotesChange }: ExecutiveSummarySectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAction } = useMedicalAuditLog();

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [duration, setDuration] = useState('30');
  const [sharing, setSharing] = useState(false);
  const [activeShares, setActiveShares] = useState<SummaryShare[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);

  useEffect(() => {
    if (shareDialogOpen && user) {
      fetchActiveShares();
    }
  }, [shareDialogOpen, user]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchDoctors();
    } else {
      setDoctors([]);
    }
  }, [searchQuery]);

  const fetchActiveShares = async () => {
    if (!user) return;
    setLoadingShares(true);

    const { data } = await supabase
      .from('medical_record_shares')
      .select('*, providers(name, specialty, avatar_url, user_id)')
      .eq('patient_id', user.id)
      .eq('is_active', true);

    if (data) {
      const mapped: SummaryShare[] = data.map((s: any) => ({
        id: s.id,
        doctor_user_id: s.providers?.user_id || '',
        shared_at: s.shared_at,
        expires_at: s.expires_at,
        is_active: s.is_active,
        doctor: s.providers ? {
          name: s.providers.name,
          specialty: s.providers.specialty,
          avatar_url: s.providers.avatar_url,
        } : undefined,
      }));
      setActiveShares(mapped);
    }
    setLoadingShares(false);
  };

  const searchDoctors = async () => {
    const { data } = await supabase
      .from('providers')
      .select('id, user_id, name, specialty, avatar_url')
      .eq('type', 'doctor')
      .eq('is_active', true)
      .ilike('name', `%${searchQuery}%`)
      .limit(10);

    setDoctors(data || []);
  };

  const handleShare = async () => {
    if (!user || !selectedDoctor || !notes.trim()) return;

    setSharing(true);

    try {
      const expiresAt = duration === 'permanent'
        ? null
        : addDays(new Date(), parseInt(duration)).toISOString();

      // Share via medical_record_shares (re-uses existing table)
      const { error } = await supabase
        .from('medical_record_shares')
        .upsert({
          patient_id: user.id,
          provider_id: selectedDoctor.id,
          is_active: true,
          expires_at: expiresAt,
        }, { onConflict: 'patient_id,provider_id' });

      if (error) throw error;

      // Also grant access via medical_access_grants
      await supabase
        .from('medical_access_grants')
        .upsert({
          patient_user_id: user.id,
          doctor_user_id: selectedDoctor.user_id,
          expires_at: expiresAt,
          is_active: true,
          grant_type: duration === 'permanent' ? 'permanent' : 'temporary',
        }, { onConflict: 'patient_user_id,doctor_user_id' });

      // Create notification for the doctor
      if (selectedDoctor.user_id) {
        await supabase.from('notifications').insert({
          user_id: selectedDoctor.user_id,
          title: 'Νέα Σύνοψη Υγείας',
          message: `Ένας ασθενής σάς κοινοποίησε τη σύνοψη του ιατρικού του ιστορικού. Ελέγξτε τον φάκελο του ασθενή.`,
          type: 'medical_share',
        });
      }

      await logAction('share', user.id, 'medical_entry', undefined, {
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        content_type: 'executive_summary',
        duration,
      });

      toast({
        title: 'Επιτυχής Κοινοποίηση',
        description: `Η σύνοψη κοινοποιήθηκε στον/στην ${selectedDoctor.name}`,
      });

      setSelectedDoctor(null);
      setSearchQuery('');
      fetchActiveShares();
    } catch (error) {
      console.error('Error sharing summary:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία κοινοποίησης σύνοψης',
        variant: 'destructive',
      });
    } finally {
      setSharing(false);
    }
  };

  const handleRevokeShare = async (shareId: string, doctorName: string) => {
    const { error } = await supabase
      .from('medical_record_shares')
      .update({ is_active: false })
      .eq('id', shareId);

    if (error) {
      toast({ title: 'Σφάλμα', description: 'Αποτυχία ανάκλησης', variant: 'destructive' });
    } else {
      toast({ title: 'Ανακλήθηκε', description: `Η πρόσβαση του/της ${doctorName} αφαιρέθηκε` });
      fetchActiveShares();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Executive Summary
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              disabled={!notes.trim()}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Κοινοποίηση σε Γιατρό
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Καταγράψτε σημαντικές πληροφορίες υγείας και κοινοποιήστε τες στον γιατρό σας
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Γράψτε τη σύνοψη του ιατρικού σας ιστορικού, σημαντικές παρατηρήσεις, τρέχουσα κατάσταση υγείας..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={5}
            className="resize-none"
          />

          {/* Active shares preview */}
          {activeShares.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center">Κοινοποιημένο σε:</span>
              {activeShares.map((share) => (
                <Badge key={share.id} variant="secondary" className="gap-1.5">
                  <User className="h-3 w-3" />
                  {share.doctor?.name || 'Γιατρός'}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Κοινοποίηση Σύνοψης
            </DialogTitle>
            <DialogDescription>
              Επιλέξτε τον γιατρό που θέλετε να λάβει τη σύνοψή σας
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary Preview */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Προεπισκόπηση Σύνοψης</p>
              <p className="text-sm line-clamp-3">{notes || 'Δεν υπάρχει σύνοψη'}</p>
            </div>

            {/* Doctor Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Αναζήτηση γιατρού..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Search Results */}
              {doctors.length > 0 && !selectedDoctor && (
                <ScrollArea className="h-32 border rounded-lg">
                  <div className="p-1">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setSearchQuery(doctor.name);
                          setDoctors([]);
                        }}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={doctor.avatar_url || undefined} />
                          <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Selected Doctor */}
              {selectedDoctor && (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedDoctor.avatar_url || undefined} />
                      <AvatarFallback>{selectedDoctor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedDoctor.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => { setSelectedDoctor(null); setSearchQuery(''); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="flex gap-2">
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleShare}
                disabled={!selectedDoctor || sharing || !notes.trim()}
                className="gap-2"
              >
                {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Αποστολή
              </Button>
            </div>

            {/* Active Shares */}
            {activeShares.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Ενεργές Κοινοποιήσεις
                </p>
                <div className="space-y-2">
                  {activeShares.map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{share.doctor?.name?.[0] || 'D'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{share.doctor?.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {share.expires_at
                              ? `Λήγει: ${format(new Date(share.expires_at), 'dd/MM/yyyy')}`
                              : 'Μόνιμη'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-7"
                        onClick={() => handleRevokeShare(share.id, share.doctor?.name || '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
