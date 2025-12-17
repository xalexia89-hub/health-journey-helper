import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileSignature, Heart, Shield, Smartphone, CheckCircle, Users, Printer } from "lucide-react";

export default function InterestForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signatureCount, setSignatureCount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    provider_type: "",
    specialty: "",
    organization_name: "",
    city: "",
    reason: "",
  });

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("interest_expressions")
        .select("*", { count: "exact", head: true });
      setSignatureCount(count || 0);
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.provider_type) {
      toast.error("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("interest_expressions")
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          provider_type: formData.provider_type,
          specialty: formData.specialty || null,
          organization_name: formData.organization_name || null,
          city: formData.city || null,
          reason: formData.reason || null,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Η εκδήλωση ενδιαφέροντος καταχωρήθηκε!");
    } catch (error) {
      console.error("Error submitting interest:", error);
      toast.error("Σφάλμα κατά την υποβολή. Δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ευχαριστούμε!</h2>
            <p className="text-muted-foreground mb-6">
              Η υπογραφή σας καταχωρήθηκε επιτυχώς. Θα επικοινωνήσουμε μαζί σας σύντομα.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Επιστροφή στην αρχική
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="sm" linkTo="/" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open("/interest/print", "_blank")}>
              <Printer className="w-4 h-4 mr-2" />
              Εκτύπωση
            </Button>
            <Button variant="outline" onClick={() => navigate("/pitch-deck")}>
              Pitch Deck
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <FileSignature className="w-4 h-4" />
            Εκδήλωση Ενδιαφέροντος
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Υπογράψτε για το <span className="text-gradient-neon">Μέλλον της Υγείας</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ενώστε τη φωνή σας με εκατοντάδες επαγγελματίες υγείας που πιστεύουν 
            στην ψηφιακή καινοτομία της ιατρικής περίθαλψης.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Benefits */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Γιατί να υπογράψετε;
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Βελτίωση Περίθαλψης</h3>
                  <p className="text-muted-foreground text-sm">
                    Ταχύτερη διάγνωση, καλύτερη επικοινωνία με ασθενείς, λιγότερη γραφειοκρατία.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Offline Λειτουργία</h3>
                  <p className="text-muted-foreground text-sm">
                    Πρόσβαση σε κρίσιμα ιατρικά δεδομένα ακόμα και χωρίς internet.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ασφάλεια & GDPR</h3>
                  <p className="text-muted-foreground text-sm">
                    Πλήρης συμμόρφωση με ευρωπαϊκούς κανονισμούς προστασίας δεδομένων.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Δίκτυο Συνεργασίας</h3>
                  <p className="text-muted-foreground text-sm">
                    Συνδεθείτε με άλλους επαγγελματίες υγείας και μοιραστείτε γνώσεις.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats placeholder */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Μέχρι στιγμής έχουν υπογράψει</p>
              <p className="text-4xl font-bold text-foreground">
                <span className="text-gradient-neon">{signatureCount !== null ? signatureCount : "..."}</span> επαγγελματίες
              </p>
              {signatureCount === 0 && (
                <p className="text-sm text-muted-foreground mt-1">Γίνετε ο πρώτος!</p>
              )}
            </div>
          </div>

          {/* Form */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary" />
                Φόρμα Εκδήλωσης Ενδιαφέροντος
              </CardTitle>
              <CardDescription>
                Τα στοιχεία σας θα χρησιμοποιηθούν μόνο για επικοινωνία σχετικά με το Medithos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Ονοματεπώνυμο *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Τηλέφωνο</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="69xxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_type">Ιδιότητα *</Label>
                  <Select
                    value={formData.provider_type}
                    onValueChange={(value) => setFormData({ ...formData, provider_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε ιδιότητα" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Γιατρός</SelectItem>
                      <SelectItem value="nurse">Νοσοκόμος/α</SelectItem>
                      <SelectItem value="clinic">Κλινική / Ιατρείο</SelectItem>
                      <SelectItem value="hospital">Νοσοκομείο</SelectItem>
                      <SelectItem value="other">Άλλο</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Ειδικότητα</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="π.χ. Καρδιολόγος, Παθολόγος"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization_name">Όνομα Οργανισμού/Κλινικής</Label>
                  <Input
                    id="organization_name"
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    placeholder="π.χ. Ιατρείο Υγεία"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Πόλη</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="π.χ. Αθήνα"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Γιατί σας ενδιαφέρει το Medithos;</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Πείτε μας γιατί πιστεύετε ότι χρειάζεται μια τέτοια εφαρμογή..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Υποβολή..." : "Υπογραφή Εκδήλωσης Ενδιαφέροντος"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Με την υποβολή, συμφωνείτε να επικοινωνήσουμε μαζί σας σχετικά με το Medithos.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
