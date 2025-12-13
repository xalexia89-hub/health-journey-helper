import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Building2,
  User,
  Stethoscope,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'hospital';
  specialty: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  rating: number | null;
  review_count: number | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
  avatar_url: string | null;
  services: string[] | null;
  qualifications: string[] | null;
  description: string | null;
}

const typeIcons = {
  doctor: User,
  clinic: Building2,
  hospital: Stethoscope
};

const AdminProviders = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const { data } = await supabase
      .from('providers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProviders(data as Provider[]);
    setLoading(false);
  };

  const handleVerify = async (providerId: string, verify: boolean) => {
    const { error } = await supabase
      .from('providers')
      .update({ is_verified: verify })
      .eq('id', providerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive'
      });
    } else {
      toast({
        title: verify ? 'Provider Verified' : 'Verification Removed',
        description: verify ? 'Provider has been verified successfully' : 'Provider verification has been removed'
      });
      fetchProviders();
      setSelectedProvider(null);
    }
  };

  const handleToggleActive = async (providerId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('providers')
      .update({ is_active: isActive })
      .eq('id', providerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    } else {
      toast({
        title: isActive ? 'Provider Activated' : 'Provider Deactivated',
        description: `Provider has been ${isActive ? 'activated' : 'deactivated'}`
      });
      fetchProviders();
    }
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingProviders = filteredProviders.filter(p => !p.is_verified);
  const verifiedProviders = filteredProviders.filter(p => p.is_verified);

  const ProviderCard = ({ provider }: { provider: Provider }) => {
    const TypeIcon = typeIcons[provider.type];
    
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={provider.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{provider.name}</p>
                  {provider.is_verified && (
                    <CheckCircle className="h-4 w-4 text-health-success" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {provider.type}
                  </Badge>
                  {provider.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-health-warning text-health-warning" />
                      {provider.rating}
                    </span>
                  )}
                  {provider.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {provider.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={provider.is_active ?? true}
                onCheckedChange={(checked) => handleToggleActive(provider.id, checked)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProvider(provider)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Provider Management</h1>
        <p className="text-muted-foreground">Verify and manage healthcare providers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{providers.length}</p>
            <p className="text-sm text-muted-foreground">Total Providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-health-warning">{pendingProviders.length}</p>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-health-success">{verifiedProviders.length}</p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{providers.filter(p => p.is_active).length}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pendingProviders.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verifiedProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingProviders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-health-success mb-4" />
                <p className="text-muted-foreground">No pending verifications</p>
              </CardContent>
            </Card>
          ) : (
            pendingProviders.map(p => <ProviderCard key={p.id} provider={p} />)
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-4 mt-4">
          {verifiedProviders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No verified providers yet</p>
              </CardContent>
            </Card>
          ) : (
            verifiedProviders.map(p => <ProviderCard key={p.id} provider={p} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Provider Details Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProvider.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedProvider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{selectedProvider.name}</p>
                    {selectedProvider.is_verified && (
                      <CheckCircle className="h-5 w-5 text-health-success" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedProvider.specialty}</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {selectedProvider.type}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                {selectedProvider.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <span>{selectedProvider.email}</span>
                  </div>
                )}
                {selectedProvider.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    <span>{selectedProvider.phone}</span>
                  </div>
                )}
                {selectedProvider.address && (
                  <div>
                    <span className="text-muted-foreground">Address:</span>{' '}
                    <span>{selectedProvider.address}, {selectedProvider.city}</span>
                  </div>
                )}
                {selectedProvider.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Rating:</span>
                    <Star className="h-4 w-4 fill-health-warning text-health-warning" />
                    <span>{selectedProvider.rating} ({selectedProvider.review_count} reviews)</span>
                  </div>
                )}
              </div>

              {selectedProvider.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                </div>
              )}

              {selectedProvider.services && selectedProvider.services.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Services</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProvider.services.map((s, i) => (
                      <Badge key={i} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProvider.qualifications && selectedProvider.qualifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Qualifications</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProvider.qualifications.map((q, i) => (
                      <Badge key={i} variant="outline">{q}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {!selectedProvider.is_verified ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1 bg-health-success hover:bg-health-success/90">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Provider
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Verify Provider?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark {selectedProvider.name} as a verified healthcare provider.
                          Verified providers are displayed with a verification badge.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleVerify(selectedProvider.id, true)}>
                          Verify
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="flex-1 text-health-danger">
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove Verification
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Verification?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the verification badge from {selectedProvider.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleVerify(selectedProvider.id, false)}
                          className="bg-health-danger hover:bg-health-danger/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProviders;
