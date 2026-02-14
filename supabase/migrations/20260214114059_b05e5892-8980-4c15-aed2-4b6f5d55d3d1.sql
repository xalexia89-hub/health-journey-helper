
-- Nutrition Profiles
CREATE TABLE public.nutrition_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dietary_pattern TEXT DEFAULT 'balanced',
  food_allergies TEXT[] DEFAULT '{}',
  food_intolerances TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  daily_calorie_target INTEGER,
  daily_water_target_ml INTEGER DEFAULT 2000,
  notes TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nutrition_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own nutrition profile" ON public.nutrition_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view nutrition profiles" ON public.nutrition_profiles FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Nutrition Logs (meals)
CREATE TABLE public.nutrition_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_type TEXT NOT NULL DEFAULT 'snack',
  meal_description TEXT,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  water_ml INTEGER,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own nutrition logs" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view nutrition logs" ON public.nutrition_logs FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Physical Activity Profiles
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER,
  intensity TEXT DEFAULT 'moderate',
  calories_burned INTEGER,
  heart_rate_avg INTEGER,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own activity logs" ON public.activity_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view activity logs" ON public.activity_logs FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Sleep Pattern Logs
CREATE TABLE public.sleep_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sleep_start TIMESTAMPTZ,
  sleep_end TIMESTAMPTZ,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 10),
  interruptions INTEGER DEFAULT 0,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sleep logs" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view sleep logs" ON public.sleep_logs FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Stress Indicators
CREATE TABLE public.stress_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  triggers TEXT[] DEFAULT '{}',
  physical_symptoms TEXT[] DEFAULT '{}',
  coping_methods TEXT[] DEFAULT '{}',
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stress_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stress logs" ON public.stress_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view stress logs" ON public.stress_logs FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Preventive Screening Timeline
CREATE TABLE public.preventive_screenings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  screening_type TEXT NOT NULL,
  recommended_date DATE,
  completed_date DATE,
  result TEXT,
  provider_name TEXT,
  next_due DATE,
  risk_level TEXT DEFAULT 'normal',
  ai_recommended BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.preventive_screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own screenings" ON public.preventive_screenings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view screenings" ON public.preventive_screenings FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Preventive Insights (AI-generated)
CREATE TABLE public.preventive_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'info',
  data_sources TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.preventive_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own insights" ON public.preventive_insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authorized providers can view insights" ON public.preventive_insights FOR SELECT USING (can_access_patient_medical_data(auth.uid(), user_id));

-- Preventive Chat Messages
CREATE TABLE public.preventive_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.preventive_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chat messages" ON public.preventive_chat_messages FOR ALL USING (auth.uid() = user_id);
