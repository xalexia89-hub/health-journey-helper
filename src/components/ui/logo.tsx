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
    sm: { icon: "h-8 w-8", text: "text-lg", frame: "p-2" },
    md: { icon: "h-10 w-10", text: "text-xl", frame: "p-2.5" },
    lg: { icon: "h-14 w-14", text: "text-3xl", frame: "p-3" },
  };

  const content = (
    <>
      {/* Futuristic Frame with Glow */}
      <div className="relative group">
        {/* Outer glow ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        
        {/* Animated border frame */}
        <div className={cn(
          "relative rounded-xl bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-primary/50",
          sizes[size].frame,
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:animate-[shimmer_2s_infinite]",
          "after:absolute after:-inset-[1px] after:rounded-xl after:bg-gradient-to-r after:from-primary/0 after:via-primary/50 after:to-primary/0 after:blur-sm after:animate-[scan_3s_infinite]"
        )}>
          {/* Inner container with logo */}
          <div className="relative z-10">
            <img 
              src={medithoLogo} 
              alt="Medithos Logo" 
              className={cn(
                sizes[size].icon, 
                "rounded-lg object-contain",
                "drop-shadow-[0_0_10px_hsl(var(--primary)/0.8)]",
                "group-hover:drop-shadow-[0_0_20px_hsl(var(--primary))]",
                "transition-all duration-300",
                "animate-[float_4s_ease-in-out_infinite]"
              )}
            />
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary rounded-br-lg" />
        </div>
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
