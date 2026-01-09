import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Calendar, Clock, MapPin, User, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Provider {
  name: string;
  specialty: string | null;
  address: string | null;
  city: string | null;
}

interface BookingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider;
  selectedDate: Date;
  selectedTime: string;
  onConfirm: () => void;
  isLoading: boolean;
  symptomSummary?: {
    bodyAreas?: string[];
    symptoms?: string[];
    painLevel?: number;
  };
}

export const BookingConfirmationDialog = ({
  open,
  onOpenChange,
  provider,
  selectedDate,
  selectedTime,
  onConfirm,
  isLoading,
  symptomSummary
}: BookingConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Επιβεβαίωση Ραντεβού</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 mt-4">
              {/* Provider Info */}
              <div className="flex items-start gap-3 text-left">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{provider.name}</p>
                  <p className="text-sm">{provider.specialty}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 text-left">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-foreground">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: el })}
                </p>
              </div>

              <div className="flex items-center gap-3 text-left">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-foreground font-medium">{selectedTime}</p>
              </div>

              {/* Location */}
              {provider.address && (
                <div className="flex items-start gap-3 text-left">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm">
                    {provider.address}, {provider.city}
                  </p>
                </div>
              )}

              {/* Symptom Summary */}
              {symptomSummary && (symptomSummary.bodyAreas?.length || symptomSummary.symptoms?.length) && (
                <>
                  <Separator />
                  <div className="space-y-2 text-left">
                    <p className="text-sm font-medium text-foreground">Συμπτώματα που θα αναφερθούν:</p>
                    <div className="flex flex-wrap gap-1">
                      {symptomSummary.bodyAreas?.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs capitalize">
                          {area.replace('_', ' ')}
                        </Badge>
                      ))}
                      {symptomSummary.symptoms?.map((symptom) => (
                        <Badge key={symptom} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    {symptomSummary.painLevel && (
                      <p className="text-xs text-muted-foreground">
                        Επίπεδο πόνου: {symptomSummary.painLevel}/10
                      </p>
                    )}
                  </div>
                </>
              )}

              <Separator />

              {/* Pilot Notice */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-health-warning/10 border border-health-warning/20">
                <AlertTriangle className="h-5 w-5 text-health-warning flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-health-warning">Πιλοτική Έκδοση</p>
                  <p className="text-xs text-muted-foreground">
                    Αυτό είναι ένα ραντεβού συμβουλευτικής/καθοδήγησης, 
                    όχι επίσημη ιατρική συνεδρία. Ο ιατρός θα επικοινωνήσει 
                    μαζί σας για επιβεβαίωση.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>Ακύρωση</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Κράτηση...' : 'Επιβεβαίωση Κράτησης'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
