import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export const PreventiveAdvisorChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const DEMO_MESSAGES: ChatMessage[] = [
    {
      id: 'demo-1',
      role: 'user',
      content: 'Πώς τα πάω γενικά; Τι πρέπει να προσέξω;',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-2',
      role: 'assistant',
      content: `## 📊 Ανάλυση Lifestyle — Εβδομαδιαία Αναφορά

Με βάση τα δεδομένα σου από το Apple Watch και τις καταγραφές σου, ορίστε μια αναλυτική εικόνα:

### ✅ Θετικά
- **Κίνηση**: Εξαιρετική δραστηριότητα! Μέσος όρος **~7.500 βήματα/ημέρα** με ποικιλία (περπάτημα, τρέξιμο, ποδηλασία, γυμναστήριο). Αυτό είναι πάνω από τον μέσο όρο και συμβάλλει σημαντικά στην καρδιαγγειακή σου υγεία.
- **Στρες**: Πολύ χαμηλά επίπεδα στρες (**~1.5/10**), που είναι εξαιρετικό! Οι τεχνικές διαχείρισης που χρησιμοποιείς (αναπνοές, διαλογισμός, περπάτημα) φαίνεται να δουλεύουν πολύ καλά.

### ⚠️ Σημεία Προσοχής

**1. Ύπνος — Κρίσιμο θέμα** 😴
Κοιμάσαι μόλις **~5 ώρες** τη νύχτα, ενώ η σύσταση είναι 7-9 ώρες. Αυτό:
- Επηρεάζει την ανάκαμψη μετά τη γυμναστική
- Μειώνει τη μυϊκή αποκατάσταση
- Αυξάνει μακροπρόθεσμα τον κίνδυνο μεταβολικών διαταραχών
- Μπορεί να οδηγήσει σε αύξηση κορτιζόλης παρά τα χαμηλά σου επίπεδα στρες

> 💡 **Πρόταση**: Βάλε στόχο να πέφτεις τουλάχιστον μέχρι τις 00:30. Ακόμα και 30 λεπτά νωρίτερα κάθε εβδομάδα θα βοηθήσουν.

**2. Διατροφή — Χαμηλή πρόσληψη** 🍽️
Με μόλις **467 θερμίδες** σήμερα και **10% πρωτεΐνη**, τρως σημαντικά λιγότερο από ό,τι χρειάζεται ο οργανισμός σου — ειδικά με το επίπεδο δραστηριότητάς σου:
- Ο βασικός μεταβολισμός σου είναι πιθανά γύρω στις **1.600-1.800 kcal**
- Με την άσκηση, χρειάζεσαι τουλάχιστον **2.000-2.200 kcal/ημέρα**
- Η χαμηλή πρωτεΐνη (~11g) δεν επαρκεί για μυϊκή αποκατάσταση

> 💡 **Πρόταση**: Αύξησε σταδιακά τα γεύματα. Πρόσθεσε ένα πρωτεϊνούχο σνακ (αυγά, τυρί cottage, ξηρούς καρπούς) και μεγάλωσε τις μερίδες στο μεσημεριανό.

**3. Νερό — Θετικό!** 💧
Τα **2 λίτρα** νερό είναι ικανοποιητικά, αλλά με τη δραστηριότητά σου θα πρότεινα **2.5-3 λίτρα** τις ημέρες που γυμνάζεσαι.

### 🔮 Τι να Προσέχεις
1. **Μην αγνοείς τον ύπνο** — η κίνηση χωρίς ανάκαμψη μπορεί να οδηγήσει σε burnout
2. **Αύξησε τις θερμίδες σταδιακά** — ο οργανισμός σου χρειάζεται καύσιμα
3. **Επόμενες εξετάσεις**: Θυρεοειδής (Απρ. 2026), Δερματολόγος (Μάι. 2026)
4. **Τεστ Παπ**: Το τελευταίο ήταν φυσιολογικό — επόμενο σε 12 μήνες

---
*⚕️ Αυτές οι συστάσεις δεν αντικαθιστούν ιατρική συμβουλή. Συμβουλευτείτε τον γιατρό σας.*`,
      created_at: new Date(Date.now() - 3500000).toISOString(),
    },
  ];

  useEffect(() => { if (user) fetchMessages(); }, [user]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('preventive_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);
    const realMsgs = (data as ChatMessage[]) || [];
    setMessages(realMsgs.length > 0 ? realMsgs : DEMO_MESSAGES);
  };

  const gatherContext = async () => {
    if (!user) return {};
    const [nutrition, activity, sleep, stress, medical, health, heartRate, steps, spo2, bp] = await Promise.all([
      supabase.from('nutrition_logs').select('meal_type,meal_description,calories,logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(10),
      supabase.from('activity_logs').select('activity_type,duration_minutes,intensity,logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(10),
      supabase.from('sleep_logs').select('quality_rating,interruptions,sleep_start,sleep_end,logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(10),
      supabase.from('stress_logs').select('stress_level,triggers,logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(10),
      supabase.from('medical_records').select('allergies,chronic_conditions,current_medications,family_history').eq('user_id', user.id).limit(1).maybeSingle(),
      supabase.from('health_files').select('date_of_birth,sex,height_cm,weight_kg,smoking_status,activity_level').eq('user_id', user.id).limit(1).maybeSingle(),
      supabase.from('wearable_heart_rate').select('bpm,heart_rate_type,measured_at,source').eq('user_id', user.id).order('measured_at', { ascending: false }).limit(10),
      supabase.from('wearable_steps').select('step_count,date,source').eq('user_id', user.id).order('date', { ascending: false }).limit(7),
      supabase.from('wearable_spo2').select('spo2_value,measured_at,source').eq('user_id', user.id).order('measured_at', { ascending: false }).limit(5),
      supabase.from('wearable_blood_pressure').select('systolic,diastolic,measured_at,source').eq('user_id', user.id).order('measured_at', { ascending: false }).limit(5),
    ]);
    return {
      recent_nutrition: nutrition.data,
      recent_activity: activity.data,
      recent_sleep: sleep.data,
      recent_stress: stress.data,
      medical_record: medical.data,
      health_file: health.data,
      recent_heart_rate: heartRate.data,
      recent_steps: steps.data,
      recent_spo2: spo2.data,
      recent_blood_pressure: bp.data,
    };
  };

  const clearHistory = async () => {
    if (!user) return;
    await supabase.from('preventive_chat_messages').delete().eq('user_id', user.id);
    setMessages([]);
    toast({ title: 'Ιστορικό διαγράφηκε' });
  };

  const sendMessage = async () => {
    if (!user || !input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const { data: savedMsg } = await supabase.from('preventive_chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: userMessage,
    }).select().single();

    if (savedMsg) setMessages(prev => [...prev, savedMsg as ChatMessage]);

    try {
      const context = await gatherContext();

      // Send conversation history for continuity
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('preventive-advisor', {
        body: { message: userMessage, context, conversationHistory },
      });

      if (error) {
        // Check for rate limit / payment errors
        const statusCode = (error as any)?.status;
        if (statusCode === 429) {
          toast({ title: 'Πολλά αιτήματα', description: 'Παρακαλώ περιμένετε λίγο και δοκιμάστε ξανά.', variant: 'destructive' });
        } else if (statusCode === 402) {
          toast({ title: 'Credits εξαντλήθηκαν', description: 'Χρειάζεται ανανέωση credits.', variant: 'destructive' });
        }
        throw error;
      }

      const aiContent = data.message;

      const { data: aiMsg } = await supabase.from('preventive_chat_messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: aiContent,
      }).select().single();

      if (aiMsg) setMessages(prev => [...prev, aiMsg as ChatMessage]);
    } catch {
      const fallback = 'Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.';
      const { data: errMsg } = await supabase.from('preventive_chat_messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: fallback,
      }).select().single();
      if (errMsg) setMessages(prev => [...prev, errMsg as ChatMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Προληπτικός Σύμβουλος AI</span>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearHistory}>
                <Trash2 className="h-3 w-3 mr-1" />
                Καθαρισμός
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Αναλύω τα δεδομένα υγείας & wearables σας για εξατομικευμένες προτάσεις πρόληψης. Δεν αντικαθιστώ γιατρό.
          </p>
        </CardContent>
      </Card>

      <ScrollArea className="h-[350px] pr-2">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Ρωτήστε με για διατροφή, ύπνο, στρες, ζωτικά σημεία ή πρόληψη!</p>
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {[
                  'Πώς μπορώ να βελτιώσω τον ύπνο μου;',
                  'Τι δείχνουν τα ζωτικά μου σημεία;',
                  'Τι εξετάσεις πρέπει να κάνω;',
                  'Πώς μπορώ να μειώσω το στρες;',
                  'Ανάλυσε τη δραστηριότητά μου',
                ].map(q => (
                  <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => { setInput(q); }}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />}
              <Card className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'}`}>
                <CardContent className="p-3 text-sm">
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </CardContent>
              </Card>
              {msg.role === 'user' && <User className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <Bot className="h-5 w-5 text-primary mt-1" />
              <Card className="bg-secondary/50">
                <CardContent className="p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ρωτήστε τον σύμβουλό σας..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
