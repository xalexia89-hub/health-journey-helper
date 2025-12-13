import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';

interface AppointmentData {
  appointment_date: string;
  status: string;
}

interface ProviderData {
  type: string;
  is_verified: boolean;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--health-success))',
  warning: 'hsl(var(--health-warning))',
  danger: 'hsl(var(--health-danger))',
  info: 'hsl(var(--health-info))',
  muted: 'hsl(var(--muted-foreground))'
};

const PIE_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7');
  const [loading, setLoading] = useState(true);
  const [appointmentsByDate, setAppointmentsByDate] = useState<any[]>([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState<any[]>([]);
  const [providersByType, setProvidersByType] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const days = parseInt(dateRange);
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

    await Promise.all([
      fetchAppointmentsByDate(startDate),
      fetchAppointmentsByStatus(),
      fetchProvidersByType(),
      fetchUserGrowth(startDate)
    ]);

    setLoading(false);
  };

  const fetchAppointmentsByDate = async (startDate: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('appointment_date, status')
      .gte('appointment_date', startDate);

    if (data) {
      const days = parseInt(dateRange);
      const dateInterval = eachDayOfInterval({
        start: subDays(new Date(), days),
        end: new Date()
      });

      const grouped = dateInterval.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayAppointments = data.filter(a => a.appointment_date === dateStr);
        return {
          date: format(date, 'MMM d'),
          total: dayAppointments.length,
          completed: dayAppointments.filter(a => a.status === 'completed').length,
          cancelled: dayAppointments.filter(a => a.status === 'cancelled').length
        };
      });

      setAppointmentsByDate(grouped);
    }
  };

  const fetchAppointmentsByStatus = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('status');

    if (data) {
      const statusCounts: Record<string, number> = {};
      data.forEach((a) => {
        statusCounts[a.status || 'unknown'] = (statusCounts[a.status || 'unknown'] || 0) + 1;
      });

      const formatted = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
      }));

      setAppointmentsByStatus(formatted);
    }
  };

  const fetchProvidersByType = async () => {
    const { data } = await supabase
      .from('providers')
      .select('type, is_verified');

    if (data) {
      const typeCounts: Record<string, { total: number; verified: number }> = {};
      data.forEach((p) => {
        if (!typeCounts[p.type]) {
          typeCounts[p.type] = { total: 0, verified: 0 };
        }
        typeCounts[p.type].total++;
        if (p.is_verified) typeCounts[p.type].verified++;
      });

      const formatted = Object.entries(typeCounts).map(([type, counts]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        total: counts.total,
        verified: counts.verified
      }));

      setProvidersByType(formatted);
    }
  };

  const fetchUserGrowth = async (startDate: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate);

    if (data) {
      const days = parseInt(dateRange);
      const dateInterval = eachDayOfInterval({
        start: subDays(new Date(), days),
        end: new Date()
      });

      let cumulative = 0;
      const grouped = dateInterval.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const newUsers = data.filter(u => 
          u.created_at && format(parseISO(u.created_at), 'yyyy-MM-dd') === dateStr
        ).length;
        cumulative += newUsers;
        return {
          date: format(date, 'MMM d'),
          newUsers,
          cumulative
        };
      });

      setUserGrowth(grouped);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">System performance and insights</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6 mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Appointments Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentsByDate}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cancelled" name="Cancelled" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Appointments by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {appointmentsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Providers by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={providersByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="type" type="category" className="text-xs" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="verified" name="Verified" fill={COLORS.success} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {providersByType.map((item) => (
              <Card key={item.type}>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold">{item.total}</p>
                  <p className="text-sm text-muted-foreground">{item.type}s</p>
                  <p className="text-xs text-health-success mt-1">
                    {item.verified} verified ({Math.round((item.verified / item.total) * 100)}%)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      name="New Users"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative"
                      stroke={COLORS.success}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {userGrowth.reduce((sum, d) => sum + d.newUsers, 0)}
                </p>
                <p className="text-sm text-muted-foreground">New Users (Last {dateRange} days)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {userGrowth[userGrowth.length - 1]?.cumulative || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
