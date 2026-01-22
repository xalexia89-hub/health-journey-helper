import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { el } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ChevronLeft, 
  Loader2,
  CheckCircle,
  Stethoscope,
  Video,
  Building2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  specialty: string | null;
  type: string;
  rating: number | null;
  address: string | null;
  avatar_url: string | null;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}

interface SymptomSummary {
  bodyAreas: string[];
  symptoms: string[];
  urgencyLevel?: string;
}

type VisitType = "in_person" | "telemedicine";

interface InlineBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider;
  symptomSummary?: SymptomSummary;
  onBookingComplete?: () => void;
}

export function InlineBookingDialog({
  open,
  onOpenChange,
  provider,
  symptomSummary,
  onBookingComplete,
}: InlineBookingDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"visitType" | "date" | "time" | "confirm" | "success">("visitType");
  const [visitType, setVisitType] = useState<VisitType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  useEffect(() => {
    if (open && provider.id) {
      fetchAvailability();
    }
  }, [open, provider.id]);

  useEffect(() => {
    if (selectedDate && provider.id) {
      fetchBookedTimes();
    }
  }, [selectedDate, provider.id]);

  const fetchAvailability = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("is_active", true);

    if (!error && data) {
      setAvailableSlots(data);
    }
    setIsLoading(false);
  };

  const fetchBookedTimes = async () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const { data } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("provider_id", provider.id)
      .eq("appointment_date", dateStr)
      .neq("status", "cancelled");

    if (data) {
      setBookedTimes(data.map((a) => a.appointment_time));
    }
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay();
    const daySlots = availableSlots.filter((s) => s.day_of_week === dayOfWeek);
    
    const times: string[] = [];
    daySlots.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);
      const duration = slot.slot_duration_minutes || 30;
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`;
        if (!bookedTimes.includes(timeStr)) {
          times.push(timeStr);
        }
        currentMin += duration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
    });
    
    return times.sort();
  };

  const handleVisitTypeSelect = (type: VisitType) => {
    setVisitType(type);
    setStep("date");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime) return;

    setIsBooking(true);
    try {
      // Check for duplicate booking
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data: existingBooking } = await supabase
        .from("appointments")
        .select("id")
        .eq("patient_id", user.id)
        .eq("provider_id", provider.id)
        .eq("appointment_date", dateStr)
        .eq("appointment_time", selectedTime)
        .neq("status", "cancelled")
        .maybeSingle();

      if (existingBooking) {
        toast({
          title: "Υπάρχει ήδη κράτηση",
          description: "Έχετε ήδη ραντεβού αυτή την ώρα",
          variant: "destructive",
        });
        setIsBooking(false);
        return;
      }

      // Create the appointment
      const visitTypeLabel = visitType === "telemedicine" ? "telemedicine" : "in_person";
      const { error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        provider_id: provider.id,
        appointment_date: dateStr,
        appointment_time: selectedTime,
        notes: symptomSummary
          ? `Τύπος: ${visitType === "telemedicine" ? "Τηλεϊατρική" : "Δια ζώσης"}\nΣυμπτώματα: ${symptomSummary.symptoms.join(", ")}\nΠεριοχές: ${symptomSummary.bodyAreas.join(", ")}`
          : `Τύπος: ${visitType === "telemedicine" ? "Τηλεϊατρική" : "Δια ζώσης"}`,
        status: "pending",
        visit_type: visitTypeLabel,
      });

      if (error) throw error;

      setStep("success");
      toast({
        title: "Επιτυχής κράτηση!",
        description: "Το ραντεβού σας καταχωρήθηκε",
      });
      onBookingComplete?.();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία κράτησης ραντεβού",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setStep("visitType");
      setVisitType(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 300);
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Κλείσιμο Ραντεβού
          </DialogTitle>
          <DialogDescription>
            Επιλέξτε ημερομηνία και ώρα για το ραντεβού σας
          </DialogDescription>
        </DialogHeader>

        {/* Provider Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            {provider.avatar_url && (
              <AvatarImage src={provider.avatar_url} alt={provider.name} />
            )}
            <AvatarFallback className="bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{provider.name}</h4>
            <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            {provider.rating && (
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>{provider.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {["visitType", "date", "time", "confirm"].map((s, i) => {
            const steps = ["visitType", "date", "time", "confirm"];
            const currentIndex = steps.indexOf(step);
            return (
              <div
                key={s}
                className={cn(
                  "h-2 w-6 rounded-full transition-colors",
                  step === s || (step === "success" && i < 4)
                    ? "bg-primary"
                    : currentIndex > i
                    ? "bg-primary/50"
                    : "bg-muted"
                )}
              />
            );
          })}
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Visit Type Selection */}
          {step === "visitType" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-sm">Επιλέξτε τύπο ραντεβού</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex items-center gap-4 justify-start"
                  onClick={() => handleVisitTypeSelect("in_person")}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Δια ζώσης</p>
                    <p className="text-xs text-muted-foreground">
                      Επίσκεψη στο ιατρείο
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex items-center gap-4 justify-start"
                  onClick={() => handleVisitTypeSelect("telemedicine")}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10">
                    <Video className="h-6 w-6 text-success" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Τηλεϊατρική</p>
                    <p className="text-xs text-muted-foreground">
                      Βιντεοκλήση από το σπίτι σας
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Date Selection */}
          {step === "date" && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("visitType")}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Πίσω
                </Button>
                <Badge variant="outline" className="gap-1">
                  {visitType === "telemedicine" ? (
                    <>
                      <Video className="h-3 w-3" />
                      Τηλεϊατρική
                    </>
                  ) : (
                    <>
                      <Building2 className="h-3 w-3" />
                      Δια ζώσης
                    </>
                  )}
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Επιλέξτε ημερομηνία</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableDates.map((date) => {
                    const dayOfWeek = date.getDay();
                    const hasSlots = availableSlots.some(
                      (s) => s.day_of_week === dayOfWeek
                    );
                    
                    return (
                      <Button
                        key={date.toISOString()}
                        variant={hasSlots ? "outline" : "ghost"}
                        className={cn(
                          "flex-col h-auto py-3 gap-1",
                          !hasSlots && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => hasSlots && handleDateSelect(date)}
                        disabled={!hasSlots}
                      >
                        <span className="text-xs text-muted-foreground">
                          {format(date, "EEE", { locale: el })}
                        </span>
                        <span className="text-lg font-semibold">
                          {format(date, "d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(date, "MMM", { locale: el })}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
              {availableSlots.length === 0 && !isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Δεν υπάρχουν διαθέσιμες ώρες για αυτόν τον πάροχο
                </p>
              )}
            </div>
          )}

          {/* Time Selection */}
          {step === "time" && selectedDate && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("date")}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Πίσω
                </Button>
                <Badge variant="outline">
                  {format(selectedDate, "EEEE, d MMM", { locale: el })}
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Επιλέξτε ώρα</h3>
              {availableTimes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Δεν υπάρχουν διαθέσιμες ώρες για αυτή την ημέρα
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {step === "confirm" && selectedDate && selectedTime && (
            <div className="space-y-4 animate-fade-in pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("time")}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Πίσω
              </Button>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                <h3 className="font-semibold">Επιβεβαίωση Ραντεβού</h3>
                
                {/* Visit type badge */}
                <div className="flex items-center gap-2">
                  {visitType === "telemedicine" ? (
                    <Badge className="gap-1 bg-success/20 text-success border-success/30">
                      <Video className="h-3 w-3" />
                      Τηλεϊατρική
                    </Badge>
                  ) : (
                    <Badge className="gap-1 bg-primary/20 text-primary border-primary/30">
                      <Building2 className="h-3 w-3" />
                      Δια ζώσης
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{format(selectedDate, "EEEE, d MMMM yyyy", { locale: el })}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedTime}</span>
                </div>

                {visitType === "in_person" && provider.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.address}</span>
                  </div>
                )}

                {visitType === "telemedicine" && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Video className="h-4 w-4" />
                    <span>Θα λάβετε σύνδεσμο για βιντεοκλήση</span>
                  </div>
                )}
              </div>

              {/* Symptom summary */}
              {symptomSummary && symptomSummary.symptoms.length > 0 && (
                <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Συμπτώματα που θα αναφερθούν:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {symptomSummary.symptoms.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Κράτηση...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Επιβεβαίωση Κράτησης
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Αυτό είναι ραντεβού συμβουλευτικής/καθοδήγησης.
                Ο ιατρός θα επικοινωνήσει για επιβεβαίωση.
              </p>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Επιτυχής Κράτηση!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Το ραντεβού σας με {provider.name} καταχωρήθηκε για{" "}
                  {selectedDate && format(selectedDate, "d/M/yyyy")} στις{" "}
                  {selectedTime}
                </p>
              </div>
              <Button onClick={handleClose} className="mt-4">
                Κλείσιμο
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
