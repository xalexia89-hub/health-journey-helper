import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Radio } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import type { StoryGroup } from "./types";

interface StoriesBarProps {
  stories: StoryGroup[];
  onStoryClick: (groupIndex: number) => void;
  onAddStory: () => void;
  currentUserAvatar?: string;
  className?: string;
}

export function StoriesBar({ 
  stories, 
  onStoryClick, 
  onAddStory,
  currentUserAvatar,
  className 
}: StoriesBarProps) {
  return (
    <div className={cn(
      "w-full overflow-x-auto scrollbar-hide py-3",
      className
    )}>
      <div className="flex gap-3 px-4 min-w-max">
        {/* Add Story Button */}
        <div 
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
          onClick={onAddStory}
        >
          <div className="relative">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-muted to-muted/50">
              <div className="bg-background p-0.5 rounded-full">
                <Avatar className="h-[68px] w-[68px] ring-2 ring-background">
                  <AvatarImage src={currentUserAvatar} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                    You
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-2 ring-background shadow-glow">
              <Plus className="h-4 w-4" />
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
            Your Story
          </span>
        </div>

        {/* Story Groups */}
        {stories.map((group, index) => (
          <div 
            key={group.profile.id}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
            onClick={() => onStoryClick(index)}
          >
            <div className="relative">
              {/* Gradient Ring for unseen stories */}
              <div className={cn(
                "p-0.5 rounded-full transition-all duration-300",
                group.has_unseen 
                  ? "bg-gradient-to-tr from-primary via-accent to-neon-purple shadow-glow" 
                  : "bg-border",
                group.is_live && "animate-pulse"
              )}>
                <div className="bg-background p-0.5 rounded-full">
                  <Avatar className="h-[68px] w-[68px] ring-2 ring-background">
                    <AvatarImage 
                      src={group.profile.avatar_url} 
                      alt={group.profile.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                      {group.profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Live Indicator */}
              {group.is_live && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-sm bg-destructive text-destructive-foreground flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide">
                  <Radio className="h-2 w-2 animate-pulse" />
                  Live
                </div>
              )}

              {/* Verification Badge */}
              {group.profile.verification_status === 'verified' && (
                <div className="absolute -top-0.5 -right-0.5">
                  <VerificationBadge 
                    type={group.profile.type} 
                    status="verified" 
                    size="sm" 
                  />
                </div>
              )}
            </div>

            <span className={cn(
              "text-[11px] text-center max-w-[70px] truncate transition-colors",
              group.has_unseen 
                ? "text-foreground font-medium" 
                : "text-muted-foreground",
              "group-hover:text-foreground"
            )}>
              {group.profile.type === 'hospital' 
                ? group.profile.name.split(' ')[0] 
                : group.profile.name.split(' ').slice(-1)[0]
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
