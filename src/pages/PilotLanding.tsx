import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { SplashScreen } from "@/components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowRight,
  CheckCircle,
  Shield,
  Stethoscope,
  Users,
  FileText,
  Activity,
  Heart,
  Sparkles,
  Building2,
  ChevronDown
} from "lucide-react";

export default function PilotLanding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState<number>(100);
  const [isPilotFull, setIsPilotFull] = useState(false);

  useEffect(() => {
    // Show splash only once per session
    const seen = sessionStorage.getItem("medithos_splash_seen");
    if (!seen) {
      setShowSplash(true);
    }
    fetchPilotStatus();
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem("medithos_splash_seen", "true");
  }, []);

  const fetchPilotStatus = async () => {
    try {
      const { data: countData } = await supabase.rpc('get_pilot_enrollment_count');
      const { data: settingsData } = await supabase
        .from('pilot_settings')
        .select('setting_value')
        .eq('setting_key', 'max_pilot_users')
        .single();

      const count = countData || 0;
      const max = settingsData?.setting_value ? parseInt(settingsData.setting_value) : 100;
      setEnrollmentCount(count);
      setMaxUsers(max);
      setIsPilotFull(count >= max);
    } catch (error) {
      console.error('Error fetching pilot status:', error);
    }
  };

  const highlights = [
    { icon: Activity, label: "AI Symptom Analysis", desc: "Έξυπνη ανάλυση συμπτωμάτων" },
    { icon: Stethoscope, label: "Doctor Network", desc: "Δίκτυο πιστοποιημένων γιατρών" },
    { icon: Shield, label: "GDPR Compliant", desc: "Πλήρης προστασία δεδομένων" },
    { icon: Heart, label: "Health Records", desc: "Ψηφιακός φάκελος υγείας" },
  ];

  const trustBadges = [
    "50 Πραγματικοί Χρήστες",
    "4 Αδειοδοτημένοι Γιατροί",
    "Νομική Γνωμοδότηση",
    "GDPR Συμμόρφωση",
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Logo size="md" linkTo={undefined} />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1 text-[10px] px-2 py-0.5">
                <Sparkles className="h-2.5 w-2.5" />
                PILOT
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => navigate('/auth')} className="text-sm">
                Σύνδεση
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-12 pb-8 text-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-futuristic mb-6">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-foreground/80">Πιλοτικό Πρόγραμμα — Live</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Η Υγεία σας,{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Απλοποιημένη
                </span>
              </h1>

              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
                Το πρώτο AI σύστημα πλοήγησης υγείας στην Ελλάδα. 
                Βρείτε τον σωστό γιατρό, αναλύστε τα συμπτώματά σας, 
                διαχειριστείτε το ιατρικό σας ιστορικό.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-sm mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Button 
                size="lg" 
                onClick={() => navigate(isPilotFull ? '/pilot/waitlist' : '/pilot/enroll')}
                className="h-14 text-base font-semibold rounded-xl gradient-futuristic hover:shadow-neon border-0 transition-all duration-300"
              >
                {isPilotFull ? "Εγγραφή σε Λίστα Αναμονής" : "Δωρεάν Συμμετοχή"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-12 rounded-xl border-border/60 hover:border-primary/40 transition-all"
              >
                Έχω ήδη λογαριασμό
              </Button>
            </div>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                <span>Εγγεγραμμένοι</span>
                <span className="font-medium text-foreground">50/{maxUsers}</span>
              </div>
              <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 rounded-full"
                  style={{ width: `${Math.min((50 / maxUsers) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-10 animate-bounce">
              <ChevronDown className="h-5 w-5 text-muted-foreground mx-auto" />
            </div>
          </section>

          {/* Features Grid */}
          <section className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <Card
                  key={item.label}
                  className="glass border-border/40 hover:border-primary/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-3">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">{item.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Doctor CTA */}
          <section className="container mx-auto px-4 py-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/8 to-transparent overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl gradient-primary shadow-glow shrink-0">
                    <Stethoscope className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Είστε Γιατρός;</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Γίνετε σύμβουλος πλοήγησης υγείας — χωρίς σχέση γιατρού-ασθενή.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/pilot/doctor-signup')}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      Εγγραφή Συμβούλου
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Trust Section */}
          <section className="container mx-auto px-4 py-10">
            <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider">Εγγυήσεις Pilot</p>
            <div className="flex flex-wrap justify-center gap-2">
              {trustBadges.map((badge) => (
                <Badge key={badge} variant="secondary" className="gap-1.5 px-3 py-1 text-xs bg-secondary/60">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  {badge}
                </Badge>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="container mx-auto px-4 py-8 border-t border-border/30">
            <div className="flex justify-center gap-4 text-xs text-muted-foreground mb-4">
              <Link to="/terms" className="hover:text-primary transition-colors">Όροι Χρήσης</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Απόρρητο</Link>
              <Link to="/evaluation" className="hover:text-primary transition-colors">Αξιολόγηση</Link>
              <Link to="/install" className="hover:text-primary transition-colors">Εγκατάσταση</Link>
            </div>
            <p className="text-[10px] text-center text-muted-foreground/60 max-w-sm mx-auto">
              Ιατρική Αποποίηση: Αυτή η εφαρμογή δεν παρέχει ιατρικές συμβουλές, διάγνωση ή θεραπεία.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
