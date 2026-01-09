import { useState, useEffect } from "react";
import { PilotConsentModal, hasPilotConsent } from "./PilotConsentModal";
import { EmergencyButton } from "./EmergencyButton";
import { PilotBadge } from "./PilotBadge";

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
  const [hasConsent, setHasConsent] = useState(hasPilotConsent());

  useEffect(() => {
    setHasConsent(hasPilotConsent());
  }, []);

  return (
    <>
      <PilotConsentModal onConsentGiven={() => setHasConsent(true)} />
      
      {showPilotBadge && <PilotBadge variant="corner" />}
      
      {children}
      
      {showEmergencyButton && hasConsent && <EmergencyButton variant="floating" />}
    </>
  );
}
