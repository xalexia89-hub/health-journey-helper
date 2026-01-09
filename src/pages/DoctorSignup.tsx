import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  ArrowRight, 
  Stethoscope, 
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle
} from "lucide-react";

const specialties = [
  "Γενική Ιατρική",
  "Παθολογία",
  "Καρδιολογία",
  "Νευρολογία",
  "Ορθοπεδική",
  "Δερματολογία",
  "Παιδιατρική",
  "Ψυχιατρική",
  "Ουρολογία",
  "Γυναικολογία",
  "Οφθαλμολογία",
  "Ωτορινολαρυγγολογία",
  "Γαστρεντερολογία",
  "Πνευμονολογία",
  "Ενδοκρινολογία",
  "Ρευματολογία",
  "Άλλο"
];

const doctorSchema = z.object({
  fullName: z.string().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες"),
  email: z.string().email("Μη έγκυρη διεύθυνση email"),
  password: z.string().min(8, "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Εισάγετε έγκυρο τηλέφωνο"),
  specialty: z.string().min(1, "Επιλέξτε ειδικότητα"),
  licenseNumber: z.string().optional(),
  clinicName: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).default(["Ελληνικά"]),
  
  // Advisor Terms
  volunteerAcknowledged: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  noPatientRelationship: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  navigationOnly: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε"),
  termsAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε τους όρους"),
  privacyAccepted: z.boolean().refine(val => val === true, "Πρέπει να αποδεχτείτε την πολιτική"),
  
  // Optional
  publicListing: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export default function DoctorSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      specialty: "",
      licenseNumber: "",
      clinicName: "",
      city: "",
      bio: "",
      languages: ["Ελληνικά"],
      volunteerAcknowledged: false,
      noPatientRelationship: false,
      navigationOnly: false,
      termsAccepted: false,
      privacyAccepted: false,
      publicListing: false,
    },
  });

  const onSubmit = async (data: DoctorFormData) => {
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
        // Update profile
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            phone: data.phone,
            city: data.city || null,
            gdpr_consent: true,
            terms_accepted: true,
          })
          .eq('id', authData.user.id);

        // Add doctor role
        await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'doctor',
          });

        // Create provider record
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .insert({
            user_id: authData.user.id,
            name: data.fullName,
            type: 'doctor',
            specialty: data.specialty,
            license_number: data.licenseNumber || null,
            phone: data.phone,
            email: data.email,
            city: data.city || null,
            description: data.bio || null,
            is_active: true,
            is_verified: false,
            registration_status: 'pending',
          })
          .select()
          .single();

        if (providerError) throw providerError;

        // Create advisor agreement
        await supabase
          .from('doctor_advisor_agreements')
          .insert({
            provider_id: providerData.id,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            no_patient_relationship_acknowledged: true,
            unpaid_volunteer_acknowledged: true,
            navigation_only_acknowledged: true,
            public_listing_opted_in: data.publicListing,
            bio: data.bio || null,
            languages: data.languages,
          });

        toast({
          title: "Επιτυχής Εγγραφή! 🩺",
          description: "Καλώς ήρθατε στο Medithos ως Σύμβουλος Πλοήγησης.",
        });

        navigate('/doctor');
      }
    } catch (error: any) {
      console.error('Doctor signup error:', error);
      toast({
        title: "Σφάλμα Εγγραφής",
        description: error.message || "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Stethoscope className="h-3 w-3 mr-1" />
            Ιατρός
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg pb-24">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
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
              {step === 2 && "Επαγγελματικά Στοιχεία"}
              {step === 3 && "Προφίλ & Παρουσία"}
              {step === 4 && "Όροι Συμμετοχής Συμβούλου"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Δημιουργήστε τον λογαριασμό σας"}
              {step === 2 && "Ειδικότητα και στοιχεία επαφής"}
              {step === 3 && "Βιογραφικό και δημόσια παρουσία"}
              {step === 4 && "Αποδοχή όρων για Σύμβουλο Πλοήγησης"}
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
                            <Input placeholder="Δρ. Ιωάννης Παπαδόπουλος" {...field} />
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
                            <Input type="email" placeholder="doctor@example.com" {...field} />
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
                        form.trigger(['fullName', 'email', 'password', 'confirmPassword']).then((isValid) => {
                          if (isValid) setStep(2);
                        });
                      }}
                    >
                      Συνέχεια
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Step 2: Professional Info */}
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ειδικότητα *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε ειδικότητα" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialties.map((spec) => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Τηλέφωνο Επικοινωνίας *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+30 210 xxx xxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Αριθμός Αδείας (προαιρετικό για pilot)</FormLabel>
                          <FormControl>
                            <Input placeholder="Π.χ. Α123456" {...field} />
                          </FormControl>
                          <FormDescription>
                            Προαιρετικό για τη φάση pilot, απαιτείται για επαλήθευση.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clinicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Όνομα Ιατρείου/Κλινικής (προαιρετικό)</FormLabel>
                          <FormControl>
                            <Input placeholder="Π.χ. Ιατρείο Υγεία" {...field} />
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
                        onClick={() => {
                          form.trigger(['specialty', 'phone']).then((isValid) => {
                            if (isValid) setStep(3);
                          });
                        }}
                      >
                        Συνέχεια
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Profile */}
                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Σύντομο Βιογραφικό (προαιρετικό)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Λίγα λόγια για την εμπειρία και τα ενδιαφέροντά σας..."
                              className="resize-none"
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="publicListing"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                              Δημόσια Εμφάνιση στην Πλατφόρμα
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Επιλέξτε αυτό αν θέλετε να εμφανίζεστε στη δημόσια λίστα γιατρών για προβολή/διαφήμιση.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

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
                        type="button" 
                        className="flex-1"
                        onClick={() => setStep(4)}
                      >
                        Συνέχεια
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 4: Advisor Terms */}
                {step === 4 && (
                  <>
                    {/* Important Notice */}
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <p className="font-semibold text-warning text-sm">Σημαντική Ενημέρωση</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ως Σύμβουλος Πλοήγησης στο Medithos, δεν δημιουργείται σχέση γιατρού-ασθενή. 
                            Παρέχετε μόνο γενική καθοδήγηση πλοήγησης, χωρίς διάγνωση ή θεραπεία.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold">Όροι Συμμετοχής Συμβούλου</span>
                      </div>

                      <FormField
                        control={form.control}
                        name="volunteerAcknowledged"
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
                                Κατανοώ ότι η συμμετοχή μου είναι <strong>εθελοντική και άμισθη</strong> κατά τη φάση pilot *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="noPatientRelationship"
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
                                Κατανοώ ότι <strong>δεν δημιουργείται σχέση γιατρού-ασθενή</strong> μέσω της πλατφόρμας *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="navigationOnly"
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
                                Κατανοώ ότι παρέχω μόνο <strong>καθοδήγηση πλοήγησης</strong>, όχι διάγνωση ή θεραπεία *
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
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(3)}
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
