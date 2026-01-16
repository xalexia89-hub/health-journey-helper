import { Search, Bell, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CommunityHeaderProps {
  onSearch?: (query: string) => void;
  onCreatePost?: () => void;
  unreadNotifications?: number;
}

export function CommunityHeader({ onSearch, onCreatePost, unreadNotifications = 0 }: CommunityHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="Αναζήτηση στην κοινότητα..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-9 text-sm"
              autoFocus
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            >
              Ακύρωση
            </Button>
          </form>
        ) : (
          <>
            <h1 className="text-lg font-bold text-foreground">Κοινότητα</h1>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              
              {onCreatePost && (
                <Button 
                  size="sm"
                  className="h-9 gap-1.5 text-xs"
                  onClick={onCreatePost}
                >
                  <PenSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Δημοσίευση</span>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
