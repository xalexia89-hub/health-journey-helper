import { useState } from "react";
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
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const signInSchema = z.object({
  email: z.string().email("Παρακαλώ εισάγετε ένα έγκυρο email"),
  password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="mb-8 text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Καλώς ήρθατε</h1>
          <p className="text-muted-foreground mt-1">
            Συνδεθείτε για να συνεχίσετε
          </p>
        </div>

        <Card className="border-0 shadow-soft">
          <CardContent className="pt-6">
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...signInForm.register('email')}
                  className="h-12 rounded-xl"
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
                    className="h-12 rounded-xl pr-10"
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

              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Σύνδεση
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Ιατρική Αποποίηση:</strong> Αυτή η εφαρμογή δεν αντικαθιστά επαγγελματικές ιατρικές συμβουλές.
        </p>
      </div>
    </div>
  );
}
