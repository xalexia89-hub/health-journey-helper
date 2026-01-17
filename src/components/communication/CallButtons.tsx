import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video } from 'lucide-react';
import { CallDialog } from './CallDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CallButtonsProps {
  providerId: string;
  providerName: string;
  providerAvatar?: string | null;
  providerSpecialty?: string | null;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export const CallButtons = ({
  providerId,
  providerName,
  providerAvatar,
  providerSpecialty,
  variant = 'default',
  className
}: CallButtonsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');

  const handleCall = (type: 'voice' | 'video') => {
    if (!user) {
      toast({
        title: 'Απαιτείται Σύνδεση',
        description: 'Παρακαλώ συνδεθείτε για να πραγματοποιήσετε κλήση.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    
    setCallType(type);
    setShowCallDialog(true);
  };

  if (variant === 'icon-only') {
    return (
      <>
        <div className={className}>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-primary/30 hover:bg-primary/10"
            onClick={() => handleCall('voice')}
            title="Φωνητική Κλήση"
          >
            <Phone className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-primary/30 hover:bg-primary/10"
            onClick={() => handleCall('video')}
            title="Βιντεοκλήση"
          >
            <Video className="h-4 w-4 text-primary" />
          </Button>
        </div>

        <CallDialog
          open={showCallDialog}
          onOpenChange={setShowCallDialog}
          providerName={providerName}
          providerAvatar={providerAvatar}
          providerSpecialty={providerSpecialty}
          callType={callType}
        />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <div className={className}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => handleCall('voice')}
          >
            <Phone className="h-3.5 w-3.5" />
            Κλήση
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => handleCall('video')}
          >
            <Video className="h-3.5 w-3.5" />
            Video
          </Button>
        </div>

        <CallDialog
          open={showCallDialog}
          onOpenChange={setShowCallDialog}
          providerName={providerName}
          providerAvatar={providerAvatar}
          providerSpecialty={providerSpecialty}
          callType={callType}
        />
      </>
    );
  }

  // Default variant
  return (
    <>
      <div className={className}>
        <Button
          variant="outline"
          className="flex-1 gap-2 h-12"
          onClick={() => handleCall('voice')}
        >
          <Phone className="h-5 w-5" />
          <span>Φωνητική Κλήση</span>
        </Button>
        <Button
          className="flex-1 gap-2 h-12 bg-primary"
          onClick={() => handleCall('video')}
        >
          <Video className="h-5 w-5" />
          <span>Βιντεοκλήση</span>
        </Button>
      </div>

      <CallDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        providerName={providerName}
        providerAvatar={providerAvatar}
        providerSpecialty={providerSpecialty}
        callType={callType}
      />
    </>
  );
};
