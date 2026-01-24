import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  UserPlus, 
  Shield, 
  Clock, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMedicalAuditLog } from '@/hooks/useMedicalAuditLog';
import { format, addDays } from 'date-fns';
import { el } from 'date-fns/locale';

interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  avatar_url: string | null;
}

interface AccessGrant {
  id: string;
  doctor_user_id: string;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
  grant_type: string;
  doctor?: {
    name: string;
    specialty: string;
    avatar_url: string | null;
  };
}

interface MedicalAccessGrantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DURATION_OPTIONS = [
  { value: '7', label: '7 ημέρες' },
  { value: '30', label: '30 ημέρες' },
  { value: '90', label: '3 μήνες' },
  { value: 'permanent', label: 'Μόνιμη' },
];

export function MedicalAccessGrantsDialog({ open, onOpenChange }: MedicalAccessGrantsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAction } = useMedicalAuditLog();

  const [grants, setGrants] = useState<AccessGrant[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchGrants();
    }
  }, [open, user]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchDoctors();
    } else {
      setDoctors([]);
    }
  }, [searchQuery]);

  const fetchGrants = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_access_grants')
        .select('*')
        .eq('patient_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch doctor info for each grant
      const grantsWithDoctors = await Promise.all(
        (data || []).map(async (grant) => {
          const { data: provider } = await supabase
            .from('providers')
            .select('name, specialty, avatar_url')
            .eq('user_id', grant.doctor_user_id)
            .single();
          
          return { ...grant, doctor: provider };
        })
      );

      setGrants(grantsWithDoctors);
    } catch (error) {
      console.error('Error fetching grants:', error);
    } finally {
      setLoading(false);
    }
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

  const handleGrantAccess = async () => {
    if (!user || !selectedDoctor) return;

    // Check if already granted
    const existingGrant = grants.find(g => g.doctor_user_id === selectedDoctor.user_id && g.is_active);
    if (existingGrant) {
      toast({
        title: 'Ήδη υπάρχει',
        description: 'Έχετε ήδη παραχωρήσει πρόσβαση σε αυτόν τον ιατρό',
        variant: 'destructive',
      });
      return;
    }

    setGranting(true);

    try {
      const expiresAt = duration === 'permanent' 
        ? null 
        : addDays(new Date(), parseInt(duration)).toISOString();

      const { error } = await supabase.from('medical_access_grants').upsert({
        patient_user_id: user.id,
        doctor_user_id: selectedDoctor.user_id,
        expires_at: expiresAt,
        is_active: true,
        grant_type: duration === 'permanent' ? 'permanent' : 'temporary',
      }, {
        onConflict: 'patient_user_id,doctor_user_id',
      });

      if (error) throw error;

      await logAction('share', user.id, 'access_grant', undefined, {
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        duration,
      });

      toast({
        title: 'Επιτυχία',
        description: `Παραχωρήθηκε πρόσβαση στον/στην ${selectedDoctor.name}`,
      });

      setSelectedDoctor(null);
      setSearchQuery('');
      fetchGrants();
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία παραχώρησης πρόσβασης',
        variant: 'destructive',
      });
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeAccess = async (grant: AccessGrant) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('medical_access_grants')
        .update({ is_active: false })
        .eq('id', grant.id);

      if (error) throw error;

      await logAction('revoke_share', user.id, 'access_grant', grant.id, {
        doctor_name: grant.doctor?.name,
      });

      toast({
        title: 'Επιτυχία',
        description: 'Η πρόσβαση ανακλήθηκε',
      });

      fetchGrants();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ανάκλησης πρόσβασης',
        variant: 'destructive',
      });
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const activeGrants = grants.filter(g => g.is_active && !isExpired(g.expires_at));
  const expiredGrants = grants.filter(g => !g.is_active || isExpired(g.expires_at));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Διαχείριση Πρόσβασης
          </DialogTitle>
          <DialogDescription>
            Ελέγξτε ποιοι ιατροί έχουν πρόσβαση στον ιατρικό σας φάκελο
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Add New Grant */}
          <div className="border rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Παραχώρηση Πρόσβασης
            </h4>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Αναζήτηση ιατρού..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Search Results */}
              {doctors.length > 0 && !selectedDoctor && (
                <div className="border rounded-lg max-h-32 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors"
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
                    onClick={() => {
                      setSelectedDoctor(null);
                      setSearchQuery('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

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
                  onClick={handleGrantAccess}
                  disabled={!selectedDoctor || granting}
                >
                  {granting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Παραχώρηση'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Active Grants */}
          <div className="flex-1 overflow-hidden">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Ενεργές Προσβάσεις ({activeGrants.length})
            </h4>

            <ScrollArea className="h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : activeGrants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Δεν υπάρχουν ενεργές προσβάσεις
                </p>
              ) : (
                <div className="space-y-2 pr-4">
                  {activeGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={grant.doctor?.avatar_url || undefined} />
                          <AvatarFallback>
                            {grant.doctor?.name?.[0] || 'D'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{grant.doctor?.name || 'Άγνωστος'}</p>
                          <p className="text-xs text-muted-foreground">
                            {grant.doctor?.specialty}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {grant.expires_at 
                              ? `Λήγει: ${format(new Date(grant.expires_at), 'dd/MM/yyyy')}`
                              : 'Μόνιμη πρόσβαση'
                            }
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRevokeAccess(grant)}
                      >
                        Ανάκληση
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Expired/Revoked Grants */}
            {expiredGrants.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Ανενεργές ({expiredGrants.length})
                </h4>
                <ScrollArea className="h-[100px]">
                  <div className="space-y-2 pr-4">
                    {expiredGrants.map((grant) => (
                      <div
                        key={grant.id}
                        className="flex items-center justify-between p-2 border rounded-lg opacity-60"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {grant.doctor?.name?.[0] || 'D'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{grant.doctor?.name || 'Άγνωστος'}</p>
                            <Badge variant="outline" className="text-xs">
                              {isExpired(grant.expires_at) ? 'Έληξε' : 'Ανακλήθηκε'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Κλείσιμο
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
