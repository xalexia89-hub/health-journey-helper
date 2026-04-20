import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { MedicalDisclaimer } from "@/components/pilot/MedicalDisclaimer";
import { EmergencyButton } from "@/components/pilot/EmergencyButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateAuthError } from "@/lib/authErrors";
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

const enrollSchema = z.object({
  fullName: z.string().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες"),
  email: z.string().email("Μη έγκυρη διεύθυνση email"),
  password: z.string().min(8, "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  ageConfirmed: z.boolean().refine(val => val === true, "Πρέπει να επιβεβαιώσετε ότι είστε άνω των 18"),
  termsAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε τους όρους χρήσης"),
  privacyAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε την πολιτική απορρήτου"),
  healthDisclaimerAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε την ιατρική δήλωση αποποίησης"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type EnrollFormData = z.infer<typeof enrollSchema>;

export default function PilotEnroll() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPilotFull, setIsPilotFull] = useState(false);

  const form = useForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
      ageConfirmed: false,
      termsAccepted: false,
      privacyAccepted: false,
      healthDisclaimerAccepted: false,
    },
  });

  useEffect(() => {
    checkPilotAvailability();
  }, []);

  const checkPilotAvailability = async () => {
    const { data } = await supabase.rpc('is_pilot_full');
    if (data === true) {
      setIsPilotFull(true);
      toast({
        title: "Pilot Πλήρες",
        description: "Το pilot έχει φτάσει στο όριο χρηστών. Μπορείτε να εγγραφείτε στη λίστα αναμονής.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: EnrollFormData) => {
    if (isPilotFull) {
      navigate('/pilot/waitlist');
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with additional info
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            phone: data.phone || null,
            city: data.city || null,
            gdpr_consent: true,
            terms_accepted: true,
          })
          .eq('id', authData.user.id);

        // Create pilot enrollment record
        await supabase
          .from('pilot_enrollments')
          .insert({
            user_id: authData.user.id,
            consent_accepted: true,
            consent_accepted_at: new Date().toISOString(),
            age_confirmed: true,
            status: 'active',
          });

        // Fire-and-forget admin notification
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'new-user-signup',
            idempotencyKey: `new-user-signup-${authData.user.id}`,
            templateData: {
              userEmail: data.email,
              userName: data.fullName,
              signupDate: new Date().toLocaleString('el-GR'),
              userId: authData.user.id,
            },
          },
        }).catch((e) => console.warn('Admin signup notification failed', e));

        toast({
          title: "Επιτυχής Εγγραφή! 🎉",
          description: "Καλώς ήρθατε στο Medithos Pilot. Ας ξεκινήσουμε!",
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: "Σφάλμα Εγγραφής",
        description: translateAuthError(error.message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPilotFull) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <CardTitle>Το Pilot είναι Πλήρες</CardTitle>
            <CardDescription>
              Έχουμε φτάσει στο όριο των 100 χρηστών. Εγγραφείτε στη λίστα αναμονής.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/pilot/waitlist')}
            >
              Εγγραφή σε Λίστα Αναμονής
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/pilot')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <EmergencyButton variant="floating" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/pilot')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Logo size="sm" />
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-primary' : s < step ? 'w-8 bg-primary/50' : 'w-8 bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === 1 && "Στοιχεία Λογαριασμού"}
              {step === 2 && "Προσωπικά Στοιχεία"}
              {step === 3 && "Συγκατάθεση & Όροι"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Δημιουργήστε τον λογαριασμό σας"}
              {step === 2 && "Προαιρετικά στοιχεία επικοινωνίας"}
              {step === 3 && "Αποδεχτείτε τους όρους για να συνεχίσετε"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Step 1: Account */}
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ονοματεπώνυμο *</FormLabel>
                          <FormControl>
                            <Input placeholder="Π.χ. Μαρία Παπαδοπούλου" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Κωδικός *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Τουλάχιστον 8 χαρακτήρες"
                                {...field} 
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Επιβεβαίωση Κωδικού *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Επαναλάβετε τον κωδικό" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="button" 
                      className="w-full mt-6"
                      onClick={() => {
                        const fields = ['fullName', 'email', 'password', 'confirmPassword'] as const;
                        form.trigger(fields).then((isValid) => {
                          if (isValid) setStep(2);
                        });
                      }}
                    >
                      Συνέχεια
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Τηλέφωνο (προαιρετικό)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+30 6xx xxx xxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Πόλη (προαιρετικό)</FormLabel>
                          <FormControl>
                            <Input placeholder="Π.χ. Αθήνα" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => setStep(3)}
                      >
                        Συνέχεια
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Consent */}
                {step === 3 && (
                  <>
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold">Συγκατάθεση & Όροι</span>
                      </div>

                      <FormField
                        control={form.control}
                        name="ageConfirmed"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm font-normal">
                                Επιβεβαιώνω ότι είμαι άνω των 18 ετών *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm font-normal">
                                Αποδέχομαι τους{" "}
                                <Link to="/terms" className="text-primary underline" target="_blank">
                                  Όρους Χρήσης
                                </Link>{" "}
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="privacyAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm font-normal">
                                Αποδέχομαι την{" "}
                                <Link to="/privacy" className="text-primary underline" target="_blank">
                                  Πολιτική Απορρήτου
                                </Link>{" "}
                                και συναινώ στην επεξεργασία των δεδομένων υγείας μου *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="healthDisclaimerAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm font-normal">
                                Κατανοώ ότι το Medithos{" "}
                                <strong className="text-warning">ΔΕΝ παρέχει ιατρικές συμβουλές</strong>{" "}
                                και δεν υποκαθιστά επαγγελματία υγείας *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Emergency Notice */}
                    <MedicalDisclaimer variant="inline" />

                    <div className="flex gap-3 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(2)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Εγγραφή...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Ολοκλήρωση
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
