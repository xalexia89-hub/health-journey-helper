import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Share2, Search, X, Check, Building2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  specialty: string | null;
  type: string;
  avatar_url: string | null;
}

interface Share {
  id: string;
  provider_id: string;
  is_active: boolean;
  shared_at: string;
  providers: Provider;
}

export function ShareRecordDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [activeShares, setActiveShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchActiveShares();
    }
  }, [open, user]);

  useEffect(() => {
    if (search.length >= 2) {
      searchProviders();
    } else {
      setProviders([]);
    }
  }, [search]);

  const fetchActiveShares = async () => {
    const { data } = await supabase
      .from('medical_record_shares')
      .select('*, providers(*)')
      .eq('patient_id', user?.id)
      .eq('is_active', true);

    if (data) {
      setActiveShares(data as Share[]);
    }
  };

  const searchProviders = async () => {
    const { data } = await supabase
      .from('providers')
      .select('id, name, specialty, type, avatar_url')
      .eq('is_active', true)
      .ilike('name', `%${search}%`)
      .limit(10);

    if (data) {
      setProviders(data);
    }
  };

  const shareWith = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabase
      .from('medical_record_shares')
      .upsert({
        patient_id: user?.id,
        provider_id: provider.id,
        is_active: true
      }, { onConflict: 'patient_id,provider_id' });

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία διαμοιρασμού',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Επιτυχία',
        description: `Ο φάκελος κοινοποιήθηκε στον/στην ${provider.name}`
      });
      fetchActiveShares();
      setSearch('');
    }
    setLoading(false);
  };

  const revokeShare = async (shareId: string, providerName: string) => {
    const { error } = await supabase
      .from('medical_record_shares')
      .update({ is_active: false })
      .eq('id', shareId);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ανάκλησης',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Ανακλήθηκε',
        description: `Η πρόσβαση του/της ${providerName} αφαιρέθηκε`
      });
      fetchActiveShares();
    }
  };

  const isShared = (providerId: string) => {
    return activeShares.some(s => s.provider_id === providerId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Διαμοιρασμός Ιατρικού Φακέλου</DialogTitle>
          <DialogDescription>
            Επιλέξτε γιατρούς ή κλινικές που θέλετε να έχουν πρόσβαση στον ιατρικό σας φάκελο
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Αναζήτηση παρόχου</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση γιατρού ή κλινικής..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Search Results */}
          {providers.length > 0 && (
            <ScrollArea className="h-48 border rounded-lg">
              <div className="p-2 space-y-1">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {provider.type === 'clinic' || provider.type === 'hospital' ? (
                          <Building2 className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">{provider.specialty || provider.type}</p>
                      </div>
                    </div>
                    {isShared(provider.id) ? (
                      <Badge variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Κοινοποιημένο
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => shareWith(provider)}
                        disabled={loading}
                      >
                        Κοινοποίηση
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Active Shares */}
          {activeShares.length > 0 && (
            <div className="space-y-2">
              <Label>Ενεργές κοινοποιήσεις</Label>
              <div className="space-y-2">
                {activeShares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {share.providers.type === 'clinic' || share.providers.type === 'hospital' ? (
                          <Building2 className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{share.providers.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Από {new Date(share.shared_at).toLocaleDateString('el-GR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => revokeShare(share.id, share.providers.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeShares.length === 0 && providers.length === 0 && search.length < 2 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Αναζητήστε γιατρό ή κλινική για να κοινοποιήσετε τον ιατρικό σας φάκελο
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}