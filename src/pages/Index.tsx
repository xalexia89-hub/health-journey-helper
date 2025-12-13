import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Shield, Calendar, ArrowRight, GraduationCap, 
  PlayCircle, FileText, Users, Globe, Sparkles, BookOpen 
} from "lucide-react";

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

const academyFeatures = [
  {
    icon: PlayCircle,
    title: "Video Lectures",
    description: "Εκπαιδευτικά βίντεο από κορυφαίους ειδικούς",
    stats: "2,500+ βίντεο"
  },
  {
    icon: FileText,
    title: "Έρευνες & Μελέτες",
    description: "Δημοσιεύσεις peer-reviewed ερευνών",
    stats: "10,000+ άρθρα"
  },
  {
    icon: Users,
    title: "Global Network",
    description: "Δίκτυο γιατρών από όλο τον κόσμο",
    stats: "50,000+ μέλη"
  },
  {
    icon: BookOpen,
    title: "Case Studies",
    description: "Αναλυτικές μελέτες περιπτώσεων",
    stats: "5,000+ cases"
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-mesh-futuristic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-futuristic opacity-40" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] gradient-glow animate-pulse-soft opacity-50" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] gradient-glow animate-pulse-soft opacity-30" style={{ animationDelay: '1s' }} />
      
      {/* Floating Orbs */}
      <div className="absolute top-32 right-20 w-4 h-4 rounded-full bg-accent/60 animate-float shadow-glow-accent" />
      <div className="absolute top-60 left-16 w-2 h-2 rounded-full bg-primary/50 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-60 right-1/3 w-3 h-3 rounded-full bg-accent/40 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex gap-3">
            <Button asChild variant="ghost" className="hover-glow">
              <Link to="/auth">Σύνδεση</Link>
            </Button>
            <Button asChild className="gradient-futuristic hover:shadow-neon border-0">
              <Link to="/auth?mode=signup">Εγγραφή</Link>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Το μέλλον της υγείας είναι εδώ</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
              Η Υγεία σας,{" "}
              <span className="gradient-neon bg-clip-text text-transparent">Απλοποιημένη</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Συνδεθείτε με παρόχους υγείας, παρακολουθήστε τα συμπτώματά σας και διαχειριστείτε 
              το ιατρικό σας ταξίδι — όλα σε ένα μέρος.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-xl gradient-futuristic hover:shadow-neon border-0 transition-all duration-300">
                <Link to="/auth?mode=signup">
                  Ξεκινήστε Τώρα
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl glass border-primary/30 hover:shadow-glow transition-all duration-300">
                <Link to="/providers">
                  Εξερεύνηση Παρόχων
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="glass-futuristic border-0 hover:shadow-futuristic transition-all duration-300 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl gradient-primary w-fit mb-4 shadow-glow">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Medical Academy Section */}
        <section className="px-6 py-20 relative">
          <div className="absolute inset-0 gradient-cosmic" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic mb-6">
                <GraduationCap className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Νέο</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                <span className="gradient-aurora bg-clip-text text-transparent">Medical Academy</span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Το παγκόσμιο hub γνώσης όπου γιατροί από όλο τον κόσμο μοιράζονται εμπειρίες, 
                έρευνες και εκπαιδευτικό περιεχόμενο με τη διεθνή ιατρική κοινότητα.
              </p>
            </div>

            {/* Academy Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {academyFeatures.map((item, index) => (
                <Card 
                  key={item.title}
                  className="glass-futuristic border-0 text-center hover:shadow-futuristic transition-all duration-300 hover-lift animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-accent/10 w-fit mx-auto mb-4 group-hover:shadow-glow-accent transition-all duration-300">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <p className="text-2xl font-bold gradient-neon bg-clip-text text-transparent mb-1">
                      {item.stats}
                    </p>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Academy Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-strong border-0 overflow-hidden hover:shadow-futuristic transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-2xl gradient-primary shadow-glow flex-shrink-0">
                      <Globe className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Παγκόσμιο Δίκτυο Γιατρών
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Συνδεθείτε με ειδικούς από κορυφαία νοσοκομεία και πανεπιστήμια. 
                        Ανταλλάξτε γνώσεις, συνεργαστείτε σε έρευνες και επεκτείνετε το 
                        επαγγελματικό σας δίκτυο.
                      </p>
                      <Button variant="link" className="p-0 text-accent hover:text-accent/80">
                        Εξερευνήστε το δίκτυο <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-strong border-0 overflow-hidden hover:shadow-futuristic transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-2xl gradient-aurora shadow-glow flex-shrink-0">
                      <PlayCircle className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Video Library & Live Sessions
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Παρακολουθήστε εκπαιδευτικά βίντεο, webinars και live sessions. 
                        Δημοσιεύστε το δικό σας εκπαιδευτικό περιεχόμενο και χτίστε το 
                        ακαδημαϊκό σας προφίλ.
                      </p>
                      <Button variant="link" className="p-0 text-accent hover:text-accent/80">
                        Ξεκινήστε να μαθαίνετε <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA for Academy */}
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="h-14 px-10 text-base font-semibold rounded-xl gradient-aurora hover:shadow-neon border-0 transition-all duration-300">
                <Link to="/auth?mode=signup&role=doctor">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Γίνετε Μέλος της Academy
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <footer className="px-6 py-6 glass border-t border-primary/20">
          <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
            <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή παρέχει γενικές πληροφορίες υγείας και 
            δεν αντικαθιστά επαγγελματικές ιατρικές συμβουλές, διάγνωση ή θεραπεία.
          </p>
        </footer>
      </div>
    </div>
  );
}
