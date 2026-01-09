import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type AccessAction = 'view_patient' | 'view_medical_record' | 'view_appointment' | 'view_symptom_intake' | 'update_appointment';

export const useDoctorAccessLog = () => {
  const { user } = useAuth();

  const logAccess = async (
    action: AccessAction,
    patientUserId: string,
    resourceType: 'patient' | 'appointment' | 'medical_record' | 'symptom_intake',
    resourceId?: string
  ) => {
    if (!user) return;

    try {
      await supabase.from('doctor_access_logs').insert({
        doctor_user_id: user.id,
        patient_user_id: patientUserId,
        access_type: action,
        resource_type: resourceType,
        resource_id: resourceId || null
      });
    } catch (error) {
      console.error('Failed to log access:', error);
    }
  };

  return { logAccess };
};

