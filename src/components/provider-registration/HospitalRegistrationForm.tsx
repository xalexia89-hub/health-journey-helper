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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateAuthError } from "@/lib/authErrors";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { hospitalSchema, HospitalFormData, hospitalDepartments, greekCities } from "./types";
import { RegistrationStepIndicator } from "./RegistrationStepIndicator";
import { DocumentUploadSection, UploadedDocument } from "./DocumentUploadSection";
import { ServicesSection, ServiceItem } from "./ServicesSection";
import { AvailabilitySection, DayAvailability, defaultAvailability } from "./AvailabilitySection";
import { uploadProviderDocuments } from "./uploadDocuments";

interface HospitalRegistrationFormProps {
  onBack: () => void;
}

const organizationTypes = [
  { value: 'hospital', label: 'Νοσοκομείο' },
  { value: 'clinic', label: 'Κλινική' },
  { value: 'medical_center', label: 'Ιατρικό Κέντρο' },
];

export default function HospitalRegistrationForm({ onBack }: HospitalRegistrationFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [availability, setAvailability] = useState<DayAvailability[]>(defaultAvailability);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const form = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      organizationName: "",
      organizationType: 'clinic',
      licenseNumber: "",
      city: "",
      address: "",
      bio: "",
      emergencyAvailable: false,
      parkingAvailable: false,
      accessibilityFeatures: false,
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (data: HospitalFormData) => {
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
            address: data.address || null,
            gdpr_consent: true,
            terms_accepted: true,
          })
          .eq('id', authData.user.id);

        const providerType = data.organizationType === 'hospital' ? 'hospital' : 'clinic';
        
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .insert({
            user_id: authData.user.id,
            name: data.organizationName,
            type: providerType,
            license_number: data.licenseNumber,
            phone: data.phone,
            email: data.email,
            city: data.city || null,
            address: data.address || null,
            description: data.bio || null,
            services: [...selectedDepartments, ...services.map(s => s.name)],
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
          title: "Επιτυχής Εγγραφή! 🏥",
          description: uploadResult.failed > 0
            ? `${uploadResult.uploaded} έγγραφα ανέβηκαν. ${uploadResult.failed} απέτυχαν — μπορείτε να τα ανεβάσετε ξανά από τις ρυθμίσεις.`
            : "Τα στοιχεία σας θα επαληθευτούν εντός 24-48 ωρών.",
        });

        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Hospital signup error:', error);
      toast({
        title: "Σφάλμα Εγγραφής",
        description: translateAuthError(message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Logo size="sm" />
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            <Building2 className="h-3 w-3 mr-1" />
            Ίδρυμα
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg pb-24">
        <RegistrationStepIndicator currentStep={step} totalSteps={5} />

        <Card className="border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === 1 && "Στοιχεία Λογαριασμού"}
              {step === 2 && "Στοιχεία Οργανισμού"}
              {step === 3 && "Τμήματα & Υπηρεσίες"}
              {step === 4 && "Έγγραφα & Ωράριο"}
              {step === 5 && "Όροι Χρήσης"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Δημιουργήστε τον λογαριασμό διαχειριστή"}
              {step === 2 && "Πληροφορίες οργανισμού"}
              {step === 3 && "Επιλέξτε τμήματα και υπηρεσίες"}
              {step === 4 && "Πιστοποίηση και ωράριο"}
              {step === 5 && "Αποδοχή όρων"}
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
                          <FormLabel>Όνομα Υπεύθυνου *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ονοματεπώνυμο διαχειριστή" {...field} />
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
                          <FormLabel>Email Επικοινωνίας *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@clinic.gr" {...field} />
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

                {/* Step 2: Organization Info */}
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Επωνυμία Οργανισμού *</FormLabel>
                          <FormControl>
                            <Input placeholder="π.χ. Ιατρικό Κέντρο Υγεία" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Τύπος Οργανισμού *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε τύπο" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {organizationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Αριθμός Αδείας Λειτουργίας *</FormLabel>
                          <FormControl>
                            <Input placeholder="Αριθμός αδείας" {...field} />
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
                            <Input type="tel" placeholder="+30 210 xxx xxxx" {...field} />
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε πόλη" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {greekCities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Διεύθυνση</FormLabel>
                          <FormControl>
                            <Input placeholder="Οδός, αριθμός, ΤΚ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => {
                          form.trigger(['organizationName', 'organizationType', 'licenseNumber', 'phone']).then((isValid) => {
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

                {/* Step 3: Departments & Services */}
                {step === 3 && (
                  <>
                    <div className="space-y-3">
                      <FormLabel>Τμήματα</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {hospitalDepartments.map((dept) => (
                          <Badge
                            key={dept}
                            variant={selectedDepartments.includes(dept) ? "default" : "outline"}
                            className="cursor-pointer py-1.5 px-3"
                            onClick={() => toggleDepartment(dept)}
                          >
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border my-4" />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="emergencyAvailable"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Επείγοντα Περιστατικά 24/7</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parkingAvailable"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Διαθέσιμο Parking</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accessibilityFeatures"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Πρόσβαση ΑΜΕΑ</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t border-border my-4" />

                    <ServicesSection
                      services={services}
                      onServicesChange={setServices}
                      suggestedServices={["Check-up", "Αιμοληψία", "Ακτινογραφία", "Υπέρηχος"]}
                      title="Επιπλέον Υπηρεσίες"
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

                {/* Step 4: Documents & Availability */}
                {step === 4 && (
                  <>
                    <DocumentUploadSection
                      documents={documents}
                      onDocumentsChange={setDocuments}
                      requiredTypes={['license']}
                    />

                    <div className="border-t border-border my-6" />

                    <AvailabilitySection
                      availability={availability}
                      onAvailabilityChange={setAvailability}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Περιγραφή</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Περιγράψτε τον οργανισμό σας..."
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(3)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω
                      </Button>
                      <Button type="button" className="flex-1" onClick={() => setStep(5)}>
                        Συνέχεια
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 5: Terms */}
                {step === 5 && (
                  <>
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
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(4)}>
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
