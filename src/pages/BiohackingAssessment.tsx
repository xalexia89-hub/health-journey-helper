import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BiohackingDisclaimer } from "@/components/biohacking/BiohackingDisclaimer";

const TOTAL_SECTIONS = 4;

interface FormState {
  // Sleep
  sleep_hours_avg: number;
  sleep_quality: number;
  sleep_latency_minutes: number;
  wake_ups_per_night: number;
  feel_rested: string;
  sleep_schedule_consistent: boolean;
  sleep_environment: string[];
  screens_before_bed: boolean;
  screens_minutes_before_bed: number;
  // Energy
  energy_morning: number;
  energy_afternoon: number;
  energy_evening: number;
  afternoon_crash: boolean;
  caffeine_cups_per_day: number;
  caffeine_cutoff_hour: number;
  hydration_liters: number;
  // Stress
  stress_level: number;
  stress_sources: string[];
  recovery_activities: string[];
  meditation_minutes_per_day: number;
  work_hours_per_day: number;
  screen_time_hours: number;
  nature_time_weekly_hours: number;
  // Context
  exercise_type: string;
  exercise_days_per_week: number;
  diet_type: string;
  hrv_device: string;
  hrv_avg: number | null;
  smoking: boolean;
  alcohol_units_per_week: number;
  primary_goal: string;
}

const initialState: FormState = {
  sleep_hours_avg: 7, sleep_quality: 6, sleep_latency_minutes: 15, wake_ups_per_night: 1,
  feel_rested: "sometimes", sleep_schedule_consistent: false, sleep_environment: [],
  screens_before_bed: true, screens_minutes_before_bed: 30,
  energy_morning: 6, energy_afternoon: 5, energy_evening: 5,
  afternoon_crash: false, caffeine_cups_per_day: 2, caffeine_cutoff_hour: 14, hydration_liters: 2,
  stress_level: 5, stress_sources: [], recovery_activities: [], meditation_minutes_per_day: 0,
  work_hours_per_day: 8, screen_time_hours: 6, nature_time_weekly_hours: 1,
  exercise_type: "mixed", exercise_days_per_week: 3, diet_type: "mixed",
  hrv_device: "none", hrv_avg: null, smoking: false, alcohol_units_per_week: 0,
  primary_goal: "all",
};

const QUALITY_EMOJIS = ["😩","😟","😕","😐","🙂","😊","😄","😁","🤩","🤯"];

