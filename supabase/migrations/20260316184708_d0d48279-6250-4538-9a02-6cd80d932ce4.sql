-- Fix medical_documents broken INSERT policy for doctors
DROP POLICY IF EXISTS "Doctors can add documents for shared patients" ON medical_documents;

CREATE POLICY "Doctors can add documents for shared patients"
ON medical_documents
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM medical_record_shares mrs
    JOIN providers p ON mrs.provider_id = p.id
    WHERE mrs.patient_id = medical_documents.user_id
      AND p.user_id = auth.uid()
      AND mrs.is_active = true
  )
);

-- Restrict pilot_settings SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view settings" ON pilot_settings;

CREATE POLICY "Authenticated users can view settings"
ON pilot_settings
FOR SELECT
TO authenticated
USING (true);

-- Restrict reviews SELECT to authenticated users
DROP POLICY IF EXISTS "Everyone can view reviews" ON reviews;

CREATE POLICY "Authenticated users can view reviews"
ON reviews
FOR SELECT
TO authenticated
USING (true);

-- Restrict academy_publications public SELECT to authenticated users
DROP POLICY IF EXISTS "Everyone can view published publications" ON academy_publications;

CREATE POLICY "Authenticated users can view published publications"
ON academy_publications
FOR SELECT
TO authenticated
USING (status = 'published'::academy_content_status);

-- Restrict availability_slots public SELECT to authenticated users
DROP POLICY IF EXISTS "Everyone can view active slots" ON availability_slots;

CREATE POLICY "Authenticated users can view active slots"
ON availability_slots
FOR SELECT
TO authenticated
USING (is_active = true);