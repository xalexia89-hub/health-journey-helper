import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Calendar,
  Filter,
  MapPin,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  Activity,
  Trash2,
  Eye,
  TrendingUp,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SymptomEntry {
  id: string;
  body_areas: string[] | null;
  ai_summary: string | null;
  risk_flags: string[] | null;
  urgency_level: string | null;
  duration: string | null;
  created_at: string;
  raw_user_input: string | null;
  recommended_actions: string[] | null;
  status: string | null;
}

// Body area labels in Greek
const bodyAreaLabels: Record<string, string> = {
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
  general: "Γενικά",
};

export function SymptomHistorySection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SymptomEntry | null>(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days" | "90days" | "year">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [bodyAreaFilter, setBodyAreaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("symptom_entries")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching symptom entries:", error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from("symptom_entries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής εγγραφής",
        variant: "destructive",
      });
    } else {
      setEntries(prev => prev.filter(e => e.id !== id));
      setSelectedEntry(null);
      toast({
        title: "Διαγράφηκε",
        description: "Η εγγραφή διαγράφηκε επιτυχώς",
      });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("symptom_entries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης κατάστασης",
        variant: "destructive",
      });
    } else {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      toast({
        title: "Ενημερώθηκε",
        description: `Η κατάσταση άλλαξε σε "${status === 'resolved' ? 'Επιλύθηκε' : 'Ενεργό'}"`,
      });
    }
  };

  // Get all unique body areas from entries
  const allBodyAreas = Array.from(
    new Set(entries.flatMap(e => e.body_areas || []))
  );

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    // Date filter
    if (dateFilter !== "all") {
      const days = dateFilter === "7days" ? 7 : dateFilter === "30days" ? 30 : dateFilter === "90days" ? 90 : 365;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(entry.created_at) < cutoff) return false;
    }
    
    // Urgency filter
    if (urgencyFilter !== "all" && entry.urgency_level !== urgencyFilter) return false;
    
    // Body area filter
    if (bodyAreaFilter !== "all" && !entry.body_areas?.includes(bodyAreaFilter)) return false;
    
    // Status filter
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    
    return true;
  });

  // Stats
  const stats = {
    total: entries.length,
    active: entries.filter(e => e.status === "active").length,
    resolved: entries.filter(e => e.status === "resolved").length,
    highUrgency: entries.filter(e => e.urgency_level === "high").length,
  };

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium": return "bg-warning/20 text-warning border-warning/30";
      default: return "bg-success/20 text-success border-success/30";
    }
  };

  const getUrgencyLabel = (level: string | null) => {
    switch (level) {
      case "high": return "Υψηλή";
      case "medium": return "Μέτρια";
      default: return "Χαμηλή";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("el-GR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBodyAreaLabel = (area: string) => {
    return bodyAreaLabels[area] || area;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Ιστορικό Συμπτωμάτων
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Ιστορικό Συμπτωμάτων
          </div>
          <Badge variant="secondary" className="font-normal">
            {filteredEntries.length} εγγραφές
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-secondary/30 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Σύνολο</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-center">
            <p className="text-2xl font-bold text-primary">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Ενεργά</p>
          </div>
          <div className="p-3 rounded-lg bg-success/10 text-center">
            <p className="text-2xl font-bold text-success">{stats.resolved}</p>
            <p className="text-xs text-muted-foreground">Επιλύθηκαν</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.highUrgency}</p>
            <p className="text-xs text-muted-foreground">Υψηλό Επείγον</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center p-3 rounded-lg bg-secondary/20 border border-border/50">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as typeof dateFilter)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Ημερομηνία" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες</SelectItem>
              <SelectItem value="7days">Τελευταίες 7 μέρες</SelectItem>
              <SelectItem value="30days">Τελευταίες 30 μέρες</SelectItem>
              <SelectItem value="90days">Τελευταίες 90 μέρες</SelectItem>
              <SelectItem value="year">Τελευταίο Έτος</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={urgencyFilter} onValueChange={(v) => setUrgencyFilter(v as typeof urgencyFilter)}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Επείγον" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλα</SelectItem>
              <SelectItem value="low">Χαμηλή</SelectItem>
              <SelectItem value="medium">Μέτρια</SelectItem>
              <SelectItem value="high">Υψηλή</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={bodyAreaFilter} onValueChange={setBodyAreaFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Περιοχή" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες οι περιοχές</SelectItem>
              {allBodyAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {getBodyAreaLabel(area)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες</SelectItem>
              <SelectItem value="active">Ενεργά</SelectItem>
              <SelectItem value="resolved">Επιλύθηκαν</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {entries.length === 0 
                ? "Δεν υπάρχουν καταγεγραμμένα συμπτώματα"
                : "Δεν βρέθηκαν εγγραφές με αυτά τα φίλτρα"}
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <Dialog key={entry.id}>
                  <DialogTrigger asChild>
                    <button 
                      className="w-full text-left p-4 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-primary/30 transition-all group"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Header row */}
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(entry.created_at)}
                            </span>
                            <Badge className={cn("text-xs", getUrgencyColor(entry.urgency_level))}>
                              {getUrgencyLabel(entry.urgency_level)}
                            </Badge>
                            {entry.status === "resolved" && (
                              <Badge variant="outline" className="text-xs text-success border-success/30">
                                Επιλύθηκε
                              </Badge>
                            )}
                          </div>
                          
                          {/* Body areas */}
                          {entry.body_areas && entry.body_areas.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.body_areas.map((area, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  <MapPin className="h-2.5 w-2.5 mr-1" />
                                  {getBodyAreaLabel(area)}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Summary preview */}
                          {entry.ai_summary && (
                            <p className="text-sm text-foreground line-clamp-2">
                              {entry.ai_summary.slice(0, 150)}...
                            </p>
                          )}
                          
                          {/* Duration */}
                          {entry.duration && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Διάρκεια: {entry.duration}</span>
                            </div>
                          )}
                          
                          {/* Risk flags */}
                          {entry.risk_flags && entry.risk_flags.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <AlertTriangle className="h-3 w-3 text-destructive" />
                              <span className="text-xs text-destructive">
                                {entry.risk_flags.slice(0, 2).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  </DialogTrigger>
                  
                  {/* Detail Dialog */}
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        Λεπτομέρειες Ανάλυσης
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Date & Urgency */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(entry.created_at)}
                        </span>
                        <Badge className={getUrgencyColor(entry.urgency_level)}>
                          Επείγον: {getUrgencyLabel(entry.urgency_level)}
                        </Badge>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <span className="text-sm font-medium">Κατάσταση:</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={entry.status === "active" ? "default" : "outline"}
                            onClick={() => updateStatus(entry.id, "active")}
                          >
                            Ενεργό
                          </Button>
                          <Button 
                            size="sm" 
                            variant={entry.status === "resolved" ? "default" : "outline"}
                            className={entry.status === "resolved" ? "bg-success hover:bg-success/90" : ""}
                            onClick={() => updateStatus(entry.id, "resolved")}
                          >
                            Επιλύθηκε
                          </Button>
                        </div>
                      </div>
                      
                      {/* Body areas */}
                      {entry.body_areas && entry.body_areas.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            Περιοχές Σώματος
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {entry.body_areas.map((area, i) => (
                              <Badge key={i} variant="secondary">
                                {getBodyAreaLabel(area)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Duration */}
                      {entry.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Διάρκεια: <strong>{entry.duration}</strong></span>
                        </div>
                      )}
                      
                      {/* AI Summary */}
                      {entry.ai_summary && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <FileText className="h-4 w-4 text-primary" />
                            Σύνοψη AI
                          </h4>
                          <div className="p-3 rounded-lg bg-secondary/30 text-sm whitespace-pre-wrap">
                            {entry.ai_summary}
                          </div>
                        </div>
                      )}
                      
                      {/* Raw user input */}
                      {entry.raw_user_input && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Αρχική Περιγραφή</h4>
                          <div className="p-3 rounded-lg bg-secondary/30 text-sm">
                            {entry.raw_user_input}
                          </div>
                        </div>
                      )}
                      
                      {/* Recommendations */}
                      {entry.recommended_actions && entry.recommended_actions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Συστάσεις
                          </h4>
                          <ul className="space-y-1">
                            {entry.recommended_actions.map((action, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Risk flags */}
                      {entry.risk_flags && entry.risk_flags.length > 0 && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            Προειδοποιήσεις
                          </h4>
                          <ul className="space-y-1">
                            {entry.risk_flags.map((flag, i) => (
                              <li key={i} className="text-sm text-destructive">• {flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Delete button */}
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Διαγραφή Εγγραφής
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
