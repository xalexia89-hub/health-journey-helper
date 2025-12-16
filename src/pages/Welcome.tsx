import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Heart, Shield, Calendar, ArrowRight, Stethoscope, Building2, Hospital } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Παρακολουθήστε την Υγεία σας",
    description: "Καταγράψτε συμπτώματα και διατηρήστε ολοκληρωμένο ιατρικό ιστορικό",
  },
  {
    icon: Shield,
    title: "Βρείτε Αξιόπιστους Παρόχους",
    description: "Συνδεθείτε με πιστοποιημένους γιατρούς, κλινικές και νοσοκομεία",
  },
  {
    icon: Calendar,
    title: "Εύκολη Κράτηση",
    description: "Προγραμματίστε ραντεβού και πληρώστε με ασφάλεια online",
  },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-mesh-futuristic relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-futuristic opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-glow animate-pulse-soft opacity-50" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 gradient-glow animate-pulse-soft opacity-40" style={{ animationDelay: '1s' }} />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-accent/60 animate-float shadow-glow-accent" />
      <div className="absolute top-40 left-20 w-2 h-2 rounded-full bg-primary/50 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-1/4 w-4 h-4 rounded-full bg-accent/40 animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="px-6 pt-12 pb-8">
          <Logo size="lg" />
        </div>

        <div className="flex-1 px-6 flex flex-col justify-center">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Η Υγεία σας,{" "}
              <span className="text-gradient-neon">Απλοποιημένη</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Συνδεθείτε με παρόχους υγείας, παρακολουθήστε τα συμπτώματά σας και διαχειριστείτε 
              το ιατρικό σας ταξίδι — όλα σε ένα μέρος.
            </p>
          </div>

          {/* Features */}
          <div className="mt-10 space-y-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-4 rounded-2xl glass-futuristic animate-fade-in hover-lift transition-all duration-300"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="relative z-10 p-6 space-y-3">
          <Button asChild size="lg" className="w-full h-14 text-base font-semibold rounded-xl gradient-futuristic hover:shadow-neon border-0 transition-all duration-300">
            <Link to="/auth?mode=signup">
              Ξεκινήστε
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full h-14 text-base font-semibold rounded-xl glass border-primary/30 hover:shadow-glow transition-all duration-300">
            <Link to="/auth?mode=signin">
              Έχω ήδη λογαριασμό
            </Link>
          </Button>
          
          {/* Provider Registration Links */}
          <div className="pt-4 border-t border-border/50 space-y-2">
            <p className="text-xs text-center text-muted-foreground mb-3">Είστε πάροχος υγείας;</p>
            <div className="grid grid-cols-3 gap-2">
              <Button asChild variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 glass border-primary/30 hover:shadow-glow">
                <Link to="/doctor-registration?type=doctor">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span className="text-xs">Γιατρός</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 glass border-primary/30 hover:shadow-glow">
                <Link to="/doctor-registration?type=clinic">
                  <Building2 className="h-5 w-5 text-accent" />
                  <span className="text-xs">Κλινική</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 glass border-primary/30 hover:shadow-glow">
                <Link to="/doctor-registration?type=hospital">
                  <Hospital className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs">Νοσοκομείο</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="relative z-10 px-6 py-4 glass border-t border-primary/20">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή παρέχει γενικές πληροφορίες υγείας και 
          δεν αντικαθιστά επαγγελματικές ιατρικές συμβουλές, διάγνωση ή θεραπεία.
        </p>
      </div>
    </div>
  );
}