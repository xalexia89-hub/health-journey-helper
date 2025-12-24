import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Bell,
  CreditCard,
  CalendarCheck
} from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { el } from 'date-fns/locale';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  patient: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean;
  created_at: string;
}

interface Stats {
  todayAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  completedThisWeek: number;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    completedThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProviderAndData();
  }, [user]);

  // Real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('doctor-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchProviderAndData = async () => {
    // Get provider ID for this doctor
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (provider) {
      setProviderId(provider.id);
      await Promise.all([
        fetchTodayAppointments(provider.id),
        fetchStats(provider.id),
        fetchNotifications()
      ]);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setNotifications(data);
  };

  const fetchTodayAppointments = async (provId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        patient:profiles!appointments_patient_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('provider_id', provId)
      .eq('appointment_date', today)
      .neq('status', 'cancelled')
      .order('appointment_time', { ascending: true });

    if (data) {
      setTodayAppointments(data as unknown as Appointment[]);
    }
  };

  const fetchStats = async (provId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekAgo = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

    // Fetch all stats in parallel
    const [todayRes, pendingRes, patientsRes, completedRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('provider_id', provId)
        .eq('appointment_date', today)
        .neq('status', 'cancelled'),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('provider_id', provId)
        .eq('status', 'pending'),
      supabase
        .from('appointments')
        .select('patient_id')
        .eq('provider_id', provId),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('provider_id', provId)
        .eq('status', 'completed')
        .gte('appointment_date', weekAgo)
    ]);

    const uniquePatients = new Set(patientsRes.data?.map(a => a.patient_id) || []);

    setStats({
      todayAppointments: todayRes.count || 0,
      pendingAppointments: pendingRes.count || 0,
      totalPatients: uniquePatients.size,
      completedThisWeek: completedRes.count || 0
    });
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'completed') => {
    await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);
    
    if (providerId) {
      fetchTodayAppointments(providerId);
      fetchStats(providerId);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const statusColors = {
    pending: 'bg-health-warning/10 text-health-warning border-health-warning/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-health-success/10 text-health-success border-health-success/20',
    cancelled: 'bg-health-danger/10 text-health-danger border-health-danger/20'
  };

  const getNotificationIcon = (type: string | null) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4 text-health-success" />;
      case 'appointment':
        return <CalendarCheck className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!providerId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-health-warning mb-4" />
        <h2 className="text-xl font-semibold mb-2">Δεν Βρέθηκε Προφίλ Παρόχου</h2>
        <p className="text-muted-foreground">
          Το προφίλ ιατρού δεν έχει ρυθμιστεί ακόμα. Επικοινωνήστε με τον διαχειριστή.
        </p>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Πίνακας Ελέγχου</h1>
        <p className="text-muted-foreground">
          Καλώς ήρθατε! Επισκόπηση για {format(new Date(), 'EEEE, d MMMM', { locale: el })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                <p className="text-sm text-muted-foreground">Σημερινά Ραντεβού</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-health-warning/10">
                <Clock className="h-6 w-6 text-health-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingAppointments}</p>
                <p className="text-sm text-muted-foreground">Εκκρεμείς Επιβεβαιώσεις</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-health-info/10">
                <Users className="h-6 w-6 text-health-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Συνολικοί Ασθενείς</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-health-success/10">
                <TrendingUp className="h-6 w-6 text-health-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedThisWeek}</p>
                <p className="text-sm text-muted-foreground">Ολοκληρωμένα (7 ημέρες)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Σημερινό Πρόγραμμα
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/appointments')}>
              Όλα
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-health-success mb-4" />
                <p className="text-muted-foreground">Δεν υπάρχουν ραντεβού για σήμερα</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.patient?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {appointment.patient?.full_name?.charAt(0) || 'Α'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {appointment.patient?.full_name || 'Ασθενής'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[appointment.status]}>
                        {appointment.status === 'pending' && 'Εκκρεμεί'}
                        {appointment.status === 'confirmed' && 'Επιβεβαιωμένο'}
                        {appointment.status === 'completed' && 'Ολοκληρώθηκε'}
                      </Badge>
                      
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                        >
                          Επιβεβαίωση
                        </Button>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                        >
                          Ολοκλήρωση
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ειδοποιήσεις
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Καμία ειδοποίηση</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.is_read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(notification.created_at), 'd MMM, HH:mm', { locale: el })}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/schedule')}
        >
          <Clock className="h-6 w-6" />
          <span>Διαχείριση Ωραρίου</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/patients')}
        >
          <Users className="h-6 w-6" />
          <span>Ασθενείς</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/settings')}
        >
          <Calendar className="h-6 w-6" />
          <span>Ρυθμίσεις Προφίλ</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorDashboard;