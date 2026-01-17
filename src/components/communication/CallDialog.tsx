import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Volume2,
  Maximize2,
  MessageSquare,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  providerAvatar?: string | null;
  providerSpecialty?: string | null;
  callType: 'voice' | 'video';
}

type CallState = 'connecting' | 'ringing' | 'connected' | 'ended';

export const CallDialog = ({
  open,
  onOpenChange,
  providerName,
  providerAvatar,
  providerSpecialty,
  callType
}: CallDialogProps) => {
  const [callState, setCallState] = useState<CallState>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Simulate call connection flow
  useEffect(() => {
    if (open) {
      setCallState('connecting');
      setCallDuration(0);
      
      // Simulate connection delay
      const connectTimer = setTimeout(() => {
        setCallState('ringing');
      }, 1500);

      // Simulate answer after ringing
      const answerTimer = setTimeout(() => {
        setCallState('connected');
      }, 4500);

      return () => {
        clearTimeout(connectTimer);
        clearTimeout(answerTimer);
      };
    }
  }, [open]);

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState]);

  // Demo: Try to get user camera for video calls
  useEffect(() => {
    if (open && callType === 'video' && callState === 'connected' && !isVideoOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Camera not available for demo:', err);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [open, callType, callState, isVideoOff]);

  const handleEndCall = () => {
    setCallState('ended');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStateText = () => {
    switch (callState) {
      case 'connecting':
        return 'Σύνδεση...';
      case 'ringing':
        return 'Καλεί...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Η κλήση τερματίστηκε';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 gap-0 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {callType === 'video' ? 'Βιντεοκλήση' : 'Φωνητική Κλήση'} με {providerName}
          </DialogTitle>
        </DialogHeader>

        {/* Main Call Area */}
        <div className="relative aspect-[4/3] md:aspect-video bg-slate-900 flex items-center justify-center">
          
          {/* Video Background for video calls when connected */}
          {callType === 'video' && callState === 'connected' && !isVideoOff && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900">
              {/* Simulated provider video - would be real video stream in production */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="h-32 w-32 mx-auto border-4 border-white/20">
                    <AvatarImage src={providerAvatar || undefined} />
                    <AvatarFallback className="text-4xl bg-primary/30 text-white">
                      {providerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          )}

          {/* Provider Info - Center */}
          <div className="relative z-10 text-center text-white">
            {(callType === 'voice' || callState !== 'connected' || isVideoOff) && (
              <Avatar className={cn(
                "mx-auto border-4 border-white/20 mb-4 transition-all",
                callState === 'ringing' && "animate-pulse",
                callState === 'connected' ? "h-24 w-24" : "h-28 w-28"
              )}>
                <AvatarImage src={providerAvatar || undefined} />
                <AvatarFallback className="text-4xl bg-primary/30 text-white">
                  {providerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <h2 className="text-xl font-semibold mb-1">{providerName}</h2>
            {providerSpecialty && (
              <p className="text-white/70 text-sm mb-2">{providerSpecialty}</p>
            )}
            
            <div className={cn(
              "text-lg font-medium",
              callState === 'connecting' && "text-yellow-400",
              callState === 'ringing' && "text-green-400 animate-pulse",
              callState === 'connected' && "text-green-400",
              callState === 'ended' && "text-red-400"
            )}>
              {getCallStateText()}
            </div>

            {/* Encryption Badge */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-white/50 text-xs">
              <Shield className="h-3 w-3" />
              <span>Κρυπτογραφημένη σύνδεση</span>
            </div>
          </div>

          {/* Self Video Preview for video calls */}
          {callType === 'video' && callState === 'connected' && !isVideoOff && (
            <div className="absolute bottom-4 right-4 w-28 h-20 md:w-36 md:h-28 rounded-lg overflow-hidden border-2 border-white/30 bg-slate-800 shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!videoRef.current?.srcObject && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                  <Video className="h-6 w-6 text-white/50" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="bg-slate-800/90 backdrop-blur px-6 py-5">
          <div className="flex items-center justify-center gap-4">
            {/* Mute Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-14 w-14 rounded-full transition-all",
                isMuted 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            {/* Video Toggle - Only for video calls */}
            {callType === 'video' && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-14 w-14 rounded-full transition-all",
                  isVideoOff 
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </Button>
            )}

            {/* End Call Button */}
            <Button
              variant="destructive"
              size="icon"
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-7 w-7" />
            </Button>

            {/* Speaker Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-14 w-14 rounded-full transition-all",
                !isSpeakerOn 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <Volume2 className="h-6 w-6" />
            </Button>

            {/* Fullscreen for video calls */}
            {callType === 'video' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <Maximize2 className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Demo Notice */}
          <p className="text-center text-white/40 text-xs mt-4">
            Demo Mode - Σε πραγματική χρήση θα συνδεθείτε με τον ιατρό σας
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
