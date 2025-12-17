import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileSignature, Users, Search, CheckCircle, Mail, Phone, MapPin, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";

interface InterestExpression {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  provider_type: string;
  specialty: string | null;
  organization_name: string | null;
  city: string | null;
  reason: string | null;
  is_verified: boolean;
  signature_date: string;
  created_at: string;
}

const providerTypeLabels: Record<string, string> = {
  doctor: "Γιατρός",
  nurse: "Νοσοκόμος/α",
  clinic: "Κλινική / Ιατρείο",
  hospital: "Νοσοκομείο",
  other: "Άλλο",
};

export default function AdminInterestExpressions() {
  const [expressions, setExpressions] = useState<InterestExpression[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExpressions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("interest_expressions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExpressions(data || []);
    } catch (error) {
      console.error("Error fetching interest expressions:", error);
      toast.error("Σφάλμα κατά τη φόρτωση των εκδηλώσεων ενδιαφέροντος");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpressions();
  }, []);

  const toggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("interest_expressions")
        .update({ is_verified: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      setExpressions(prev => 
        prev.map(exp => 
          exp.id === id ? { ...exp, is_verified: !currentStatus } : exp
        )
      );
      toast.success(currentStatus ? "Αφαιρέθηκε η επαλήθευση" : "Επαληθεύτηκε επιτυχώς");
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("Σφάλμα κατά την ενημέρωση");
    }
  };

  const exportToCSV = () => {
    const headers = ["Ονοματεπώνυμο", "Email", "Τηλέφωνο", "Ιδιότητα", "Ειδικότητα", "Οργανισμός", "Πόλη", "Λόγος", "Επαληθευμένο", "Ημερομηνία"];
    const rows = expressions.map(exp => [
      exp.full_name,
      exp.email,
      exp.phone || "",
      providerTypeLabels[exp.provider_type] || exp.provider_type,
      exp.specialty || "",
      exp.organization_name || "",
      exp.city || "",
      exp.reason || "",
      exp.is_verified ? "Ναι" : "Όχι",
      format(new Date(exp.created_at), "dd/MM/yyyy HH:mm", { locale: el })
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `interest_expressions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const filteredExpressions = expressions.filter(exp =>
    exp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.city && exp.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exp.specialty && exp.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: expressions.length,
    verified: expressions.filter(e => e.is_verified).length,
    doctors: expressions.filter(e => e.provider_type === "doctor").length,
    thisWeek: expressions.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.created_at) > weekAgo;
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-primary" />
            Εκδηλώσεις Ενδιαφέροντος
          </h1>
          <p className="text-muted-foreground">Διαχειριστείτε τις εκδηλώσεις ενδιαφέροντος για το Medithos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchExpressions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Ανανέωση
          </Button>
          <Button size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Εξαγωγή CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Συνολικά</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">Επαληθευμένα</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileSignature className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.doctors}</p>
                <p className="text-xs text-muted-foreground">Γιατροί</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">Αυτή την εβδομάδα</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredExpressions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSignature className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Δεν βρέθηκαν εκδηλώσεις ενδιαφέροντος</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Στοιχεία</TableHead>
                    <TableHead>Ιδιότητα</TableHead>
                    <TableHead>Τοποθεσία</TableHead>
                    <TableHead>Ημερομηνία</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpressions.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{exp.full_name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {exp.email}
                          </div>
                          {exp.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {exp.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">
                            {providerTypeLabels[exp.provider_type] || exp.provider_type}
                          </Badge>
                          {exp.specialty && (
                            <p className="text-sm text-muted-foreground mt-1">{exp.specialty}</p>
                          )}
                          {exp.organization_name && (
                            <p className="text-xs text-muted-foreground">{exp.organization_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {exp.city && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {exp.city}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {format(new Date(exp.created_at), "dd MMM yyyy", { locale: el })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(exp.created_at), "HH:mm")}
                        </p>
                      </TableCell>
                      <TableCell>
                        {exp.is_verified ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Επαληθευμένο
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Εκκρεμεί</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVerified(exp.id, exp.is_verified)}
                        >
                          {exp.is_verified ? "Ακύρωση" : "Επαλήθευση"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
