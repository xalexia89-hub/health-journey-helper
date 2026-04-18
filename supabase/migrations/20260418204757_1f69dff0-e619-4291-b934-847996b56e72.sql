-- AI analysis results for medical documents
CREATE TABLE public.medical_document_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES public.medical_documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  document_kind TEXT,
  summary TEXT,
  plain_explanation TEXT,
  extracted_values JSONB DEFAULT '[]'::jsonb,
  flags JSONB DEFAULT '[]'::jsonb,
  recommendations TEXT[] DEFAULT '{}',
  disclaimer TEXT DEFAULT 'Αυτή η ανάλυση είναι πληροφοριακή και ΔΕΝ αποτελεί ιατρική διάγνωση. Συμβουλευτείτε πάντα γιατρό.',
  ai_model TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id)
);

CREATE INDEX idx_mda_user ON public.medical_document_analyses(user_id, created_at DESC);
CREATE INDEX idx_mda_doc ON public.medical_document_analyses(document_id);

ALTER TABLE public.medical_document_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON public.medical_document_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.medical_document_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON public.medical_document_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.medical_document_analyses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Authorized providers can view analyses"
  ON public.medical_document_analyses FOR SELECT
  USING (public.can_access_patient_medical_data(auth.uid(), user_id));

CREATE TRIGGER trg_mda_updated_at
  BEFORE UPDATE ON public.medical_document_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();