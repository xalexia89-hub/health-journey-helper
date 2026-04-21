import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, CalendarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AdvisorBanner } from '@/components/pilot/AdvisorBanner';

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number | null;
  is_active: boolean | null;
}

const DAYS = [
  { value: 0, label: 'Κυριακή' },
  { value: 1, label: 'Δευτέρα' },
  { value: 2, label: 'Τρίτη' },
  { value: 3, label: 'Τετάρτη' },
  { value: 4, label: 'Πέμπτη' },
  { value: 5, label: 'Παρασκευή' },
  { value: 6, label: 'Σάββατο' },
];

const DoctorSchedule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New slot form
  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30
  });

  useEffect(() => {
    if (user) fetchProviderAndSlots();
  }, [user]);

  const fetchProviderAndSlots = async () => {
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (provider) {
      setProviderId(provider.id);
      await fetchSlots(provider.id);
    }
    setLoading(false);
  };

  const fetchSlots = async (provId: string) => {
    const { data } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('provider_id', provId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (data) setSlots(data);
  };

  const handleAddSlot = async () => {
    if (!providerId) return;
    
    setSaving(true);
    const { error } = await supabase.from('availability_slots').insert({
      provider_id: providerId,
      day_of_week: newSlot.day_of_week,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      slot_duration_minutes: newSlot.slot_duration_minutes,
      is_active: true
    });

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία προσθήκης διαθεσιμότητας',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Διαθεσιμότητα Προστέθηκε',
        description: 'Η ώρα διαθεσιμότητας προστέθηκε επιτυχώς'
      });
      fetchSlots(providerId);
    }
    setSaving(false);
  };

  const handleToggleSlot = async (slotId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('availability_slots')
      .update({ is_active: isActive })
      .eq('id', slotId);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία ενημέρωσης',
        variant: 'destructive'
      });
    } else if (providerId) {
      fetchSlots(providerId);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    const { error } = await supabase
      .from('availability_slots')
      .delete()
      .eq('id', slotId);

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία διαγραφής',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Διαθεσιμότητα Διαγράφηκε',
        description: 'Η ώρα διαθεσιμότητας αφαιρέθηκε'
      });
      if (providerId) fetchSlots(providerId);
    }
  };

  const groupedSlots = DAYS.map(day => ({
    ...day,
    slots: slots.filter(s => s.day_of_week === day.value)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdvisorBanner />
      
      <div>
        <h1 className="text-2xl font-bold">Διαχείριση Προγράμματος</h1>
        <p className="text-muted-foreground">Ρυθμίστε τη διαθεσιμότητά σας για ραντεβού συμβουλευτικής</p>
      </div>

      {/* Add New Slot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Προσθήκη Διαθεσιμότητας
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>Ημέρα</Label>
              <Select
                value={newSlot.day_of_week.toString()}
                onValueChange={(v) => setNewSlot({ ...newSlot, day_of_week: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ώρα Έναρξης</Label>
              <Input
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Ώρα Λήξης</Label>
              <Input
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Διάρκεια Ραντεβού</Label>
              <Select
                value={newSlot.slot_duration_minutes.toString()}
                onValueChange={(v) => setNewSlot({ ...newSlot, slot_duration_minutes: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 λεπτά</SelectItem>
                  <SelectItem value="30">30 λεπτά</SelectItem>
                  <SelectItem value="45">45 λεπτά</SelectItem>
                  <SelectItem value="60">60 λεπτά</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddSlot} disabled={saving} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Προσθήκη
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Εβδομαδιαίο Πρόγραμμα
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedSlots.map((day) => (
            <div key={day.value} className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                {day.label}
                {day.slots.length > 0 && (
                  <Badge variant="secondary">{day.slots.length} slot(s)</Badge>
                )}
              </h3>
              
              {day.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-4">Δεν έχει οριστεί διαθεσιμότητα</p>
              ) : (
                <div className="space-y-2 pl-4">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={slot.is_active ?? true}
                          onCheckedChange={(checked) => handleToggleSlot(slot.id, checked)}
                        />
                        <div className={slot.is_active === false ? 'opacity-50' : ''}>
                          <p className="font-medium">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {slot.slot_duration_minutes || 30} λεπτά ανά ραντεβού
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-health-danger hover:text-health-danger hover:bg-health-danger/10"
                        onClick={() => handleDeleteSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Συνολικές Ενεργές Διαθεσιμότητες</p>
              <p className="text-sm text-muted-foreground">
                {slots.filter(s => s.is_active !== false).length} χρονικά διαστήματα σε {
                  new Set(slots.filter(s => s.is_active !== false).map(s => s.day_of_week)).size
                } ημέρες
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {slots.filter(s => s.is_active !== false).length} Ενεργά
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSchedule;
