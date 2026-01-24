import { cn } from "@/lib/utils";
import { Heart, Lightbulb, Radio, Sparkles, Menu } from "lucide-react";
import { PostCategory } from "./types";
import { PulseIndicator } from "./PulseIndicator";

interface CommunityNavProps {
  activeCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  onMenuClick?: () => void;
}

const categories = [
  { id: 'all' as const, label: 'Όλα', icon: Menu, gradient: 'from-slate-400 to-slate-500' },
  { id: 'human-story' as const, label: 'Ιστορίες', icon: Heart, gradient: 'from-rose-400 to-pink-500' },
  { id: 'knowledge' as const, label: 'Γνώση', icon: Lightbulb, gradient: 'from-blue-400 to-indigo-500' },
  { id: 'mission-reel' as const, label: 'Αποστολή', icon: Radio, gradient: 'from-violet-400 to-purple-500' },
  { id: 'pulse-moment' as const, label: 'Παλμός', icon: Sparkles, gradient: 'from-teal-400 to-cyan-500' },
];

export function CommunityNav({ activeCategory, onCategoryChange }: CommunityNavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/10">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PulseIndicator state="present" size="sm" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                Κοινότητα
              </h1>
              <p className="text-xs text-muted-foreground">
                128 ενεργοί τώρα
              </p>
            </div>
          </div>
          
          {/* My pulse indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100/80 dark:bg-white/5">
            <PulseIndicator state="present" size="md" showLabel />
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300",
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : "bg-slate-100/80 dark:bg-white/5 text-muted-foreground hover:bg-slate-200/80 dark:hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
