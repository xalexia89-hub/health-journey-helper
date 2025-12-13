import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showBack, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {title ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            <Logo size="sm" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
