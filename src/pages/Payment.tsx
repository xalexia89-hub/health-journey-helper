import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDetails {
  id: string;
  appointment_date: string;
  appointment_time: string;
  provider: {
    id: string;
    name: string;
    specialty: string | null;
    price_min: number | null;
    price_max: number | null;
    avatar_url: string | null;
  };
}

const Payment = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        provider:providers(id, name, specialty, price_min, price_max, avatar_url)
      `)
      .eq('id', appointmentId)
      .maybeSingle();
    
    if (data && !error) {
      setAppointment(data as unknown as AppointmentDetails);
    }
    setLoading(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!user || !appointment) return;
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        title: 'Μη έγκυρος αριθμός κάρτας',
        description: 'Παρακαλώ εισάγετε έγκυρο αριθμό κάρτας 16 ψηφίων',
        variant: 'destructive'
      });
      return;
    }

    if (expiryDate.length !== 5) {
      toast({
        title: 'Μη έγκυρη ημερομηνία λήξης',
        description: 'Παρακαλώ εισάγετε ημερομηνία στη μορφή MM/YY',
        variant: 'destructive'
      });
      return;
    }

    if (cvv.length < 3) {
      toast({
        title: 'Μη έγκυρο CVV',
        description: 'Παρακαλώ εισάγετε έγκυρο CVV',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    try {
      const amount = appointment.provider.price_min || 50;
      
      // Create payment record
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: user.id,
        appointment_id: appointment.id,
        amount: amount,
        status: 'paid',
        paid_at: new Date().toISOString()
      });

      if (paymentError) throw paymentError;

      // Update appointment status to confirmed
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointment.id);

      if (appointmentError) throw appointmentError;

      toast({
        title: 'Πληρωμή Επιτυχής!',
        description: 'Το ραντεβού σας έχει επιβεβαιωθεί.'
      });

      navigate('/appointments');
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Αποτυχία Πληρωμής',
        description: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Το ραντεβού δεν βρέθηκε</p>
        <Button variant="link" onClick={() => navigate('/appointments')}>
          Επιστροφή στα Ραντεβού
        </Button>
      </div>
    );
  }

  const amount = appointment.provider.price_min || 50;

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Πίσω
      </Button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Ολοκλήρωση Πληρωμής</h1>
        <p className="text-muted-foreground">Ασφαλής πληρωμή με κάρτα</p>
      </div>

      {/* Appointment Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Σύνοψη Ραντεβού</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{appointment.provider.name}</p>
              <p className="text-sm text-muted-foreground">{appointment.provider.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.appointment_date), 'EEEE, d MMMM yyyy', { locale: el })}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.appointment_time}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Σύνολο</span>
            <span className="text-primary">€{amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Στοιχεία Κάρτας
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <Lock className="h-3 w-3" />
            Τα στοιχεία σας είναι ασφαλή
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Όνομα Κατόχου</Label>
            <Input
              id="cardName"
              placeholder="ΟΝΟΜΑ ΕΠΩΝΥΜΟ"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Αριθμός Κάρτας</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Λήξη</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                type="password"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-4" 
            size="lg"
            disabled={processing || !cardName || !cardNumber || !expiryDate || !cvv}
            onClick={handlePayment}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Επεξεργασία...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Πληρωμή €{amount.toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security badges */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
