import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateAuthError } from "@/lib/authErrors";
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { nurseSchema, NurseFormData, nursingServices, greekCities } from "./types";
import { RegistrationStepIndicator } from "./RegistrationStepIndicator";
import { DocumentUploadSection, UploadedDocument } from "./DocumentUploadSection";
import { ServicesSection, ServiceItem } from "./ServicesSection";
import { AvailabilitySection, DayAvailability, defaultAvailability } from "./AvailabilitySection";
import { uploadProviderDocuments } from "./uploadDocuments";

interface NurseRegistrationFormProps {
  onBack: () => void;
}

export default function NurseRegistrationForm({ onBack }: NurseRegistrationFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [availability, setAvailability] = useState<DayAvailability[]>(defaultAvailability);

  const form = useForm<NurseFormData>({
    resolver: zodResolver(nurseSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      licenseNumber: "",
      specialty: "",
      city: "",
      bio: "",
      homeVisits: true,
      availability24h: false,
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (data: NurseFormData) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: data.fullName }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
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

        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .insert({
            user_id: authData.user.id,
            name: data.fullName,
            type: 'nurse',
            specialty: data.specialty || 'Γενική Νοσηλεία',
            license_number: data.licenseNumber,
            phone: data.phone,
            email: data.email,
            city: data.city || null,
            description: data.bio || null,
            price_min: services[0]?.priceMin || null,
            price_max: services[0]?.priceMax || null,
            services: services.map(s => s.name),
            is_active: true,
            is_verified: false,
            registration_status: 'pending',
          })
          .select()
          .single();

        if (providerError) throw providerError;

        // Create availability slots
        for (const slot of availability.filter(a => a.isActive)) {
          await supabase.from('availability_slots').insert({
            provider_id: providerData.id,
            day_of_week: slot.dayOfWeek,
            start_time: slot.startTime,
            end_time: slot.endTime,
            is_active: true,
          });
        }

        // Upload verification documents
        const uploadResult = await uploadProviderDocuments(
          providerData.id,
          authData.user.id,
          documents
        );

        toast({
          title: "Επιτυχής Εγγραφή! 💉",
          description: uploadResult.failed > 0
            ? `${uploadResult.uploaded} έγγραφα ανέβηκαν. ${uploadResult.failed} απέτυχαν — μπορείτε να τα ανεβάσετε ξανά από τις ρυθμίσεις.`
            : "Τα στοιχεία σας θα επαληθευτούν εντός 24-48 ωρών.",
        });

        navigate('/nurses');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Nurse signup error:', error);
      toast({
        title: "Σφάλμα Εγγραφής",
        description: translateAuthError(message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-500/5">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Logo size="sm" />
          <Badge variant="outline" className="bg-pink-500/10 text-pink-600 border-pink-500/30">
            <Heart className="h-3 w-3 mr-1" />
            Νοσηλευτής
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg pb-24">
        <RegistrationStepIndicator currentStep={step} totalSteps={4} />

        <Card className="border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === 1 && "Στοιχεία Λογαριασμού"}
              {step === 2 && "Επαγγελματικά Στοιχεία"}
              {step === 3 && "Υπηρεσίες & Ωράριο"}
              {step === 4 && "Έγγραφα & Όροι"}
            </CardTitle>
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
                            <Input placeholder="Μαρία Παπαδοπούλου" {...field} />
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
                            <Input type="email" placeholder="nurse@example.com" {...field} />
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
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Αριθμός Αδείας *</FormLabel>
                          <FormControl>
                            <Input placeholder="Αριθμός αδείας νοσηλευτή" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Τηλέφωνο *</FormLabel>
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
                          <FormLabel>Πόλη</FormLabel>
                          <FormControl>
                            <Input placeholder="Πόλη εργασίας" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Εμπειρία & Βιογραφικό</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Περιγράψτε την εμπειρία σας..."
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3 pt-2">
                      <FormField
                        control={form.control}
                        name="homeVisits"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Κατ' οίκον επισκέψεις</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability24h"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Διαθεσιμότητα 24/7</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => {
                          form.trigger(['licenseNumber', 'phone']).then((isValid) => {
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

                {/* Step 3: Services & Availability */}
                {step === 3 && (
                  <>
                    <ServicesSection
                      services={services}
                      onServicesChange={setServices}
                      suggestedServices={nursingServices.slice(0, 8)}
                    />

                    <div className="border-t border-border my-6" />

                    <AvailabilitySection
                      availability={availability}
                      onAvailabilityChange={setAvailability}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button type="button" className="flex-1" onClick={() => setStep(4)}>
                        Συνέχεια
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 4: Documents & Terms */}
                {step === 4 && (
                  <>
                    <DocumentUploadSection
                      documents={documents}
                      onDocumentsChange={setDocuments}
                      requiredTypes={['license']}
                    />

                    <div className="border-t border-border my-6" />

                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Αποδέχομαι τους <Link to="/terms" className="text-primary underline">Όρους Χρήσης</Link> *
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="privacyAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Αποδέχομαι την <Link to="/privacy" className="text-primary underline">Πολιτική Απορρήτου</Link> *
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(3)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading}>
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
