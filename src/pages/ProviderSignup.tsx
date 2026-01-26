import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Stethoscope, 
  Building2,
  Heart,
  FlaskConical,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

// Provider Type Selection Components
import DoctorRegistrationForm from "@/components/provider-registration/DoctorRegistrationForm";
import HospitalRegistrationForm from "@/components/provider-registration/HospitalRegistrationForm";
import NurseRegistrationForm from "@/components/provider-registration/NurseRegistrationForm";
import LabRegistrationForm from "@/components/provider-registration/LabRegistrationForm";

type ProviderType = 'doctor' | 'hospital' | 'nurse' | 'lab' | null;

const providerTypes = [
  {
    type: 'doctor' as const,
    icon: Stethoscope,
    title: 'Ιατρός',
    description: 'Ιδιώτης γιατρός με ειδικότητα',
    color: 'bg-primary/10 text-primary border-primary/30',
    features: ['Προφίλ ειδικότητας', 'Online κρατήσεις', 'Ιατρική κοινότητα']
  },
  {
    type: 'hospital' as const,
    icon: Building2,
    title: 'Νοσοκομείο / Κλινική',
    description: 'Ίδρυμα υγείας με τμήματα',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    features: ['Πολλαπλά τμήματα', 'Ανακοινώσεις', 'Θέσεις εργασίας']
  },
  {
    type: 'nurse' as const,
    icon: Heart,
    title: 'Νοσηλευτής/τρια',
    description: 'Πιστοποιημένος νοσηλευτής',
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/30',
    features: ['Κατ\' οίκον φροντίδα', 'Ευέλικτο ωράριο', 'Υπηρεσίες νοσηλείας']
  },
  {
    type: 'lab' as const,
    icon: FlaskConical,
    title: 'Διαγνωστικό Εργαστήριο',
    description: 'Εργαστήριο αναλύσεων',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    features: ['Εξετάσεις αίματος', 'Απεικονιστικά', 'Online αποτελέσματα']
  }
];

export default function ProviderSignup() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProviderType>(null);

  // If a type is selected, render the specific form
  if (selectedType === 'doctor') {
    return <DoctorRegistrationForm onBack={() => setSelectedType(null)} />;
  }
  if (selectedType === 'hospital') {
    return <HospitalRegistrationForm onBack={() => setSelectedType(null)} />;
  }
  if (selectedType === 'nurse') {
    return <NurseRegistrationForm onBack={() => setSelectedType(null)} />;
  }
  if (selectedType === 'lab') {
    return <LabRegistrationForm onBack={() => setSelectedType(null)} />;
  }

  // Type selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/pilot')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Logo size="sm" />
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Εγγραφή
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Εγγραφή Επαγγελματία Υγείας
          </h1>
          <p className="text-muted-foreground">
            Επιλέξτε τον τύπο λογαριασμού που σας αντιπροσωπεύει
          </p>
        </div>

        {/* Provider Type Cards */}
        <div className="grid gap-4">
          {providerTypes.map((provider) => {
            const Icon = provider.icon;
            return (
              <Card 
                key={provider.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${
                  selectedType === provider.type ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setSelectedType(provider.type)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${provider.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{provider.title}</h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {provider.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {provider.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-muted/50 border-dashed">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Τι περιλαμβάνει η εγγραφή:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Πλήρες επαγγελματικό προφίλ με φωτογραφίες</li>
              <li>✓ Διαχείριση υπηρεσιών και τιμοκαταλόγου</li>
              <li>✓ Online σύστημα ραντεβού</li>
              <li>✓ Πιστοποίηση και badge επαλήθευσης</li>
              <li>✓ Συμμετοχή στην επαγγελματική κοινότητα</li>
            </ul>
          </CardContent>
        </Card>

        {/* Already have account */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Έχετε ήδη λογαριασμό;{" "}
          <Link to="/auth" className="text-primary hover:underline">
            Σύνδεση
          </Link>
        </p>
      </main>
    </div>
  );
}
