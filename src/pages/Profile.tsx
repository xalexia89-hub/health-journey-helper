import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar, Droplet, Save, Camera, Loader2, Settings, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateOfBirthInput } from '@/components/ui/date-of-birth-input';

interface ProfileData {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  blood_type: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // If no profile exists, create one
    if (!data) {
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null
        })
        .select()
        .single();
      
      if (!error && newProfile) {
        data = newProfile;
      }
    }

    // Generate signed URL for avatar if it exists and looks like a storage path
    if (data?.avatar_url && !data.avatar_url.startsWith('http')) {
      const { data: signedUrlData } = await supabase.storage
        .from('avatars')
        .createSignedUrl(data.avatar_url, 3600); // 1 hour expiry
      
      if (signedUrlData) {
        data = { ...data, avatar_url: signedUrlData.signedUrl };
      }
    }

    if (data) setProfile(data);
    setLoading(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Μη έγκυρο αρχείο',
        description: 'Παρακαλώ επιλέξτε μια εικόνα',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Αρχείο πολύ μεγάλο',
        description: 'Η εικόνα πρέπει να είναι μικρότερη από 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get signed URL (bucket is private for privacy)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('avatars')
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      if (signedUrlError) throw signedUrlError;

      const avatarUrl = signedUrlData.signedUrl;

      // Update profile with the file path (not URL) for later signed URL generation
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: avatarUrl });

      toast({
        title: 'Επιτυχία!',
        description: 'Η φωτογραφία προφίλ ενημερώθηκε',
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ανεβάσματος φωτογραφίας',
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        blood_type: profile.blood_type,
        address: profile.address,
        city: profile.city,
        country: profile.country
      })
      .eq('id', profile.id);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ενημέρωσης προφίλ',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Προφίλ ενημερώθηκε',
        description: 'Τα στοιχεία σας αποθηκεύτηκαν επιτυχώς'
      });
    }
    setSaving(false);
  };

  const updateField = (field: keyof ProfileData, value: string | null) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Το προφίλ δεν βρέθηκε</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Το Προφίλ μου" showBack />
      <div className="px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Διαχειριστείτε τα προσωπικά σας στοιχεία</p>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
          </Button>
        </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile.full_name || 'Το Όνομά σας'}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ανέβασμα...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Αλλαγή φωτογραφίας
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Προσωπικά Στοιχεία
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ονοματεπώνυμο</Label>
              <Input
                id="fullName"
                value={profile.full_name || ''}
                onChange={(e) => updateField('full_name', e.target.value)}
                placeholder="Εισάγετε το ονοματεπώνυμό σας"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Τηλέφωνο</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+30 69X XXX XXXX"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Ημερομηνία Γέννησης</Label>
              <DateOfBirthInput
                id="dob"
                value={profile.date_of_birth}
                onChange={(v) => updateField('date_of_birth', v)}
              />
              <p className="text-xs text-muted-foreground">
                Συμπληρώστε χειροκίνητα ημέρα, μήνα και έτος γέννησης.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-destructive" />
            Ιατρικές Πληροφορίες
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Ομάδα Αίματος</Label>
            <Select
              value={profile.blood_type || ''}
              onValueChange={(value) => updateField('blood_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε ομάδα αίματος" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Διεύθυνση
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Οδός</Label>
            <Input
              id="address"
              value={profile.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Εισάγετε τη διεύθυνσή σας"
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Πόλη</Label>
              <Input
                id="city"
                value={profile.city || ''}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Εισάγετε την πόλη σας"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Χώρα</Label>
              <Input
                id="country"
                value={profile.country || ''}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="Εισάγετε τη χώρα σας"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Link */}
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => navigate('/settings')}
      >
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Ρυθμίσεις</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Profile;