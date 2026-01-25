import { cn } from "@/lib/utils";
import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TabId = 'home' | 'search' | 'create' | 'reels' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  userAvatar?: string;
  userName?: string;
  className?: string;
}

export function BottomNav({ 
  activeTab, 
  onTabChange,
  userAvatar,
  userName,
  className 
}: BottomNavProps) {
  const tabs: { id: TabId; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="h-6 w-6" />, label: 'Home' },
    { id: 'search', icon: <Search className="h-6 w-6" />, label: 'Search' },
    { id: 'create', icon: <PlusSquare className="h-6 w-6" />, label: 'Create' },
    { id: 'reels', icon: <Film className="h-6 w-6" />, label: 'Reels' },
    { id: 'profile', icon: (
      <Avatar className={cn(
        "h-7 w-7",
        activeTab === 'profile' && "ring-2 ring-foreground"
      )}>
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="bg-secondary text-xs">
          {userName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    ), label: 'Profile' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50",
      className
    )}>
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center py-2 transition-all",
              activeTab === tab.id 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={tab.label}
          >
            <div className={cn(
              "transition-transform",
              activeTab === tab.id && "scale-110"
            )}>
              {tab.icon}
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
