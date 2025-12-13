import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'hospital';
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

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchAvailability();
    }
  }, [id]);

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

  const getAvailableTimesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const daySlots = slots.filter(s => s.day_of_week === dayOfWeek);
    
    const times: string[] = [];
    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.start_time.split(':').map(Number);
      const [endHour, endMin] = slot.end_time.split(':').map(Number);
      const duration = slot.slot_duration_minutes || 30;
      
      let current = setMinutes(setHours(date, startHour), startMin);
      const end = setMinutes(setHours(date, endHour), endMin);
      
      while (current < end) {
        times.push(format(current, 'HH:mm'));
        current = new Date(current.getTime() + duration * 60000);
      }
    });
    
    return times;
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime || !provider) return;
    
    setBooking(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        provider_id: provider.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: 'Appointment Booked',
        description: `Your appointment with ${provider.name} on ${format(selectedDate, 'PPP')} at ${selectedTime} has been booked.`
      });
      
      navigate('/appointments');
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Unable to book appointment. Please try again.',
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
        <p className="text-muted-foreground">Provider not found</p>
        <Button variant="link" onClick={() => navigate('/providers')}>
          Back to Providers
        </Button>
      </div>
    );
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <div className="space-y-6 pb-24">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

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
                      ({provider.review_count} reviews)
                    </span>
                  </div>
                )}
                
                <Badge variant="outline" className="capitalize">
                  {provider.type}
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
          <CardTitle className="text-lg">Contact Information</CardTitle>
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
              <span>{provider.phone}</span>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{provider.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      {provider.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
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
            <CardTitle className="text-lg">Services</CardTitle>
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

      {/* Booking Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Book Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            />
          </div>

          {selectedDate && availableTimes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Times</p>
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
            <p className="text-center text-muted-foreground text-sm">
              No available times for this date
            </p>
          )}

          <Button
            className="w-full"
            disabled={!selectedDate || !selectedTime || booking}
            onClick={handleBooking}
          >
            {booking ? 'Booking...' : 'Book Appointment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDetail;
