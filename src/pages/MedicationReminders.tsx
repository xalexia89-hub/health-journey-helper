import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Pill, 
  Plus, 
  Clock, 
  Trash2, 
  Bell, 
  BellOff,
  Check,
  X,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface MedicationReminder {
  id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string;
  reminder_times: string[];
  days_of_week: number[];
  is_active: boolean;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Κυ' },
  { value: 1, label: 'Δε' },
  { value: 2, label: 'Τρ' },
  { value: 3, label: 'Τε' },
  { value: 4, label: 'Πε' },
  { value: 5, label: 'Πα' },
  { value: 6, label: 'Σα' },
];

const MedicationReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchReminders();
  }, [user]);

  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from('medication_reminders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setReminders(data as MedicationReminder[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setMedicationName('');
    setDosage('');
    setFrequency('daily');
    setReminderTimes(['08:00']);
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setNotes('');
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!medicationName.trim()) {
      toast({
        title: 'Σφάλμα',
        description: 'Παρακαλώ εισάγετε όνομα φαρμάκου',
        variant: 'destructive'
      });
      return;
    }

    if (reminderTimes.length === 0) {
      toast({
        title: 'Σφάλμα',
        description: 'Παρακαλώ προσθέστε τουλάχιστον μία ώρα υπενθύμισης',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);

    const reminderData = {
      user_id: user?.id,
      medication_name: medicationName,
      dosage: dosage || null,
      frequency,
      reminder_times: reminderTimes,
      days_of_week: selectedDays,
      notes: notes || null,
      is_active: true
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('medication_reminders')
        .update(reminderData)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('medication_reminders')
        .insert(reminderData));
    }

    if (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία αποθήκευσης υπενθύμισης',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Επιτυχία',
        description: editingId ? 'Η υπενθύμιση ενημερώθηκε' : 'Η υπενθύμιση δημιουργήθηκε'
      });
      fetchReminders();
      setDialogOpen(false);
      resetForm();
    }

    setSaving(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('medication_reminders')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (!error) {
      fetchReminders();
      toast({
        title: isActive ? 'Απενεργοποιήθηκε' : 'Ενεργοποιήθηκε',
        description: `Η υπενθύμιση ${isActive ? 'απενεργοποιήθηκε' : 'ενεργοποιήθηκε'}`
      });
    }
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase
      .from('medication_reminders')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchReminders();
      toast({
        title: 'Διαγράφηκε',
        description: 'Η υπενθύμιση διαγράφηκε'
      });
    }
  };

  const editReminder = (reminder: MedicationReminder) => {
    setEditingId(reminder.id);
    setMedicationName(reminder.medication_name);
    setDosage(reminder.dosage || '');
    setFrequency(reminder.frequency);
    setReminderTimes(reminder.reminder_times);
    setSelectedDays(reminder.days_of_week);
    setNotes(reminder.notes || '');
    setDialogOpen(true);
  };

  const addTime = () => {
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const removeTime = (index: number) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
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
    <div className="min-h-screen bg-background">
      <Header title="Υπενθυμίσεις Φαρμάκων" showBack />
      <div className="px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Διαχειριστείτε τις υπενθυμίσεις λήψης φαρμάκων</p>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Νέα Υπενθύμιση
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Επεξεργασία Υπενθύμισης' : 'Νέα Υπενθύμιση Φαρμάκου'}
                </DialogTitle>
                <DialogDescription>
                  Προσθέστε τις λεπτομέρειες του φαρμάκου και τις ώρες λήψης
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Medication Name */}
                <div className="space-y-2">
                  <Label htmlFor="medication">Όνομα Φαρμάκου *</Label>
                  <Input
                    id="medication"
                    placeholder="π.χ. Παρακεταμόλη"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                  />
                </div>

                {/* Dosage */}
                <div className="space-y-2">
                  <Label htmlFor="dosage">Δοσολογία</Label>
                  <Input
                    id="dosage"
                    placeholder="π.χ. 500mg, 1 χάπι"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <Label>Συχνότητα</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Καθημερινά</SelectItem>
                      <SelectItem value="weekly">Εβδομαδιαία</SelectItem>
                      <SelectItem value="custom">Συγκεκριμένες μέρες</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Days of Week (for weekly/custom) */}
                {(frequency === 'weekly' || frequency === 'custom') && (
                  <div className="space-y-2">
                    <Label>Ημέρες</Label>
                    <div className="flex gap-1 flex-wrap">
                      {DAYS_OF_WEEK.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                          size="sm"
                          className="w-10 h-10"
                          onClick={() => toggleDay(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reminder Times */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Ώρες Υπενθύμισης *</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addTime}>
                      <Plus className="h-4 w-4 mr-1" />
                      Προσθήκη
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {reminderTimes.map((time, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => updateTime(index, e.target.value)}
                          className="flex-1"
                        />
                        {reminderTimes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTime(index)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Σημειώσεις</Label>
                  <Input
                    id="notes"
                    placeholder="π.χ. Με φαγητό, πριν τον ύπνο"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Δεν υπάρχουν υπενθυμίσεις</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Προσθέστε υπενθυμίσεις για να μην ξεχνάτε τα φάρμακά σας
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Προσθήκη Φαρμάκου
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <Card 
                key={reminder.id} 
                className={`transition-opacity ${!reminder.is_active ? 'opacity-60' : ''}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1" onClick={() => editReminder(reminder)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Pill className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{reminder.medication_name}</h3>
                        {!reminder.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            <BellOff className="h-3 w-3 mr-1" />
                            Ανενεργό
                          </Badge>
                        )}
                      </div>
                      
                      {reminder.dosage && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {reminder.dosage}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-2">
                        {reminder.reminder_times.map((time, i) => (
                          <Badge key={i} variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </Badge>
                        ))}
                      </div>

                      {reminder.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {reminder.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.is_active}
                        onCheckedChange={() => toggleActive(reminder.id, reminder.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationReminders;