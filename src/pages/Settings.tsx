import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GDPRSection } from '@/components/settings/GDPRSection';
import { WearableConnectionsSection } from '@/components/settings/WearableConnectionsSection';
import { InsuranceConsentSection } from '@/components/settings/InsuranceConsentSection';
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
  ChevronRight,
  Info,
  Check
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Settings = () => {
  const { signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
      title: t('settings.notifications.updated'),
      description: t('settings.notifications.saved')
    });
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: darkMode ? t('settings.appearance.light.enabled') : t('settings.appearance.dark.enabled'),
      description: t('settings.appearance.updated')
    });
  };

  const handleLanguageChange = (lang: 'el' | 'en') => {
    setLanguage(lang);
    toast({
      title: t('settings.language.changed'),
      description: t('settings.language.updated')
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={t('settings.title')} showBack />
      <div className="px-4 py-6 space-y-6 pb-24">
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications')}
          </CardTitle>
          <CardDescription>{t('settings.notifications.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.appointments')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.appointments.desc')}</p>
            </div>
            <Switch
              checked={notifications.appointments}
              onCheckedChange={() => toggleNotification('appointments')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.health')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.health.desc')}</p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={() => toggleNotification('reminders')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.marketing')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.marketing.desc')}</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={() => toggleNotification('marketing')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('settings.channels')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Label>{t('settings.channels.email')}</Label>
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
              <Label>{t('settings.channels.sms')}</Label>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={() => toggleNotification('sms')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            {t('settings.appearance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.appearance.dark')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.appearance.dark.desc')}</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('settings.privacy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-between">
            <span>{t('settings.privacy.password')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span>{t('settings.privacy.2fa')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span>{t('settings.privacy.data')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Help & Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t('settings.help')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-between" onClick={() => navigate('/intro')}>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>{t('settings.help.about')}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>{t('settings.help.center')}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between" onClick={() => navigate('/terms')}>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{t('settings.help.terms')}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-between" onClick={() => navigate('/privacy')}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{t('settings.help.privacy')}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Wearable Devices */}
      <WearableConnectionsSection />

      {/* Insurance Data Consent */}
      <InsuranceConsentSection />

      {/* Insurance Governance */}
      <Card>
        <CardContent className="pt-6">
          <Button variant="ghost" className="w-full justify-between" onClick={() => navigate('/insurance')}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-500" />
              <span>Insurance Governance</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* GDPR Section */}
      <GDPRSection />

      {/* Language */}
      <Card>
        <CardContent className="pt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{t('settings.language')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{language === 'el' ? 'Ελληνικά' : 'English'}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('el')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Ελληνικά</span>
                {language === 'el' && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('en')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>English</span>
                {language === 'en' && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            {t('settings.signout')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.signout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.signout.confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('settings.signout.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>{t('settings.signout')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground">
          {t('app.version')}
        </p>
      </div>
    </div>
  );
};

export default Settings;
