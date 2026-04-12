import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check hash for recovery type
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (data: ResetFormData) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setLoading(false);

    if (error) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      toast({
        title: "Επιτυχία!",
        description: "Ο κωδικός σας ενημερώθηκε.",
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen bg-mesh-futuristic flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-0 glass-futuristic shadow-futuristic">
          <CardContent className="pt-6 text-center space-y-4">
            <Logo size="lg" className="justify-center mb-4" />
            <p className="text-muted-foreground">
              Φόρτωση... Αν δεν ανακατευθυνθείτε, χρησιμοποιήστε τον σύνδεσμο από το email σας.
            </p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-mesh-futuristic flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-0 glass-futuristic shadow-futuristic">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Ο κωδικός ενημερώθηκε!</h2>
            <p className="text-muted-foreground">Θα μεταφερθείτε αυτόματα...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-futuristic relative overflow-hidden flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid-futuristic opacity-60" />
      
      <Card className="relative z-10 w-full max-w-md border-0 glass-futuristic shadow-futuristic">
        <CardContent className="pt-6">
          <div className="mb-6 text-center">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Νέος κωδικός</h1>
            <p className="text-muted-foreground mt-1">Εισάγετε τον νέο σας κωδικό</p>
          </div>

          <form onSubmit={form.handleSubmit(handleReset)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Νέος κωδικός</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...form.register('password')}
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
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Επιβεβαίωση κωδικού</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...form.register('confirmPassword')}
                className="h-12 rounded-xl bg-background/50 border-primary/20 focus:border-accent focus:shadow-glow-accent transition-all duration-300"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-futuristic hover:shadow-neon transition-all duration-300 border-0"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Αλλαγή κωδικού
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
