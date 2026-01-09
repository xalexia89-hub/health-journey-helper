import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, FileText, Stethoscope, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Αρχική" },
    { path: "/symptoms", icon: Stethoscope, label: "Συμπτώματα" },
    { path: "/records", icon: FileText, label: "Φάκελος" },
    { path: "/appointments", icon: Calendar, label: "Ραντεβού" },
    { path: "/profile", icon: User, label: "Προφίλ" },
  ];

  const handleEmergencyCall = () => {
    window.location.href = "tel:112";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb shadow-lg">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[56px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "stroke-[2.5]"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Emergency 112 button */}
        <button
          onClick={handleEmergencyCall}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[56px] text-destructive hover:text-destructive/80 active:scale-95"
          aria-label="Κλήση 112"
        >
          <div className="p-1.5 rounded-xl bg-destructive/10">
            <Phone className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold leading-tight">112</span>
        </button>
      </div>
    </nav>
  );
}
