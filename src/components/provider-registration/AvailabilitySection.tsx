import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

interface AvailabilitySectionProps {
  availability: DayAvailability[];
  onAvailabilityChange: (availability: DayAvailability[]) => void;
}

const defaultAvailability: DayAvailability[] = [
  { dayOfWeek: 1, dayName: 'Δευτέρα', isActive: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 2, dayName: 'Τρίτη', isActive: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, dayName: 'Τετάρτη', isActive: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 4, dayName: 'Πέμπτη', isActive: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 5, dayName: 'Παρασκευή', isActive: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 6, dayName: 'Σάββατο', isActive: false, startTime: '10:00', endTime: '14:00' },
  { dayOfWeek: 0, dayName: 'Κυριακή', isActive: false, startTime: '10:00', endTime: '14:00' },
];

export function AvailabilitySection({ 
  availability = defaultAvailability, 
  onAvailabilityChange 
}: AvailabilitySectionProps) {
  const updateDay = (dayOfWeek: number, updates: Partial<DayAvailability>) => {
    const updated = availability.map(day => 
      day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
    );
    onAvailabilityChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Ωράριο Λειτουργίας</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Ορίστε τις ημέρες και ώρες που είστε διαθέσιμοι για ραντεβού.
      </p>

      <div className="space-y-2">
        {availability.map((day) => (
          <Card key={day.dayOfWeek} className={day.isActive ? 'border-primary/30' : 'opacity-60'}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={day.isActive}
                    onCheckedChange={(checked) => updateDay(day.dayOfWeek, { isActive: checked })}
                  />
                  <span className={`font-medium text-sm w-24 ${day.isActive ? '' : 'text-muted-foreground'}`}>
                    {day.dayName}
                  </span>
                </div>

                {day.isActive && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                      className="w-24 h-8 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">-</span>
                    <Input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                      className="w-24 h-8 text-sm"
                    />
                  </div>
                )}

                {!day.isActive && (
                  <span className="text-sm text-muted-foreground">Κλειστά</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Μπορείτε να αλλάξετε το ωράριό σας ανά πάσα στιγμή από τις ρυθμίσεις του προφίλ σας.
      </p>
    </div>
  );
}

export { defaultAvailability };
