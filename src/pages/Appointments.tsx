import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { DEMO_APPOINTMENTS } from '@/data/demoData';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, AlertCircle, Heart, Phone, Video } from 'lucide-react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { el } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { CallButtons } from '@/components/communication';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SymptomIntake {
  id: string;
  body_areas: string[];
  symptoms: string[] | null;
  pain_level: number | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  visit_type: string | null;
  symptom_intake: SymptomIntake | null;
  provider: {
    id: string;
    name: string;
    specialty: string | null;
    avatar_url: string | null;
    address: string | null;
    city: string | null;
  };
}

const statusColors = {
  pending: 'bg-health-warning/10 text-health-warning border-health-warning/20',
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-health-success/10 text-health-success border-health-success/20',
  cancelled: 'bg-health-danger/10 text-health-danger border-health-danger/20'
};

const statusLabels = {
  pending: 'Σε αναμονή',
  confirmed: 'Επιβεβαιωμένο',
  completed: 'Ολοκληρωμένο',
  cancelled: 'Ακυρωμένο'
};

const Appointments = () => {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      const demoAppts: Appointment[] = DEMO_APPOINTMENTS.map(a => ({
        ...a,
        status: a.status as Appointment['status'],
        notes: null,
        visit_type: 'medical',
        symptom_intake: null,
        provider: { ...a.provider, id: 'demo', avatar_url: null, address: 'Λ. Κηφισίας 120', city: 'Αθήνα' },
      }));
      setAppointments(demoAppts);
      setLoading(false);
      return;
    }
    if (user) fetchAppointments();
  }, [user, isDemo]);

  // Realtime: refresh when this patient's appointments change (e.g., physician cancels)
  useEffect(() => {
    if (!user || isDemo) return;
    const channel = supabase
      .channel(`patient-appointments-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments', filter: `patient_id=eq.${user.id}` },
        () => { fetchAppointments(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isDemo]);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        notes,
        visit_type,
        symptom_intake:symptom_intakes (
          id,
          body_areas,
          symptoms,
          pain_level
        ),
        provider:providers (
          id,
          name,
          specialty,
          avatar_url,
          address,
          city
        )
      `)
      .eq('patient_id', user?.id)
      .order('appointment_date', { ascending: true });

    if (data) {
      setAppointments(data as unknown as Appointment[]);
    }
    setLoading(false);
  };

  const handleCancel = async (appointmentId: string) => {
    if (isDemo) {
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' } : a));
      toast({ title: 'Ραντεβού Ακυρώθηκε', description: 'Demo: Ακύρωση επιτυχής.' });
      return;
    }
    const { data, error } = await supabase.functions.invoke('cancel-appointment', {
      body: { appointment_id: appointmentId, cancelled_by: 'patient' },
    });

    if (error || (data as any)?.error) {
      toast({
        title: 'Σφάλμα',
        description: (data as any)?.error ?? 'Αποτυχία ακύρωσης ραντεβού',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Ραντεβού Ακυρώθηκε',
        description: 'Το ραντεβού σας ακυρώθηκε επιτυχώς.'
      });
      fetchAppointments();
    }
  };

  const upcomingAppointments = appointments.filter(a => 
    !isPast(parseISO(a.appointment_date)) && a.status !== 'cancelled' && a.status !== 'completed'
  );
  
  const pastAppointments = appointments.filter(a => 
    isPast(parseISO(a.appointment_date)) || a.status === 'completed' || a.status === 'cancelled'
  );

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const appointmentDate = parseISO(appointment.appointment_date);
    const isUpcoming = !isPast(appointmentDate) && appointment.status !== 'cancelled';
    const isTodayAppointment = isToday(appointmentDate);

    return (
      <Card className={isTodayAppointment ? 'border-primary' : ''}>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.provider.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{appointment.provider.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {appointment.provider.specialty}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className={statusColors[appointment.status]}>
                    {statusLabels[appointment.status]}
                  </Badge>
                  {appointment.visit_type === 'telemedicine' && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Video className="h-3 w-3" />
                      Τηλεϊατρική
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(appointmentDate, 'PPP', { locale: el })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {appointment.appointment_time.slice(0, 5)}
                </div>
              </div>

              {appointment.provider.address && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {appointment.provider.address}, {appointment.provider.city}
                </div>
              )}

              {/* Symptom summary if exists */}
              {appointment.symptom_intake && (
                <div className="flex items-start gap-2 text-sm bg-primary/5 rounded-lg p-2 mt-1">
                  <Heart className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {appointment.symptom_intake.body_areas?.slice(0, 2).map((area: string) => (
                      <Badge key={area} variant="outline" className="text-xs capitalize">
                        {area.replace('_', ' ')}
                      </Badge>
                    ))}
                    {appointment.symptom_intake.symptoms?.slice(0, 2).map((symptom: string) => (
                      <Badge key={symptom} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                    {appointment.symptom_intake.pain_level && (
                      <span className="text-xs text-muted-foreground">
                        Πόνος: {appointment.symptom_intake.pain_level}/10
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isUpcoming && appointment.status !== 'cancelled' && (
                <div className="space-y-3 pt-2">
                  {/* Call buttons for confirmed appointments */}
                  {appointment.status === 'confirmed' && (
                    <CallButtons
                      providerId={appointment.provider.id}
                      providerName={appointment.provider.name}
                      providerAvatar={appointment.provider.avatar_url}
                      providerSpecialty={appointment.provider.specialty}
                      variant="compact"
                      className="flex gap-2"
                    />
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/providers/${appointment.provider.id}`)}
                    >
                      Προβολή Παρόχου
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-health-danger">
                          Ακύρωση
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ακύρωση Ραντεβού;</AlertDialogTitle>
                          <AlertDialogDescription>
                            Είστε σίγουροι ότι θέλετε να ακυρώσετε το ραντεβού σας με {appointment.provider.name} στις {format(appointmentDate, 'PPP', { locale: el })};
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Διατήρηση Ραντεβού</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(appointment.id)}
                            className="bg-health-danger hover:bg-health-danger/90"
                          >
                            Ακύρωση Ραντεβού
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Τα Ραντεβού μου" showBack />
      <div className="px-4 py-6 space-y-6 pb-24">
        <p className="text-muted-foreground">Διαχειριστείτε τα ραντεβού υγείας σας</p>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Επερχόμενα ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Παρελθόντα ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Δεν υπάρχουν επερχόμενα ραντεβού</p>
                <Button onClick={() => navigate('/providers')}>
                  Βρείτε Γιατρό
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Δεν υπάρχουν παρελθόντα ραντεβού</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;
