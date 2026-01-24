import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

type AuditAction = 'view' | 'upload' | 'edit' | 'delete' | 'share' | 'revoke_share' | 'download';
type ResourceType = 'medical_entry' | 'attachment' | 'access_grant';

export const useMedicalAuditLog = () => {
  const { user } = useAuth();

  const logAction = async (
    action: AuditAction,
    patientUserId: string,
    resourceType: ResourceType,
    resourceId?: string,
    metadata?: Record<string, string | number | boolean | null>
  ) => {
    if (!user) return;

    try {
      await supabase.from('medical_audit_logs').insert([{
        user_id: user.id,
        patient_user_id: patientUserId,
        action_type: action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        metadata: (metadata || {}) as Json,
      }]);
    } catch (error) {
      console.error('Failed to log medical audit action:', error);
    }
  };

  return { logAction };
};
