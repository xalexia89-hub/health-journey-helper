import { useEffect } from "react";
import medithoLogo from "@/assets/medithos-logo.png";

export default function InterestFormPrint() {
  useEffect(() => {
    // Auto print when page loads
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <style>
        {`
          @media print {
            body { 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-gray-300 pb-4">
        <div className="flex items-center gap-3">
          <img src={medithoLogo} alt="Medithos" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MEDITHOS</h1>
            <p className="text-sm text-gray-600">Η Υγεία στα Χέρια σας</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Ημερομηνία: _______________</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ΦΟΡΜΑ ΕΚΔΗΛΩΣΗΣ ΕΝΔΙΑΦΕΡΟΝΤΟΣ
        </h2>
        <p className="text-sm text-gray-600">
          Συμπληρώστε τα παρακάτω στοιχεία για να εκδηλώσετε το ενδιαφέρον σας για το Medithos
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="border border-gray-300 rounded-lg p-6 space-y-5">
          {/* Personal Info */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ</h3>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ονοματεπώνυμο *
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Τηλέφωνο
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">ΕΠΑΓΓΕΛΜΑΤΙΚΑ ΣΤΟΙΧΕΙΑ</h3>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ιδιότητα * (επιλέξτε ένα)
                </label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <span className="w-4 h-4 border border-gray-400 inline-block"></span>
                    Γιατρός
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-4 h-4 border border-gray-400 inline-block"></span>
                    Νοσοκόμος/α
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-4 h-4 border border-gray-400 inline-block"></span>
                    Κλινική / Ιατρείο
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-4 h-4 border border-gray-400 inline-block"></span>
                    Νοσοκομείο
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-4 h-4 border border-gray-400 inline-block"></span>
                    Άλλο: _______________
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ειδικότητα
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Όνομα Οργανισμού / Κλινικής
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Πόλη
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>
          </div>

          {/* Interest */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ΕΝΔΙΑΦΕΡΟΝ</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Γιατί σας ενδιαφέρει το Medithos;
              </label>
              <div className="border-2 border-dotted border-gray-400 h-24 rounded"></div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="border border-gray-300 rounded-lg p-6 mt-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Υπογραφή
              </label>
              <div className="border-b-2 border-gray-400 h-16"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ημερομηνία
              </label>
              <div className="border-b-2 border-gray-400 h-16"></div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          * Τα πεδία με αστερίσκο είναι υποχρεωτικά. Τα στοιχεία σας θα χρησιμοποιηθούν 
          αποκλειστικά για επικοινωνία σχετικά με το Medithos.
        </p>

        {/* Print Button - hidden in print */}
        <div className="no-print flex justify-center gap-4 mt-8">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Εκτύπωση
          </button>
          <button 
            onClick={() => window.close()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Κλείσιμο
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Medithos © {new Date().getFullYear()} - Η Υγεία στα Χέρια σας</p>
        <p>www.medithos.com</p>
      </div>
    </div>
  );
}
