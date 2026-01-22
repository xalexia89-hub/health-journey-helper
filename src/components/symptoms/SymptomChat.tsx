import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Bot, User, Save, FileText, CheckCircle, AlertTriangle, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExecutiveSummary {
  mainSymptoms: string[];
  bodyAreas: string[];
  duration: string;
  urgencyLevel: "low" | "medium" | "high";
  recommendations: string[];
  generatedAt: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/symptom-chat`;

export function SymptomChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Γεια σας! Είμαι το Medithos και είμαι εδώ δίπλα σας να σας βοηθήσω. Πείτε μου, τι σας ενοχλεί σήμερα;",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingToRecord, setSavingToRecord] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate executive summary from conversation
  const generateExecutiveSummary = (): ExecutiveSummary => {
    const userMessages = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase());
    const allText = userMessages.join(" ");

    // Extract symptoms
    const symptomKeywords = ["πόνος", "πονοκέφαλος", "ζάλη", "ναυτία", "πυρετός", "κόπωση", "αδυναμία", 
      "μούδιασμα", "φαγούρα", "εξάνθημα", "βήχας", "δύσπνοια", "πρήξιμο", "κάψιμο"];
    const foundSymptoms = symptomKeywords.filter(s => allText.includes(s));

    // Extract body areas
    const bodyKeywords: Record<string, string> = {
      "κεφάλι": "head", "κεφαλι": "head", "μάτια": "face", "λαιμός": "neck",
      "στήθος": "chest", "πλάτη": "upper_back", "μέση": "lower_back",
      "χέρι": "left_arm", "πόδι": "left_leg", "κοιλιά": "abdomen", "στομάχι": "abdomen"
    };
    const foundAreas = Object.entries(bodyKeywords)
      .filter(([greek]) => allText.includes(greek))
      .map(([, english]) => english);

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

    // Generate recommendations based on symptoms
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
      bodyAreas: foundAreas.length > 0 ? foundAreas : ["general"],
      duration,
      urgencyLevel,
      recommendations,
      generatedAt: new Date().toLocaleString('el-GR')
    };
  };

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

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Αποτυχία σύνδεσης");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Αποτυχία αποστολής μηνύματος",
        variant: "destructive",
      });
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Generate and show summary
  const handleGenerateSummary = () => {
    const summary = generateExecutiveSummary();
    setExecutiveSummary(summary);
    setShowSummary(true);
  };

  // Save symptoms with executive summary to medical record
  const saveToMedicalRecord = async () => {
    if (!user || messages.length <= 1) return;

    setSavingToRecord(true);
    try {
      const summary = executiveSummary || generateExecutiveSummary();
      
      const userSymptoms = messages
        .filter(m => m.role === "user")
        .map(m => m.content);

      const conversationSummary = messages
        .map((m) => `${m.role === 'user' ? 'Ασθενής' : 'Βοηθός'}: ${m.content}`)
        .join('\n\n');

      // Create executive summary text
      const executiveSummaryText = `
=== ΣΥΝΟΨΗ ΣΥΜΠΤΩΜΑΤΩΝ ===
Ημερομηνία: ${summary.generatedAt}

📋 Κύρια Συμπτώματα: ${summary.mainSymptoms.join(", ")}
📍 Περιοχές Σώματος: ${summary.bodyAreas.join(", ")}
⏱️ Διάρκεια: ${summary.duration}
⚠️ Επίπεδο Επείγοντος: ${summary.urgencyLevel === 'high' ? 'Υψηλό' : summary.urgencyLevel === 'medium' ? 'Μέτριο' : 'Χαμηλό'}

💡 Συστάσεις:
${summary.recommendations.map(r => `• ${r}`).join('\n')}
=============================`;

      // Save to symptom_entries table
      const { error: entryError } = await supabase
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

      if (entryError) {
        console.error("Error saving to symptom_entries:", entryError);
      }

      // Save to symptom_intakes
      const { error: intakeError } = await supabase
        .from('symptom_intakes')
        .insert({
          user_id: user.id,
          body_areas: summary.bodyAreas.length > 0 ? [summary.bodyAreas[0] as "head" | "face" | "neck" | "chest" | "upper_back" | "lower_back" | "left_shoulder" | "right_shoulder" | "left_arm" | "right_arm" | "left_hand" | "right_hand" | "abdomen" | "pelvis" | "left_leg" | "right_leg" | "left_foot" | "right_foot"] : ['head'],
          symptoms: summary.mainSymptoms,
          additional_notes: `${executiveSummaryText}\n\n--- ΠΛΗΡΗΣ ΣΥΝΟΜΙΛΙΑ ---\n${conversationSummary}`,
          urgency_level: summary.urgencyLevel,
          duration: summary.duration,
          visit_type: 'medical'
        });

      if (intakeError) throw intakeError;

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

      toast({
        title: "Αποθηκεύτηκε",
        description: "Η σύνοψη αποθηκεύτηκε στον ιατρικό φάκελό σας",
      });
    } catch (error) {
      console.error("Error saving symptoms:", error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποθήκευσης",
        variant: "destructive",
      });
    } finally {
      setSavingToRecord(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getUrgencyLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Υψηλό';
      case 'medium': return 'Μέτριο';
      default: return 'Χαμηλό';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chat Section */}
      <div className="flex flex-col h-[50vh] max-h-[400px] bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Βοηθός Συμπτωμάτων</h3>
              <p className="text-xs text-muted-foreground">Περιγράψτε τι νιώθετε</p>
            </div>
          </div>
        </div>

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
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {isLoading && index === messages.length - 1 && message.role === "assistant" && !message.content && (
                      <span className="inline-flex items-center gap-1">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse animation-delay-200">●</span>
                        <span className="animate-pulse animation-delay-400">●</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Περιγράψτε τα συμπτώματά σας..."
              disabled={isLoading}
              className="flex-1 bg-secondary/30"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
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
        </div>
      </div>

      {/* Generate Summary Button */}
      {messages.length > 2 && !showSummary && (
        <Button 
          onClick={handleGenerateSummary}
          className="w-full gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Δημιουργία Σύνοψης
        </Button>
      )}

      {/* Executive Summary Card */}
      {showSummary && executiveSummary && (
        <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Σύνοψη Συμπτωμάτων
            </CardTitle>
            <p className="text-xs text-muted-foreground">{executiveSummary.generatedAt}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Symptoms */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Κύρια Συμπτώματα
              </div>
              <div className="flex flex-wrap gap-2">
                {executiveSummary.mainSymptoms.map((symptom, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Body Areas */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Περιοχές Σώματος
              </div>
              <div className="flex flex-wrap gap-2">
                {executiveSummary.bodyAreas.map((area, i) => (
                  <Badge key={i} variant="outline">
                    {area === 'general' ? 'Γενικά' : area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Duration & Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Διάρκεια
                </div>
                <p className="text-sm text-muted-foreground">{executiveSummary.duration}</p>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Επείγον</div>
                <Badge className={getUrgencyColor(executiveSummary.urgencyLevel)}>
                  {getUrgencyLabel(executiveSummary.urgencyLevel)}
                </Badge>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-primary" />
                Συστάσεις
              </div>
              <ul className="space-y-1">
                {executiveSummary.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Save Button */}
            <Button 
              onClick={saveToMedicalRecord}
              disabled={savingToRecord}
              className="w-full gap-2 mt-4"
            >
              {savingToRecord ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Αποθήκευση στον Ιατρικό Φάκελο
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
