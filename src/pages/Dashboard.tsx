import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, FileText, Heart, Activity, 
  Stethoscope, Building2, Hospital, UserRound, GraduationCap, Pill,
  Bell, AlertTriangle, CheckCircle2, Clock, TrendingUp, Shield,
  ChevronRight, Sparkles, Zap
} from "lucide-react";


interface Profile {
  full_name: string | null;
}

interface HealthFile {
  onboarding_completed: boolean;
  weight_kg: number | null;
  height_cm: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  provider: { name: string; specialty: string | null };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface MedicationReminder {
  id: string;
  medication_name: string;
  dosage: string | null;
  reminder_times: string[];
  is_active: boolean;
}

interface SymptomEntry {
  id: string;
  ai_summary: string | null;
  urgency_level: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [healthFile, setHealthFile] = useState<HealthFile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [medications, setMedications] = useState<MedicationReminder[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
      setupRealtimeNotifications();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    const [profileRes, healthRes, appointmentsRes, notificationsRes, medicationsRes, symptomsRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
      supabase.from('health_files').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('appointments')
        .select('id, appointment_date, appointment_time, status, provider:providers(name, specialty)')
        .eq('patient_id', user.id)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .limit(3),
      supabase.from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('medication_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(3),
      supabase.from('symptom_entries')
        .select('id, ai_summary, urgency_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (healthRes.data) setHealthFile(healthRes.data);
    if (appointmentsRes.data) setAppointments(appointmentsRes.data as unknown as Appointment[]);
    if (notificationsRes.data) setNotifications(notificationsRes.data);
    if (medicationsRes.data) setMedications(medicationsRes.data);
    if (symptomsRes.data) setRecentSymptoms(symptomsRes.data);
    
    setLoading(false);
  };

  const setupRealtimeNotifications = () => {
    const channel = supabase
      .channel('dashboard-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev.slice(0, 4)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const quickActions = [
    { icon: Heart, label: "Έλεγχος Συμπτωμάτων", path: "/symptoms", color: "bg-health-coral-light text-health-coral", description: "AI ανάλυση συμπτωμάτων" },
    { icon: Stethoscope, label: "Εύρεση Γιατρών", path: "/providers?type=doctor", color: "bg-health-mint-light text-primary", description: "Βρες ειδικό γιατρό" },
    { icon: Building2, label: "Εύρεση Κλινικών", path: "/providers?type=clinic", color: "bg-health-blue-light text-health-blue", description: "Διαγνωστικά κέντρα" },
    { icon: Hospital, label: "Νοσοκομεία", path: "/providers?type=hospital", color: "bg-health-lavender-light text-health-lavender", description: "Νοσοκομειακές μονάδες" },
    { icon: UserRound, label: "Κατ' Οίκον Νοσηλεία", path: "/nurses", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400", description: "Υπηρεσίες στο σπίτι" },
    { icon: GraduationCap, label: "Ιατρική Ακαδημία", path: "/academy", color: "bg-accent/20 text-accent", description: "Εκπαιδευτικό υλικό" },
    { icon: Calendar, label: "Τα Ραντεβού μου", path: "/appointments", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", description: "Διαχείριση ραντεβού" },
    { icon: Pill, label: "Υπενθυμίσεις Φαρμάκων", path: "/medications", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", description: "Πρόγραμμα φαρμάκων" },
    { icon: FileText, label: "Ιατρικό Ιστορικό", path: "/records", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400", description: "Πλήρες ιστορικό υγείας" },
  ];

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'εκεί';
  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  // Calculate health score (simple algorithm based on available data)
  const calculateHealthScore = () => {
    let score = 70; // Base score
    if (healthFile?.onboarding_completed) score += 10;
    if (healthFile?.weight_kg && healthFile?.height_cm) score += 5;
    if (medications.length > 0) score += 5;
    if (recentSymptoms.some(s => s.urgency_level === 'high')) score -= 15;
    return Math.min(100, Math.max(0, score));
  };

  const healthScore = calculateHealthScore();

  // Calculate positions for orbital layout
  const getOrbitalPosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
      angle: angle + 90
    };
  };

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-3 py-4 space-y-4 pb-24">
        {/* Welcome Section with Health Score */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-foreground truncate">
                Καλώς ήρθες, <span className="text-primary">{firstName}</span> 
              </h1>
              <p className="text-sm text-muted-foreground">Πώς νιώθεις σήμερα;</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative shrink-0"
              onClick={() => navigate('/settings')}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </div>

          {/* Health Score Card */}
          <Card className="mt-3 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Σκορ Υγείας</p>
                    <p className="text-xl font-bold text-primary">{healthScore}%</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-medium">+5%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">από προηγ. μήνα</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hologram Hub with Orbital Actions */}
        <section className="animate-slide-up relative flex items-center justify-center" style={{ animationDelay: '100ms' }}>
          <div className="relative w-full max-w-[300px] aspect-square mx-auto">
            
            {/* Orbital Rings - smaller for mobile */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[260px] h-[260px] rounded-full border border-primary/20 animate-[spin_30s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[210px] h-[210px] rounded-full border border-primary/10 animate-[spin_25s_linear_infinite_reverse]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[160px] h-[160px] rounded-full border border-dashed border-primary/15 animate-[spin_20s_linear_infinite]" />
            </div>
            
            {/* Connection Lines (Axes) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-150 -150 300 300">
              {quickActions.map((_, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 110);
                return (
                  <line
                    key={index}
                    x1="0"
                    y1="0"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="animate-pulse"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                );
              })}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Medithos Hub - smaller for mobile */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link to="/symptoms" className="relative w-20 h-20 group cursor-pointer">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg animate-pulse" />
                <div className="absolute inset-1 rounded-full bg-primary/20 blur-md animate-pulse" style={{ animationDelay: '200ms' }} />
                
                {/* Hologram core with Activity icon */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-transparent backdrop-blur-sm border border-primary/30 flex items-center justify-center overflow-hidden group-active:scale-95 transition-transform duration-200">
                  {/* Scan lines effect */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--primary)/0.1)_2px,hsl(var(--primary)/0.1)_4px)] animate-[scan_2s_linear_infinite]" />
                  
                  {/* Activity Icon */}
                  <Activity className="h-10 w-10 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] z-10" />
                </div>
                
                {/* Rotating ring */}
                <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                
                {/* Pulse indicator */}
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-background/90 rounded-full px-1.5 py-0.5 border border-primary/20">
                  <Zap className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[8px] font-medium text-primary">Active</span>
                </div>
              </Link>
            </div>

            {/* Orbital Action Buttons - smaller for mobile */}
            <TooltipProvider>
              {quickActions.map((action, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 110);
                return (
                  <Tooltip key={action.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={action.path}
                        className={`absolute w-10 h-10 rounded-full ${action.color} flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm z-10`}
                        style={{
                          left: `calc(50% + ${pos.x}px - 20px)`,
                          top: `calc(50% + ${pos.y}px - 20px)`,
                        }}
                      >
                        <action.icon className="h-4 w-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border-primary/20 px-2 py-1.5">
                      <p className="font-medium text-xs">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </section>

        {/* Quick Status Cards */}
        <section className="grid grid-cols-1 gap-2.5 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="pb-1.5 pt-3 px-3">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Επόμενα Ραντεβού
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-2">
              {appointments.length > 0 ? (
                <div className="space-y-1.5">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{apt.provider?.name || 'Γιατρός'}</p>
                        <p className="text-[10px] text-muted-foreground">{apt.appointment_date} · {apt.appointment_time}</p>
                      </div>
                      <Badge className={`text-[9px] px-1.5 py-0.5 shrink-0 ${getStatusColor(apt.status)}`}>
                        {apt.status === 'confirmed' ? 'Επιβεβ.' : apt.status === 'pending' ? 'Αναμονή' : apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-1.5">Κανένα προγραμματισμένο ραντεβού</p>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-1.5 text-[10px] h-7" onClick={() => navigate('/appointments')}>
                Δες όλα <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card>
            <CardHeader className="pb-1.5 pt-3 px-3">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5 text-orange-500" />
                Ενεργά Φάρμακα
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-2">
              {medications.length > 0 ? (
                <div className="space-y-1.5">
                  {medications.slice(0, 2).map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{med.medication_name}</p>
                        <p className="text-[10px] text-muted-foreground">{med.dosage || 'Χωρίς δοσολογία'}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-muted-foreground shrink-0">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="text-[9px]">{med.reminder_times?.[0] || '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-1.5">Κανένα ενεργό φάρμακο</p>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-1.5 text-[10px] h-7" onClick={() => navigate('/medications')}>
                Διαχείριση <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Recent AI Symptom Analyses */}
        {recentSymptoms.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Card>
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-health-coral" />
                  Πρόσφατες AI Αναλύσεις
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-2">
                <div className="space-y-1.5">
                  {recentSymptoms.map((symptom) => (
                    <div key={symptom.id} className="p-2 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs line-clamp-2 flex-1">{symptom.ai_summary || 'Ανάλυση συμπτωμάτων'}</p>
                        <Badge className={`shrink-0 text-[9px] px-1.5 py-0.5 ${getUrgencyColor(symptom.urgency_level)}`}>
                          {symptom.urgency_level === 'high' ? 'Υψηλή' : symptom.urgency_level === 'medium' ? 'Μέτρια' : 'Χαμηλή'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(symptom.created_at).toLocaleDateString('el-GR')}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-1.5 text-[10px] h-7" onClick={() => navigate('/records')}>
                  Δες το ιστορικό <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <Card>
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  Ειδοποιήσεις
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="text-[9px] px-1 py-0">{unreadNotifications}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-2">
                <div className="space-y-1.5">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        notification.is_read 
                          ? 'bg-secondary/20 border-border/30' 
                          : 'bg-primary/5 border-primary/20'
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        {notification.type === 'appointment' ? (
                          <Calendar className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        ) : notification.type === 'warning' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{notification.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{notification.message}</p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
