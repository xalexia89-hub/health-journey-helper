import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, CheckCircle, Phone, Mail, AlertCircle, CalendarCheck } from 'lucide-react';
import { format, addDays, setHours, setMinutes, parseISO } from 'date-fns';
import { el } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { BookingConfirmationDialog } from '@/components/appointments/BookingConfirmationDialog';

interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'hospital' | 'nurse';
  specialty: string | null;
  description: string | null;
  avatar_url: string | null;
  rating: number | null;
  review_count: number | null;
  price_min: number | null;
  price_max: number | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  qualifications: string[] | null;
  services: string[] | null;
  is_verified: boolean | null;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number | null;
}

interface ExistingAppointment {
  appointment_date: string;
  appointment_time: string;
}

const typeLabels: Record<string, string> = {
  doctor: 'Γιατρός',
  clinic: 'Κλινική',
  hospital: 'Νοσοκομείο',
  nurse: 'Νοσηλευτής/τρια'
};

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const intakeId = searchParams.get('intake'); // Symptom intake ID from flow
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<ExistingAppointment[]>([]);
  const [symptomIntake, setSymptomIntake] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchAvailability();
      fetchExistingAppointments();
      if (intakeId) {
        fetchSymptomIntake();
      }
    }
  }, [id, intakeId]);

  const fetchSymptomIntake = async () => {
    const { data } = await supabase
      .from('symptom_intakes')
      .select('*')
      .eq('id', intakeId)
      .maybeSingle();
    
    if (data) setSymptomIntake(data);
  };

  const fetchProvider = async () => {
    const { data } = await supabase
      .from('providers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (data) setProvider(data as Provider);
    setLoading(false);
  };

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('provider_id', id)
      .eq('is_active', true);
    
    if (data) setSlots(data);
  };

  const fetchExistingAppointments = async () => {
    // Fetch existing appointments to avoid double bookings
    const { data } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time')
      .eq('provider_id', id)
      .in('status', ['pending', 'confirmed'])
      .gte('appointment_date', format(new Date(), 'yyyy-MM-dd'));
    
    if (data) setExistingAppointments(data);
  };

  const getAvailableTimesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const daySlots = slots.filter(s => s.day_of_week === dayOfWeek);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Get already booked times for this date
    const bookedTimes = existingAppointments
      .filter(a => a.appointment_date === dateStr)
      .map(a => a.appointment_time.slice(0, 5));
    
    const times: string[] = [];
    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.start_time.split(':').map(Number);
      const [endHour, endMin] = slot.end_time.split(':').map(Number);
      const duration = slot.slot_duration_minutes || 30;
      
      let current = setMinutes(setHours(date, startHour), startMin);
      const end = setMinutes(setHours(date, endHour), endMin);
      
      while (current < end) {
        const timeStr = format(current, 'HH:mm');
        // Only add if not already booked
        if (!bookedTimes.includes(timeStr)) {
          times.push(timeStr);
        }
        current = new Date(current.getTime() + duration * 60000);
      }
    });
    
    return times;
  };

  const handleBookingClick = () => {
    if (!user) {
      toast({
        title: 'Απαιτείται Σύνδεση',
        description: 'Παρακαλώ συνδεθείτε για να κλείσετε ραντεβού.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedDate || !selectedTime || !provider) return;
    
    setBooking(true);
    try {
      // Double-check availability before booking
      const { data: existingBooking } = await supabase
        .from('appointments')
        .select('id')
        .eq('provider_id', provider.id)
        .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('appointment_time', selectedTime)
        .in('status', ['pending', 'confirmed'])
        .maybeSingle();

      if (existingBooking) {
        toast({
          title: 'Ώρα μη Διαθέσιμη',
          description: 'Αυτή η ώρα έχει ήδη κρατηθεί. Παρακαλώ επιλέξτε άλλη.',
          variant: 'destructive'
        });
        setShowConfirmation(false);
        setSelectedTime(null);
        fetchExistingAppointments();
        return;
      }

      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        provider_id: provider.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        status: 'pending',
        symptom_intake_id: intakeId || null,
        visit_type: symptomIntake?.visit_type || 'consultation',
        notes: 'Πιλοτική Έκδοση - Ραντεβού Συμβουλευτικής'
      });

      if (error) throw error;

      toast({
        title: 'Ραντεβού Καταγράφηκε!',
        description: `Το ραντεβού σας με ${provider.name} στις ${format(selectedDate, 'd MMMM', { locale: el })} στις ${selectedTime} καταγράφηκε. Θα λάβετε επιβεβαίωση σύντομα.`
      });
      
      setShowConfirmation(false);
      navigate('/appointments');
    } catch (error) {
      toast({
        title: 'Αποτυχία Κράτησης',
        description: 'Δεν ήταν δυνατή η κράτηση ραντεβού. Παρακαλώ δοκιμάστε ξανά.',
        variant: 'destructive'
      });
    } finally {
      setBooking(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return slots.some(s => s.day_of_week === dayOfWeek) && date >= new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ο πάροχος δεν βρέθηκε</p>
        <Button variant="link" onClick={() => navigate('/providers')}>
          Επιστροφή στους Παρόχους
        </Button>
      </div>
    );
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header title={provider.name} showBack />
      <div className="px-4 py-6 space-y-6 pb-24">

      {/* Provider Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={provider.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{provider.name}</h1>
                {provider.is_verified && (
                  <CheckCircle className="h-5 w-5 text-health-success" />
                )}
              </div>
              
              <p className="text-muted-foreground">{provider.specialty}</p>
              
              <div className="flex items-center gap-4 mt-2">
                {provider.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-health-warning text-health-warning" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({provider.review_count} κριτικές)
                    </span>
                  </div>
                )}
                
                <Badge variant="outline" className="capitalize">
                  {typeLabels[provider.type]}
                </Badge>
              </div>
              
              {(provider.price_min || provider.price_max) && (
                <p className="text-primary font-semibold mt-2">
                  €{provider.price_min} - €{provider.price_max}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Στοιχεία Επικοινωνίας</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {provider.address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{provider.address}, {provider.city}</span>
            </div>
          )}
          {provider.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                {provider.phone}
              </a>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${provider.email}`} className="text-primary hover:underline">
                {provider.email}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      {provider.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Σχετικά</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{provider.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Services */}
      {provider.services && provider.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Υπηρεσίες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, i) => (
                <Badge key={i} variant="secondary">{service}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptom Summary if coming from symptom flow */}
      {symptomIntake && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Τα Συμπτώματά σας
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {symptomIntake.body_areas?.map((area: string) => (
                <Badge key={area} variant="outline" className="capitalize">
                  {area.replace('_', ' ')}
                </Badge>
              ))}
            </div>
            {symptomIntake.symptoms && symptomIntake.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {symptomIntake.symptoms.map((symptom: string) => (
                  <Badge key={symptom} variant="secondary">{symptom}</Badge>
                ))}
              </div>
            )}
            {symptomIntake.pain_level && (
              <p className="text-sm text-muted-foreground">
                Επίπεδο πόνου: <span className="font-medium">{symptomIntake.pain_level}/10</span>
              </p>
            )}
            {symptomIntake.additional_notes && (
              <p className="text-sm text-muted-foreground italic">"{symptomIntake.additional_notes}"</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Booking Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Κλείστε Ραντεβού Συμβουλευτικής
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ο ιατρός δεν έχει ορίσει διαθεσιμότητα ακόμα.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Επικοινωνήστε απευθείας για ραντεβού.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  disabled={(date) => !isDateAvailable(date)}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                  className="rounded-md border"
                  locale={el}
                />
              </div>

              {selectedDate && availableTimes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Διαθέσιμες Ώρες για {format(selectedDate, 'EEEE d MMMM', { locale: el })}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && availableTimes.length === 0 && (
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    Δεν υπάρχουν διαθέσιμες ώρες για αυτή την ημερομηνία
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Επιλέξτε άλλη ημερομηνία ή επικοινωνήστε απευθείας
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!selectedDate || !selectedTime}
                onClick={handleBookingClick}
              >
                <CalendarCheck className="h-5 w-5 mr-2" />
                {selectedDate && selectedTime 
                  ? `Κράτηση για ${format(selectedDate, 'd MMM', { locale: el })} στις ${selectedTime}`
                  : 'Επιλέξτε Ημερομηνία & Ώρα'
                }
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      {selectedDate && selectedTime && (
        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          provider={provider}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onConfirm={handleConfirmBooking}
          isLoading={booking}
          symptomSummary={symptomIntake ? {
            bodyAreas: symptomIntake.body_areas,
            symptoms: symptomIntake.symptoms,
            painLevel: symptomIntake.pain_level
          } : undefined}
        />
      )}
    </div>
  );
};

export default ProviderDetail;
