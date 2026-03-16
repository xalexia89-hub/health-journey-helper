

# Security Review — Medithos

The scan identified **2 critical** and **7 warning-level** findings across your backend. Here is the full picture and remediation plan.

---

## Critical Issues (must fix)

### 1. Preventive Advisor — No Authentication
The `preventive-advisor` edge function processes health data **without verifying the caller's identity**. Anyone can call it and consume AI credits.

**Fix:** Add JWT/auth validation at the top of the function, matching the pattern used in `symptom-chat`.

### 2. Medical Documents — Broken RLS Policy
The policy *"Doctors can add documents for shared patients"* on `medical_documents` has a logic error. It checks that the provider shared records **with themselves**, not that they have access to the target patient. This means **any authenticated user with a provider record can inject falsified documents into any patient's medical record**.

**Fix:** Rewrite the INSERT policy to bind the check to the document's `user_id` (the patient), not the caller's own user_id. The corrected condition:
```
mrs.patient_id = medical_documents.user_id
AND p.user_id = auth.uid()
AND mrs.is_active = true
```

---

## Warning-Level Issues

### 3. Leaked Password Protection Disabled
Users can sign up with passwords known to be compromised in data breaches.

**Fix:** Manual step — enable Leaked Password Protection in backend auth settings.

### 4. Public `pilot_settings` Table
Exposes system config (`max_pilot_users`, `pilot_active`, `require_invite_code`) to unauthenticated users.

**Fix:** Restrict the SELECT policy to `auth.uid() IS NOT NULL` or admin-only.

### 5. Public `reviews` Table
Exposes patient-provider relationships (who visited which doctor) without authentication.

**Fix:** Restrict SELECT to authenticated users.

### 6. Public `academy_publications` Table
Research titles, abstracts, DOIs visible to scrapers.

**Fix:** Restrict SELECT to authenticated users.

### 7. Public `availability_slots` Table
Doctor schedules scrapable by competitors.

**Fix:** Restrict SELECT to authenticated users.

### 8. Edge Function Error Leakage
`preventive-advisor` and `insurance-aggregate` return raw `error.message` to clients, potentially exposing internal details.

**Fix:** Return generic error messages; keep detailed logging server-side only.

---

## Implementation Plan

| Step | Action | Type |
|------|--------|------|
| 1 | Add auth validation to `preventive-advisor` edge function | Code change |
| 2 | Fix `medical_documents` INSERT RLS policy | DB migration |
| 3 | Restrict `pilot_settings` SELECT to authenticated users | DB migration |
| 4 | Restrict `reviews` SELECT to authenticated users | DB migration |
| 5 | Restrict `academy_publications` SELECT to authenticated users | DB migration |
| 6 | Restrict `availability_slots` SELECT to authenticated users | DB migration |
| 7 | Sanitize error responses in edge functions | Code change |
| 8 | Enable Leaked Password Protection | Manual config |

Steps 1-7 can be implemented automatically. Step 8 requires manual action in the backend auth settings.

**Note:** Since the app is currently hard-locked (Coming Soon only), these vulnerabilities are not actively exploitable via the UI. However, the database and edge function endpoints remain live and accessible via direct API calls, so fixes should be applied before any re-launch.

