import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface Story {
  id: string;
  name: string;
  avatarUrl: string | null;
  hasNewStory: boolean;
  isOwn?: boolean;
  type: "doctor" | "clinic" | "hospital";
  specialty?: string;
}

interface CommunityStoryItemProps {
  story: Story;
  onClick: () => void;
}

export function CommunityStoryItem({ story, onClick }: CommunityStoryItemProps) {
  return (
    <div 
      className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
      onClick={onClick}
    >
      <div 
        className={`relative p-0.5 rounded-full ${
          story.hasNewStory 
            ? 'bg-gradient-to-tr from-primary via-accent to-primary' 
            : 'bg-border'
        }`}
      >
        <div className="bg-background p-0.5 rounded-full">
          <Avatar className="h-14 w-14 ring-2 ring-background">
            <AvatarImage src={story.avatarUrl || undefined} alt={story.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
              {story.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Add story indicator for own profile */}
        {story.isOwn && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-2 ring-background">
            <Plus className="h-3 w-3" />
          </div>
        )}
      </div>
      
      <span className="text-[10px] text-center max-w-[60px] truncate text-muted-foreground group-hover:text-foreground transition-colors">
        {story.isOwn ? 'Εσύ' : story.name.split(" ").slice(-1)[0]}
      </span>
    </div>
  );
}
