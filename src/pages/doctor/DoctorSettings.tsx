import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Building,
  DollarSign,
  Save,
  LogOut,
  Mail,
  Phone,
  MapPin,
  X,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface ProviderProfile {
  id: string;
  name: string;
  specialty: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  price_min: number | null;
  price_max: number | null;
  services: string[] | null;
  qualifications: string[] | null;
  avatar_url: string | null;
}

const DoctorSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newService, setNewService] = useState('');
  const [newQualification, setNewQualification] = useState('');

  useEffect(() => {
    if (user) fetchProvider();
  }, [user]);

  const fetchProvider = async () => {
    const { data } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) setProvider(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!provider) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('providers')
      .update({
        name: provider.name,
        specialty: provider.specialty,
        description: provider.description,
        phone: provider.phone,
        email: provider.email,
        address: provider.address,
        city: provider.city,
        price_min: provider.price_min,
        price_max: provider.price_max,
        services: provider.services,
        qualifications: provider.qualifications
      })
      .eq('id', provider.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your provider profile has been saved'
      });
    }
    setSaving(false);
  };

  const addService = () => {
    if (!newService.trim() || !provider) return;
    const services = provider.services || [];
    if (!services.includes(newService.trim())) {
      setProvider({ ...provider, services: [...services, newService.trim()] });
    }
    setNewService('');
  };

  const removeService = (service: string) => {
    if (!provider) return;
    setProvider({
      ...provider,
      services: (provider.services || []).filter(s => s !== service)
    });
  };

  const addQualification = () => {
    if (!newQualification.trim() || !provider) return;
    const qualifications = provider.qualifications || [];
    if (!qualifications.includes(newQualification.trim())) {
      setProvider({ ...provider, qualifications: [...qualifications, newQualification.trim()] });
    }
    setNewQualification('');
  };

  const removeQualification = (qualification: string) => {
    if (!provider) return;
    setProvider({
      ...provider,
      qualifications: (provider.qualifications || []).filter(q => q !== qualification)
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Provider profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your provider profile</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={provider.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{provider.name}</h2>
              <p className="text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name / Practice Name</Label>
              <Input
                id="name"
                value={provider.name}
                onChange={(e) => setProvider({ ...provider, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={provider.specialty || ''}
                onChange={(e) => setProvider({ ...provider, specialty: e.target.value })}
                placeholder="e.g., General Medicine, Cardiology"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={provider.description || ''}
              onChange={(e) => setProvider({ ...provider, description: e.target.value })}
              placeholder="Tell patients about yourself and your practice..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Contact & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={provider.email || ''}
                  onChange={(e) => setProvider({ ...provider, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={provider.phone || ''}
                  onChange={(e) => setProvider({ ...provider, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={provider.address || ''}
                onChange={(e) => setProvider({ ...provider, address: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={provider.city || ''}
              onChange={(e) => setProvider({ ...provider, city: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceMin">Minimum Price (€)</Label>
              <Input
                id="priceMin"
                type="number"
                value={provider.price_min || ''}
                onChange={(e) => setProvider({ ...provider, price_min: parseFloat(e.target.value) || null })}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceMax">Maximum Price (€)</Label>
              <Input
                id="priceMax"
                type="number"
                value={provider.price_max || ''}
                onChange={(e) => setProvider({ ...provider, price_max: parseFloat(e.target.value) || null })}
                placeholder="150"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>List the services you provide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add a service..."
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <Button onClick={addService}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(provider.services || []).map((service, i) => (
              <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                {service}
                <button
                  onClick={() => removeService(service)}
                  className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle>Qualifications & Certifications</CardTitle>
          <CardDescription>Add your medical qualifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              placeholder="Add a qualification..."
              onKeyPress={(e) => e.key === 'Enter' && addQualification()}
            />
            <Button onClick={addQualification}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(provider.qualifications || []).map((qual, i) => (
              <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                {qual}
                <button
                  onClick={() => removeQualification(qual)}
                  className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DoctorSettings;
