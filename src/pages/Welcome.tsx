import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Heart, Shield, Calendar, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Track Your Health",
    description: "Monitor symptoms and maintain comprehensive medical records",
  },
  {
    icon: Shield,
    title: "Find Trusted Providers",
    description: "Connect with verified doctors, clinics, and hospitals",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Schedule appointments and pay securely online",
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
              Your Health,{" "}
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with healthcare providers, track your symptoms, and manage your 
              medical journey — all in one place.
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
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full h-14 text-base font-semibold rounded-xl">
            <Link to="/auth?mode=signin">
              I already have an account
            </Link>
          </Button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Medical Disclaimer:</strong> This app provides general health information and 
          is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
