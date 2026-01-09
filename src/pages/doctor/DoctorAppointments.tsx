import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { format, parseISO, isPast, isToday, isFuture } from 'date-fns';
import { el } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useDoctorAccessLog } from '@/hooks/useDoctorAccessLog';
import { AdvisorBanner } from '@/components/pilot/AdvisorBanner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  visit_type: string | null;
  patient: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
  symptom_intake: {
    symptoms: string[] | null;
    body_areas: string[];
    pain_level: number | null;
    urgency_level: string | null;
    additional_notes: string | null;
  } | null;
}

const statusColors = {
  pending: 'bg-health-warning/10 text-health-warning border-health-warning/20',
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-health-success/10 text-health-success border-health-success/20',
  cancelled: 'bg-health-danger/10 text-health-danger border-health-danger/20'
};

const DoctorAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAccess } = useDoctorAccessLog();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (user) fetchProviderAndAppointments();
  }, [user]);

  const fetchProviderAndAppointments = async () => {
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (provider) {
      setProviderId(provider.id);
      await fetchAppointments(provider.id);
    }
    setLoading(false);
  };

  const fetchAppointments = async (provId: string) => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        notes,
        visit_type,
        patient:profiles!appointments_patient_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        ),
        symptom_intake:symptom_intakes (
          symptoms,
          body_areas,
          pain_level,
          urgency_level,
          additional_notes
        )
      `)
      .eq('provider_id', provId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (data) {
      setAppointments(data as unknown as Appointment[]);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'completed' | 'cancelled', patientId?: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ενημέρωσης κατάστασης',
        variant: 'destructive'
      });
    } else {
      // Log access
      if (patientId) {
        logAccess('update_appointment', patientId, 'appointment', appointmentId);
      }
      toast({
        title: 'Επιτυχής Ενημέρωση',
        description: `Το αίτημα ενημερώθηκε σε ${newStatus === 'confirmed' ? 'επιβεβαιωμένο' : newStatus === 'completed' ? 'ολοκληρωμένο' : 'απορρίφθηκε'}`
      });
      if (providerId) fetchAppointments(providerId);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // Log access when viewing appointment details
    if (appointment.patient?.id) {
      logAccess('view_appointment', appointment.patient.id, 'appointment', appointment.id);
    }
  };

  const filteredAppointments = appointments.filter(a => 
    a.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.patient?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayAppointments = filteredAppointments.filter(a => 
    isToday(parseISO(a.appointment_date)) && a.status !== 'cancelled'
  );
  
  const upcomingAppointments = filteredAppointments.filter(a => 
    isFuture(parseISO(a.appointment_date)) && !isToday(parseISO(a.appointment_date)) && a.status !== 'cancelled'
  );
  
  const pastAppointments = filteredAppointments.filter(a => 
    isPast(parseISO(a.appointment_date)) && !isToday(parseISO(a.appointment_date))
  );

  const pendingAppointments = filteredAppointments.filter(a => a.status === 'pending');

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.patient?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.patient?.full_name?.charAt(0) || 'Χ'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <p className="font-semibold">{appointment.patient?.full_name || 'Χρήστης'}</p>
              <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(parseISO(appointment.appointment_date), 'd MMM yyyy', { locale: el })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.appointment_time.slice(0, 5)}
                </span>
              </div>
            </div>
          </div>

          <Badge className={statusColors[appointment.status]}>
            {appointment.status === 'pending' && 'Εκκρεμεί'}
            {appointment.status === 'confirmed' && 'Επιβεβαιωμένο'}
            {appointment.status === 'completed' && 'Ολοκληρώθηκε'}
            {appointment.status === 'cancelled' && 'Ακυρώθηκε'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(appointment)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Λεπτομέρειες
          </Button>
          
          {appointment.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(appointment.id, 'confirmed', appointment.patient?.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Αποδοχή
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleUpdateStatus(appointment.id, 'cancelled', appointment.patient?.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Απόρριψη
              </Button>
            </>
          )}
          
          {appointment.status === 'confirmed' && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(appointment.id, 'completed', appointment.patient?.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Ολοκλήρωση
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advisor Banner */}
      <AdvisorBanner />

      <div>
        <h1 className="text-2xl font-bold">Αιτήματα Πλοήγησης</h1>
        <p className="text-muted-foreground">Διαχειριστείτε τα αιτήματα συμβουλευτικής καθοδήγησης</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση χρηστών..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">
            Today ({todayAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No appointments today</p>
              </CardContent>
            </Card>
          ) : (
            todayAppointments.map(a => <AppointmentCard key={a.id} appointment={a} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Δεν υπάρχουν εκκρεμή αιτήματα</p>
              </CardContent>
            </Card>
          ) : (
            pendingAppointments.map(a => <AppointmentCard key={a.id} appointment={a} />)
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Δεν υπάρχουν επερχόμενα αιτήματα</p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map(a => <AppointmentCard key={a.id} appointment={a} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Δεν υπάρχει ιστορικό αιτημάτων</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map(a => <AppointmentCard key={a.id} appointment={a} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAppointment.patient?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedAppointment.patient?.full_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedAppointment.patient?.full_name || 'Patient'}
                  </p>
                  <p className="text-muted-foreground">{selectedAppointment.patient?.email}</p>
                  {selectedAppointment.patient?.phone && (
                    <p className="text-muted-foreground">{selectedAppointment.patient.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.appointment_date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.appointment_time.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedAppointment.status]}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visit Type</p>
                  <p className="font-medium capitalize">{selectedAppointment.visit_type || 'Medical'}</p>
                </div>
              </div>

              {selectedAppointment.symptom_intake && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold">Symptom Intake</h4>
                  
                  {selectedAppointment.symptom_intake.body_areas.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Affected Areas</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAppointment.symptom_intake.body_areas.map((area, i) => (
                          <Badge key={i} variant="secondary" className="capitalize">
                            {area.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.symptom_intake.symptoms && selectedAppointment.symptom_intake.symptoms.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Symptoms</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAppointment.symptom_intake.symptoms.map((symptom, i) => (
                          <Badge key={i} variant="outline">{symptom}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.symptom_intake.pain_level && (
                    <div>
                      <p className="text-sm text-muted-foreground">Pain Level</p>
                      <p className="font-medium">{selectedAppointment.symptom_intake.pain_level}/10</p>
                    </div>
                  )}
                  
                  {selectedAppointment.symptom_intake.urgency_level && (
                    <div>
                      <p className="text-sm text-muted-foreground">Urgency</p>
                      <Badge className="capitalize">{selectedAppointment.symptom_intake.urgency_level}</Badge>
                    </div>
                  )}
                  
                  {selectedAppointment.symptom_intake.additional_notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Additional Notes</p>
                      <p className="text-sm">{selectedAppointment.symptom_intake.additional_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;
