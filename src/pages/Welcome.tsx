import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, Stethoscope, Users, Phone, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

      {/* Pilot Banner */}
      <div className="relative z-20 bg-primary/10 border-b border-primary/20 py-2 px-4">
        <p className="text-center text-xs font-medium text-primary">
          🧪 Pilot Version — Δοκιμαστική Έκδοση
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Centered Logo */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="animate-fade-in">
            <Logo size="lg" />
          </div>
          
          <div className="mt-8 text-center space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Η Υγεία σας,{" "}
              <span className="text-gradient-neon">Απλοποιημένη</span>
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Συμμετέχετε στο πιλοτικό πρόγραμμα και βοηθήστε να διαμορφώσουμε το μέλλον της υγείας.
            </p>
          </div>
        </div>

        {/* CTA Buttons - Pilot Flow */}
        <div className="relative z-10 p-6 space-y-3">
          <Button asChild size="lg" className="w-full h-14 text-base font-semibold rounded-xl gradient-futuristic hover:shadow-neon border-0 transition-all duration-300">
            <Link to="/pilot">
              Συμμετοχή στο Pilot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full h-14 text-base font-semibold rounded-xl glass border-primary/30 hover:shadow-glow transition-all duration-300">
            <Link to="/auth?mode=signin">
              Έχω ήδη λογαριασμό
            </Link>
          </Button>
          
          {/* Provider Registration */}
          <div className="pt-4 border-t border-border/50 space-y-4">
            <p className="text-xs text-center text-muted-foreground">Είστε Ιατρός;</p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/doctor-signup" 
                className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Stethoscope className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Εγγραφή Ιατρού</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Button */}
      <div className="relative z-10 px-6 pb-4">
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">Έκτακτη Ανάγκη;</span>
            <a 
              href="tel:112" 
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold"
            >
              <Phone className="h-4 w-4" />
              Καλέστε 112
            </a>
          </AlertDescription>
        </Alert>
      </div>

      {/* Medical Disclaimer */}
      <div className="relative z-10 px-6 py-4 glass border-t border-primary/20">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή δεν παρέχει ιατρικές συμβουλές, 
          διάγνωση ή θεραπεία. Συμβουλευτείτε πάντα εξειδικευμένο επαγγελματία υγείας.
        </p>
      </div>
    </div>
  );
}
