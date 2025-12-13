import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { format, subDays } from 'date-fns';

interface Stats {
  totalUsers: number;
  totalProviders: number;
  pendingVerifications: number;
  totalAppointments: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    pendingVerifications: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
    appointmentsThisWeek: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const [
      usersRes,
      providersRes,
      pendingRes,
      appointmentsRes,
      todayRes,
      weekRes,
      completedRes,
      cancelledRes
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }).eq('is_verified', false),
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).gte('appointment_date', weekAgo),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'cancelled')
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      totalProviders: providersRes.count || 0,
      pendingVerifications: pendingRes.count || 0,
      totalAppointments: appointmentsRes.count || 0,
      appointmentsToday: todayRes.count || 0,
      appointmentsThisWeek: weekRes.count || 0,
      completedAppointments: completedRes.count || 0,
      cancelledAppointments: cancelledRes.count || 0
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Alert for pending verifications */}
      {stats.pendingVerifications > 0 && (
        <Card className="border-health-warning bg-health-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-health-warning" />
                <div>
                  <p className="font-semibold">Pending Provider Verifications</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingVerifications} provider(s) awaiting verification
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate('/admin/providers')}>
                Review Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/users')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/providers')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-health-info/10">
                <Building2 className="h-6 w-6 text-health-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProviders}</p>
                <p className="text-sm text-muted-foreground">Providers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-health-success/10">
                <Calendar className="h-6 w-6 text-health-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.appointmentsToday}</p>
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
                <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                <p className="text-sm text-muted-foreground">Pending Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.appointmentsThisWeek}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-health-success">{stats.completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-health-success/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-health-danger">{stats.cancelledAppointments}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-health-danger/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate('/admin/providers')}
            >
              <Building2 className="h-6 w-6" />
              <span>Verify Providers</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate('/admin/analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
