import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "./GlassCard";
import { PulseIndicator } from "./PulseIndicator";
import { MissionReel } from "./types";
import { Play, Eye, Mic, Quote, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MissionReelCardProps {
  reel: MissionReel;
  onWitness?: () => void;
}

const themeConfig = {
  'why-medicine': { 
    label: 'Γιατί η Ιατρική', 
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30'
  },
  'carrying-lives': { 
    label: 'Κρατώντας Ζωές', 
    gradient: 'from-rose-500 via-pink-500 to-purple-500',
    bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30'
  },
  'moments-that-matter': { 
    label: 'Στιγμές που Μετρούν', 
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
  },
  'the-calling': { 
    label: 'Το Κάλεσμα', 
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30'
  }
};

export function MissionReelCard({ reel, onWitness }: MissionReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = themeConfig[reel.theme];
  
  return (
    <GlassCard variant="ambient" className="overflow-hidden group">
      {/* Video/Audio preview area */}
      <div 
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br cursor-pointer overflow-hidden",
          theme.bgGradient
        )}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,150,136,0.2)_0%,transparent_50%)]" />
        </div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "w-16 h-16 rounded-full bg-white/90 dark:bg-white/80 shadow-xl flex items-center justify-center transition-transform duration-300",
            "group-hover:scale-110"
          )}>
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-slate-700 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
                <div className="w-1 h-6 bg-slate-700 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
                <div className="w-1 h-6 bg-slate-700 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
              </div>
            ) : (
              <Play className="w-7 h-7 text-slate-700 ml-1" />
            )}
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
          {reel.duration_seconds}s
        </div>
        
        {/* Theme badge */}
        <div className={cn(
          "absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm",
          "text-xs font-medium flex items-center gap-1.5"
        )}>
          <Mic className="w-3 h-3 text-slate-600" />
          <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", theme.gradient)}>
            {theme.label}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-white/20">
              <AvatarImage src={reel.author.avatar_url} />
              <AvatarFallback className={cn("bg-gradient-to-r text-white text-sm", theme.gradient)}>
                {reel.author.display_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5">
              <PulseIndicator state={reel.author.pulse_state} size="sm" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground/90 text-sm">
                {reel.author.display_name}
              </p>
              {reel.author.is_verified && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {reel.author.years_of_service} χρόνια υπηρεσίας
            </p>
          </div>
        </div>
        
        {/* Transcript preview */}
        <div className="relative mb-4">
          <Quote className="absolute -top-0.5 -left-1 w-4 h-4 text-slate-300 dark:text-slate-600" />
          <p className="text-foreground/70 text-sm leading-relaxed pl-4 line-clamp-3 italic">
            "{reel.transcript}"
          </p>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/10">
          <span className="text-xs text-muted-foreground">
            {reel.timestamp}
          </span>
          
          <button 
            onClick={onWitness}
            className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all duration-300"
          >
            <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-teal-500 transition-colors" />
            <span className="text-sm text-muted-foreground group-hover/btn:text-teal-600 dark:group-hover/btn:text-teal-400">
              {reel.witnessed_by} μάρτυρες
            </span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
