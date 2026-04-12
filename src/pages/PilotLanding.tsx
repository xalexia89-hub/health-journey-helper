import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { MedicalDisclaimer } from "@/components/pilot/MedicalDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { 
  FlaskConical, 
  Users, 
  Shield, 
  Stethoscope, 
  ArrowRight,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";

export default function PilotLanding() {
  const navigate = useNavigate();
  const { enableDemo } = useDemo();
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState<number>(100);
  const [isPilotFull, setIsPilotFull] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilotStatus();
  }, []);

  const fetchPilotStatus = async () => {
    try {
      // Get current enrollment count
      const { data: countData } = await supabase
        .rpc('get_pilot_enrollment_count');
      
      // Get max users setting
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
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "GDPR Συμμόρφωση",
      description: "Πλήρης προστασία δεδομένων με ρητή συγκατάθεση"
    },
    {
      icon: Stethoscope,
      title: "Ιατροί Σύμβουλοι",
      description: "4 αδειοδοτημένοι γιατροί ως σύμβουλοι πλοήγησης"
    },
    {
      icon: Users,
      title: "Περιορισμένη Συμμετοχή",
      description: `50/${maxUsers} θέσεις καλυμμένες`
    },
    {
      icon: FileText,
      title: "Νομική Κάλυψη",
      description: "Νομική γνωμοδότηση MDR/GDPR συμμόρφωσης"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" />
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 gap-1">
            <FlaskConical className="h-3 w-3" />
            PILOT v1.0
          </Badge>
        </div>
      </header>

      {/* Medical Disclaimer Banner */}
      <MedicalDisclaimer variant="banner" />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <FlaskConical className="h-3 w-3 mr-1" />
            Πιλοτικό Πρόγραμμα
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Medithos Pilot
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Γίνετε μέρος της πρώτης ομάδας χρηστών που δοκιμάζει το νέο σύστημα πλοήγησης υγείας
          </p>

          {/* Progress Indicator */}
          <div className="max-w-xs mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Εγγεγραμμένοι Χρήστες</span>
              <span className="font-medium">50</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                style={{ width: `${Math.min((enrollmentCount / maxUsers) * 100, 100)}%` }}
              />
            </div>
            {isPilotFull && (
              <p className="text-warning text-sm mt-2 flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />
                Το pilot είναι πλήρες - εγγραφείτε στη λίστα αναμονής
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isPilotFull ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/pilot/waitlist')}
                className="bg-warning hover:bg-warning/90"
              >
                Εγγραφή σε Λίστα Αναμονής
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/pilot/enroll')}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Συμμετοχή στο Pilot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Έχω ήδη λογαριασμό
            </Button>

            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => {
                enableDemo();
                navigate('/dashboard');
              }}
              className="text-primary border-primary/20 border"
            >
              🎬 Live Demo
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/metrics')}
              className="text-primary border-primary/20 border"
            >
              📊 Traction Metrics
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Doctor Section */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Είστε Επαγγελματίας Υγείας;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Γίνετε μέρος της ομάδας συμβούλων πλοήγησης υγείας. 
              Χωρίς σχέση γιατρού-ασθενή, χωρίς διάγνωση - μόνο καθοδήγηση.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/pilot/doctor-signup')}
            >
              Εγγραφή ως Σύμβουλος
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Εγγυήσεις Pilot</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Νομική Γνωμοδότηση",
              "50 Πραγματικοί Χρήστες",
              "4 Αδειοδοτημένοι Γιατροί",
              "Ομάδα 7 Ατόμων"
            ].map((item, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-primary">
              Όροι Χρήσης
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary">
              Πολιτική Απορρήτου
            </Link>
            <Link to="/evaluation" className="text-muted-foreground hover:text-primary">
              Αξιολόγηση Project
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
