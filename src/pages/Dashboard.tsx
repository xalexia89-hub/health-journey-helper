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

      <main className="px-4 py-6 space-y-6 pb-24">
        {/* Welcome Section with Health Score */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Καλώς ήρθες, <span className="text-primary">{firstName}</span> 
              </h1>
              <p className="text-muted-foreground mt-1">Πώς νιώθεις σήμερα;</p>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/settings')}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Health Score Card */}
          <Card className="mt-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Σκορ Υγείας</p>
                    <p className="text-2xl font-bold text-primary">{healthScore}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+5%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">από τον προηγ. μήνα</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hologram Hub with Orbital Actions */}
        <section className="animate-slide-up relative flex-1 flex items-center justify-center" style={{ animationDelay: '100ms' }}>
          <div className="relative w-full aspect-square max-w-[380px] mx-auto">
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border border-primary/20 animate-[spin_30s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border border-primary/10 animate-[spin_25s_linear_infinite_reverse]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full border border-dashed border-primary/15 animate-[spin_20s_linear_infinite]" />
            </div>
            
            {/* Connection Lines (Axes) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-190 -190 380 380">
              {quickActions.map((_, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 145);
                return (
                  <line
                    key={index}
                    x1="0"
                    y1="0"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
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

            {/* Central Medithos Hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link to="/symptoms" className="relative w-28 h-28 group cursor-pointer">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-primary/20 blur-lg animate-pulse" style={{ animationDelay: '200ms' }} />
                
                {/* Hologram core with Activity icon */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-transparent backdrop-blur-sm border border-primary/30 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  {/* Scan lines effect */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--primary)/0.1)_2px,hsl(var(--primary)/0.1)_4px)] animate-[scan_2s_linear_infinite]" />
                  
                  {/* Activity Icon */}
                  <Activity className="h-14 w-14 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))] z-10" />
                </div>
                
                {/* Rotating ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                
                {/* Pulse indicator */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/90 rounded-full px-2 py-0.5 border border-primary/20">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">Active</span>
                </div>
              </Link>
            </div>

            {/* Orbital Action Buttons */}
            <TooltipProvider>
              {quickActions.map((action, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 145);
                return (
                  <Tooltip key={action.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={action.path}
                        className={`absolute w-12 h-12 rounded-full ${action.color} flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] z-10 group`}
                        style={{
                          left: `calc(50% + ${pos.x}px - 24px)`,
                          top: `calc(50% + ${pos.y}px - 24px)`,
                        }}
                      >
                        <action.icon className="h-5 w-5" />
                        {/* Pulse ring on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 group-hover:opacity-100 animate-ping" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border-primary/20 px-3 py-2">
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </section>

        {/* Quick Status Cards */}
        <section className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {/* Upcoming Appointments */}
          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Επόμενα Ραντεβού
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {appointments.length > 0 ? (
                <ScrollArea className="max-h-32">
                  <div className="space-y-2">
                    {appointments.slice(0, 2).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{apt.provider?.name || 'Γιατρός'}</p>
                          <p className="text-xs text-muted-foreground">{apt.appointment_date} · {apt.appointment_time}</p>
                        </div>
                        <Badge className={`text-[10px] ${getStatusColor(apt.status)}`}>
                          {apt.status === 'confirmed' ? 'Επιβεβ.' : apt.status === 'pending' ? 'Αναμονή' : apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground py-2">Κανένα προγραμματισμένο ραντεβού</p>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => navigate('/appointments')}>
                Δες όλα <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Pill className="h-4 w-4 text-orange-500" />
                Ενεργά Φάρμακα
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {medications.length > 0 ? (
                <ScrollArea className="max-h-32">
                  <div className="space-y-2">
                    {medications.slice(0, 2).map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{med.medication_name}</p>
                          <p className="text-xs text-muted-foreground">{med.dosage || 'Χωρίς δοσολογία'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{med.reminder_times?.[0] || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground py-2">Κανένα ενεργό φάρμακο</p>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => navigate('/medications')}>
                Διαχείριση <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Recent AI Symptom Analyses */}
        {recentSymptoms.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-health-coral" />
                  Πρόσφατες AI Αναλύσεις
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {recentSymptoms.map((symptom) => (
                    <div key={symptom.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm line-clamp-2 flex-1">{symptom.ai_summary || 'Ανάλυση συμπτωμάτων'}</p>
                        <Badge className={`shrink-0 text-[10px] ${getUrgencyColor(symptom.urgency_level)}`}>
                          {symptom.urgency_level === 'high' ? 'Υψηλή' : symptom.urgency_level === 'medium' ? 'Μέτρια' : 'Χαμηλή'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(symptom.created_at).toLocaleDateString('el-GR')}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => navigate('/records')}>
                  Δες το ιστορικό <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Ειδοποιήσεις
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5">{unreadNotifications}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="max-h-40">
                  <div className="space-y-2">
                    {notifications.slice(0, 3).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          notification.is_read 
                            ? 'bg-secondary/20 border-border/30' 
                            : 'bg-primary/5 border-primary/20'
                        }`}
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <div className="flex items-start gap-2">
                          {notification.type === 'appointment' ? (
                            <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          ) : notification.type === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
