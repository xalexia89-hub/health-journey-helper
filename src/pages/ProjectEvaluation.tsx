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
          <h2 className="text-2xl text-gray-600 mb-2">Αναφορά Επαναξιολόγησης Συνεργασίας</h2>
          <p className="text-lg text-gray-500">Επικύρωση Μετά-Pilot & Στρατηγικό Υπόμνημα Απόφασης</p>
          
          <div className="mt-8 flex justify-center gap-6">
            <div className="inline-block bg-gray-200 px-4 py-2 rounded-full line-through">
              <span className="text-xl text-gray-500">7.0 / 10</span>
              <span className="text-xs ml-2 text-gray-400">Προηγούμενη</span>
            </div>
            <div className="inline-block bg-green-100 px-6 py-3 rounded-full border-2 border-green-500">
              <span className="text-3xl font-bold text-green-600">8.5 / 10</span>
              <span className="text-xs ml-2 text-green-600">Ενημερωμένη</span>
            </div>
          </div>
          
          <div className="mt-6 inline-block bg-primary/10 px-4 py-2 rounded-lg">
            <span className="text-primary font-semibold">+1.5 Αύξηση Βαθμολογίας</span>
            <span className="text-gray-500 text-sm ml-2">βάσει επαληθευμένων ορόσημων</span>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            Εμπιστευτικό Έγγραφο • {new Date().toLocaleDateString('el-GR')}
          </p>
        </section>

        {/* New Verified Facts */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Νέα Επαληθευμένα Δεδομένα (Ουσιώδης Ενημέρωση)
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
              <p className="text-xs text-gray-600 mt-2">✓ Ποιοτική επικύρωση: αξιολογήσεις "πολύ χρήσιμο"</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">4 Αδειοδοτημένοι Γιατροί</p>
                  <p className="text-sm text-green-600">Υπογραφή συμφωνιών συμμετοχής</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Σύμβουλοι Πλοήγησης Υγείας, όχι θεράποντες</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">7 Μέλη Ομάδας</p>
                  <p className="text-sm text-green-600">Προϊόν, Λειτουργίες, Συντονισμός</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Αφοσιωμένη ομάδα υποστήριξης</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Ελβετική Πιστοποίηση Ασφάλειας</p>
                  <p className="text-sm text-green-600">Επιβεβαίωση σοβαρότητας προσέγγισης</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">✓ Έγκριση αξιοπιστίας από τρίτο μέρος</p>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-bold text-amber-800">Διαθέσιμη Προσφορά Πόρων €200.000</p>
                <p className="text-sm text-amber-600">
                  Προσφορά συνεργάτη για τεχνικούς/λειτουργικούς πόρους MVP — 
                  <strong> αλλά ο ιδρυτής προτιμά ρητά τη συνεργασία με Lovable</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Opinion Summary */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Νομική Γνωμοδότηση — Συμμόρφωση MDR & GDPR
          </h2>
          
          <div className="bg-gray-50 border rounded-lg overflow-hidden">
            <div className="bg-primary text-white p-4">
              <h3 className="font-bold">Εκτελεστική Περίληψη (Νομική Γνωμοδότηση)</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Εφαρμογή MDR: ΟΧΙ (εκτός πεδίου εφαρμογής)</p>
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
                    Μη εμπορική λειτουργία, συμμόρφωση GDPR με ρητή συγκατάθεση, ανωνυμοποίηση, αποποιήσεις ευθύνης.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Συμμετοχή Γιατρών: ΝΟΜΙΜΗ</p>
                  <p className="text-sm text-gray-600">
                    Ως άμισθοι "Σύμβουλοι Πλοήγησης Υγείας" χωρίς σχέση γιατρού-ασθενούς, 
                    με υπογεγραμμένες δηλώσεις αποποίησης ευθύνης.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 p-4 border-t">
              <p className="text-sm text-green-800">
                <strong>Συμπέρασμα:</strong> Το Medithos μπορεί να λειτουργήσει νόμιμα ως εργαλείο 
                πλοήγησης υγείας χωρίς σήμανση CE, εφόσον τηρούνται οι 7 υποχρεωτικές διασφαλίσεις.
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500">Εφαρμοστέο Δίκαιο ΕΕ</p>
              <p className="font-medium">Κανονισμός MDR 2017/745, GDPR 2016/679</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500">Ελληνική Νομοθεσία</p>
              <p className="font-medium">Ν.4624/2019, Ν.4512/2018</p>
            </div>
          </div>
        </section>

        {/* Updated Score Breakdown */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Αναλυτική Αναθεωρημένη Βαθμολογία</h2>
          
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
                    <td className="p-3 font-medium">Ιδέα & Διαφοροποίηση</td>
                    <td className="p-3 text-center text-gray-500">8.5</td>
                    <td className="p-3 text-center font-bold text-green-600">8.5/10</td>
                    <td className="p-3 text-sm text-gray-600">Αμετάβλητο — παραμένει ισχυρό</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Έλξη Χρηστών</td>
                    <td className="p-3 text-center text-gray-500">Δ/Υ</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">50 χρήστες + ποιοτική επικύρωση</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Κλινική/Συμβουλευτική Επικύρωση</td>
                    <td className="p-3 text-center text-gray-500">5.0</td>
                    <td className="p-3 text-center font-bold text-green-600">8.5/10</td>
                    <td className="p-3 text-sm text-gray-600">4 γιατροί υπέγραψαν συμφωνίες</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Κανονιστική Σαφήνεια</td>
                    <td className="p-3 text-center text-gray-500">5.0</td>
                    <td className="p-3 text-center font-bold text-green-600">9.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Νομική γνωμοδότηση: εκτός MDR</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Ετοιμότητα Ομάδας</td>
                    <td className="p-3 text-center text-gray-500">6.0</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">7 μέλη αφοσιωμένης ομάδας</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Αξιοπιστία Τρίτων</td>
                    <td className="p-3 text-center text-gray-500">Δ/Υ</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Ελβετική πιστοποίηση ασφάλειας</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Διαθεσιμότητα Πόρων</td>
                    <td className="p-3 text-center text-gray-500">4.0</td>
                    <td className="p-3 text-center font-bold text-green-600">9.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Προσφορά €200Κ + προτίμηση Lovable</td>
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
                  <span><strong>Κανονιστική αβεβαιότητα:</strong> Νομική γνωμοδότηση επιβεβαιώνει εκτός MDR → <em>από 5.0 σε 9.0</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Κλινικό κενό αξιοπιστίας:</strong> 4 γιατροί υπέγραψαν → <em>από 5.0 σε 8.5</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Αβεβαιότητα προϊόντος-αγοράς:</strong> 50 χρήστες + υψηλές αξιολογήσεις χρησιμότητας → <em>επικυρώθηκε</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Περιορισμοί πόρων:</strong> Διαθέσιμη προσφορά €200Κ → <em>εκτέλεση ενεργοποιήθηκε</em></span>
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
                  <span><strong>Μικρή εγχώρια αγορά:</strong> Ελλάδα 10Μ πληθυσμός — απαιτείται στρατηγική επέκτασης ΕΕ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Μη αποδεδειγμένο μοντέλο εσόδων:</strong> Σαφής διαδρομή B2B αλλά χωρίς υπογεγραμμένο συμβόλαιο ακόμα</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Κατακερματισμός ελληνικής υγείας:</strong> Δομικό, δεν επιλύεται μόνο από το Medithos</span>
                </li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r">
              <h3 className="font-bold text-blue-700">Αλλαγή Τύπου Κινδύνων</h3>
              <p className="mt-2 text-blue-600">
                Οι περισσότεροι κίνδυνοι είναι πλέον <strong>κίνδυνοι εκτέλεσης</strong> (μπορούν να διαχειριστούν 
                με σωστή εκτέλεση) αντί για <strong>κίνδυνοι επικύρωσης</strong> (αβεβαιότητα αν η ιδέα λειτουργεί).
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Decision */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Handshake className="h-6 w-6" />
            Απόφαση Συνεργασίας
          </h2>
          
          <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-500 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-500 text-white px-8 py-3 rounded-full text-2xl font-bold">
                ΝΑΙ ΥΠΟ ΠΡΟΫΠΟΘΕΣΕΙΣ
              </div>
              <p className="mt-2 text-green-700 font-medium">Θετική Απόφαση με Όρους</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Ρόλος του Lovable στη Συνεργασία</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>Βασικός Τεχνολογικός Συνεργάτης:</strong> Κύρια πλατφόρμα ανάπτυξης προϊόντος</li>
                  <li>• <strong>Ταχεία Επανάληψη:</strong> Ανάπτυξη με AI για γρήγορη εξέλιξη MVP → προϊόν</li>
                  <li>• <strong>Πλήρης Δυνατότητα:</strong> Frontend, backend, edge functions, ενσωμάτωση AI</li>
                  <li>• <strong>Μακροπρόθεσμη Κλιμάκωση:</strong> Αρχιτεκτονική που κλιμακώνει με την ανάπτυξη</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Προϋποθέσεις που Πρέπει να Τηρηθούν</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ <strong>Συνεχής Νομική Συμμόρφωση:</strong> Διατήρηση εκτός πεδίου MDR</li>
                  <li>✓ <strong>Πειθαρχία Pilot:</strong> Μη εμπορική λειτουργία μέχρι πλήρη επικύρωση</li>
                  <li>✓ <strong>Τροχιά Αύξησης Χρηστών:</strong> Πρόοδος προς 100+ χρήστες σε 60 ημέρες</li>
                  <li>✓ <strong>Ανάπτυξη Pipeline B2B:</strong> Επιστολή Πρόθεσης εντός 90 ημερών</li>
                </ul>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                <h3 className="font-bold text-green-800 mb-2">Γιατί Lovable αντί για Προσφορά Πόρων €200Κ;</h3>
                <p className="text-sm text-green-700">
                  Η επιλογή του ιδρυτή να προτιμήσει Lovable παρά τους €200Κ πόρους δείχνει:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-green-600">
                  <li>• <strong>Στρατηγική Ευθυγράμμιση:</strong> Lovable = ταχύτητα προϊόντος + ανάπτυξη με AI</li>
                  <li>• <strong>Διατήρηση Ελέγχου:</strong> Αποφυγή εξάρτησης από εξωτερικό πάροχο πόρων</li>
                  <li>• <strong>Ποιότητα έναντι Ποσότητας:</strong> Εστιασμένη εκτέλεση &gt; άφθονοι πόροι</li>
                  <li>• <strong>Μακροπρόθεσμο Όραμα:</strong> Κατασκευή σε κλιμακούμενη υποδομή από την πρώτη μέρα</li>
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
                    Συνεργάτης Πόρων €200Κ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 border-r font-medium">Ταχύτητα</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">⚡ Πολύ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Με AI, άμεσες επαναλήψεις</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Μέτρια</span>
                    <p className="text-xs text-gray-500 mt-1">Παραδοσιακοί κύκλοι ανάπτυξης</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Ποιότητα</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Σύγχρονο stack, βέλτιστες πρακτικές</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-green-600">Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Εξαρτάται από κατανομή ομάδας</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Στρατηγική Ευθυγράμμιση</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Πλήρης</span>
                    <p className="text-xs text-gray-500 mt-1">Roadmap ελεγχόμενο από ιδρυτή</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Μερική</span>
                    <p className="text-xs text-gray-500 mt-1">Οι προτεραιότητες συνεργάτη μπορεί να αποκλίνουν</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Μακροπρόθεσμη Κλιμάκωση</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Εξαιρετική</span>
                    <p className="text-xs text-gray-500 mt-1">Cloud-native, backend Lovable Cloud</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-600">Άγνωστη</span>
                    <p className="text-xs text-gray-500 mt-1">Εξαρτάται από επιλογές αρχιτεκτονικής</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Αποδοτικότητα Κόστους</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Υψηλή</span>
                    <p className="text-xs text-gray-500 mt-1">Πληρωμή ανά χρήση, χωρίς overhead</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-green-600">Χαμηλή αρχικά</span>
                    <p className="text-xs text-gray-500 mt-1">€200Κ προκαταβολικά, ασαφή συνεχή κόστη</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r font-medium">Ανεξαρτησία Ιδρυτή</td>
                  <td className="p-3 text-center border-r bg-green-50">
                    <span className="text-green-600 font-bold">✓ Πλήρης</span>
                    <p className="text-xs text-gray-500 mt-1">Χωρίς αραίωση μετοχικού, πλήρης έλεγχος</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-red-600">Περιορισμένη</span>
                    <p className="text-xs text-gray-500 mt-1">Δεσμεύσεις από πόρους</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-primary/10 p-4 rounded-lg">
            <p className="text-primary font-medium">
              <strong>Συμπέρασμα:</strong> Η επιλογή Lovable προσφέρει καλύτερη ταχύτητα, ευθυγράμμιση, 
              και ανεξαρτησία — κρίσιμα για early-stage health-tech όπου η ταχεία επανάληψη 
              και ο έλεγχος ιδρυτή καθορίζουν την επιτυχία.
            </p>
          </div>
        </section>

        {/* Founder Assessment */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Αξιολόγηση Ιδρυτή
          </h2>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary">8.5 / 10</div>
              <p className="text-gray-600">Βαθμολογία Ιδρυτή (Ενημερωμένη)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Πειθαρχία Εκτέλεσης</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-sm font-bold">9/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">50 χρήστες, 4 γιατροί, ομάδα 7 ατόμων — παραδόθηκε</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Στρατηγική Κρίση</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8.5/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Επέλεξε Lovable αντί €200Κ — δείχνει ποιότητα έναντι ποσότητας</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Διαχείριση Κινδύνων</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-sm font-bold">9/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Λήφθηκε νομική γνωμοδότηση, πρωτόκολλα ασφάλειας pilot</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Διαχείριση Ενδιαφερομένων</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Ευθυγραμμισμένοι γιατροί, χρήστες, ομάδα και εξωτερική έγκριση</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Verdict */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Τελική Απόφαση</h2>
          
          <div className="border-4 border-green-500 rounded-lg p-8 text-center bg-gradient-to-b from-green-50 to-white">
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-4xl line-through text-gray-400">7.0</span>
              <span className="text-2xl text-gray-400">→</span>
              <span className="text-6xl font-bold text-green-600">8.5 / 10</span>
            </div>
            
            <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
              ΠΡΟΧΩΡΑΜΕ — ΣΥΝΙΣΤΑΤΑΙ ΣΥΝΕΡΓΑΣΙΑ
            </div>
            
            <div className="text-left max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Εκτελεστική Ετυμηγορία</h3>
              <p className="text-gray-700 leading-relaxed">
                Το Medithos έχει μετατραπεί από μια <em>ελπιδοφόρα ιδέα</em> σε ένα 
                <strong> επικυρωμένο pilot project</strong> με πραγματικούς χρήστες, 
                συμμετοχή γιατρών, νομική κάλυψη, και αφοσιωμένη ομάδα. Η απόφαση του ιδρυτή 
                να προτιμήσει τη συνεργασία με Lovable έναντι €200Κ πόρων δείχνει ωριμότητα 
                κρίσης και εστίαση στην ποιότητα. Τα βασικά κίνδυνοι επικύρωσης έχουν μετατραπεί 
                σε κινδύνους εκτέλεσης που είναι διαχειρίσιμοι. 
                <strong> Η συνεργασία συνιστάται θερμά.</strong>
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm max-w-lg mx-auto">
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Χρήστες</p>
                <p className="text-2xl font-bold text-green-700">50</p>
                <p className="text-xs text-gray-500">επικυρωμένοι</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Γιατροί</p>
                <p className="text-2xl font-bold text-green-700">4</p>
                <p className="text-xs text-gray-500">υπέγραψαν</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-600 font-bold">Νομικά</p>
                <p className="text-2xl font-bold text-green-700">✓</p>
                <p className="text-xs text-gray-500">εγκρίθηκε</p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Επόμενα Βήματα → Βαθμολογία 9.0+
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50">
              <div className="bg-green-500 text-white p-2 rounded-full font-bold">1</div>
              <div>
                <h3 className="font-bold">Ορόσημο: 100 Ενεργοί Χρήστες</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Διπλασιασμός pilot βάσης με διατηρούμενη εμπλοκή. Επίδραση: +0.2 στη βαθμολογία.
                </p>
                <p className="text-xs text-primary mt-2">Στόχος: Ημέρα 60</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary text-white p-2 rounded-full font-bold">2</div>
              <div>
                <h3 className="font-bold">Ορόσημο: Επιστολή Πρόθεσης B2B</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Επιστολή Πρόθεσης από ασφαλιστική, εργοδότη, ή οργανισμό υγείας. Επίδραση: +0.3 στη βαθμολογία.
                </p>
                <p className="text-xs text-primary mt-2">Στόχος: Ημέρα 90</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary text-white p-2 rounded-full font-bold">3</div>
              <div>
                <h3 className="font-bold">Ορόσημο: Οδικός Χάρτης Επέκτασης ΕΕ</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Τεκμηριωμένο σχέδιο για Κύπρο, Βουλγαρία, ή άλλη αγορά ΕΕ. Επίδραση: Αντιμετωπίζει κίνδυνο μεγέθους αγοράς.
                </p>
                <p className="text-xs text-primary mt-2">Στόχος: Ημέρα 120</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t text-sm text-gray-500 print-avoid-break">
          <p className="font-bold">Αναφορά Επαναξιολόγησης Συνεργασίας MEDITHOS</p>
          <p>Δημιουργήθηκε: {new Date().toLocaleDateString('el-GR')} • Εμπιστευτικό</p>
          <p className="mt-2 text-xs">
            Αυτή η αξιολόγηση βασίζεται σε επαληθευμένα στοιχεία που παρέχονται από τον ιδρυτή και δεν αποτελεί επενδυτική συμβουλή.
          </p>
          <p className="mt-2 text-xs text-primary">
            Απόφαση: <strong>ΠΡΟΧΩΡΑΜΕ — Συνιστάται Συνεργασία</strong> | Βαθμολογία: <strong>8.5/10</strong>
          </p>
        </footer>

      </div>
    </main>
  );
};

export default ProjectEvaluation;
