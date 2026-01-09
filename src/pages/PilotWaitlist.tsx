import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/ui/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  Loader2
} from "lucide-react";

const waitlistSchema = z.object({
  email: z.string().email("Μη έγκυρη διεύθυνση email"),
  fullName: z.string().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες"),
  phone: z.string().optional(),
  reason: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export default function PilotWaitlist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      reason: "",
    },
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('pilot_waitlist')
        .insert({
          email: data.email,
          full_name: data.fullName,
          phone: data.phone || null,
          reason: data.reason || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Ήδη Εγγεγραμμένοι",
            description: "Το email αυτό είναι ήδη στη λίστα αναμονής.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setSubmitted(true);
      toast({
        title: "Επιτυχής Εγγραφή! 📝",
        description: "Θα σας ενημερώσουμε μόλις υπάρξει διαθέσιμη θέση.",
      });
    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast({
        title: "Σφάλμα",
        description: error.message || "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Ευχαριστούμε!</CardTitle>
            <CardDescription className="text-base">
              Έχετε προστεθεί στη λίστα αναμονής. Θα επικοινωνήσουμε μαζί σας μόλις υπάρξει διαθέσιμη θέση.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/pilot')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή στην Αρχική
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="border-border/50">
          <CardHeader className="text-center pb-4">
            <Clock className="h-12 w-12 text-warning mx-auto mb-4" />
            <CardTitle className="text-xl">Λίστα Αναμονής</CardTitle>
            <CardDescription>
              Το pilot είναι προσωρινά πλήρες. Συμπληρώστε τα στοιχεία σας για να ειδοποιηθείτε όταν υπάρξει θέση.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Γιατί ενδιαφέρεστε; (προαιρετικό)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Πείτε μας γιατί θέλετε να συμμετάσχετε στο pilot..."
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Υποβολή...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Εγγραφή στη Λίστα Αναμονής
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
