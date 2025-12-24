import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useNavigate, Link } from "react-router-dom";
import medithoLogo from "@/assets/medithos-logo-new.png";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showBack, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/settings" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <img 
              src={medithoLogo} 
              alt="Medithos Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              MEDI<span className="text-primary">THOS</span>
            </span>
          </Link>
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button onClick={() => navigate('/profile')} className="focus:outline-none">
            <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}
