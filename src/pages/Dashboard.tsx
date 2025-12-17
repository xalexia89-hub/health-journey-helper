import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, FileText, User, Search, Heart, Activity, 
  AlertCircle, ChevronRight, Stethoscope, Building2, Hospital, UserRound, GraduationCap, Pill
} from "lucide-react";

interface Profile {
  full_name: string | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  providers: {
    name: string;
    specialty: string | null;
  } | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [profileRes, appointmentsRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user!.id).maybeSingle(),
      supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, status, providers(name, specialty)')
        .eq('patient_id', user!.id)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .limit(3)
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (appointmentsRes.data) setUpcomingAppointments(appointmentsRes.data);
    setLoading(false);
  };

  const quickActions = [
    { icon: Heart, label: "Έλεγχος Συμπτωμάτων", path: "/symptoms", color: "bg-health-coral-light text-health-coral" },
    { icon: Stethoscope, label: "Εύρεση Γιατρών", path: "/providers?type=doctor", color: "bg-health-mint-light text-primary" },
    { icon: Building2, label: "Εύρεση Κλινικών", path: "/providers?type=clinic", color: "bg-health-blue-light text-health-blue" },
    { icon: Hospital, label: "Νοσοκομεία", path: "/providers?type=hospital", color: "bg-health-lavender-light text-health-lavender" },
    { icon: UserRound, label: "Κατ' Οίκον Νοσηλεία", path: "/nurses", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { icon: GraduationCap, label: "Ιατρική Ακαδημία", path: "/academy", color: "bg-accent/20 text-accent" },
  ];

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'εκεί';

  // Calculate positions for orbital layout
  const getOrbitalPosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total) - 90; // Start from top
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
      angle: angle + 90
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="animate-slide-up text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Καλώς ήρθες, <span className="text-primary">{firstName}</span> <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Πώς νιώθεις σήμερα;</p>
        </section>

        {/* Hologram Hub with Orbital Actions */}
        <section className="animate-slide-up relative" style={{ animationDelay: '100ms' }}>
          <div className="relative w-full aspect-square max-w-[320px] mx-auto">
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border border-primary/20 animate-[spin_30s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full border border-primary/10 animate-[spin_25s_linear_infinite_reverse]" />
            </div>
            
            {/* Connection Lines (Axes) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-160 -160 320 320">
              {quickActions.map((_, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 120);
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

            {/* Central Hologram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-primary/20 blur-lg animate-pulse" style={{ animationDelay: '200ms' }} />
                
                {/* Hologram core */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-transparent backdrop-blur-sm border border-primary/30 flex items-center justify-center overflow-hidden">
                  {/* Scan lines effect */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--primary)/0.1)_2px,hsl(var(--primary)/0.1)_4px)] animate-[scan_2s_linear_infinite]" />
                  
                  {/* Health icon */}
                  <Activity className="h-10 w-10 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]" />
                </div>
                
                {/* Rotating ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
              </div>
            </div>

            {/* Orbital Action Buttons */}
            <TooltipProvider>
              {quickActions.map((action, index) => {
                const pos = getOrbitalPosition(index, quickActions.length, 120);
                return (
                  <Tooltip key={action.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={action.path}
                        className={`absolute w-14 h-14 rounded-full ${action.color} flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] z-10`}
                        style={{
                          left: `calc(50% + ${pos.x}px - 28px)`,
                          top: `calc(50% + ${pos.y}px - 28px)`,
                        }}
                      >
                        <action.icon className="h-6 w-6" />
                        {/* Pulse ring on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 hover:opacity-100 animate-ping" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-background/90 backdrop-blur-sm border-primary/20">
                      <p className="font-medium">{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </section>


        {/* Upcoming Appointments */}
        <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Επερχόμενα Ραντεβού</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments" className="text-primary">
                Προβολή Όλων <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="hover:shadow-soft transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{apt.providers?.name}</h3>
                        <p className="text-sm text-muted-foreground">{apt.providers?.specialty}</p>
                        <p className="text-sm text-primary mt-1">
                          {new Date(apt.appointment_date).toLocaleDateString('el-GR', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} στις {apt.appointment_time.slice(0, 5)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Δεν υπάρχουν επερχόμενα ραντεβού</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/providers">Κλείστε Ραντεβού</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Links */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-semibold text-foreground mb-3">Γρήγοροι Σύνδεσμοι</h2>
          <div className="space-y-2">
            <Link to="/medications">
              <Card className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-health-coral-light">
                    <Pill className="h-5 w-5 text-health-coral" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Υπενθυμίσεις Φαρμάκων</h3>
                    <p className="text-sm text-muted-foreground">Διαχειριστείτε τα φάρμακά σας και τις ώρες λήψης</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/records">
              <Card className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-health-blue-light">
                    <FileText className="h-5 w-5 text-health-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Ιατρικό Ιστορικό</h3>
                    <p className="text-sm text-muted-foreground">Δείτε και ενημερώστε τις πληροφορίες υγείας σας</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-health-lavender-light">
                    <User className="h-5 w-5 text-health-lavender" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Το Προφίλ μου</h3>
                    <p className="text-sm text-muted-foreground">Διαχειριστείτε τα προσωπικά σας στοιχεία</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
