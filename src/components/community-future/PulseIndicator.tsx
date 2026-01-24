import { cn } from "@/lib/utils";
import { PulseState } from "./types";

interface PulseIndicatorProps {
  state: PulseState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const pulseConfig: Record<PulseState, { color: string; label: string; animation: string }> = {
  present: {
    color: 'from-teal-400 to-cyan-500',
    label: 'Παρών/ούσα',
    animation: 'animate-pulse'
  },
  focused: {
    color: 'from-blue-500 to-indigo-600',
    label: 'Εστιασμένος/η',
    animation: 'animate-[pulse_1.5s_ease-in-out_infinite]'
  },
  reflecting: {
    color: 'from-violet-400 to-purple-500',
    label: 'Σε στοχασμό',
    animation: 'animate-[pulse_3s_ease-in-out_infinite]'
  },
  supporting: {
    color: 'from-emerald-400 to-teal-500',
    label: 'Υποστηρίζει',
    animation: 'animate-[pulse_2s_ease-in-out_infinite]'
  },
  resting: {
    color: 'from-slate-400 to-gray-500',
    label: 'Σε ανάπαυση',
    animation: ''
  }
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

export function PulseIndicator({ state, size = 'md', showLabel = false, className }: PulseIndicatorProps) {
  const config = pulseConfig[state];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Outer glow */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r opacity-40 blur-sm",
            config.color,
            config.animation,
            sizeClasses[size]
          )}
          style={{ transform: 'scale(1.5)' }}
        />
        
        {/* Core pulse */}
        <div 
          className={cn(
            "relative rounded-full bg-gradient-to-r",
            config.color,
            config.animation,
            sizeClasses[size]
          )}
        />
        
        {/* Inner light */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-white/30",
            sizeClasses[size]
          )}
          style={{ transform: 'scale(0.5)' }}
        />
      </div>
      
      {showLabel && (
        <span className="text-xs text-muted-foreground font-light tracking-wide">
          {config.label}
        </span>
      )}
    </div>
  );
}
