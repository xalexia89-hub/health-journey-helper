import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, FileText, Heart, Activity, 
  Stethoscope, Building2, Hospital, UserRound, GraduationCap, Pill
} from "lucide-react";

interface Profile {
  full_name: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const profileRes = await supabase.from('profiles').select('full_name').eq('id', user!.id).maybeSingle();
    if (profileRes.data) setProfile(profileRes.data);
    setLoading(false);
  };

  const quickActions = [
    { icon: Heart, label: "Έλεγχος Συμπτωμάτων", path: "/symptoms", color: "bg-health-coral-light text-health-coral" },
    { icon: Stethoscope, label: "Εύρεση Γιατρών", path: "/providers?type=doctor", color: "bg-health-mint-light text-primary" },
    { icon: Building2, label: "Εύρεση Κλινικών", path: "/providers?type=clinic", color: "bg-health-blue-light text-health-blue" },
    { icon: Hospital, label: "Νοσοκομεία", path: "/providers?type=hospital", color: "bg-health-lavender-light text-health-lavender" },
    { icon: UserRound, label: "Κατ' Οίκον Νοσηλεία", path: "/nurses", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { icon: GraduationCap, label: "Ιατρική Ακαδημία", path: "/academy", color: "bg-accent/20 text-accent" },
    { icon: Calendar, label: "Τα Ραντεβού μου", path: "/appointments", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: Pill, label: "Υπενθυμίσεις Φαρμάκων", path: "/medications", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
    { icon: FileText, label: "Ιατρικό Ιστορικό", path: "/records", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
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
                const pos = getOrbitalPosition(index, quickActions.length, 145);
                return (
                  <Tooltip key={action.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={action.path}
                        className={`absolute w-12 h-12 rounded-full ${action.color} flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] z-10`}
                        style={{
                          left: `calc(50% + ${pos.x}px - 24px)`,
                          top: `calc(50% + ${pos.y}px - 24px)`,
                        }}
                      >
                        <action.icon className="h-5 w-5" />
                        {/* Pulse ring on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 hover:opacity-100 animate-ping" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-background/90 backdrop-blur-sm border-primary/20 px-2 py-1 text-xs max-w-[100px] text-center">
                      <p className="font-medium text-xs leading-tight">{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </section>
      </main>
    </div>
  );
}
