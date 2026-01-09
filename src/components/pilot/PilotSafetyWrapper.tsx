import { useState, useEffect } from "react";
import { PilotConsentModal, hasPilotConsent } from "./PilotConsentModal";
import { EmergencyButton } from "./EmergencyButton";
import { PilotBadge } from "./PilotBadge";
import { Loader2 } from "lucide-react";

interface PilotSafetyWrapperProps {
  children: React.ReactNode;
  showEmergencyButton?: boolean;
  showPilotBadge?: boolean;
}

export function PilotSafetyWrapper({ 
  children, 
  showEmergencyButton = true,
  showPilotBadge = true 
}: PilotSafetyWrapperProps) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check consent on mount
    setHasConsent(hasPilotConsent());
  }, []);

  // Show loading while checking consent
  if (hasConsent === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Block UI completely until consent is given
  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-background">
        <PilotConsentModal onConsentGiven={() => setHasConsent(true)} />
      </div>
    );
  }

  // User has given consent - show full UI
  return (
    <>
      {showPilotBadge && <PilotBadge variant="corner" />}
      
      {children}
      
      {showEmergencyButton && <EmergencyButton variant="floating" />}
    </>
  );
}
