import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  linkTo?: string;
}

export function Logo({ className, size = "md", showText = true, linkTo = "/settings" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-5 w-5", text: "text-lg", container: "p-1.5" },
    md: { icon: "h-6 w-6", text: "text-xl", container: "p-2" },
    lg: { icon: "h-10 w-10", text: "text-3xl", container: "p-3" },
  };

  const content = (
    <>
      <div className="relative">
        <div className={cn("gradient-health rounded-xl", sizes[size].container)}>
          <Stethoscope className={cn(sizes[size].icon, "text-primary-foreground")} />
        </div>
        <div className="absolute -inset-1 gradient-health rounded-xl opacity-40 blur-lg -z-10" />
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