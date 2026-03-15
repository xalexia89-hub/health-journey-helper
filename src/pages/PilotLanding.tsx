import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { SplashScreen } from "@/components/SplashScreen";
import { StaggerContainer, StaggerItem, FadeUp, ScaleIn, MagneticHover } from "@/components/motion/MotionPrimitives";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowRight, CheckCircle, Shield, Stethoscope, Users,
  Activity, Heart, Sparkles, ChevronDown, Brain, FileHeart, Zap
} from "lucide-react";

export default function PilotLanding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const [maxUsers, setMaxUsers] = useState<number>(100);
  const [isPilotFull, setIsPilotFull] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("medithos_splash_seen");
    if (!seen) setShowSplash(true);
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
        .from('pilot_settings').select('setting_value').eq('setting_key', 'max_pilot_users').single();
      const max = settingsData?.setting_value ? parseInt(settingsData.setting_value) : 100;
      setMaxUsers(max);
      setIsPilotFull((countData || 0) >= max);
    } catch (error) {
      console.error('Error fetching pilot status:', error);
    }
  };

  const highlights = [
    { icon: Brain, label: "AI Ανάλυση", desc: "Έξυπνη αξιολόγηση συμπτωμάτων με τεχνητή νοημοσύνη", gradient: "from-primary/20 to-accent/10" },
    { icon: Stethoscope, label: "Δίκτυο Γιατρών", desc: "Σύνδεση με πιστοποιημένους ειδικούς", gradient: "from-accent/20 to-primary/10" },
    { icon: Shield, label: "GDPR Ready", desc: "Πλήρης προστασία ιατρικών δεδομένων", gradient: "from-neon-green/15 to-primary/10" },
    { icon: FileHeart, label: "Ψηφιακός Φάκελος", desc: "Ολοκληρωμένο ιατρικό ιστορικό", gradient: "from-health-blue/15 to-accent/10" },
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Premium ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px]"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]"
            animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-grid-futuristic opacity-20" />
        </div>

        {/* Header */}
        <motion.header
          className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Logo size="md" linkTo={undefined} />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px] px-2.5 py-1 font-display">
                <Sparkles className="h-2.5 w-2.5" />
                PILOT
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => navigate('/auth')} className="text-sm font-medium">
                Σύνδεση
              </Button>
            </div>
          </div>
        </motion.header>

        <main className="relative z-10">
          {/* Hero */}
          <section className="container mx-auto px-4 pt-16 pb-10 text-center">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-futuristic mb-8">
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-medium text-foreground/80 font-display tracking-wide">
                  Πιλοτικό Πρόγραμμα — Live
                </span>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5 font-display">
                Η Υγεία σας,{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Απλοποιημένη
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Το πρώτο AI σύστημα πλοήγησης υγείας στην Ελλάδα. 
                Βρείτε τον σωστό γιατρό, αναλύστε τα συμπτώματά σας, 
                διαχειριστείτε το ιατρικό σας ιστορικό.
              </p>
            </FadeUp>

            {/* CTA */}
            <FadeUp delay={0.4}>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    onClick={() => navigate(isPilotFull ? '/pilot/waitlist' : '/pilot/enroll')}
                    className="w-full h-14 text-base font-semibold rounded-2xl gradient-futuristic hover:shadow-neon border-0 transition-shadow duration-500 font-display"
                  >
                    {isPilotFull ? "Λίστα Αναμονής" : "Δωρεάν Συμμετοχή"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="h-12 rounded-2xl border-border/50 hover:border-primary/40 transition-all font-display"
                >
                  Έχω ήδη λογαριασμό
                </Button>
              </div>
            </FadeUp>

            {/* Enrollment progress */}
            <FadeUp delay={0.5}>
              <div className="max-w-xs mx-auto mt-10">
                <div className="flex justify-between text-xs mb-2 text-muted-foreground">
                  <span>Εγγεγραμμένοι</span>
                  <span className="font-semibold text-foreground font-display">50/{maxUsers}</span>
                </div>
                <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((50 / maxUsers) * 100, 100)}%` }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </FadeUp>

            <motion.div
              className="mt-12"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground/50 mx-auto" />
            </motion.div>
          </section>

          {/* Features */}
          <section className="container mx-auto px-4 py-12">
            <StaggerContainer className="grid grid-cols-2 gap-3" delay={0.6}>
              {highlights.map((item) => (
                <StaggerItem key={item.label}>
                  <MagneticHover>
                    <Card className={`bg-gradient-to-br ${item.gradient} border-border/30 backdrop-blur-sm hover:border-primary/30 transition-colors duration-500 h-full`}>
                      <CardContent className="p-4">
                        <div className="p-2 rounded-xl bg-background/40 w-fit mb-3 backdrop-blur-sm">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm text-foreground mb-1 font-display">{item.label}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </MagneticHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>

          {/* Stats banner */}
          <FadeUp delay={0.2}>
            <section className="container mx-auto px-4 py-6">
              <div className="flex justify-around py-5 px-4 rounded-2xl glass-futuristic">
                {[
                  { value: "50+", label: "Χρήστες" },
                  { value: "4", label: "Γιατροί" },
                  { value: "24/7", label: "AI Πρόσβαση" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-primary font-display">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </FadeUp>

          {/* Doctor CTA */}
          <FadeUp delay={0.1}>
            <section className="container mx-auto px-4 py-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="p-3 rounded-2xl gradient-primary shrink-0"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Stethoscope className="h-6 w-6 text-primary-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1 font-display">Είστε Γιατρός;</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Γίνετε σύμβουλος πλοήγησης — χωρίς σχέση γιατρού-ασθενή.
                      </p>
                      <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Button 
                          variant="outline" size="sm"
                          onClick={() => navigate('/pilot/doctor-signup')}
                          className="border-primary/30 hover:bg-primary/10 font-display"
                        >
                          Εγγραφή Συμβούλου
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </FadeUp>

          {/* Trust */}
          <FadeUp delay={0.1}>
            <section className="container mx-auto px-4 py-10">
              <p className="text-center text-[10px] text-muted-foreground mb-4 uppercase tracking-[0.2em] font-display">
                Εγγυήσεις & Πιστοποιήσεις
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["50 Πραγματικοί Χρήστες", "4 Αδειοδοτημένοι Γιατροί", "Νομική Γνωμοδότηση", "GDPR Συμμόρφωση"].map((badge) => (
                  <Badge key={badge} variant="secondary" className="gap-1.5 px-3 py-1.5 text-[11px] bg-secondary/50 border-border/30">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </section>
          </FadeUp>

          {/* Footer */}
          <footer className="container mx-auto px-4 py-8 border-t border-border/20">
            <div className="flex justify-center gap-5 text-xs text-muted-foreground mb-4">
              {[
                { to: "/terms", label: "Όροι" },
                { to: "/privacy", label: "Απόρρητο" },
                { to: "/evaluation", label: "Αξιολόγηση" },
                { to: "/install", label: "Εγκατάσταση" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[10px] text-center text-muted-foreground/50 max-w-sm mx-auto">
              Ιατρική Αποποίηση: Αυτή η εφαρμογή δεν παρέχει ιατρικές συμβουλές, διάγνωση ή θεραπεία.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
