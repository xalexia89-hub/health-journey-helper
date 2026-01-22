import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Bot, User, FileText, CheckCircle, AlertTriangle, MapPin, Mic, MicOff, Stethoscope, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { InteractiveAvatar } from "./InteractiveAvatar";
import { ProviderSuggestions } from "./ProviderSuggestions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  bodyArea?: BodyArea;
  type?: "text" | "body_selection" | "summary" | "recommendation";
}

interface SymptomEntry {
  bodyArea: BodyArea;
  description: string;
  timestamp: Date;
  severity?: number;
}

interface ExecutiveSummary {
  mainSymptoms: string[];
  bodyAreas: BodyArea[];
  duration: string;
  urgencyLevel: "low" | "medium" | "high";
  recommendations: string[];
  generatedAt: string;
  symptomEntries: SymptomEntry[];
}

interface SpecialtyRecommendation {
  specialty: string;
  reason: string;
  urgency: "low" | "medium" | "high";
  timestamp: Date;
}

// Body area labels in Greek
const bodyAreaLabels: Record<BodyArea, string> = {
  head: "Κεφάλι",
  face: "Πρόσωπο",
  neck: "Λαιμός",
  chest: "Στήθος",
  upper_back: "Άνω Πλάτη",
  lower_back: "Κάτω Πλάτη",
  left_shoulder: "Αριστερός Ώμος",
  right_shoulder: "Δεξιός Ώμος",
  left_arm: "Αριστερό Χέρι",
  right_arm: "Δεξί Χέρι",
  left_hand: "Αριστερή Παλάμη",
  right_hand: "Δεξιά Παλάμη",
  abdomen: "Κοιλιά",
  pelvis: "Λεκάνη",
  left_leg: "Αριστερό Πόδι",
  right_leg: "Δεξί Πόδι",
  left_foot: "Αριστερό Πέλμα",
  right_foot: "Δεξί Πέλμα",
};

// Specialty labels in Greek
const specialtyLabels: Record<string, string> = {
  Cardiology: "Καρδιολογία",
  Neurology: "Νευρολογία",
  Orthopedics: "Ορθοπεδική",
  Dermatology: "Δερματολογία",
  Gastroenterology: "Γαστρεντερολογία",
  Pulmonology: "Πνευμονολογία",
  Ophthalmology: "Οφθαλμολογία",
  ENT: "ΩΡΛ",
  Urology: "Ουρολογία",
  Gynecology: "Γυναικολογία",
  Psychiatry: "Ψυχιατρική",
  "General Practice": "Γενική Ιατρική",
};