export default function BiohackingAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggle = (k: keyof FormState, value: string) => {
    const arr = form[k] as string[];
    update(k as any, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const submit = async () => {
    if (!user) {
      toast({ title: "Συνδεθείτε πρώτα", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("biohacking_assessments")
        .insert({ patient_id: user.id, ...form })
        .select("id")
        .single();
      if (error) throw error;

      const { error: scoreErr } = await supabase.functions.invoke(
        "calculate-biohacking-scores",
        { body: { assessment_id: data.id } }
      );
      if (scoreErr) throw scoreErr;

      navigate(`/biohacking/results/${data.id}`);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Σφάλμα", description: e.message ?? "Δοκιμάστε ξανά.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((section + 1) / TOTAL_SECTIONS) * 100;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-5">
      <header className="space-y-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Πίσω
        </button>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Biohacking Assessment</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Ενότητα {section + 1} από {TOTAL_SECTIONS}
          </p>
          <Progress value={progress} className="h-2" />
        </div>
        <BiohackingDisclaimer />
      </header>

      <Card>
        <CardContent className="p-5 space-y-6">
          {section === 0 && (
            <SectionSleep form={form} update={update} toggle={toggle} />
          )}
          {section === 1 && (
            <SectionEnergy form={form} update={update} />
          )}
          {section === 2 && (
            <SectionStress form={form} update={update} toggle={toggle} />
          )}
          {section === 3 && (
            <SectionContext form={form} update={update} />
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {section > 0 && (
          <Button variant="outline" className="flex-1" onClick={() => setSection(section - 1)} disabled={submitting}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Πίσω
          </Button>
        )}
        {section < TOTAL_SECTIONS - 1 ? (
          <Button className="flex-1" onClick={() => setSection(section + 1)}>
            Επόμενο <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="flex-1" onClick={submit} disabled={submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Ανάλυση...</> : <>Ολοκλήρωση <Sparkles className="h-4 w-4 ml-1" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step = 1, suffix, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="font-semibold text-primary">{value}{suffix}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function ScaleRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-xl">{QUALITY_EMOJIS[value - 1]}</span>
      </div>
      <Slider value={[value]} min={1} max={10} step={1} onValueChange={(v) => onChange(v[0])} />
      <div className="text-center text-sm font-semibold text-primary">{value} / 10</div>
    </div>
  );
}

function SectionSleep({ form, update, toggle }: any) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">🌙 Ύπνος</h2>
        <p className="text-xs text-muted-foreground">Η βάση κάθε βελτιστοποίησης απόδοσης.</p>
      </div>
      <SliderRow label="Μέσες ώρες ύπνου" value={form.sleep_hours_avg} min={4} max={10} step={0.5} suffix="ω" onChange={(v) => update("sleep_hours_avg", v)} />
      <ScaleRow label="Ποιότητα ύπνου" value={form.sleep_quality} onChange={(v) => update("sleep_quality", v)} />
      <SliderRow label="Λεπτά για να αποκοιμηθείς" value={form.sleep_latency_minutes} min={0} max={60} suffix="'" onChange={(v) => update("sleep_latency_minutes", v)} />
      <div className="space-y-2">
        <Label>Αφυπνίσεις τη νύχτα</Label>
        <RadioGroup value={String(form.wake_ups_per_night)} onValueChange={(v) => update("wake_ups_per_night", Number(v))} className="grid grid-cols-3 gap-2">
          {[{v:0,l:"0"},{v:1,l:"1-2"},{v:3,l:"3+"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={String(o.v)} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label>Νιώθεις ξεκούραστος;</Label>
        <RadioGroup value={form.feel_rested} onValueChange={(v) => update("feel_rested", v)} className="grid grid-cols-3 gap-2">
          {[{v:"yes",l:"Ναι"},{v:"sometimes",l:"Μερικές"},{v:"no",l:"Όχι"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={form.sleep_schedule_consistent} onCheckedChange={(c) => update("sleep_schedule_consistent", !!c)} />
        <span className="text-sm">Σταθερό ωράριο ύπνου</span>
      </label>
      <div className="space-y-2">
        <Label>Περιβάλλον ύπνου</Label>
        <div className="grid grid-cols-3 gap-2">
          {[{v:"dark",l:"Σκοτεινό"},{v:"quiet",l:"Ήσυχο"},{v:"cool",l:"Δροσερό"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <Checkbox checked={form.sleep_environment.includes(o.v)} onCheckedChange={() => toggle("sleep_environment", o.v)} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={form.screens_before_bed} onCheckedChange={(c) => update("screens_before_bed", !!c)} />
        <span className="text-sm">Οθόνες πριν τον ύπνο</span>
      </label>
      {form.screens_before_bed && (
        <SliderRow label="Λεπτά οθόνης πριν τον ύπνο" value={form.screens_minutes_before_bed} min={0} max={120} step={10} suffix="'" onChange={(v) => update("screens_minutes_before_bed", v)} />
      )}
    </div>
  );
}

function SectionEnergy({ form, update }: any) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">⚡ Ενέργεια</h2>
        <p className="text-xs text-muted-foreground">Η ροή ενέργειας μέσα στην ημέρα.</p>
      </div>
      <ScaleRow label="Πρωινή ενέργεια" value={form.energy_morning} onChange={(v) => update("energy_morning", v)} />
      <ScaleRow label="Μεσημεριανή ενέργεια" value={form.energy_afternoon} onChange={(v) => update("energy_afternoon", v)} />
      <ScaleRow label="Βραδινή ενέργεια" value={form.energy_evening} onChange={(v) => update("energy_evening", v)} />
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={form.afternoon_crash} onCheckedChange={(c) => update("afternoon_crash", !!c)} />
        <span className="text-sm">Έχω μεσημεριανό energy crash</span>
      </label>
      <SliderRow label="Καφέδες ημερησίως" value={form.caffeine_cups_per_day} min={0} max={6} suffix="" onChange={(v) => update("caffeine_cups_per_day", v)} />
      <SliderRow label="Τελευταίος καφές (ώρα)" value={form.caffeine_cutoff_hour} min={6} max={22} suffix=":00" onChange={(v) => update("caffeine_cutoff_hour", v)} />
      <SliderRow label="Νερό (λίτρα)" value={form.hydration_liters} min={0.5} max={4} step={0.25} suffix="L" onChange={(v) => update("hydration_liters", v)} />
    </div>
  );
}

function SectionStress({ form, update, toggle }: any) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">🧘 Stress & Recovery</h2>
        <p className="text-xs text-muted-foreground">Η ικανότητα ανάκαμψης ορίζει την απόδοση.</p>
      </div>
      <ScaleRow label="Τρέχον επίπεδο stress" value={form.stress_level} onChange={(v) => update("stress_level", v)} />
      <div className="space-y-2">
        <Label>Πηγές stress</Label>
        <div className="grid grid-cols-2 gap-2">
          {[{v:"work",l:"Εργασία"},{v:"relationships",l:"Σχέσεις"},{v:"finances",l:"Οικονομικά"},{v:"health",l:"Υγεία"},{v:"other",l:"Άλλο"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <Checkbox checked={form.stress_sources.includes(o.v)} onCheckedChange={() => toggle("stress_sources", o.v)} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Δραστηριότητες ανάκαμψης</Label>
        <div className="grid grid-cols-2 gap-2">
          {[{v:"exercise",l:"Άσκηση"},{v:"meditation",l:"Meditation"},{v:"nature",l:"Φύση"},{v:"social",l:"Κοινωνικά"},{v:"hobbies",l:"Hobbies"},{v:"none",l:"Τίποτα"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <Checkbox checked={form.recovery_activities.includes(o.v)} onCheckedChange={() => toggle("recovery_activities", o.v)} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </div>
      </div>
      <SliderRow label="Λεπτά meditation/breathwork ημερησίως" value={form.meditation_minutes_per_day} min={0} max={60} step={5} suffix="'" onChange={(v) => update("meditation_minutes_per_day", v)} />
      <SliderRow label="Ώρες εργασίας ημερησίως" value={form.work_hours_per_day} min={4} max={14} suffix="ω" onChange={(v) => update("work_hours_per_day", v)} />
      <SliderRow label="Συνολικό screen time ημερησίως" value={form.screen_time_hours} min={2} max={14} step={0.5} suffix="ω" onChange={(v) => update("screen_time_hours", v)} />
      <SliderRow label="Ώρες στη φύση εβδομαδιαίως" value={form.nature_time_weekly_hours} min={0} max={20} step={0.5} suffix="ω" onChange={(v) => update("nature_time_weekly_hours", v)} />
    </div>
  );
}

function SectionContext({ form, update }: any) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">🎯 Πλαίσιο & Στόχοι</h2>
      </div>
      <div className="space-y-2">
        <Label>Τύπος άσκησης</Label>
        <RadioGroup value={form.exercise_type} onValueChange={(v) => update("exercise_type", v)} className="grid grid-cols-2 gap-2">
          {[{v:"strength",l:"Δύναμη"},{v:"cardio",l:"Cardio"},{v:"mixed",l:"Μικτή"},{v:"none",l:"Καμία"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <SliderRow label="Ημέρες άσκησης / εβδομάδα" value={form.exercise_days_per_week} min={0} max={7} suffix="" onChange={(v) => update("exercise_days_per_week", v)} />
      <div className="space-y-2">
        <Label>Διατροφή</Label>
        <RadioGroup value={form.diet_type} onValueChange={(v) => update("diet_type", v)} className="grid grid-cols-2 gap-2">
          {[{v:"mediterranean",l:"Μεσογειακή"},{v:"vegan",l:"Vegan"},{v:"keto",l:"Keto"},{v:"mixed",l:"Μικτή"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label>Wearable συσκευή</Label>
        <RadioGroup value={form.hrv_device} onValueChange={(v) => update("hrv_device", v)} className="grid grid-cols-3 gap-2">
          {[{v:"apple",l:"Apple"},{v:"garmin",l:"Garmin"},{v:"fitbit",l:"Fitbit"},{v:"oura",l:"Oura"},{v:"whoop",l:"Whoop"},{v:"none",l:"Καμία"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      {form.hrv_device !== "none" && (
        <div className="space-y-2">
          <Label>Μέσο HRV (ms)</Label>
          <Input type="number" value={form.hrv_avg ?? ""} onChange={(e) => update("hrv_avg", e.target.value ? Number(e.target.value) : null)} placeholder="π.χ. 45" />
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={form.smoking} onCheckedChange={(c) => update("smoking", !!c)} />
        <span className="text-sm">Κάπνισμα</span>
      </label>
      <SliderRow label="Μονάδες αλκοόλ / εβδομάδα" value={form.alcohol_units_per_week} min={0} max={30} suffix="" onChange={(v) => update("alcohol_units_per_week", v)} />
      <div className="space-y-2">
        <Label>Πρωτεύων στόχος</Label>
        <RadioGroup value={form.primary_goal} onValueChange={(v) => update("primary_goal", v)} className="grid gap-2">
          {[{v:"sleep",l:"🌙 Καλύτερος ύπνος"},{v:"energy",l:"⚡ Περισσότερη ενέργεια"},{v:"stress",l:"🧘 Διαχείριση stress"},{v:"all",l:"✨ Όλα μαζί"}].map(o => (
            <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
