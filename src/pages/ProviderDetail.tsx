import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, CheckCircle, Phone, Mail, AlertCircle, CalendarCheck, Video, User as UserIcon, Timer } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { el } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { BookingConfirmationDialog } from '@/components/appointments/BookingConfirmationDialog';
import { CallButtons } from '@/components/communication';
import { cn } from '@/lib/utils';
import { logger, getErrorMessage } from '@/lib/logger';

interface SlotResponse {
  slots?: Array<{ start: string; end: string; available: boolean }>;
}

interface LockResponse {
  error?: string;
  lock_id?: string;
  locked_until?: string;
}

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

interface BlockedDate {
  blocked_date: string;
}

interface RemoteSlot {
  start: string;
  end: string;
  label: string;
  available: boolean;
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

  const intakeId = searchParams.get('intake');

  const [provider, setProvider] = useState<Provider | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [symptomIntake, setSymptomIntake] = useState<any>(null);
  const [gallery, setGallery] = useState<{ id: string; image_url: string; caption: string | null }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [remoteSlots, setRemoteSlots] = useState<RemoteSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<RemoteSlot | null>(null);
  const [meetingType, setMeetingType] = useState<'in_person' | 'video'>('in_person');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lockId, setLockId] = useState<string | null>(null);
  const [lockExpiresAt, setLockExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchAvailability();
      fetchBlocked();
      fetchGallery();
      if (intakeId) fetchSymptomIntake();
    }
  }, [id, intakeId]);

  // Realtime: refresh remote slots when appointments or locks change for this provider
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`provider-slots-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `provider_id=eq.${id}` }, () => {
        if (selectedDate) loadRemoteSlots(selectedDate);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointment_slot_locks', filter: `provider_id=eq.${id}` }, () => {
        if (selectedDate) loadRemoteSlots(selectedDate);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, selectedDate]);

  // Countdown for slot lock
  useEffect(() => {
    if (!lockExpiresAt) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        setLockId(null);
        setLockExpiresAt(null);
        setSelectedSlot(null);
        setShowConfirmation(false);
        toast({
          title: 'Η κράτηση έληξε',
          description: 'Παρακαλώ επιλέξτε ξανά διαθέσιμη ώρα.',
          variant: 'destructive',
        });
        if (selectedDate) loadRemoteSlots(selectedDate);
      }
    };
    tick();
    countdownRef.current = window.setInterval(tick, 1000);
    return () => { if (countdownRef.current) window.clearInterval(countdownRef.current); };
  }, [lockExpiresAt]);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('provider_gallery')
      .select('id, image_url, caption')
      .eq('provider_id', id)
      .order('display_order', { ascending: true });
    if (data) setGallery(data);
  };

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

  const fetchBlocked = async () => {
    const { data } = await supabase
      .from('provider_blocked_dates')
      .select('blocked_date')
      .eq('provider_id', id)
      .gte('blocked_date', format(new Date(), 'yyyy-MM-dd'));
    if (data) setBlockedDates(data);
  };

  const loadRemoteSlots = async (date: Date) => {
    if (!id) return;
    setSlotsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-available-slots', {
        body: { provider_id: id, date: format(date, 'yyyy-MM-dd') },
      });
      if (error) throw error;
      setRemoteSlots((data as any)?.slots ?? []);
    } catch (e) {
      console.error(e);
      setRemoteSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setRemoteSlots([]);
    if (date) loadRemoteSlots(date);
  };

  const handleSelectSlot = async (slot: RemoteSlot) => {
    if (!slot.available) return;
    if (!user) {
      toast({
        title: 'Απαιτείται Σύνδεση',
        description: 'Παρακαλώ συνδεθείτε για να κρατήσετε ραντεβού.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    // Lock the slot
    try {
      const { data, error } = await supabase.functions.invoke('lock-slot', {
        body: { provider_id: id, slot_start: slot.start, slot_end: slot.end },
      });
      if (error) throw error;
      const resp = data as any;
      if (resp?.error) {
        toast({
          title: 'Ώρα μη διαθέσιμη',
          description: 'Κάποιος άλλος μόλις την κράτησε. Επιλέξτε άλλη.',
          variant: 'destructive',
        });
        if (selectedDate) loadRemoteSlots(selectedDate);
        return;
      }
      setLockId(resp.lock_id);
      setLockExpiresAt(new Date(resp.locked_until).getTime());
      setSelectedSlot(slot);
      setShowConfirmation(true);
    } catch (e: any) {
      toast({ title: 'Σφάλμα', description: e?.message ?? 'Αποτυχία κράτησης ώρας', variant: 'destructive' });
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedSlot || !provider) return;
    setBooking(true);
    try {
      const slotStart = new Date(selectedSlot.start);
      const slotEnd = new Date(selectedSlot.end);
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        provider_id: provider.id,
        appointment_date: format(slotStart, 'yyyy-MM-dd'),
        appointment_time: format(slotStart, 'HH:mm:ss'),
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString(),
        meeting_type: meetingType,
        status: 'pending',
        symptom_intake_id: intakeId || null,
        visit_type: symptomIntake?.visit_type || 'consultation',
        notes: 'Πιλοτική Έκδοση - Ραντεβού Συμβουλευτικής',
      });

      if (error) throw error;

      // Release the lock
      if (lockId) {
        await supabase.from('appointment_slot_locks').delete().eq('id', lockId);
      }

      toast({
        title: 'Ραντεβού Καταγράφηκε!',
        description: `Το ραντεβού σας με ${provider.name} στις ${format(slotStart, 'd MMMM', { locale: el })} στις ${format(slotStart, 'HH:mm')} καταγράφηκε.`,
      });

      setShowConfirmation(false);
      setLockId(null);
      setLockExpiresAt(null);
      navigate('/appointments');
    } catch (error: any) {
      toast({
        title: 'Αποτυχία Κράτησης',
        description: error?.message ?? 'Δοκιμάστε ξανά.',
        variant: 'destructive',
      });
    } finally {
      setBooking(false);
    }
  };

  const handleDialogChange = async (open: boolean) => {
    setShowConfirmation(open);
    if (!open && lockId) {
      // User backed out — release the lock
      await supabase.from('appointment_slot_locks').delete().eq('id', lockId);
      setLockId(null);
      setLockExpiresAt(null);
      setSelectedSlot(null);
      if (selectedDate) loadRemoteSlots(selectedDate);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dateStr = format(date, 'yyyy-MM-dd');
    const isBlocked = blockedDates.some(b => b.blocked_date === dateStr);
    return slots.some(s => s.day_of_week === dayOfWeek) && date >= new Date(new Date().setHours(0, 0, 0, 0)) && !isBlocked;
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

      {/* Voice & Video Call Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5" />
            Άμεση Επικοινωνία
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Επικοινωνήστε απευθείας με φωνητική ή βιντεοκλήση
          </p>
          <CallButtons
            providerId={provider.id}
            providerName={provider.name}
            providerAvatar={provider.avatar_url}
            providerSpecialty={provider.specialty}
            className="flex gap-3"
          />
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

      {/* Gallery */}
      {gallery.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Φωτογραφίες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img) => (
                <a
                  key={img.id}
                  href={img.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden border border-border hover:opacity-90 transition-opacity"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Provider gallery'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
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
              {/* Meeting type toggle */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Τρόπος συνάντησης</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={meetingType === 'in_person' ? 'default' : 'outline'}
                    onClick={() => setMeetingType('in_person')}
                    className="justify-center"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Δια ζώσης
                  </Button>
                  <Button
                    variant={meetingType === 'video' ? 'default' : 'outline'}
                    onClick={() => setMeetingType('video')}
                    className="justify-center"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video κλήση
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  disabled={(date) => !isDateAvailable(date)}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                  className="rounded-md border pointer-events-auto"
                  locale={el}
                />
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Διαθέσιμες Ώρες — {format(selectedDate, 'EEEE d MMMM', { locale: el })}
                    </p>
                    {slotsLoading && (
                      <span className="text-xs text-muted-foreground">Ενημέρωση...</span>
                    )}
                  </div>
                  {remoteSlots.length === 0 && !slotsLoading ? (
                    <div className="text-center py-4 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Δεν υπάρχουν διαθέσιμες ώρες για αυτή την ημερομηνία
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {remoteSlots.map((s) => (
                        <Button
                          key={s.start}
                          variant={selectedSlot?.start === s.start ? 'default' : 'outline'}
                          size="sm"
                          disabled={!s.available}
                          onClick={() => handleSelectSlot(s)}
                          className={cn(!s.available && 'opacity-40 line-through')}
                        >
                          {s.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {lockExpiresAt && secondsLeft > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Timer className="h-4 w-4 text-primary" />
                  <p className="text-xs text-foreground">
                    Η ώρα είναι κρατημένη για εσάς για ακόμη{' '}
                    <span className="font-semibold text-primary">
                      {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      {selectedSlot && (
        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={handleDialogChange}
          provider={provider}
          selectedDate={new Date(selectedSlot.start)}
          selectedTime={selectedSlot.label}
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
