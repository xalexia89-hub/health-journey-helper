import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, CheckCircle2, User, Mail, Phone, MapPin, Stethoscope, FileCheck, ArrowLeft } from "lucide-react";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Το όνομα πρέπει να έχει τουλάχιστον 3 χαρακτήρες"),
  email: z.string().email("Μη έγκυρο email"),
  password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
  phone: z.string().min(10, "Μη έγκυρος αριθμός τηλεφώνου"),
  specialty: z.string().min(1, "Επιλέξτε ειδικότητα"),
  licenseNumber: z.string().min(5, "Ο αριθμός άδειας είναι υποχρεωτικός"),
  address: z.string().min(5, "Η διεύθυνση είναι υποχρεωτική"),
  city: z.string().min(2, "Η πόλη είναι υποχρεωτική"),
  description: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const SPECIALTIES = [
  "Γενικός Ιατρός",
  "Καρδιολόγος",
  "Ορθοπεδικός",
  "Δερματολόγος",
  "Νευρολόγος",
  "Παιδίατρος",
  "Γυναικολόγος",
  "Οφθαλμίατρος",
  "Ωτορινολαρυγγολόγος",
  "Ψυχίατρος",
  "Χειρουργός",
  "Παθολόγος",
  "Ογκολόγος",
  "Ρευματολόγος",
  "Ενδοκρινολόγος",
  "Γαστρεντερολόγος",
  "Πνευμονολόγος",
  "Ουρολόγος",
  "Νεφρολόγος",
  "Αλλεργιολόγος",
];

