import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Monitor, CheckCircle2, ArrowRight, Share, MoreVertical } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) setIsInstalled(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Εγκατάσταση Medithos
          </h1>
          <p className="text-muted-foreground text-lg">
            Προσθέστε το Medithos στην αρχική σας οθόνη για γρήγορη πρόσβαση
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
            <CardContent className="pt-6 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                Η εφαρμογή είναι εγκατεστημένη!
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Άνοιγμα Medithos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Smartphone className="h-16 w-16 text-primary mx-auto" />
              <div className="space-y-4 text-left">
                <p className="font-semibold text-center">Οδηγίες για iPhone / iPad:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">1</div>
                    <p className="text-muted-foreground pt-1">
                      Πατήστε το κουμπί <Share className="inline h-4 w-4" /> <strong>Share</strong> στο κάτω μέρος του Safari
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">2</div>
                    <p className="text-muted-foreground pt-1">
                      Σύρετε και επιλέξτε <strong>"Προσθήκη στην οθόνη Αφετηρίας"</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">3</div>
                    <p className="text-muted-foreground pt-1">
                      Πατήστε <strong>"Προσθήκη"</strong> πάνω δεξιά
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Download className="h-16 w-16 text-primary mx-auto animate-bounce" />
              <Button onClick={handleInstall} size="lg" className="w-full text-lg py-6">
                <Download className="mr-2 h-5 w-5" />
                Εγκατάσταση Medithos
              </Button>
              <p className="text-sm text-muted-foreground">
                Χωρίς App Store • Χωρίς download • Δωρεάν
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Monitor className="h-16 w-16 text-primary mx-auto" />
              <div className="space-y-4 text-left">
                <p className="font-semibold text-center">Οδηγίες εγκατάστασης:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">1</div>
                    <p className="text-muted-foreground pt-1">
                      Πατήστε <MoreVertical className="inline h-4 w-4" /> στο browser menu
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">2</div>
                    <p className="text-muted-foreground pt-1">
                      Επιλέξτε <strong>"Εγκατάσταση εφαρμογής"</strong> ή <strong>"Προσθήκη στην αρχική οθόνη"</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { icon: "⚡", label: "Γρήγορη" },
            { icon: "📴", label: "Offline" },
            { icon: "🔒", label: "Ασφαλής" },
          ].map((f) => (
            <div key={f.label} className="text-center space-y-1">
              <div className="text-2xl">{f.icon}</div>
              <p className="text-xs text-muted-foreground font-medium">{f.label}</p>
            </div>
          ))}
        </div>

        <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
          Συνέχεια στο browser →
        </Button>
      </div>
    </div>
  );
};

export default Install;
