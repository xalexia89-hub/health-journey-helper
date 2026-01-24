import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "./GlassCard";
import { PulseIndicator } from "./PulseIndicator";
import { HumanStory } from "./types";
import { Heart, Eye, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface HumanStoryCardProps {
  story: HumanStory;
  onAcknowledge?: () => void;
}

const emotionConfig = {
  hope: { emoji: '✨', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  gratitude: { emoji: '🙏', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  reflection: { emoji: '💭', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  strength: { emoji: '💪', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  compassion: { emoji: '💙', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30' }
};

export function HumanStoryCard({ story, onAcknowledge }: HumanStoryCardProps) {
  const emotion = story.emotion ? emotionConfig[story.emotion] : null;
  
  return (
    <GlassCard variant="holographic" className="p-6 group">
      {/* Ambient light effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-cyan-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {story.is_anonymous ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
              <Eye className="w-5 h-5 text-slate-500" />
            </div>
          ) : (
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-white/50 dark:ring-white/20">
                <AvatarImage src={story.author.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                  {story.author.display_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PulseIndicator state={story.author.pulse_state} size="sm" />
              </div>
            </div>
          )}
          
          <div>
            <p className="font-medium text-foreground/90">
              {story.is_anonymous ? 'Ανώνυμος Συνάδελφος' : story.author.display_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {story.is_anonymous 
                ? 'Ιατρός' 
                : `${story.author.role === 'doctor' ? 'Ιατρός' : story.author.role === 'nurse' ? 'Νοσηλευτής/ρια' : 'Επαγγελματίας Υγείας'} · ${story.author.specialty || ''}`
              }
            </p>
          </div>
        </div>
        
        {emotion && (
          <div className={cn("px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5", emotion.bg, emotion.color)}>
            <span>{emotion.emoji}</span>
            <span className="hidden sm:inline">{story.emotion}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative mb-5">
        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-teal-500/20" />
        <p className="text-foreground/85 leading-relaxed pl-5 text-[15px] font-light">
          {story.content}
        </p>
      </div>
      
      {/* Footer - Acknowledgment system instead of likes */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/10">
        <span className="text-xs text-muted-foreground">
          {story.timestamp}
        </span>
        
        <button 
          onClick={onAcknowledge}
          className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all duration-300"
        >
          <Heart className="w-4 h-4 text-slate-400 group-hover/btn:text-teal-500 transition-colors" />
          <span className="text-sm text-muted-foreground group-hover/btn:text-teal-600 dark:group-hover/btn:text-teal-400">
            {story.acknowledgments} αναγνωρίσεις
          </span>
        </button>
      </div>
    </GlassCard>
  );
}
