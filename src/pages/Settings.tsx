import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Shield,
  LogOut,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Globe,
  HelpCircle,
  FileText,
  ChevronRight
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

const Settings = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    appointments: true,
    reminders: true,
    marketing: false,
    sms: true,
    email: true
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: 'Ρυθμίσεις Ενημερώθηκαν',
      description: 'Οι προτιμήσεις ειδοποιήσεων αποθηκεύτηκαν.'
    });
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: darkMode ? 'Ενεργοποιήθηκε το Φωτεινό Θέμα' : 'Ενεργοποιήθηκε το Σκοτεινό Θέμα',
      description: 'Οι προτιμήσεις εμφάνισης ενημερώθηκαν.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Ρυθμίσεις" showBack />
      <div className="px-4 py-6 space-y-6 pb-24">
        <p className="text-muted-foreground">Διαχειριστείτε τις προτιμήσεις της εφαρμογής</p>

      {/* Ειδοποιήσεις */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Ειδοποιήσεις
          </CardTitle>
          <CardDescription>Διαμορφώστε πώς θέλετε να ειδοποιείστε</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Υπενθυμίσεις Ραντεβού</Label>
              <p className="text-sm text-muted-foreground">Ειδοποίηση πριν τα ραντεβού σας</p>
            </div>
            <Switch
              checked={notifications.appointments}
              onCheckedChange={() => toggleNotification('appointments')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Υπενθυμίσεις Υγείας</Label>
              <p className="text-sm text-muted-foreground">Υπενθυμίσεις φαρμάκων και ελέγχων</p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={() => toggleNotification('reminders')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ενημερωτικές Επικοινωνίες</Label>
              <p className="text-sm text-muted-foreground">Λήψη συμβουλών υγείας και προσφορών</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={() => toggleNotification('marketing')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Κανάλια Επικοινωνίας */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Κανάλια Επικοινωνίας
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Label>Ειδοποιήσεις Email</Label>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => toggleNotification('email')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <Label>Ειδοποιήσεις SMS</Label>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={() => toggleNotification('sms')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Εμφάνιση */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Εμφάνιση
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Σκοτεινό Θέμα</Label>
              <p className="text-sm text-muted-foreground">Εναλλαγή μεταξύ φωτεινού και σκοτεινού θέματος</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Απόρρητο & Ασφάλεια */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Απόρρητο & Ασφάλεια
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-between">
            <span>Αλλαγή Κωδικού</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span>Ταυτοποίηση Δύο Παραγόντων</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span>Ρυθμίσεις Απορρήτου Δεδομένων</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Βοήθεια & Νομικά */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Βοήθεια & Νομικά
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Κέντρο Βοήθειας</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Όροι Χρήσης</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Πολιτική Απορρήτου</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Γλώσσα */}
      <Card>
        <CardContent className="pt-6">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Γλώσσα</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Ελληνικά</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Αποσύνδεση */}
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
              Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε από τον λογαριασμό σας;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Αποσύνδεση</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        {/* Έκδοση Εφαρμογής */}
        <p className="text-center text-sm text-muted-foreground">
          MediConnect v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
