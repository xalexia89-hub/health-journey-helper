import { AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AdvisorBanner = () => {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-primary border-primary">
              Pilot Version
            </Badge>
            <Badge variant="outline" className="text-health-warning border-health-warning">
              Advisor Mode
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Λειτουργείτε ως <strong>Σύμβουλος Πλοήγησης</strong>. Παρέχετε καθοδήγηση για πλοήγηση στο σύστημα υγείας - 
            <span className="text-health-warning"> όχι ιατρικές διαγνώσεις ή θεραπευτικές συμβουλές</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
