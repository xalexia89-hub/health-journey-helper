import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, Send, PlusSquare, Search, Compass } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface FeedHeaderProps {
  notificationCount?: number;
  onNotificationsClick: () => void;
  onMessagesClick: () => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  onExploreClick: () => void;
  className?: string;
}

export function FeedHeader({ 
  notificationCount = 0,
  onNotificationsClick,
  onMessagesClick,
  onCreateClick,
  onSearchClick,
  onExploreClick,
  className 
}: FeedHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 glass-strong border-b border-border/50",
      className
    )}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo size="sm" showText={false} />
          <span className="font-bold text-lg text-gradient-neon">Medithos</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onCreateClick}
          >
            <PlusSquare className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onSearchClick}
          >
            <Search className="h-6 w-6" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative"
            onClick={onNotificationsClick}
          >
            <Heart className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onMessagesClick}
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
