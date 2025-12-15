-- Create medication reminders table
CREATE TABLE public.medication_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily',
  reminder_times TIME[] NOT NULL DEFAULT '{}',
  days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reminders
CREATE POLICY "Users can view own reminders"
ON public.medication_reminders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reminders"
ON public.medication_reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
ON public.medication_reminders
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
ON public.medication_reminders
FOR DELETE
USING (auth.uid() = user_id);

-- Create medication logs table to track when medications were taken
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.medication_reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'skipped', 'missed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Users can manage their own logs
CREATE POLICY "Users can view own logs"
ON public.medication_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create logs"
ON public.medication_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs"
ON public.medication_logs
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_medication_reminders_updated_at
BEFORE UPDATE ON public.medication_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();