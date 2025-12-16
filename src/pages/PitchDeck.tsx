import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Heart, Users, Building2, Stethoscope, Brain, Calendar, FileText, Video, BookOpen, Shield, TrendingUp, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function PitchDeck() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print Button - Hidden in print */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
        </Link>
        <Button onClick={handlePrint} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Αποθήκευση ως PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-8 print:p-4 print:space-y-6">
        {/* Cover Page */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center print:min-h-0 print:py-16 page-break-after">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-16 w-16 text-primary" />
              <h1 className="text-6xl font-bold gradient-neon bg-clip-text text-transparent print:text-primary">
                MEDITHOS
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground">
              Η Υγεία σας, Απλοποιημένη
            </p>
            <p className="text-lg text-muted-foreground max-w-xl">
              Η πρώτη ολοκληρωμένη πλατφόρμα υγείας στην Ελλάδα που συνδέει 
              ασθενείς με παρόχους υγείας και προσφέρει Ιατρική Ακαδημία
            </p>
            <div className="pt-8">
              <p className="text-sm text-muted-foreground">Pitch Deck 2024</p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="page-break-after">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                <Target className="h-6 w-6" />
                Το Πρόβλημα
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Για Ασθενείς</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Δυσκολία εύρεσης κατάλληλου γιατρού</li>
                    <li>• Χάος στη διαχείριση ιατρικού ιστορικού</li>
                    <li>• Έλλειψη αξιόπιστης πληροφόρησης για συμπτώματα</li>
                    <li>• Πολύπλοκη διαδικασία κράτησης ραντεβού</li>
                  </ul>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Για Γιατρούς</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Δυσκολία προσέλκυσης νέων ασθενών</li>
                    <li>• Έλλειψη πλατφόρμας για ανταλλαγή γνώσης</li>
                    <li>• Διαχείριση ραντεβού με παραδοσιακές μεθόδους</li>
                    <li>• Περιορισμένη online παρουσία</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Solution */}
        <section className="page-break-after">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Zap className="h-6 w-6" />
                Η Λύση: MEDITHOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold">Για Ασθενείς</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    AI ανάλυση συμπτωμάτων, εύρεση γιατρών, διαχείριση υγείας
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold">Για Γιατρούς</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Online παρουσία, διαχείριση ραντεβού, Ιατρική Ακαδημία
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold">Για Κλινικές</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ολοκληρωμένη λύση διαχείρισης και προβολής
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Κύριες Λειτουργίες</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Για Ασθενείς</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-primary" />
                      <span>AI Ανάλυση Συμπτωμάτων</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary" />
                      <span>Διαδραστικό Body Avatar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Online Κράτηση Ραντεβού</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Ψηφιακό Ιατρικό Ιστορικό</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Υπενθυμίσεις Φαρμάκων</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Για Επαγγελματίες</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-primary" />
                      <span>Εκπαιδευτικά Βίντεο</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Επιστημονικές Δημοσιεύσεις</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Κλινικές Περιπτώσεις</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Διαχείριση Προγράμματος</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Προφίλ Ασθενών</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Unique Value - Medical Academy */}
        <section className="page-break-after">
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" />
                Μοναδικό Feature: Ιατρική Ακαδημία
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Η Ιατρική Ακαδημία είναι το χαρακτηριστικό που διαφοροποιεί το MEDITHOS 
                από κάθε άλλη πλατφόρμα υγείας στην Ελλάδα και διεθνώς.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Video className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold">Βίντεο</h4>
                  <p className="text-xs text-muted-foreground">
                    Εκπαιδευτικά βίντεο από κορυφαίους γιατρούς
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold">Δημοσιεύσεις</h4>
                  <p className="text-xs text-muted-foreground">
                    Επιστημονικές μελέτες και έρευνες
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <BookOpen className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold">Case Studies</h4>
                  <p className="text-xs text-muted-foreground">
                    Κλινικές περιπτώσεις με διάγνωση/θεραπεία
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Market Size */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Μέγεθος Αγοράς (Ελλάδα)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">10.4M</p>
                  <p className="text-sm text-muted-foreground">Πληθυσμός</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">70K+</p>
                  <p className="text-sm text-muted-foreground">Γιατροί</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">1.5K+</p>
                  <p className="text-sm text-muted-foreground">Κλινικές/Νοσοκομεία</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">7M+</p>
                  <p className="text-sm text-muted-foreground">Mobile Users</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2">Digital Health Market Greece</h4>
                <p className="text-sm text-muted-foreground">
                  Εκτιμώμενη αξία: €500M+ ετησίως με ρυθμό ανάπτυξης 15-20%
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Competition */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Ανταγωνισμός</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-center p-2">Doctoranytime</th>
                      <th className="text-center p-2">Doctolib</th>
                      <th className="text-center p-2">Practo</th>
                      <th className="text-center p-2 bg-primary/10 font-bold">MEDITHOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Κράτηση Ραντεβού</td>
                      <td className="text-center p-2">✅</td>
                      <td className="text-center p-2">✅</td>
                      <td className="text-center p-2">✅</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">AI Συμπτώματα</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">⚠️</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Body Avatar</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Ιατρική Ακαδημία</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Ιατρικό Ιστορικό</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">⚠️</td>
                      <td className="text-center p-2">⚠️</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                    <tr>
                      <td className="p-2">Υπενθυμίσεις Φαρμάκων</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">⚠️</td>
                      <td className="text-center p-2 bg-primary/10">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Business Model */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Business Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">B2C - Γιατροί</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Basic: Δωρεάν listing</li>
                    <li>• Pro: €29/μήνα - Προτεραιότητα εμφάνισης</li>
                    <li>• Premium: €99/μήνα - Ακαδημία + Analytics</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">B2B - Κλινικές/Νοσοκομεία</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Starter: €299/μήνα</li>
                    <li>• Professional: €599/μήνα</li>
                    <li>• Enterprise: Custom pricing</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Commission</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 5-10% ανά κράτηση ραντεβού</li>
                    <li>• Transaction fees για πληρωμές</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Premium Content</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Ακαδημία Premium: €9.99/μήνα</li>
                    <li>• Exclusive webinars & courses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technology */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Τεχνολογία</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Stack</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Frontend</span>
                      <span className="text-muted-foreground">React + TypeScript</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Styling</span>
                      <span className="text-muted-foreground">Tailwind CSS</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Backend</span>
                      <span className="text-muted-foreground">Lovable Cloud</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Database</span>
                      <span className="text-muted-foreground">PostgreSQL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>AI</span>
                      <span className="text-muted-foreground">Gemini AI</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Mobile</span>
                      <span className="text-muted-foreground">Capacitor (iOS/Android)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Ασφάλεια</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Row Level Security (RLS)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>End-to-end Encryption</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Secure Authentication</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section className="page-break-after">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-green-500/10 border-l-4 border-green-500 rounded-r">
                  <div className="text-center min-w-[80px]">
                    <p className="font-bold text-green-500">Q4 2024</p>
                    <p className="text-xs">MVP</p>
                  </div>
                  <div>
                    <p className="font-semibold">✅ Ολοκληρωμένο MVP</p>
                    <p className="text-sm text-muted-foreground">Βασικές λειτουργίες, AI, Ακαδημία</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-primary/10 border-l-4 border-primary rounded-r">
                  <div className="text-center min-w-[80px]">
                    <p className="font-bold text-primary">Q1 2025</p>
                    <p className="text-xs">Phase 2</p>
                  </div>
                  <div>
                    <p className="font-semibold">Τηλεϊατρική & Payments</p>
                    <p className="text-sm text-muted-foreground">Video calls, Stripe integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted border-l-4 border-muted-foreground rounded-r">
                  <div className="text-center min-w-[80px]">
                    <p className="font-bold">Q2 2025</p>
                    <p className="text-xs">Phase 3</p>
                  </div>
                  <div>
                    <p className="font-semibold">Mobile Apps</p>
                    <p className="text-sm text-muted-foreground">Native iOS & Android apps</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted border-l-4 border-muted-foreground rounded-r">
                  <div className="text-center min-w-[80px]">
                    <p className="font-bold">Q3 2025</p>
                    <p className="text-xs">Phase 4</p>
                  </div>
                  <div>
                    <p className="font-semibold">Scale & Partnerships</p>
                    <p className="text-sm text-muted-foreground">B2B συνεργασίες, Marketing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact / CTA */}
        <section>
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">MEDITHOS</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Η Υγεία σας, Απλοποιημένη
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 contact@medithos.gr</p>
                <p>🌐 www.medithos.gr</p>
              </div>
              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Ευχαριστούμε για το ενδιαφέρον σας!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .page-break-after {
            page-break-after: always;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
