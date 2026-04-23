/**
 * Consent service — GDPR Article 7 compliance.
 *
 * Every consent grant or revocation creates an immutable audit row in
 * `consent_records`. Never UPDATE an existing record — always insert a new
 * one with the new `granted` value.
 */
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export type ConsentType =
  | "terms_of_service"
  | "privacy_policy"
  | "health_data_processing"
  | "ai_processing"
  | "pilot_program"
  | "insurance_data_share"
  | "physician_data_share"
  | "marketing"
  | "age_verification";

export const CONSENT_VERSION = "1.0";

export interface ConsentInput {
  type: ConsentType;
  granted: boolean;
  version?: string;
  metadata?: Record<string, unknown>;
}

/** Record one consent decision (grant or revoke). Append-only. */
export async function recordConsent(input: ConsentInput): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  const { error } = await supabase.from("consent_records").insert([{
    user_id: user.id,
    consent_type: input.type,
    granted: input.granted,
    version: input.version ?? CONSENT_VERSION,
    user_agent: navigator.userAgent,
    metadata: (input.metadata ?? {}) as never,
    revoked_at: input.granted ? null : new Date().toISOString(),
  }]);

  if (error) {
    logger.error("recordConsent failed", error);
    throw error;
  }
}

/** Record many consents atomically (used during signup). */
export async function recordConsentBatch(items: ConsentInput[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  const rows = items.map((i) => ({
    user_id: user.id,
    consent_type: i.type,
    granted: i.granted,
    version: i.version ?? CONSENT_VERSION,
    user_agent: navigator.userAgent,
    metadata: (i.metadata ?? {}) as never,
    revoked_at: i.granted ? null : new Date().toISOString(),
  }));

  const { error } = await supabase.from("consent_records").insert(rows);
  if (error) {
    logger.error("recordConsentBatch failed", error);
    throw error;
  }
}

export interface ActiveConsent {
  type: ConsentType;
  granted: boolean;
  version: string;
  granted_at: string;
}

/** Latest consent state per type for the current user. */
export async function getActiveConsents(): Promise<ActiveConsent[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("consent_records")
    .select("consent_type, granted, version, granted_at")
    .eq("user_id", user.id)
    .order("granted_at", { ascending: false });

  if (error) {
    logger.error("getActiveConsents failed", error);
    return [];
  }

  // Reduce: latest record per consent_type
  const latest = new Map<string, ActiveConsent>();
  for (const row of data ?? []) {
    if (!latest.has(row.consent_type)) {
      latest.set(row.consent_type, {
        type: row.consent_type as ConsentType,
        granted: row.granted,
        version: row.version,
        granted_at: row.granted_at,
      });
    }
  }
  return Array.from(latest.values());
}

export async function hasConsent(type: ConsentType): Promise<boolean> {
  const consents = await getActiveConsents();
  return consents.find((c) => c.type === type)?.granted ?? false;
}
