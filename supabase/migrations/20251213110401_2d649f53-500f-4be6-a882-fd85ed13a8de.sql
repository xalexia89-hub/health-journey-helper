-- Enable realtime for appointments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create a function to create notifications when appointments change
CREATE OR REPLACE FUNCTION public.notify_appointment_changes()
RETURNS TRIGGER AS $$
DECLARE
  provider_user_id uuid;
  patient_name text;
  provider_name text;
BEGIN
  -- Get provider's user_id and name
  SELECT user_id, name INTO provider_user_id, provider_name
  FROM public.providers
  WHERE id = NEW.provider_id;

  -- Get patient name
  SELECT full_name INTO patient_name
  FROM public.profiles
  WHERE id = NEW.patient_id;

  -- Handle new appointment (notify doctor)
  IF TG_OP = 'INSERT' THEN
    IF provider_user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        provider_user_id,
        'New Appointment',
        'New appointment with ' || COALESCE(patient_name, 'a patient') || ' on ' || NEW.appointment_date::text || ' at ' || NEW.appointment_time::text,
        'appointment'
      );
    END IF;
  END IF;

  -- Handle status changes (notify patient)
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.patient_id,
      'Appointment ' || INITCAP(NEW.status::text),
      'Your appointment with ' || COALESCE(provider_name, 'your provider') || ' on ' || NEW.appointment_date::text || ' has been ' || NEW.status::text,
      'appointment'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for appointment notifications
DROP TRIGGER IF EXISTS on_appointment_change ON public.appointments;
CREATE TRIGGER on_appointment_change
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_appointment_changes();