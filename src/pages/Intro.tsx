import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import medithoLogo from "@/assets/medithos-logo.png";
import { Heart, Users, Building2, Mic, Accessibility, ArrowRight, Sparkles } from "lucide-react";

export default function Intro() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex flex-col items-center px-6 py-8 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        {/* Logo */}
        <div className="relative mb-6 mt-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-xl animate-pulse" />
          <img 
            src={medithoLogo} 
            alt="Medithos Logo" 
            className="w-28 h-28 md:w-36 md:h-36 relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-2 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          MEDI<span className="text-accent">THOS</span>
        </h1>

        <p className={`text-base text-muted-foreground text-center mb-6 transition-all duration-1000 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Το Μέλλον της Ιατρικής Περίθαλψης
        </p>

        {/* Vision Content */}
        <div className={`w-full space-y-5 transition-all duration-1000 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Philosophy Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-lg">
            <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Το Όραμά μας
            </h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                Το <span className="text-foreground font-medium">Medithos</span> δημιουργήθηκε για να κάνει την υγειονομική φροντίδα απλή και άμεσα προσβάσιμη.
              </p>
              <p>
                Μέσα από μία εφαρμογή, ο πολίτης μπορεί να βρει γρήγορα τη σωστή πληροφορία, να καταλάβει τι χρειάζεται να κάνει και να συνδεθεί με τον κατάλληλο γιατρό ή ιατρική δομή, χωρίς ταλαιπωρία και χωρίς περιττές διαδικασίες.
              </p>
              <p>
                Το Medithos ξεχωρίζει γιατί δεν ζητά από τον χρήστη να γνωρίζει το σύστημα υγείας — <span className="text-primary font-medium">το φέρνει κοντά του</span>, οργανωμένο και κατανοητό. Καθοδηγεί με σαφήνεια, λειτουργεί άμεσα και είναι σχεδιασμένο για να χρησιμοποιείται εύκολα, από όλους.
              </p>
              <p>
                Στόχος μας είναι κάθε άνθρωπος να έχει μια <span className="text-foreground font-medium">αξιόπιστη βοήθεια υγείας στην τσέπη του</span>. Ένα εργαλείο που απλοποιεί τις αποφάσεις, εξοικονομεί χρόνο και προσφέρει σιγουριά, κάθε στιγμή που τη χρειάζεται.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-sm">Ενοποιημένο Δίκτυο</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Σύνδεση όλων των παρόχων υγείας για καλύτερη συντονισμένη φροντίδα.
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-medium text-sm">Σωστή Πληροφόρηση</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Ακριβείς και έγκυρες πληροφορίες υγείας στον πολίτη.
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-health-coral/10">
                  <Accessibility className="h-4 w-4 text-health-coral" />
                </div>
                <h3 className="font-medium text-sm">Προσβασιμότητα</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Σχεδιασμένο για άτομα με ειδικές ανάγκες, με πλήρη υποστήριξη.
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-health-blue/10">
                  <Mic className="h-4 w-4 text-health-blue" />
                </div>
                <h3 className="font-medium text-sm">Φωνητικές Λειτουργίες</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Υποστήριξη φωνητικών εντολών για εύκολη πλοήγηση.
              </p>
            </div>
          </div>

          {/* Philosophy Quote */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground italic leading-relaxed">
                "Πιστεύουμε ότι η πρόσβαση στην υγεία είναι δικαίωμα κάθε πολίτη. 
                Η τεχνολογία πρέπει να γεφυρώνει τα κενά, όχι να τα διευρύνει."
              </p>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Σχεδιάστηκε & Αναπτύχθηκε από
            </p>
            <p className="text-base font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-1">
              Αλεξία Χαλβατζάκου
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => navigate('/dashboard')}
          size="lg"
          className={`mt-8 mb-4 gap-2 px-10 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Συνέχεια
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
