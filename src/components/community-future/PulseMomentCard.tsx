import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "./GlassCard";
import { PulseIndicator } from "./PulseIndicator";
import { PulseMoment } from "./types";
import { cn } from "@/lib/utils";

interface PulseMomentCardProps {
  moment: PulseMoment;
  onSupport?: () => void;
}

const pulseTypeConfig = {
  breathing: {
    label: 'Αναπνέει',
    icon: '🌬️',
    message: 'Αφιερώνει χρόνο να αναπνεύσει',
    gradient: 'from-sky-400 to-cyan-500',
    bgGradient: 'from-sky-50/50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/20',
    animation: 'animate-[pulse_4s_ease-in-out_infinite]'
  },
  present: {
    label: 'Παρών/ούσα',
    icon: '🕯️',
    message: 'Είναι παρών/ούσα σε αυτή τη στιγμή',
    gradient: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20',
    animation: 'animate-[pulse_3s_ease-in-out_infinite]'
  },
  grateful: {
    label: 'Ευγνώμων',
    icon: '🙏',
    message: 'Νιώθει ευγνωμοσύνη',
    gradient: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20',
    animation: 'animate-[pulse_2.5s_ease-in-out_infinite]'
  },
  'holding-space': {
    label: 'Κρατάει Χώρο',
    icon: '💫',
    message: 'Κρατάει χώρο για κάποιον',
    gradient: 'from-violet-400 to-purple-500',
    bgGradient: 'from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20',
    animation: 'animate-[pulse_3.5s_ease-in-out_infinite]'
  }
};

export function PulseMomentCard({ moment, onSupport }: PulseMomentCardProps) {
  const config = pulseTypeConfig[moment.pulse_type];
  
  return (
    <GlassCard 
      variant="default" 
      className={cn(
        "p-5 relative overflow-hidden border-2",
        moment.pulse_type === 'breathing' && "border-sky-200/50 dark:border-sky-800/30",
        moment.pulse_type === 'present' && "border-amber-200/50 dark:border-amber-800/30",
        moment.pulse_type === 'grateful' && "border-emerald-200/50 dark:border-emerald-800/30",
        moment.pulse_type === 'holding-space' && "border-violet-200/50 dark:border-violet-800/30"
      )}
    >
      {/* Ambient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        config.bgGradient
      )} />
      
      {/* Pulsing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className={cn(
          "w-32 h-32 rounded-full bg-gradient-to-r opacity-10 blur-2xl",
          config.gradient,
          config.animation
        )} />
      </div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-white/20">
                <AvatarImage src={moment.author.avatar_url} />
                <AvatarFallback className={cn("bg-gradient-to-r text-white text-sm", config.gradient)}>
                  {moment.author.display_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PulseIndicator state="present" size="sm" />
              </div>
            </div>
            
            <div>
              <p className="font-medium text-foreground/90 text-sm">
                {moment.author.display_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {moment.author.role === 'doctor' ? 'Ιατρός' : moment.author.role === 'nurse' ? 'Νοσηλευτής/ρια' : 'Επαγγελματίας Υγείας'}
              </p>
            </div>
          </div>
          
          <div className="text-3xl">{config.icon}</div>
        </div>
        
        {/* Pulse state */}
        <div className="text-center py-6">
          <p className={cn(
            "text-lg font-light bg-gradient-to-r bg-clip-text text-transparent",
            config.gradient
          )}>
            {config.message}
          </p>
          
          {moment.message && (
            <p className="mt-3 text-sm text-muted-foreground italic">
              "{moment.message}"
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>για {moment.duration_minutes} λεπτά</span>
          </div>
        </div>
        
        {/* Support action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/30 dark:border-white/5">
          <span className="text-xs text-muted-foreground">
            {moment.timestamp}
          </span>
          
          <button 
            onClick={onSupport}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              "bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20"
            )}
          >
            <span className="text-lg">🤝</span>
            <span className="text-sm text-foreground/70">
              {moment.supporters} υποστηρίζουν
            </span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
