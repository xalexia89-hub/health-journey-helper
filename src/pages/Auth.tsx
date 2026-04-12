import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Eye, EyeOff, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const signInSchema = z.object({
  email: z.string().trim().email("Παρακαλώ εισάγετε ένα έγκυρο email"),
  password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες").max(100, "Το όνομα είναι πολύ μεγάλο"),
  email: z.string().trim().email("Παρακαλώ εισάγετε ένα έγκυρο email"),
  password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);

    if (error) {
      toast({
        title: "Αποτυχία σύνδεσης",
        description: error.message === "Invalid login credentials" 
          ? "Λάθος email ή κωδικός. Παρακαλώ δοκιμάστε ξανά." 
          : error.message,
        variant: "destructive",
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "Αυτό το email χρησιμοποιείται ήδη. Δοκιμάστε να συνδεθείτε.";
      }
      toast({
        title: "Αποτυχία εγγραφής",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Επιτυχής εγγραφή! ✉️",
        description: "Σας στείλαμε email επιβεβαίωσης. Παρακαλώ ελέγξτε τα εισερχόμενά σας για να ενεργοποιήσετε τον λογαριασμό σας.",
      });
      // Don't navigate — user must verify email first
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    signInForm.reset();
    signUpForm.reset();
  };

  return (
    <div className="min-h-screen bg-mesh-futuristic relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-futuristic opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-glow animate-pulse-soft opacity-60" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 gradient-glow animate-pulse-soft opacity-40" style={{ animationDelay: '1s' }} />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-accent/60 animate-float shadow-glow-accent" />
      <div className="absolute top-40 left-20 w-2 h-2 rounded-full bg-primary/50 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-1/4 w-4 h-4 rounded-full bg-accent/40 animate-float" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover-glow">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="mb-8 text-center animate-fade-in">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? "Δημιουργία λογαριασμού" : "Καλώς ήρθατε"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isSignUp ? "Εγγραφείτε για να ξεκινήσετε" : "Συνδεθείτε για να συνεχίσετε"}
          </p>
        </div>

        <Card className="border-0 glass-futuristic shadow-futuristic animate-slide-up">
          <CardContent className="pt-6">
            {isSignUp ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Ονοματεπώνυμο</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Γιάννης Παπαδόπουλος"
                    {...signUpForm.register('fullName')}
                    className="h-12 rounded-xl bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    {...signUpForm.register('email')}
                    className="h-12 rounded-xl bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Κωδικός</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...signUpForm.register('password')}
                      className="h-12 rounded-xl pr-10 bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Επιβεβαίωση κωδικού</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...signUpForm.register('confirmPassword')}
                    className="h-12 rounded-xl bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl gradient-futuristic hover:shadow-neon transition-all duration-300 border-0" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Εγγραφή
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Έχετε ήδη λογαριασμό;{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-accent hover:underline font-medium"
                  >
                    Συνδεθείτε
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...signInForm.register('email')}
                    className="h-12 rounded-xl bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Κωδικός</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...signInForm.register('password')}
                      className="h-12 rounded-xl pr-10 bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      const email = signInForm.getValues('email');
                      if (!email) {
                        toast({ title: "Εισάγετε το email σας", description: "Συμπληρώστε το email και πατήστε ξανά.", variant: "destructive" });
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      });
                      if (error) {
                        toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
                      } else {
                        toast({ title: "Email στάλθηκε ✉️", description: "Ελέγξτε τα εισερχόμενά σας για τον σύνδεσμο επαναφοράς κωδικού." });
                      }
                    }}
                    className="text-xs text-accent hover:underline"
                  >
                    Ξεχάσατε τον κωδικό;
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl gradient-futuristic hover:shadow-neon transition-all duration-300 border-0" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Σύνδεση
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Δεν έχετε λογαριασμό;{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-accent hover:underline font-medium"
                  >
                    Εγγραφείτε
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Healthcare Professional Registration */}
        <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/doctor-registration')}
            className="w-full h-14 rounded-xl border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 group"
          >
            <Stethoscope className="mr-3 h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-foreground">Είστε επαγγελματίας υγείας;</span>
              <span className="text-xs text-muted-foreground">Γιατρός, Νοσοκομείο, Ιατρικό Κέντρο, Νοσηλευτής</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="relative z-10 px-6 py-4 glass border-t border-primary/20">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή δεν αντικαθιστά επαγγελματικές ιατρικές συμβουλές.
        </p>
      </div>
    </div>
  );
}
