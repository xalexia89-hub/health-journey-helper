import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Users, 
  Target,
  CheckCircle2,
  Linkedin,
  Globe
} from "lucide-react";
import medithoLogo from "@/assets/medithos-logo-new.png";

const AdvisorProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 print:bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 print:static print:bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={medithoLogo} alt="Medithos" className="h-8" />
          <Badge variant="outline" className="text-primary border-primary">
            Θεσμικός Σύμβουλος
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-r from-primary/5 via-white to-accent/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  ΝΓ
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Νίκος Γεωργακόπουλος
                </h1>
                <p className="text-xl text-primary font-medium mb-4">
                  Θεσμικός Σύμβουλος | Institutional Advisor
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    Στρατηγική Ανάπτυξη
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    Χρηματοδότηση ΕΣΠΑ
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    Επιχειρηματικότητα
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Σχετικά</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ο Νίκος Γεωργακόπουλος είναι έμπειρος σύμβουλος επιχειρήσεων με εξειδίκευση στη 
              στρατηγική ανάπτυξη και τη διαχείριση χρηματοδοτικών προγραμμάτων. Ως Θεσμικός 
              Σύμβουλος του Medithos, συμβάλλει στη διαμόρφωση της επιχειρηματικής στρατηγικής, 
              τις θεσμικές σχέσεις και την αξιοποίηση ευκαιριών χρηματοδότησης για την 
              ανάπτυξη της πλατφόρμας.
            </p>
          </CardContent>
        </Card>

        {/* Role & Responsibilities */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Ρόλος στο Medithos</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Στρατηγική Καθοδήγηση",
                  desc: "Διαμόρφωση επιχειρηματικής στρατηγικής και roadmap ανάπτυξης"
                },
                {
                  title: "Θεσμικές Σχέσεις",
                  desc: "Ανάπτυξη συνεργασιών με φορείς υγείας και δημόσιες αρχές"
                },
                {
                  title: "Χρηματοδότηση ΕΣΠΑ",
                  desc: "Υποστήριξη στην υποβολή και διαχείριση προτάσεων ΕΣΠΑ"
                },
                {
                  title: "Business Development",
                  desc: "Αναζήτηση ευκαιριών B2B και στρατηγικών συνεργασιών"
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Επαγγελματική Εμπειρία</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  role: "Θεσμικός Σύμβουλος",
                  company: "Medithos",
                  period: "2024 - Σήμερα",
                  type: "current"
                },
                {
                  role: "Σύμβουλος Επιχειρήσεων",
                  company: "Ανεξάρτητος",
                  period: "2018 - Σήμερα",
                  type: "current"
                },
                {
                  role: "Διευθυντής Ανάπτυξης",
                  company: "Επιχειρηματικός Φορέας",
                  period: "2012 - 2018",
                  type: "past"
                }
              ].map((exp, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className={`p-2 rounded-lg ${exp.type === 'current' ? 'bg-green-100' : 'bg-slate-200'}`}>
                    <Building2 className={`w-5 h-5 ${exp.type === 'current' ? 'text-green-600' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                  </div>
                  {exp.type === 'current' && (
                    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                      Ενεργό
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education & Expertise */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Εκπαίδευση</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-sm">MBA - Business Administration</p>
                  <p className="text-xs text-muted-foreground">Πανεπιστήμιο Θεσσαλίας</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-sm">Πτυχίο Οικονομικών</p>
                  <p className="text-xs text-muted-foreground">ΑΕΙ Ελλάδος</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Εξειδικεύσεις</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "ΕΣΠΑ & Ευρωπαϊκά Προγράμματα",
                  "Στρατηγικός Σχεδιασμός",
                  "Business Development",
                  "Θεσμικές Σχέσεις",
                  "Healthcare Innovation",
                  "Startup Mentoring"
                ].map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Επικοινωνία</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">advisor@medithos.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Τηλέφωνο</p>
                  <p className="text-sm font-medium">+30 XXX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Τοποθεσία</p>
                  <p className="text-sm font-medium">Θεσσαλία, Ελλάδα</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 print:hidden">
              <Button className="flex-1">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" className="flex-1">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 Medithos - AI Health Navigation Platform</p>
          <p className="mt-1">Θεσσαλία, Ελλάδα</p>
        </div>
      </main>
    </div>
  );
};

export default AdvisorProfile;
