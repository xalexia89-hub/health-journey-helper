import { AlertCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentDisabledNoticeProps {
  appointmentId?: string;
}

export function PaymentDisabledNotice({ appointmentId }: PaymentDisabledNoticeProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-strong border-warning/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-warning" />
          </div>
          <CardTitle className="text-xl text-warning">Πληρωμές Απενεργοποιημένες</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Πιλοτική Έκδοση:</strong> Οι πληρωμές είναι απενεργοποιημένες κατά τη διάρκεια της δοκιμαστικής περιόδου.
                </p>
                <p>
                  Το ραντεβού σας έχει καταγραφεί. Η επικοινωνία με τον πάροχο υγείας θα γίνει χειροκίνητα.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/appointments')} 
              className="w-full"
            >
              Δείτε τα Ραντεβού σας
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
              className="w-full"
            >
              Επιστροφή στην Αρχική
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Για οποιαδήποτε απορία, επικοινωνήστε απευθείας με τον πάροχο υγείας.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
