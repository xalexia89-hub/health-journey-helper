import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import medithoLogo from "@/assets/medithos-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  linkTo?: string;
}

export function Logo({ className, size = "md", showText = true, linkTo = "/settings" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-xl" },
    lg: { icon: "h-14 w-14", text: "text-3xl" },
  };

  const content = (
    <>
      {/* Diamond Glow Effect */}
      <div className="relative group">
        {/* Outer diamond glow */}
        <div className="absolute -inset-3 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur-xl opacity-70 animate-[glowPulse_2s_ease-in-out_infinite]" />
        
        {/* Logo with diamond shine */}
        <img 
          src={medithoLogo} 
          alt="Medithos Logo" 
          className={cn(
            sizes[size].icon, 
            "rounded-lg object-contain relative z-10",
            "drop-shadow-[0_0_15px_hsl(var(--primary))]",
            "group-hover:drop-shadow-[0_0_25px_hsl(var(--primary))]",
            "transition-all duration-300"
          )}
        />
      </div>
      
      {showText && (
        <span className={cn(
          sizes[size].text, 
          "font-bold tracking-wider",
          "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent",
          "drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
          "animate-[glowPulse_2s_ease-in-out_infinite]"
        )}>
          MEDI<span className="text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]">THOS</span>
        </span>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={cn("flex items-center gap-4 hover:scale-105 transition-transform duration-300", className)}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {content}
    </div>
  );
}
