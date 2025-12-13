import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BodyAvatar } from "@/components/body-avatar/BodyAvatar";
import { SymptomChat } from "@/components/symptoms/SymptomChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, MessageCircle, Hand } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

const symptoms = [
  "Πόνος", "Πρήξιμο", "Μούδιασμα", "Μυρμήγκιασμα", "Αδυναμία", "Δυσκαμψία",
  "Κάψιμο", "Φαγούρα", "Εξάνθημα", "Μώλωπες", "Πυρετός", "Κόπωση"
];

const durations = ["Λιγότερο από 24 ώρες", "1-3 μέρες", "4-7 μέρες", "1-2 εβδομάδες", "Περισσότερο από 2 εβδομάδες"];

export default function Symptoms() {
  const [step, setStep] = useState(1);
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>([]);
  const [painLevel, setPainLevel] = useState([5]);
  const [duration, setDuration] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "manual">("chat");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAreaClick = (area: BodyArea) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [area]
    );
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
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
      toast({ title: "Σφάλμα", description: "Αποτυχία αποθήκευσης συμπτωμάτων", variant: "destructive" });
    } else {
      toast({ title: "Τα συμπτώματα καταγράφηκαν", description: "Αναζητούμε τους κατάλληλους παρόχους για εσάς..." });
      navigate(`/providers?urgency=${urgency}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Έλεγχος Συμπτωμάτων" />

      <main className="px-4 py-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "chat" | "manual")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Συνομιλία AI
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Hand className="h-4 w-4" />
              Χειροκίνητα
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="animate-fade-in">
            <SymptomChat />
          </TabsContent>

          <TabsContent value="manual" className="animate-fade-in">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Πού πονάει;</h2>
                  <p className="text-muted-foreground mt-1">Πατήστε στις περιοχές του σώματος</p>
                </div>
                <BodyAvatar 
                  selectedAreas={selectedAreas} 
                  onAreaClick={handleAreaClick}
                  onSubcategorySelect={handleSubcategorySelect}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Επίπεδο Πόνου: {painLevel[0]}/10</Label>
                  <Slider value={painLevel} onValueChange={setPainLevel} max={10} step={1} className="mt-4" />
                </div>

                <div>
                  <Label className="text-base font-medium">Διάρκεια</Label>
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
                  <Label className="text-base font-medium">Συμπτώματα</Label>
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
                  <Label className="text-base font-medium">Επιπλέον Σημειώσεις</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Περιγράψτε τα συμπτώματά σας..." className="mt-2" rows={3} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-warning/10 border-warning/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm">Αυτό δεν αποτελεί ιατρική διάγνωση. Παρακαλώ συμβουλευτείτε έναν επαγγελματία υγείας.</p>
          </CardContent>
        </Card>
      </main>

      {mode === "manual" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" /> Πίσω
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={() => setStep(2)} disabled={selectedAreas.length === 0} className="flex-1">
                Συνέχεια <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Εύρεση Παρόχων
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}