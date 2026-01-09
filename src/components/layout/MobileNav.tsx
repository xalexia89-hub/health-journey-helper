import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, FileText, Newspaper, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", icon: Home, labelKey: "nav.home" },
    { path: "/feed", icon: Newspaper, labelKey: "nav.news" },
    { path: "/appointments", icon: Calendar, labelKey: "nav.appointments" },
    { path: "/records", icon: FileText, labelKey: "nav.records" },
  ];

  const handleEmergencyCall = () => {
    window.location.href = "tel:112";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-8 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
        {/* Emergency 112 button */}
        <button
          onClick={handleEmergencyCall}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-destructive hover:text-destructive/80"
          aria-label="Κλήση 112"
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium">112</span>
        </button>
      </div>
    </nav>
  );
}
