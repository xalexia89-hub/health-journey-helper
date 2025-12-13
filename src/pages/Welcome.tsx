import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Heart, Shield, Calendar, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-12 pb-8">
          <Logo size="lg" />
        </div>

        <div className="flex-1 px-6 flex flex-col justify-center">
          <div className="space-y-4 animate-slide-up">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Η Υγεία σας,{" "}
              <span className="text-primary">Απλοποιημένη</span>
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
                className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
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
        <div className="p-6 space-y-3 bg-gradient-to-t from-background via-background to-transparent">
          <Button asChild size="lg" className="w-full h-14 text-base font-semibold rounded-xl shadow-soft">
            <Link to="/auth?mode=signup">
              Ξεκινήστε
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full h-14 text-base font-semibold rounded-xl">
            <Link to="/auth?mode=signin">
              Έχω ήδη λογαριασμό
            </Link>
          </Button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή παρέχει γενικές πληροφορίες υγείας και 
          δεν αντικαθιστά επαγγελματικές ιατρικές συμβουλές, διάγνωση ή θεραπεία.
        </p>
      </div>
    </div>
  );
}
