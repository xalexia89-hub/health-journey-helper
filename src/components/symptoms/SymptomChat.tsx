import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/symptom-chat`;

export function SymptomChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Γεια σας! Είμαι εδώ για να σας βοηθήσω να περιγράψετε τα συμπτώματά σας. Πείτε μου, τι σας ενοχλεί σήμερα;",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingToRecord, setSavingToRecord] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Get the user's session token for authentication
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

      // Add empty assistant message
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
      // Remove the empty assistant message on error
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

  // Save symptoms to medical record
  const saveToMedicalRecord = async () => {
    if (!user || messages.length <= 1) return;

    setSavingToRecord(true);
    try {
      // Extract symptoms from user messages
      const userSymptoms = messages
        .filter(m => m.role === "user")
        .map(m => m.content);

      // Get the conversation summary (last assistant message if it contains a summary)
      const conversationSummary = messages
        .map((m, i) => `${m.role === 'user' ? 'Ασθενής' : 'Βοηθός'}: ${m.content}`)
        .join('\n\n');

      // Get current medical record
      const { data: record } = await supabase
        .from('medical_records')
        .select('notes')
        .eq('user_id', user.id)
        .maybeSingle();

      // Append symptom chat to notes
      const timestamp = new Date().toLocaleString('el-GR');
      const newNote = `\n\n--- Συνομιλία Συμπτωμάτων (${timestamp}) ---\n${conversationSummary}`;
      
      const updatedNotes = (record?.notes || '') + newNote;

      const { error } = await supabase
        .from('medical_records')
        .update({ notes: updatedNotes })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Αποθηκεύτηκε",
        description: "Τα συμπτώματα αποθηκεύτηκαν στον ιατρικό σας φάκελο",
      });
    } catch (error) {
      console.error("Error saving to medical record:", error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποθήκευσης στον ιατρικό φάκελο",
        variant: "destructive",
      });
    } finally {
      setSavingToRecord(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px] bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Βοηθός Συμπτωμάτων</h3>
              <p className="text-xs text-muted-foreground">Περιγράψτε τι νιώθετε</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveToMedicalRecord}
              disabled={savingToRecord}
              className="gap-2"
            >
              {savingToRecord ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Αποθήκευση</span>
            </Button>
          )}
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
  );
}