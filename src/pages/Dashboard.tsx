import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="animate-slide-up">
          <h1 className="text-2xl font-bold text-foreground">
            Καλώς ήρθες, <span className="text-primary">{firstName}</span> <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Πώς νιώθεις σήμερα;</p>
        </section>

        {/* Quick Actions */}
        <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className="hover:shadow-soft transition-all active:scale-[0.98]">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className={`p-3 rounded-xl ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
