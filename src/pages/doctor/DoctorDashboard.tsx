import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

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
        fetchStats(provider.id)
      ]);
    }
    setLoading(false);
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

  const statusColors = {
    pending: 'bg-health-warning/10 text-health-warning border-health-warning/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-health-success/10 text-health-success border-health-success/20',
    cancelled: 'bg-health-danger/10 text-health-danger border-health-danger/20'
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
        <h2 className="text-xl font-semibold mb-2">Provider Profile Not Found</h2>
        <p className="text-muted-foreground">
          Your doctor profile hasn't been set up yet. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your overview for {format(new Date(), 'EEEE, MMMM d')}
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
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
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
                <p className="text-sm text-muted-foreground">Pending Approval</p>
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
                <p className="text-sm text-muted-foreground">Total Patients</p>
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
                <p className="text-sm text-muted-foreground">Completed This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/appointments')}>
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-health-success mb-4" />
              <p className="text-muted-foreground">No appointments scheduled for today</p>
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
                        {appointment.patient?.full_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {appointment.patient?.full_name || 'Patient'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.appointment_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[appointment.status]}>
                      {appointment.status}
                    </Badge>
                    
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/schedule')}
        >
          <Clock className="h-6 w-6" />
          <span>Manage Schedule</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/patients')}
        >
          <Users className="h-6 w-6" />
          <span>View Patients</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex-col gap-2"
          onClick={() => navigate('/doctor/appointments')}
        >
          <Calendar className="h-6 w-6" />
          <span>All Appointments</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorDashboard;
