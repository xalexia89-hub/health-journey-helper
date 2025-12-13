import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BodyAvatar } from "@/components/body-avatar/BodyAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

const symptoms = [
  "Pain", "Swelling", "Numbness", "Tingling", "Weakness", "Stiffness",
  "Burning", "Itching", "Rash", "Bruising", "Fever", "Fatigue"
];

const durations = ["Less than 24 hours", "1-3 days", "4-7 days", "1-2 weeks", "More than 2 weeks"];

export default function Symptoms() {
  const [step, setStep] = useState(1);
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>([]);
  const [painLevel, setPainLevel] = useState([5]);
  const [duration, setDuration] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAreaClick = (area: BodyArea) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const getUrgencyLevel = () => {
    const pain = painLevel[0];
    if (pain >= 9) return 'emergency';
    if (pain >= 7) return 'high';
    if (pain >= 4) return 'medium';
    return 'low';
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const urgency = getUrgencyLevel();
    const { data, error } = await supabase.from('symptom_intakes').insert({
      user_id: user.id,
      body_areas: selectedAreas,
      pain_level: painLevel[0],
      duration,
      symptoms: selectedSymptoms,
      additional_notes: notes,
      urgency_level: urgency,
      suggested_specialty: "General Practice",
    }).select().single();

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Failed to save symptoms", variant: "destructive" });
    } else {
      toast({ title: "Symptoms recorded", description: "Finding the right providers for you..." });
      navigate(`/providers?urgency=${urgency}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Check Symptoms" />

      <main className="px-4 py-6">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Where does it hurt?</h2>
              <p className="text-muted-foreground mt-1">Tap on the affected body areas</p>
            </div>
            <BodyAvatar selectedAreas={selectedAreas} onAreaClick={handleAreaClick} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label className="text-base font-medium">Pain Level: {painLevel[0]}/10</Label>
              <Slider value={painLevel} onValueChange={setPainLevel} max={10} step={1} className="mt-4" />
            </div>

            <div>
              <Label className="text-base font-medium">Duration</Label>
              <div className="flex flex-wrap gap-2 mt-3">
                {durations.map(d => (
                  <Badge key={d} variant={duration === d ? "default" : "outline"} 
                    className="cursor-pointer py-2 px-3" onClick={() => setDuration(d)}>
                    {d}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Symptoms</Label>
              <div className="flex flex-wrap gap-2 mt-3">
                {symptoms.map(s => (
                  <Badge key={s} variant={selectedSymptoms.includes(s) ? "default" : "outline"}
                    className="cursor-pointer py-2 px-3" onClick={() => toggleSymptom(s)}>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Additional Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} 
                placeholder="Describe your symptoms..." className="mt-2" rows={3} />
            </div>
          </div>
        )}

        <Card className="mt-6 bg-warning/10 border-warning/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm">This is not a medical diagnosis. Please consult a healthcare professional.</p>
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          {step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={selectedAreas.length === 0} className="flex-1">
              Continue <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Find Providers
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
