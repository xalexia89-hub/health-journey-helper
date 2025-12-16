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
      <div className="relative">
        <img 
          src={medithoLogo} 
          alt="Medithos Logo" 
          className={cn(sizes[size].icon, "rounded-lg object-contain")}
        />
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-lg blur-lg -z-10" />
      </div>
      {showText && (
        <span className={cn(sizes[size].text, "font-semibold text-foreground tracking-wide")}>
          MEDI<span className="text-accent">THOS</span>
        </span>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={cn("flex items-center gap-3 hover:opacity-80 transition-opacity", className)}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {content}
    </div>
  );
}