// Map specialty to body areas for provider suggestions
const specialtyToBodyAreas: Record<string, BodyArea[]> = {
  Cardiology: ["chest"],
  Neurology: ["head", "neck"],
  Orthopedics: ["left_shoulder", "right_shoulder", "left_arm", "right_arm", "lower_back", "left_leg", "right_leg"],
  Dermatology: ["face", "left_arm", "right_arm"],
  Gastroenterology: ["abdomen"],
  Pulmonology: ["chest"],
  Ophthalmology: ["head", "face"],
  ENT: ["head", "face", "neck"],
  Urology: ["pelvis", "abdomen"],
  Gynecology: ["pelvis", "abdomen"],
  Psychiatry: ["head"],
  "General Practice": ["head"],
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/symptom-chat`;

// Parse specialty recommendation from AI response
function parseSpecialtyRecommendation(content: string): SpecialtyRecommendation | null {
  const match = content.match(/\[SPECIALTY_RECOMMENDATION\]([\s\S]*?)\[\/SPECIALTY_RECOMMENDATION\]/);
  if (!match) return null;
  
  const block = match[1];
  const specialtyMatch = block.match(/specialty:\s*(.+)/i);
  const reasonMatch = block.match(/reason:\s*(.+)/i);
  const urgencyMatch = block.match(/urgency:\s*(low|medium|high)/i);
  
  if (!specialtyMatch) return null;
  
  return {
    specialty: specialtyMatch[1].trim(),
    reason: reasonMatch ? reasonMatch[1].trim() : "",
    urgency: (urgencyMatch?.[1]?.toLowerCase() as "low" | "medium" | "high") || "medium",
    timestamp: new Date(),
  };
}

// Remove the recommendation block from display text
function cleanMessageContent(content: string): string {
  return content.replace(/\[SPECIALTY_RECOMMENDATION\][\s\S]*?\[\/SPECIALTY_RECOMMENDATION\]/g, "").trim();
}

export function UnifiedSymptomAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Avatar state
  const [avatarState, setAvatarState] = useState<"idle" | "listening" | "processing" | "responding">("idle");
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>([]);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Γεια σας! Είμαι το Medithos και είμαι εδώ δίπλα σας να σας βοηθήσω. Μπορείτε να πατήσετε στο σώμα για να δείξετε πού πονάτε, ή να μου περιγράψετε τα συμπτώματά σας.",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Symptom tracking
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  
  // Specialty recommendation state
  const [specialtyRecommendation, setSpecialtyRecommendation] = useState<SpecialtyRecommendation | null>(null);
  const [showProviderSuggestions, setShowProviderSuggestions] = useState(false);
  const [userConfirmedBooking, setUserConfirmedBooking] = useState(false);

  // Voice input
  const {
    isListening,
    isSupported: isSpeechSupported,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: "el-GR",
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        setInput(prev => prev + text);
      }
    },
    onError: (error) => {
      toast({
        title: "Σφάλμα μικροφώνου",
        description: error,
        variant: "destructive",
      });
      setAvatarState("idle");
    },
    onEnd: () => {
      setAvatarState("idle");
    },
  });

  // Sync avatar state with listening
  useEffect(() => {
    if (isListening) {
      setAvatarState("listening");
    }
  }, [isListening]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle voice toggle
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      setAvatarState("idle");
    } else {
      resetTranscript();
      startListening();
      setAvatarState("listening");
    }
  }, [isListening, startListening, stopListening, resetTranscript]);

  // Handle body area click - triggers contextual chat prompt
  const handleBodyAreaClick = useCallback((area: BodyArea) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area];
      return newAreas;
    });
    
    // Add a symptom entry
    const entry: SymptomEntry = {
      bodyArea: area,
      description: "",
      timestamp: new Date(),
    };
    setSymptomEntries(prev => [...prev, entry]);
    
    // Generate contextual prompt in chat
    const areaLabel = bodyAreaLabels[area];
    const contextualMessage: Message = {
      role: "assistant",
      content: `Βλέπω ότι επιλέξατε "${areaLabel}". Μπορείτε να μου περιγράψετε τι ακριβώς νιώθετε εκεί; Είναι πόνος, μούδιασμα, φαγούρα ή κάτι άλλο;`,
      timestamp: new Date(),
      type: "body_selection",
      bodyArea: area,
    };
    
    setMessages(prev => [...prev, contextualMessage]);
    setAvatarState("responding");
    
    setTimeout(() => setAvatarState("listening"), 1500);
  }, []);

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συνδεθείτε για να χρησιμοποιήσετε τον βοηθό",
        variant: "destructive",
      });
      return;
    }

    // Create user message
    const userMessage: Message = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date(),
      type: "text",
      bodyArea: selectedAreas.length > 0 ? selectedAreas[selectedAreas.length - 1] : undefined,
    };
    
    // Update symptom entry if we have a recent body area selection
    if (selectedAreas.length > 0) {
      const lastArea = selectedAreas[selectedAreas.length - 1];
      setSymptomEntries(prev => {
        // Find last entry without description for this area
        const reversedIndex = [...prev].reverse().findIndex(e => e.bodyArea === lastArea && !e.description);
        if (reversedIndex !== -1) {
          const actualIndex = prev.length - 1 - reversedIndex;
          return prev.map((e, i) => 
            i === actualIndex ? { ...e, description: input.trim() } : e
          );
        }
        return [...prev, { bodyArea: lastArea, description: input.trim(), timestamp: new Date() }];
      });
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setAvatarState("processing");

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Αποτυχία σύνδεσης");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setAvatarState("responding");
      setMessages(prev => [...prev, { role: "assistant", content: "", timestamp: new Date(), type: "text" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { 
                  role: "assistant", 
                  content: assistantContent,
                  timestamp: new Date(),
                  type: "text",
                };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
      
      // After streaming complete, check for specialty recommendation
      const recommendation = parseSpecialtyRecommendation(assistantContent);
      if (recommendation) {
        setSpecialtyRecommendation(recommendation);
        setShowProviderSuggestions(true);
        
        // Log the recommendation to medical record
        logRecommendationToRecord(recommendation);
        
        // Update the last message to clean version (without recommendation block)
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            role: "assistant", 
            content: cleanMessageContent(assistantContent),
            timestamp: new Date(),
            type: "recommendation",
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Αποτυχία αποστολής μηνύματος",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m.content !== ""));
    } finally {
      setIsLoading(false);
      setAvatarState("idle");
    }
  };

  // Log specialty recommendation to medical record
  const logRecommendationToRecord = async (recommendation: SpecialtyRecommendation) => {
    if (!user) return;
    
    try {
      const logEntry = `
[AI ΣΥΣΤΑΣΗ ΕΙΔΙΚΟΤΗΤΑΣ - ${recommendation.timestamp.toLocaleString('el-GR')}]
Ειδικότητα: ${specialtyLabels[recommendation.specialty] || recommendation.specialty}
Αιτιολόγηση: ${recommendation.reason}
Επείγον: ${recommendation.urgency === 'high' ? 'Υψηλό' : recommendation.urgency === 'medium' ? 'Μέτριο' : 'Χαμηλό'}
---`;
      
      // Get current medical record
      const { data: record } = await supabase
        .from('medical_records')
        .select('notes')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const updatedNotes = (record?.notes || '') + logEntry;
      
      await supabase
        .from('medical_records')
        .update({ notes: updatedNotes })
        .eq('user_id', user.id);
        
      console.log("Recommendation logged to medical record");
    } catch (error) {
      console.error("Error logging recommendation:", error);
    }
  };

  // Generate executive summary
  const generateExecutiveSummary = useCallback((): ExecutiveSummary => {
    const userMessages = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase());
    const allText = userMessages.join(" ");

    // Extract symptoms from keywords
    const symptomKeywords = ["πόνος", "πονοκέφαλος", "ζάλη", "ναυτία", "πυρετός", "κόπωση", "αδυναμία", 
      "μούδιασμα", "φαγούρα", "εξάνθημα", "βήχας", "δύσπνοια", "πρήξιμο", "κάψιμο"];
    const foundSymptoms = symptomKeywords.filter(s => allText.includes(s));

    // Use selected body areas
    const bodyAreas = selectedAreas.length > 0 ? selectedAreas : ["head" as BodyArea];

    // Determine duration
    let duration = "Μη προσδιορισμένη";
    if (allText.includes("σήμερα") || allText.includes("τώρα")) duration = "Λιγότερο από 24 ώρες";
    else if (allText.includes("χθες") || allText.includes("μέρες")) duration = "1-3 μέρες";
    else if (allText.includes("εβδομάδα")) duration = "Περίπου 1 εβδομάδα";
    else if (allText.includes("μήνα") || allText.includes("καιρό")) duration = "Περισσότερο από 2 εβδομάδες";

    // Determine urgency
    let urgencyLevel: "low" | "medium" | "high" = "low";
    const highUrgencyWords = ["επείγον", "πολύ δυνατός", "αφόρητος", "δεν αντέχω", "αιμορραγία", "δύσπνοια"];
    const mediumUrgencyWords = ["δυνατός πόνος", "συνεχής", "επιδεινώνεται", "χειροτερεύει"];
    
    if (highUrgencyWords.some(w => allText.includes(w))) urgencyLevel = "high";
    else if (mediumUrgencyWords.some(w => allText.includes(w))) urgencyLevel = "medium";

    // Generate recommendations
    const recommendations: string[] = [];
    if (foundSymptoms.length > 0) {
      recommendations.push("Καταγράψτε την εξέλιξη των συμπτωμάτων");
    }
    if (urgencyLevel === "high") {
      recommendations.push("Συστήνεται άμεση επίσκεψη σε γιατρό");
    } else if (urgencyLevel === "medium") {
      recommendations.push("Προγραμματίστε ραντεβού με τον γιατρό σας");
    } else {
      recommendations.push("Παρακολουθήστε τα συμπτώματα για 2-3 ημέρες");
    }
    recommendations.push("Διατηρήστε καλή ενυδάτωση");

    return {
      mainSymptoms: foundSymptoms.length > 0 ? foundSymptoms : ["Γενικά συμπτώματα"],
      bodyAreas,
      duration,
      urgencyLevel,
      recommendations,
      generatedAt: new Date().toLocaleString('el-GR'),
      symptomEntries,
    };
  }, [messages, selectedAreas, symptomEntries]);

  // Auto-save to medical record
  const saveToMedicalRecord = async () => {
    if (!user || messages.length <= 1) return;

    setIsSaving(true);
    try {
      const summary = executiveSummary || generateExecutiveSummary();
      
      const userSymptoms = messages
        .filter(m => m.role === "user")
        .map(m => m.content);

      const conversationSummary = messages
        .map(m => `${m.role === 'user' ? 'Ασθενής' : 'Βοηθός'}: ${m.content}`)
        .join('\n\n');

      // Create structured symptom data
      const structuredData = {
        summary: summary,
        conversation: conversationSummary,
        symptomEntries: symptomEntries.map(e => ({
          bodyArea: e.bodyArea,
          description: e.description,
          timestamp: e.timestamp.toISOString(),
        })),
      };

      const executiveSummaryText = `
=== ΣΥΝΟΨΗ ΣΥΜΠΤΩΜΑΤΩΝ ===
Ημερομηνία: ${summary.generatedAt}

📋 Κύρια Συμπτώματα: ${summary.mainSymptoms.join(", ")}
📍 Περιοχές Σώματος: ${summary.bodyAreas.map(a => bodyAreaLabels[a]).join(", ")}
⏱️ Διάρκεια: ${summary.duration}
⚠️ Επίπεδο Επείγοντος: ${summary.urgencyLevel === 'high' ? 'Υψηλό' : summary.urgencyLevel === 'medium' ? 'Μέτριο' : 'Χαμηλό'}

💡 Συστάσεις:
${summary.recommendations.map(r => `• ${r}`).join('\n')}

📝 Καταγεγραμμένες Επιλογές:
${symptomEntries.map(e => `• ${bodyAreaLabels[e.bodyArea]}: ${e.description || '(περιμένει περιγραφή)'}`).join('\n')}
=============================`;

      // Save to symptom_entries table
      await supabase
        .from('symptom_entries')
        .insert({
          user_id: user.id,
          raw_user_input: userSymptoms.join('\n'),
          ai_summary: executiveSummaryText,
          body_areas: summary.bodyAreas,
          urgency_level: summary.urgencyLevel,
          duration: summary.duration,
          recommended_actions: summary.recommendations,
          status: 'active'
        });

      // Save to symptom_intakes
      await supabase
        .from('symptom_intakes')
        .insert({
          user_id: user.id,
          body_areas: summary.bodyAreas.length > 0 ? [summary.bodyAreas[0]] : ['head'],
          symptoms: summary.mainSymptoms,
          additional_notes: `${executiveSummaryText}\n\n--- ΠΛΗΡΗΣ ΣΥΝΟΜΙΛΙΑ ---\n${conversationSummary}`,
          urgency_level: summary.urgencyLevel,
          duration: summary.duration,
          visit_type: 'medical'
        });

      // Update medical records notes
      const { data: record } = await supabase
        .from('medical_records')
        .select('notes')
        .eq('user_id', user.id)
        .maybeSingle();

      const newNote = `\n\n${executiveSummaryText}`;
      const updatedNotes = (record?.notes || '') + newNote;

      await supabase
        .from('medical_records')
        .update({ notes: updatedNotes })
        .eq('user_id', user.id);

      setAutoSaved(true);
      toast({
        title: "Αποθηκεύτηκε",
        description: "Τα συμπτώματα αποθηκεύτηκαν αυτόματα στον ιατρικό φάκελό σας",
      });
    } catch (error) {
      console.error("Error saving symptoms:", error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποθήκευσης",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Generate and show summary, then auto-save
  const handleFinishSession = async () => {
    const summary = generateExecutiveSummary();
    setExecutiveSummary(summary);
    setShowSummary(true);
    
    // Auto-save after generating summary
    await saveToMedicalRecord();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-success/20 text-success border-success/30';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[80vh]">
      {/* Left: Interactive Avatar */}
      <div className="lg:w-2/5 flex flex-col items-center">
        <InteractiveAvatar
          selectedAreas={selectedAreas}
          onAreaClick={handleBodyAreaClick}
          state={avatarState}
          className="sticky top-4"
        />
        
        {/* Selected areas */}
        {selectedAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {selectedAreas.map(area => (
              <Badge key={area} variant="default" className="gap-1">
                <MapPin className="h-3 w-3" />
                {bodyAreaLabels[area]}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right: Chat Panel */}
      <div className="lg:w-3/5 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden border-primary/20">
          <CardHeader className="py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  avatarState === "processing" && "animate-pulse bg-primary",
                  avatarState === "responding" && "bg-success",
                  avatarState === "listening" && "bg-primary/60",
                  avatarState === "idle" && "bg-primary/20"
                )}>
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ψηφιακός Βοηθός Υγείας</h3>
                  <p className="text-xs text-muted-foreground">
                    {avatarState === "listening" && "Σας ακούω..."}
                    {avatarState === "processing" && "Επεξεργάζομαι..."}
                    {avatarState === "responding" && "Απαντώ..."}
                    {avatarState === "idle" && "Πατήστε στο σώμα ή γράψτε"}
                  </p>
                </div>
              </div>
              
              {messages.length > 2 && !showSummary && (
                <Button 
                  onClick={handleFinishSession}
                  size="sm"
                  variant="outline"
                  disabled={isSaving}
                  className="gap-1"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  Ολοκλήρωση
                </Button>
              )}
            </div>
          </CardHeader>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 p-2 rounded-xl",
                      message.role === "user" ? "bg-primary" : "bg-secondary"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    {message.bodyArea && message.type === "body_selection" && (
                      <Badge variant="outline" className="self-start mb-1 text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {bodyAreaLabels[message.bodyArea]}
                      </Badge>
                    )}
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {cleanMessageContent(message.content)}
                        {isLoading && index === messages.length - 1 && message.role === "assistant" && !message.content && (
                          <span className="inline-flex items-center gap-1">
                            <span className="animate-pulse">●</span>
                            <span className="animate-pulse animation-delay-200">●</span>
                            <span className="animate-pulse animation-delay-400">●</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground px-2">
                      {message.timestamp.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Inline Specialty Recommendation Card */}
              {showProviderSuggestions && specialtyRecommendation && !showSummary && (
                <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 animate-fade-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Σύσταση Ειδικότητας
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getUrgencyColor(specialtyRecommendation.urgency)}>
                        Επείγον: {specialtyRecommendation.urgency === 'high' ? 'Υψηλό' : specialtyRecommendation.urgency === 'medium' ? 'Μέτριο' : 'Χαμηλό'}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {specialtyLabels[specialtyRecommendation.specialty] || specialtyRecommendation.specialty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {specialtyRecommendation.reason}
                    </p>
                    
                    {!userConfirmedBooking ? (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => setUserConfirmedBooking(true)}
                          className="gap-1"
                        >
                          <Calendar className="h-4 w-4" />
                          Δείτε Διαθέσιμους Γιατρούς
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowProviderSuggestions(false)}
                        >
                          Όχι Τώρα
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <ProviderSuggestions
                          bodyAreas={specialtyToBodyAreas[specialtyRecommendation.specialty] || selectedAreas}
                          urgencyLevel={specialtyRecommendation.urgency}
                          symptoms={messages.filter(m => m.role === "user").map(m => m.content).slice(-3)}
                          className="border-0 shadow-none p-0"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          {/* Summary Card */}
          {showSummary && executiveSummary && (
            <div className="p-4 border-t border-border bg-gradient-to-r from-primary/5 to-success/5 space-y-4">
              {/* Summary Card */}
              <Card className="border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Σύνοψη Αποθηκεύτηκε
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getUrgencyColor(executiveSummary.urgencyLevel)}>
                      Επείγον: {executiveSummary.urgencyLevel === 'high' ? 'Υψηλό' : executiveSummary.urgencyLevel === 'medium' ? 'Μέτριο' : 'Χαμηλό'}
                    </Badge>
                    {executiveSummary.mainSymptoms.slice(0, 3).map((s, i) => (
                      <Badge key={i} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {executiveSummary.recommendations[0]}
                  </p>
                </CardContent>
              </Card>
              
              {/* Provider Suggestions */}
              <ProviderSuggestions
                bodyAreas={executiveSummary.bodyAreas}
                urgencyLevel={executiveSummary.urgencyLevel}
                symptoms={executiveSummary.mainSymptoms}
              />
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-background/50">
            {/* Voice status indicator */}
            {isListening && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-primary/10 border border-primary/30 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-sm text-primary font-medium">Σας ακούω...</span>
                {interimTranscript && (
                  <span className="text-sm text-muted-foreground italic ml-2 truncate flex-1">
                    "{interimTranscript}"
                  </span>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              {/* Voice input button */}
              {isSpeechSupported && (
                <Button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isLoading || showSummary}
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  className={cn(
                    "shrink-0 transition-all",
                    isListening && "bg-primary text-primary-foreground animate-pulse ring-2 ring-primary/50"
                  )}
                  title={isListening ? "Σταματήστε την εγγραφή" : "Μιλήστε τα συμπτώματά σας"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Μιλάτε... ή γράψτε εδώ" : "Περιγράψτε τα συμπτώματά σας..."}
                disabled={isLoading || showSummary}
                className="flex-1 bg-secondary/30"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || showSummary}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Browser support message */}
            {!isSpeechSupported && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Η φωνητική εισαγωγή δεν υποστηρίζεται σε αυτόν τον browser
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
