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
  Plus,
  ImagePlus,
  Trash2,
  Loader2,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger, getErrorMessage } from '@/lib/logger';
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

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

const DoctorSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  
  const [newService, setNewService] = useState('');
  const [newQualification, setNewQualification] = useState('');

  useEffect(() => {
    if (user) {
      fetchProvider();
      fetchGallery();
    }
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

  const fetchGallery = async () => {
    const { data: providerData } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (providerData) {
      const { data } = await supabase
        .from('provider_gallery')
        .select('*')
        .eq('provider_id', providerData.id)
        .order('display_order', { ascending: true });

      if (data) setGalleryImages(data);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !provider || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('providers')
        .update({ avatar_url: publicUrl })
        .eq('id', provider.id);

      if (updateError) throw updateError;

      setProvider({ ...provider, avatar_url: publicUrl });
      toast({ title: 'Επιτυχία', description: 'Η φωτογραφία προφίλ ενημερώθηκε' });
    } catch (error: unknown) {
      toast({ title: 'Σφάλμα', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !provider || !user) return;

    if (galleryImages.length >= 5) {
      toast({
        title: 'Όριο φωτογραφιών',
        description: 'Μπορείτε να ανεβάσετε μέχρι 5 φωτογραφίες',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/gallery_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('provider-gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('provider-gallery')
        .getPublicUrl(fileName);

      const { data, error: insertError } = await supabase
        .from('provider_gallery')
        .insert({
          provider_id: provider.id,
          image_url: publicUrl,
          display_order: galleryImages.length
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setGalleryImages([...galleryImages, data]);
      toast({ title: 'Επιτυχία', description: 'Η φωτογραφία προστέθηκε στη gallery' });
    } catch (error: unknown) {
      toast({ title: 'Σφάλμα', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('provider_gallery')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setGalleryImages(galleryImages.filter(img => img.id !== imageId));
      toast({ title: 'Επιτυχία', description: 'Η φωτογραφία διαγράφηκε' });
    } catch (error: unknown) {
      toast({ title: 'Σφάλμα', description: getErrorMessage(error), variant: 'destructive' });
    }
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
        title: 'Σφάλμα',
        description: 'Αποτυχία ενημέρωσης προφίλ',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Επιτυχία',
        description: 'Το προφίλ σας αποθηκεύτηκε'
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
        <p className="text-muted-foreground">Δεν βρέθηκε προφίλ παρόχου</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ρυθμίσεις</h1>
          <p className="text-muted-foreground">Διαχειριστείτε το προφίλ σας</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
        </Button>
      </div>

      {/* Profile Header with Avatar Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={provider.avatar_url || undefined} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{provider.name}</h2>
              <p className="text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery - 5 Promotional Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Διαφημιστικές Φωτογραφίες
          </CardTitle>
          <CardDescription>
            Ανεβάστε μέχρι 5 φωτογραφίες του ιατρείου σας ({galleryImages.length}/5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image.image_url}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDeleteGalleryImage(image.id, image.image_url)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {galleryImages.length < 5 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                {uploadingImage ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <>
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Προσθήκη</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Βασικές Πληροφορίες
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Όνομα / Επωνυμία</Label>
              <Input
                id="name"
                value={provider.name}
                onChange={(e) => setProvider({ ...provider, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Ειδικότητα</Label>
              <Input
                id="specialty"
                value={provider.specialty || ''}
                onChange={(e) => setProvider({ ...provider, specialty: e.target.value })}
                placeholder="π.χ. Γενική Ιατρική, Καρδιολογία"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Βιογραφικό / Περιγραφή Ιατρείου</Label>
            <Textarea
              id="description"
              value={provider.description || ''}
              onChange={(e) => setProvider({ ...provider, description: e.target.value })}
              placeholder="Περιγράψτε τον εαυτό σας και το ιατρείο σας στους ασθενείς..."
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
            Επικοινωνία & Τοποθεσία
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
              <Label htmlFor="phone">Τηλέφωνο</Label>
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
            <Label htmlFor="address">Διεύθυνση</Label>
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
            <Label htmlFor="city">Πόλη</Label>
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
            Τιμολόγηση
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceMin">Ελάχιστη Τιμή (€)</Label>
              <Input
                id="priceMin"
                type="number"
                value={provider.price_min || ''}
                onChange={(e) => setProvider({ ...provider, price_min: parseFloat(e.target.value) || null })}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceMax">Μέγιστη Τιμή (€)</Label>
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
          <CardTitle>Υπηρεσίες</CardTitle>
          <CardDescription>Οι υπηρεσίες που προσφέρετε</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Προσθήκη υπηρεσίας..."
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
          <CardTitle>Προσόντα & Πιστοποιήσεις</CardTitle>
          <CardDescription>Τα ιατρικά σας προσόντα</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              placeholder="Προσθήκη προσόντος..."
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
            Αποσύνδεση
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Αποσύνδεση</AlertDialogTitle>
            <AlertDialogDescription>
              Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Αποσύνδεση</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DoctorSettings;