import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ManualWearableEntryDialog } from './ManualWearableEntryDialog';
import { 
  Watch, 
  RefreshCw, 
  Unlink, 
  Heart, 
  Footprints, 
  Moon,
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface WearableConnection {
  id: string;
  provider: string;
  is_active: boolean;
  last_sync_at: string | null;
  sync_status: string;
  sync_error: string | null;
  external_user_id: string | null;
}

interface SyncResults {
  heart_rate?: number;
  steps?: number;
  spo2?: number;
  sleep?: { duration_min: number };
}

export const WearableConnectionsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<WearableConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncResults | null>(null);

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  // Check URL params for OAuth callback result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fitbitResult = params.get('fitbit');
    if (fitbitResult === 'success') {
      toast({ title: 'Fitbit Συνδέθηκε!', description: 'Η συσκευή σας συνδέθηκε επιτυχώς.' });
      fetchConnections();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (fitbitResult === 'error') {
      toast({ title: 'Σφάλμα Σύνδεσης', description: 'Η σύνδεση με Fitbit απέτυχε. Δοκιμάστε ξανά.', variant: 'destructive' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchConnections = async () => {
    const { data } = await supabase
      .from('wearable_connections')
      .select('id, provider, is_active, last_sync_at, sync_status, sync_error, external_user_id')
      .eq('is_active', true);
    
    setConnections(data || []);
    setLoading(false);
  };

  const connectFitbit = async () => {
    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Σφάλμα', description: 'Πρέπει να είστε συνδεδεμένος', variant: 'destructive' });
        return;
      }

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/fitbit-auth?action=authorize`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to get auth URL');
      }
    } catch (error) {
      console.error('Connect error:', error);
      toast({ title: 'Σφάλμα', description: 'Αποτυχία σύνδεσης. Δοκιμάστε ξανά.', variant: 'destructive' });
    } finally {
      setConnecting(false);
    }
  };

  const syncData = async () => {
    setSyncing(true);
    setLastSync(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/fitbit-sync`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setLastSync(data.synced);
        toast({ title: 'Συγχρονισμός Ολοκληρώθηκε', description: 'Τα δεδομένα σας ενημερώθηκαν.' });
        fetchConnections();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({ title: 'Σφάλμα Συγχρονισμού', description: 'Η ανανέωση δεδομένων απέτυχε.', variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  const disconnectFitbit = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/fitbit-auth?action=disconnect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast({ title: 'Αποσυνδέθηκε', description: 'Η συσκευή Fitbit αποσυνδέθηκε.' });
      fetchConnections();
      setLastSync(null);
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({ title: 'Σφάλμα', description: 'Αποτυχία αποσύνδεσης.', variant: 'destructive' });
    }
  };

  const fitbitConnection = connections.find(c => c.provider === 'fitbit');
  const isConnected = !!fitbitConnection;

  const formatLastSync = (dateStr: string | null) => {
    if (!dateStr) return 'Ποτέ';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.round((now.getTime() - date.getTime()) / 60000);
    if (diffMin < 1) return 'Μόλις τώρα';
    if (diffMin < 60) return `${diffMin} λεπτά πριν`;
    if (diffMin < 1440) return `${Math.round(diffMin / 60)} ώρες πριν`;
    return `${Math.round(diffMin / 1440)} ημέρες πριν`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch className="h-5 w-5 text-primary" />
          Συνδεδεμένες Συσκευές
        </CardTitle>
        <CardDescription>
          Συνδέστε wearables ή καταχωρήστε μετρήσεις χειροκίνητα
        </CardDescription>
        <ManualWearableEntryDialog onDataAdded={fetchConnections} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fitbit */}
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#00B0B9]/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-[#00B0B9]" />
              </div>
              <div>
                <p className="font-medium">Fitbit</p>
                <p className="text-xs text-muted-foreground">
                  {isConnected 
                    ? `Τελ. συγχρονισμός: ${formatLastSync(fitbitConnection?.last_sync_at || null)}`
                    : 'Μη συνδεδεμένο'
                  }
                </p>
              </div>
            </div>
            {isConnected ? (
              <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Ενεργό
              </Badge>
            ) : (
              <Badge variant="secondary">Αποσυνδεδεμένο</Badge>
            )}
          </div>

          {fitbitConnection?.sync_error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-2">
              <AlertCircle className="h-4 w-4" />
              {fitbitConnection.sync_error}
            </div>
          )}

          {/* Sync Results */}
          {lastSync && Object.keys(lastSync).length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {lastSync.heart_rate && (
                <div className="bg-rose-500/10 rounded-lg p-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Καρδιακοί</p>
                    <p className="text-sm font-semibold">{lastSync.heart_rate} bpm</p>
                  </div>
                </div>
              )}
              {lastSync.steps !== undefined && (
                <div className="bg-blue-500/10 rounded-lg p-2 flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Βήματα</p>
                    <p className="text-sm font-semibold">{lastSync.steps.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {lastSync.spo2 && (
                <div className="bg-purple-500/10 rounded-lg p-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">SpO2</p>
                    <p className="text-sm font-semibold">{lastSync.spo2}%</p>
                  </div>
                </div>
              )}
              {lastSync.sleep && (
                <div className="bg-indigo-500/10 rounded-lg p-2 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ύπνος</p>
                    <p className="text-sm font-semibold">{Math.round(lastSync.sleep.duration_min / 60)}ω {lastSync.sleep.duration_min % 60}λ</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button 
                  size="sm" 
                  onClick={syncData} 
                  disabled={syncing}
                  className="flex-1"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  {syncing ? 'Συγχρονισμός...' : 'Συγχρονισμός'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={disconnectFitbit}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Αποσύνδεση
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={connectFitbit} 
                disabled={connecting}
                className="w-full"
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 mr-1" />
                )}
                {connecting ? 'Σύνδεση...' : 'Σύνδεση Fitbit'}
              </Button>
            )}
          </div>
        </div>

        {/* Coming Soon: Other Devices */}
        <div className="space-y-2 opacity-60">
          {[
            { name: 'Apple Health', desc: 'Απαιτεί native app', icon: '🍎' },
            { name: 'Google Fit', desc: 'Σύντομα διαθέσιμο', icon: '🏃' },
            { name: 'Garmin', desc: 'Σύντομα διαθέσιμο', icon: '⌚' },
          ].map(device => (
            <div key={device.name} className="rounded-lg border border-dashed p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{device.icon}</span>
                <div>
                  <p className="text-sm font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.desc}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Soon</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
