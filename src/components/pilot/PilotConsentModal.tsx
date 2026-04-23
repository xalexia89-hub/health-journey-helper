import { useEffect, useState } from "react";
import { GranularConsentDialog } from "@/components/consent/GranularConsentDialog";
import { hasConsent } from "@/lib/consent";
import { useAuth } from "@/contexts/AuthContext";

const LEGACY_CONSENT_KEY = "medithos_pilot_consent_v1";
const LEGACY_AGE_KEY = "medithos_age_confirmed_v1";

interface PilotConsentModalProps {
  onConsentGiven: () => void;
}

/**
 * Bridges the legacy local-storage gate to the new database-backed
 * granular consent system. Logged-in users get the multi-step dialog
 * that writes audit rows to `consent_records`. Anonymous/demo users
 * fall back to local-storage acknowledgement (no DB write possible).
 */
export function PilotConsentModal({ onConsentGiven }: PilotConsentModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user) {
        const ok = await hasConsent("pilot_program");
        if (!cancelled) {
          if (ok) onConsentGiven();
          else setOpen(true);
        }
      } else {
        const legacy = localStorage.getItem(LEGACY_CONSENT_KEY) && localStorage.getItem(LEGACY_AGE_KEY);
        if (!cancelled) {
          if (legacy) onConsentGiven();
          else setOpen(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user, onConsentGiven]);

  if (!user) {
    // Anonymous fallback — keep legacy local-storage gate
    return null;
  }

  return (
    <GranularConsentDialog
      open={open}
      onComplete={() => {
        setOpen(false);
        // Mirror to localStorage so PilotSafetyWrapper recognises it instantly
        localStorage.setItem(LEGACY_CONSENT_KEY, new Date().toISOString());
        localStorage.setItem(LEGACY_AGE_KEY, "true");
        onConsentGiven();
      }}
    />
  );
}

export function hasPilotConsent(): boolean {
  return !!localStorage.getItem(LEGACY_CONSENT_KEY) && !!localStorage.getItem(LEGACY_AGE_KEY);
}
