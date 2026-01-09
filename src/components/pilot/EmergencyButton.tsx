import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmergencyButtonProps {
  variant?: "floating" | "inline" | "compact";
  className?: string;
}

export function EmergencyButton({ variant = "floating", className = "" }: EmergencyButtonProps) {
  const EmergencyContent = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Σε περίπτωση ιατρικής έκτακτης ανάγκης, καλέστε αμέσως:
        </p>
      </div>
      
      <div className="grid gap-3">
        <a 
          href="tel:112" 
          className="flex items-center justify-between p-4 bg-destructive/20 border border-destructive/40 rounded-lg hover:bg-destructive/30 transition-colors"
        >
          <div>
            <div className="font-bold text-destructive text-lg">112</div>
            <div className="text-sm text-muted-foreground">Ευρωπαϊκός Αριθμός Έκτακτης Ανάγκης</div>
          </div>
          <Phone className="h-6 w-6 text-destructive" />
        </a>
        
        <a 
          href="tel:166" 
          className="flex items-center justify-between p-4 bg-primary/20 border border-primary/40 rounded-lg hover:bg-primary/30 transition-colors"
        >
          <div>
            <div className="font-bold text-primary text-lg">166</div>
            <div className="text-sm text-muted-foreground">ΕΚΑΒ - Εθνικό Κέντρο Άμεσης Βοήθειας</div>
          </div>
          <Phone className="h-6 w-6 text-primary" />
        </a>

        <a 
          href="tel:1016" 
          className="flex items-center justify-between p-4 bg-accent/20 border border-accent/40 rounded-lg hover:bg-accent/30 transition-colors"
        >
          <div>
            <div className="font-bold text-accent text-lg">1016</div>
            <div className="text-sm text-muted-foreground">Δηλητηριάσεις</div>
          </div>
          <Phone className="h-6 w-6 text-accent" />
        </a>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Σε κάθε περίπτωση έκτακτης ανάγκης, ακολουθήστε τις οδηγίες του χειριστή.
      </p>
    </div>
  );

  if (variant === "compact") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${className}`}>
            <Phone className="h-4 w-4 mr-1" />
            112
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-strong border-destructive/30">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Αριθμοί Έκτακτης Ανάγκης
            </DialogTitle>
            <DialogDescription>
              Επιλέξτε τον κατάλληλο αριθμό για κλήση.
            </DialogDescription>
          </DialogHeader>
          <EmergencyContent />
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "inline") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className={className}>
            <Phone className="h-4 w-4 mr-2" />
            Κάλεσε 112
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-strong border-destructive/30">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Αριθμοί Έκτακτης Ανάγκης
            </DialogTitle>
            <DialogDescription>
              Επιλέξτε τον κατάλληλο αριθμό για κλήση.
            </DialogDescription>
          </DialogHeader>
          <EmergencyContent />
        </DialogContent>
      </Dialog>
    );
  }

  // Floating variant (default)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="lg"
          className={`fixed bottom-24 right-4 z-50 rounded-full shadow-lg animate-pulse-soft ${className}`}
        >
          <Phone className="h-5 w-5 mr-2" />
          112
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong border-destructive/30">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Αριθμοί Έκτακτης Ανάγκης
          </DialogTitle>
          <DialogDescription>
            Επιλέξτε τον κατάλληλο αριθμό για κλήση.
          </DialogDescription>
        </DialogHeader>
        <EmergencyContent />
      </DialogContent>
    </Dialog>
  );
}
