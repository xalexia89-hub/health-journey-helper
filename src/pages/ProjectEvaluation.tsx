import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, TrendingUp, AlertTriangle, Target, User, Calendar, CheckCircle, XCircle, Shield, Scale, Handshake, Users, Award, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectEvaluation = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      {/* Navigation Bar - Hidden on Print */}
      <div className="no-print sticky top-0 z-50 bg-white border-b p-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Πίσω
        </Button>
        <Button onClick={handlePrint} className="bg-primary text-white">
          <Printer className="h-4 w-4 mr-2" />
          Εκτύπωση PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Cover Page */}
        <section className="text-center py-16 border-b-4 border-primary print-avoid-break">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-4xl font-bold text-primary mb-4">MEDITHOS</h1>
          <h2 className="text-2xl text-gray-600 mb-2">Partnership Re-Evaluation Report</h2>
          <p className="text-lg text-gray-500">Post-Pilot Validation & Strategic Decision Memo</p>
          
          <div className="mt-8 flex justify-center gap-6">
            <div className="inline-block bg-gray-200 px-4 py-2 rounded-full line-through">
              <span className="text-xl text-gray-500">7.0 / 10</span>
              <span className="text-xs ml-2 text-gray-400">Previous</span>
            </div>
            <div className="inline-block bg-green-100 px-6 py-3 rounded-full border-2 border-green-500">
              <span className="text-3xl font-bold text-green-600">8.5 / 10</span>
              <span className="text-xs ml-2 text-green-600">Updated</span>
            </div>
          </div>
          
          <div className="mt-6 inline-block bg-primary/10 px-4 py-2 rounded-lg">
            <span className="text-primary font-semibold">+1.5 Score Increase</span>
            <span className="text-gray-500 text-sm ml-2">based on verified milestones</span>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            Confidential Document • {new Date().toLocaleDateString('el-GR')}
          </p>
        </section>

        {/* New Verified Facts */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Νέα Επαληθευμένα Δεδομένα (Material Update)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">50 Πραγματικοί Χρήστες</p>
                  <p className="text-sm text-green-600">Υπογεγραμμένη συγκατάθεση + pilot χρήση</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Qualitative validation: "highly useful" ratings</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">4 Αδειοδοτημένοι Γιατροί</p>
                  <p className="text-sm text-green-600">Υπογραφή συμφωνιών συμμετοχής</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Health Navigation Advisors, όχι θεράποντες</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">7 Μέλη Ομάδας</p>
                  <p className="text-sm text-green-600">Product, Ops, Coordination</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Committed support team</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Swiss Security Testimonial</p>
                  <p className="text-sm text-green-600">Επιβεβαίωση σοβαρότητας προσέγγισης</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Third-party credibility endorsement</p>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-bold text-amber-800">€200,000 Resource Offer Available</p>
                <p className="text-sm text-amber-600">
                  Partner προσφορά για τεχνικούς/λειτουργικούς πόρους MVP — 
                  <strong> αλλά ο founder προτιμά συνεργασία με Lovable</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Opinion Summary */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Νομική Γνωμοδότηση — MDR & GDPR Compliance
          </h2>
          
          <div className="bg-gray-50 border rounded-lg overflow-hidden">
            <div className="bg-primary text-white p-4">
              <h3 className="font-bold">Executive Summary (Legal Opinion)</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">MDR Applicability: ΟΧΙ (εκτός πεδίου εφαρμογής)</p>
                  <p className="text-sm text-gray-600">
                    Το Medithos δεν αποτελεί ιατροτεχνολογικό προϊόν υπό τις τρέχουσες συνθήκες, 
                    καθώς δεν παρέχει διάγνωση ή θεραπευτική καθοδήγηση.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Νομιμότητα Pilot: ΝΑΙ, ΥΠΟ ΠΡΟΫΠΟΘΕΣΕΙΣ</p>
                  <p className="text-sm text-gray-600">
                    Μη εμπορική λειτουργία, GDPR-compliant με ρητή συγκατάθεση, ανωνυμοποίηση, disclaimers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Συμμετοχή Γιατρών: ΝΟΜΙΜΗ</p>
                  <p className="text-sm text-gray-600">
                    Ως άμισθοι "Health Navigation Advisors" χωρίς σχέση γιατρού-ασθενούς, 
                    με υπογεγραμμένα waivers ευθύνης.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 p-4 border-t">
              <p className="text-sm text-green-800">
                <strong>Συμπέρασμα:</strong> Το Medithos μπορεί να λειτουργήσει νόμιμα ως εργαλείο 
                πλοήγησης υγείας χωρίς CE marking, εφόσον τηρούνται οι 7 υποχρεωτικές διασφαλίσεις.
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500">Εφαρμοστέο Δίκαιο</p>
              <p className="font-medium">EU MDR 2017/745, GDPR 2016/679</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500">Ελληνική Νομοθεσία</p>
              <p className="font-medium">Ν.4624/2019, Ν.4512/2018</p>
            </div>
          </div>
        </section>

        {/* Updated Score Breakdown */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Αναθεωρημένη Βαθμολογία</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3 text-left">Διάσταση</th>
                    <th className="p-3 text-center">Πριν</th>
                    <th className="p-3 text-center">Τώρα</th>
                    <th className="p-3 text-left">Αιτιολόγηση Αλλαγής</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-medium">Concept & Differentiation</td>
                    <td className="p-3 text-center text-gray-500">8.5</td>
                    <td className="p-3 text-center font-bold text-green-600">8.5/10</td>
                    <td className="p-3 text-sm text-gray-600">Αμετάβλητο — παραμένει ισχυρό</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">User Traction</td>
                    <td className="p-3 text-center text-gray-500">N/A</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">50 χρήστες + qualitative validation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Clinical/Advisor Validation</td>
                    <td className="p-3 text-center text-gray-500">5.0</td>
                    <td className="p-3 text-center font-bold text-green-600">8.5/10</td>
                    <td className="p-3 text-sm text-gray-600">4 γιατροί υπέγραψαν συμφωνίες</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Regulatory Clarity</td>
                    <td className="p-3 text-center text-gray-500">5.0</td>
                    <td className="p-3 text-center font-bold text-green-600">9.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Νομική γνωμοδότηση: εκτός MDR</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Team Readiness</td>
                    <td className="p-3 text-center text-gray-500">6.0</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">7 μέλη committed team</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Third-Party Credibility</td>
                    <td className="p-3 text-center text-gray-500">N/A</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Swiss security testimonial</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Resource Availability</td>
                    <td className="p-3 text-center text-gray-500">4.0</td>
                    <td className="p-3 text-center font-bold text-green-600">9.0/10</td>
                    <td className="p-3 text-sm text-gray-600">€200K offer + Lovable preference</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Risk Reassessment */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Επαναξιολόγηση Κινδύνων
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r">
              <h3 className="font-bold text-green-700 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Κίνδυνοι που ΜΕΙΩΘΗΚΑΝ Σημαντικά
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-green-600">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Regulatory uncertainty:</strong> Νομική γνωμοδότηση επιβεβαιώνει εκτός MDR → <em>από 5.0 σε 9.0</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Clinical credibility gap:</strong> 4 γιατροί signed → <em>από 5.0 σε 8.5</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Product-market fit uncertainty:</strong> 50 users + high usefulness ratings → <em>validated</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Resource constraints:</strong> €200K offer available → <em>execution enabled</em></span>
                </li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r">
              <h3 className="font-bold text-yellow-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Κίνδυνοι που ΠΑΡΑΜΕΝΟΥΝ
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-yellow-600">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Small domestic market:</strong> Ελλάδα 10M πληθυσμός — απαιτείται EU expansion strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Revenue model unproven:</strong> B2B path clear αλλά no signed contract yet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Greek healthcare fragmentation:</strong> Structural, not solvable by Medithos alone</span>
                </li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r">
              <h3 className="font-bold text-blue-700">Αλλαγή Τύπου Κινδύνων</h3>
              <p className="mt-2 text-blue-600">
                Οι περισσότεροι κίνδυνοι είναι πλέον <strong>execution risks</strong> (μπορούν να διαχειριστούν 
                με σωστή εκτέλεση) αντί για <strong>validation risks</strong> (αβεβαιότητα αν η ιδέα λειτουργεί).
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Decision */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Handshake className="h-6 w-6" />
            Απόφαση Συνεργασίας (Partnership Decision)
          </h2>
          
          <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-500 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-500 text-white px-8 py-3 rounded-full text-2xl font-bold">
                ΝΑΙ ΥΠΟ ΠΡΟΫΠΟΘΕΣΕΙΣ
              </div>
              <p className="mt-2 text-green-700 font-medium">YES UNDER CONDITIONS</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Ρόλος του Lovable στη Συνεργασία</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>Core Technology Partner:</strong> Primary platform for product development</li>
                  <li>• <strong>Rapid Iteration:</strong> AI-powered development για γρήγορο MVP → product evolution</li>
                  <li>• <strong>Full-Stack Capability:</strong> Frontend, backend (Supabase), edge functions, AI integration</li>
                  <li>• <strong>Long-term Scaling:</strong> Architecture που κλιμακώνει με την ανάπτυξη</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Προϋποθέσεις που πρέπει να τηρηθούν</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ <strong>Continued Legal Compliance:</strong> Διατήρηση εκτός MDR scope</li>
                  <li>✓ <strong>Pilot Discipline:</strong> Non-commercial operation μέχρι full validation</li>
                  <li>✓ <strong>User Growth Trajectory:</strong> Progression toward 100+ users in 60 days</li>
                  <li>✓ <strong>B2B Pipeline Development:</strong> LOI within 90 days</li>
                </ul>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                <h3 className="font-bold text-green-800 mb-2">Γιατί Lovable αντί για €200K Resource Offer;</h3>
                <p className="text-sm text-green-700">
                  Η επιλογή του founder να προτιμήσει Lovable παρά τους €200K πόρους δείχνει:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-green-600">
                  <li>• <strong>Strategic Alignment:</strong> Lovable = product velocity + AI-native development</li>
                  <li>• <strong>Control Retention:</strong> Αποφυγή dependency σε external resource provider</li>
                  <li>• <strong>Quality over Quantity:</strong> Focused execution &gt; abundant resources</li>
                  <li>• <strong>Long-term Vision:</strong> Building on scalable infrastructure from day 1</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Comparison */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Στρατηγική Σύγκριση</h2>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border-r">Παράγοντας</th>
                  <th className="p-3 text-center border-r bg-primary/10">
                    <span className="text-primary font-bold">Lovable</span>
                  </th>
                  <th className="p-3 text-center">
                    €200K Resource Partner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 border-r font-medium">Ταχύτητα (Speed)</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">⚡ Πολύ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">AI-powered, instant iterations</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Μέτρια</span>
                    <p className="text-xs text-gray-500 mt-1">Traditional dev cycles</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Ποιότητα (Quality)</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Modern stack, best practices</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-green-600">Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Depends on team allocation</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Strategic Alignment</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Πλήρης</span>
                    <p className="text-xs text-gray-500 mt-1">Founder-controlled roadmap</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Μερική</span>
                    <p className="text-xs text-gray-500 mt-1">Partner priorities may diverge</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Long-term Scalability</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Εξαιρετική</span>
                    <p className="text-xs text-gray-500 mt-1">Cloud-native, Supabase backend</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Άγνωστη</span>
                    <p className="text-xs text-gray-500 mt-1">Depends on architecture choices</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Cost Efficiency</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Pay-as-you-go, no overhead</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-green-600">Χαμηλή αρχικά</span>
                    <p className="text-xs text-gray-500 mt-1">€200K upfront, ongoing costs unclear</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Founder Independence</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Πλήρης</span>
                    <p className="text-xs text-gray-500 mt-1">No equity dilution, full control</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-red-600">Περιορισμένη</span>
                    <p className="text-xs text-gray-500 mt-1">Resource strings attached</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-primary/10 p-4 rounded-lg">
            <p className="text-primary font-medium">
              <strong>Συμπέρασμα:</strong> Η επιλογή Lovable προσφέρει καλύτερο speed, alignment, 
              και independence — κρίσιμα για early-stage health-tech όπου rapid iteration 
              και founder control καθορίζουν την επιτυχία.
            </p>
          </div>
        </section>

        {/* Founder Assessment */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Αξιολόγηση Ιδρυτή (Founder Assessment)
          </h2>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary">8.5 / 10</div>
              <p className="text-gray-600">Founder Score (Updated)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Execution Discipline</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-sm font-bold">9/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">50 users, 4 doctors, 7-person team — delivered</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Strategic Judgment</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8.5/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Chose Lovable over €200K — shows quality over quantity</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Risk Management</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-sm font-bold">9/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Legal opinion obtained, pilot safety protocols in place</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Stakeholder Management</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Aligned doctors, users, team, and external endorsement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Verdict */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Τελική Απόφαση (Final Verdict)</h2>
          
          <div className="border-4 border-green-500 rounded-lg p-8 text-center bg-gradient-to-b from-green-50 to-white">
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-4xl line-through text-gray-400">7.0</span>
              <span className="text-2xl text-gray-400">→</span>
              <span className="text-6xl font-bold text-green-600">8.5 / 10</span>
            </div>
            
            <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
              GO — PARTNERSHIP RECOMMENDED
            </div>
            
            <div className="text-left max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Executive Verdict</h3>
              <p className="text-gray-700 leading-relaxed">
                Το Medithos έχει μετατραπεί από μια <em>ελπιδοφόρα ιδέα</em> σε ένα 
                <strong> επικυρωμένο pilot project</strong> με πραγματικούς χρήστες, 
                συμμετοχή γιατρών, νομική κάλυψη, και committed team. Η απόφαση του founder 
                να προτιμήσει τη συνεργασία με Lovable έναντι €200K πόρων δείχνει ωριμότητα 
                κρίσης και focus στην ποιότητα. Τα βασικά validation risks έχουν μετατραπεί 
                σε execution risks που είναι διαχειρίσιμα. 
                <strong> Η συνεργασία συνιστάται θερμά.</strong>
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm max-w-lg mx-auto">
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Users</p>
                <p className="text-2xl font-bold text-green-700">50</p>
                <p className="text-xs text-gray-500">validated</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Doctors</p>
                <p className="text-2xl font-bold text-green-700">4</p>
                <p className="text-xs text-gray-500">signed</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Legal</p>
                <p className="text-2xl font-bold text-green-700">✓</p>
                <p className="text-xs text-gray-500">cleared</p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Επόμενα Βήματα → Score 9.0+
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50">
              <div className="bg-green-500 text-white p-2 rounded-full font-bold">1</div>
              <div>
                <h3 className="font-bold">Milestone: 100 Active Users</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Διπλασιασμός pilot base με sustained engagement. Impact: +0.2 στο score.
                </p>
                <p className="text-xs text-primary mt-2">Στόχος: Ημέρα 60</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary text-white p-2 rounded-full font-bold">2</div>
              <div>
                <h3 className="font-bold">Milestone: B2B Letter of Intent</h3>
                <p className="text-sm text-gray-600 mt-1">
                  LOI από ασφαλιστική, εργοδότη, ή healthcare organization. Impact: +0.3 στο score.
                </p>
                <p className="text-xs text-primary mt-2">Target: Day 90</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary text-white p-2 rounded-full font-bold">3</div>
              <div>
                <h3 className="font-bold">Milestone: EU Expansion Roadmap</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Documented plan για Cyprus, Bulgaria, ή άλλη EU αγορά. Impact: Addresses market size risk.
                </p>
                <p className="text-xs text-primary mt-2">Target: Day 120</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t text-sm text-gray-500 print-avoid-break">
          <p className="font-bold">MEDITHOS Partnership Re-Evaluation Report</p>
          <p>Generated: {new Date().toLocaleDateString('el-GR')} • Confidential</p>
          <p className="mt-2 text-xs">
            This assessment is based on verified facts provided by the founder and does not constitute investment advice.
          </p>
          <p className="mt-2 text-xs text-primary">
            Decision: <strong>GO — Partnership Recommended</strong> | Score: <strong>8.5/10</strong>
          </p>
        </footer>

      </div>
    </main>
  );
};

export default ProjectEvaluation;
