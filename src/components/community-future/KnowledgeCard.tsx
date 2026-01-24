import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "./GlassCard";
import { PulseIndicator } from "./PulseIndicator";
import { KnowledgePost } from "./types";
import { Lightbulb, Sparkles, BookOpen, Users, Heart as HeartIcon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeCardProps {
  post: KnowledgePost;
  onResonate?: () => void;
}

const categoryConfig = {
  clinical: { icon: Lightbulb, label: 'Κλινική Γνώση', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'patient-care': { icon: HeartIcon, label: 'Φροντίδα Ασθενούς', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  'self-care': { icon: Sparkles, label: 'Αυτοφροντίδα', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  teamwork: { icon: Users, label: 'Ομαδικότητα', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  ethics: { icon: Shield, label: 'Ηθική', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' }
};

export function KnowledgeCard({ post, onResonate }: KnowledgeCardProps) {
  const category = categoryConfig[post.category];
  const CategoryIcon = category.icon;
  
  return (
    <GlassCard variant="elevated" className="overflow-hidden group">
      {/* Category accent bar */}
      <div className={cn("h-1 w-full bg-gradient-to-r", 
        post.category === 'clinical' && "from-blue-400 to-cyan-500",
        post.category === 'patient-care' && "from-rose-400 to-pink-500",
        post.category === 'self-care' && "from-violet-400 to-purple-500",
        post.category === 'teamwork' && "from-emerald-400 to-teal-500",
        post.category === 'ethics' && "from-amber-400 to-orange-500"
      )} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-11 h-11 ring-2 ring-white/50 dark:ring-white/20">
                <AvatarImage src={post.author.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                  {post.author.display_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PulseIndicator state={post.author.pulse_state} size="sm" />
              </div>
            </div>
            
            <div>
              <p className="font-medium text-foreground/90 text-sm">
                {post.author.display_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {post.author.specialty} · {post.author.hospital}
              </p>
            </div>
          </div>
          
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full", category.bg)}>
            <CategoryIcon className={cn("w-3.5 h-3.5", category.color)} />
            <span className={cn("text-xs font-medium hidden sm:inline", category.color)}>
              {category.label}
            </span>
          </div>
        </div>
        
        {/* Learning context */}
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="italic">{post.learned_from}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground/90 mb-3 leading-snug">
          {post.title}
        </h3>
        
        {/* Insight */}
        <p className="text-foreground/70 leading-relaxed text-[15px] mb-5">
          {post.insight}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/10">
          <span className="text-xs text-muted-foreground">
            {post.timestamp}
          </span>
          
          <button 
            onClick={onResonate}
            className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-blue-500 group-hover/btn:text-indigo-500 transition-colors" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {post.resonances} απήχηση
            </span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