export default function DoctorRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{ type: string; file: File }[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const specialty = watch("specialty");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Check if user has doctor role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const hasDoctor = roles?.some(r => r.role === "doctor");

      if (hasDoctor) {
        toast({
          title: "Επιτυχής σύνδεση",
          description: "Καλώς ήρθατε!",
        });
        navigate("/doctor/settings");
      } else {
        toast({
          title: "Πρόβλημα πρόσβασης",
          description: "Δεν έχετε δικαιώματα γιατρού. Παρακαλώ εγγραφείτε ως γιατρός.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Σφάλμα σύνδεσης",
        description: error.message || "Λάθος email ή κωδικός",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Σφάλμα",
          description: "Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 10MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFiles((prev) => [...prev.filter((f) => f.type !== type), { type, file }]);
    }
  };

  const getFileForType = (type: string) => uploadedFiles.find((f) => f.type === type);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Αποτυχία δημιουργίας λογαριασμού");

      // Step 2: Add doctor role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: "doctor" });

      if (roleError) {
        console.error("Role error:", roleError);
      }

      // Step 3: Create provider record
      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .insert({
          user_id: authData.user.id,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          specialty: data.specialty,
          license_number: data.licenseNumber,
          address: data.address,
          city: data.city,
          country: "Ελλάδα",
          description: data.description || null,
          type: "doctor",
          is_active: false,
          is_verified: false,
          registration_status: "pending",
        })
        .select()
        .single();

      if (providerError) throw providerError;

      setProviderId(providerData.id);
      setStep(2);

      toast({
        title: "Επιτυχία!",
        description: "Ο λογαριασμός σας δημιουργήθηκε. Τώρα ανεβάστε τα έγγραφά σας.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Check if user already exists
      if (error.code === "user_already_exists" || error.message?.includes("already registered")) {
        toast({
          title: "Ο χρήστης υπάρχει ήδη",
          description: "Αυτό το email είναι ήδη εγγεγραμμένο. Παρακαλώ συνδεθείτε.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Σφάλμα",
          description: error.message || "Αποτυχία εγγραφής",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Προσοχή",
        description: "Παρακαλώ ανεβάστε τουλάχιστον ένα έγγραφο",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !providerId) throw new Error("Δεν βρέθηκε χρήστης");

      for (const { type, file } of uploadedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("provider-documents")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("provider-documents")
          .getPublicUrl(fileName);

        const { error: docError } = await supabase
          .from("provider_documents")
          .insert({
            provider_id: providerId,
            document_type: type,
            file_name: file.name,
            file_url: publicUrl,
            status: "pending",
          });

        if (docError) throw docError;
      }

      setStep(3);

      toast({
        title: "Επιτυχία!",
        description: "Τα έγγραφά σας υποβλήθηκαν για έγκριση.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Σφάλμα",
        description: error.message || "Αποτυχία ανεβάσματος εγγράφων",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή
        </Button>

        <div className="flex justify-center mb-8">
          <Logo size="lg" linkTo="/" />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && !isLoginMode && (
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                Εγγραφή Ιατρού
              </CardTitle>
              <CardDescription>
                Συμπληρώστε τα στοιχεία σας για να εγγραφείτε στην πλατφόρμα
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Ονοματεπώνυμο *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@email.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Κωδικός Πρόσβασης *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Τηλέφωνο *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="69XXXXXXXX"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Ειδικότητα *
                    </Label>
                    <Select onValueChange={(value) => setValue("specialty", value)} value={specialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε ειδικότητα" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTIES.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialty && (
                      <p className="text-sm text-destructive">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Αριθμός Άδειας *
                    </Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Αριθμός άδειας ασκήσεως"
                      {...register("licenseNumber")}
                    />
                    {errors.licenseNumber && (
                      <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Πόλη *
                    </Label>
                    <Input
                      id="city"
                      placeholder="π.χ. Αθήνα"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Διεύθυνση Ιατρείου *
                    </Label>
                    <Input
                      id="address"
                      placeholder="Οδός, αριθμός"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Σύντομη Περιγραφή</Label>
                  <Textarea
                    id="description"
                    placeholder="Περιγράψτε την εμπειρία και τις υπηρεσίες σας..."
                    rows={3}
                    {...register("description")}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Εγγραφή...
                    </>
                  ) : (
                    "Συνέχεια"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Έχετε ήδη λογαριασμό;{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsLoginMode(true)}>
                    Σύνδεση
                  </Button>
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 1 && isLoginMode && (
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                Σύνδεση Ιατρού
              </CardTitle>
              <CardDescription>
                Συνδεθείτε για να συνεχίσετε στο προφίλ σας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="doctor@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Κωδικός Πρόσβασης</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Σύνδεση...
                    </>
                  ) : (
                    "Σύνδεση"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Δεν έχετε λογαριασμό;{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsLoginMode(false)}>
                    Εγγραφή
                  </Button>
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Upload className="h-6 w-6 text-primary" />
                Ανέβασμα Εγγράφων
              </CardTitle>
              <CardDescription>
                Ανεβάστε τα απαραίτητα έγγραφα για επαλήθευση
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { type: "license", label: "Άδεια Ασκήσεως Επαγγέλματος", required: true },
                { type: "diploma", label: "Πτυχίο Ιατρικής", required: true },
                { type: "specialty_cert", label: "Τίτλος Ειδικότητας", required: false },
                { type: "id_card", label: "Ταυτότητα/Διαβατήριο", required: true },
              ].map(({ type, label, required }) => {
                const uploadedFile = getFileForType(type);
                return (
                  <div
                    key={type}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      uploadedFile
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="file"
                      id={type}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload(type)}
                    />
                    <label htmlFor={type} className="cursor-pointer block">
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">{uploadedFile.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <CheckCircle2 className="h-6 w-6 text-primary ml-auto" />
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="font-medium">
                            {label} {required && <span className="text-destructive">*</span>}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, JPG ή PNG (μέχρι 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                );
              })}

              <Button
                onClick={handleDocumentUpload}
                className="w-full"
                disabled={isLoading || uploadedFiles.length < 3}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ανέβασμα...
                  </>
                ) : (
                  "Υποβολή Εγγράφων"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                * Απαιτούνται τουλάχιστον 3 έγγραφα για υποβολή
              </p>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-border/50 shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Η αίτησή σας υποβλήθηκε!</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Η αίτησή σας θα εξεταστεί από την ομάδα μας και θα λάβετε ειδοποίηση
                μόλις εγκριθεί ο λογαριασμός σας.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm">
                  <strong>Τι συμβαίνει τώρα:</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>✓ Έλεγχος στοιχείων από την ομάδα μας</li>
                  <li>✓ Επαλήθευση αριθμού άδειας</li>
                  <li>✓ Έλεγχος εγγράφων</li>
                  <li>✓ Ενεργοποίηση λογαριασμού (1-3 εργάσιμες)</li>
                </ul>
              </div>
              <Button onClick={() => navigate("/")} variant="outline">
                Επιστροφή στην Αρχική
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
