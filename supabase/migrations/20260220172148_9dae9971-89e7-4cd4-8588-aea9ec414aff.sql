
-- Table for connected wearable devices/services
CREATE TABLE public.wearable_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL, -- 'fitbit', 'garmin', 'apple_health', 'google_fit', 'samsung_health'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  external_user_id TEXT,
  scopes TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'idle', -- 'idle', 'syncing', 'error'
  sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Heart rate data from wearables
CREATE TABLE public.wearable_heart_rate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL, -- 'fitbit', 'garmin', etc.
  bpm INTEGER NOT NULL,
  heart_rate_type TEXT DEFAULT 'resting', -- 'resting', 'active', 'peak', 'cardio', 'fat_burn'
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Steps data from wearables
CREATE TABLE public.wearable_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  step_count INTEGER NOT NULL,
  distance_meters NUMERIC,
  calories_burned NUMERIC,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, source, date)
);

-- SpO2 / oxygen data
CREATE TABLE public.wearable_spo2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  spo2_value NUMERIC NOT NULL,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_heart_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_spo2 ENABLE ROW LEVEL SECURITY;

-- RLS: wearable_connections
CREATE POLICY "Users can manage own wearable connections"
  ON public.wearable_connections FOR ALL
  USING (auth.uid() = user_id);

-- RLS: wearable_heart_rate
CREATE POLICY "Users can manage own heart rate data"
  ON public.wearable_heart_rate FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Authorized providers can view heart rate"
  ON public.wearable_heart_rate FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), user_id));

-- RLS: wearable_steps
CREATE POLICY "Users can manage own steps data"
  ON public.wearable_steps FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Authorized providers can view steps"
  ON public.wearable_steps FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), user_id));

-- RLS: wearable_spo2
CREATE POLICY "Users can manage own spo2 data"
  ON public.wearable_spo2 FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Authorized providers can view spo2"
  ON public.wearable_spo2 FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Indexes for performance
CREATE INDEX idx_wearable_heart_rate_user_date ON public.wearable_heart_rate(user_id, measured_at DESC);
CREATE INDEX idx_wearable_steps_user_date ON public.wearable_steps(user_id, date DESC);
CREATE INDEX idx_wearable_spo2_user_date ON public.wearable_spo2(user_id, measured_at DESC);
CREATE INDEX idx_wearable_connections_user ON public.wearable_connections(user_id);

-- Update trigger for wearable_connections
CREATE TRIGGER update_wearable_connections_updated_at
  BEFORE UPDATE ON public.wearable_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
