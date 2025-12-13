import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-lg" },
    md: { icon: "h-8 w-8", text: "text-xl" },
    lg: { icon: "h-12 w-12", text: "text-3xl" },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="gradient-health rounded-xl p-2">
          <Heart className={cn(sizes[size].icon, "text-primary-foreground fill-primary-foreground")} />
        </div>
        <div className="absolute -inset-1 gradient-health rounded-xl opacity-30 blur-md -z-10" />
      </div>
      {showText && (
        <span className={cn(sizes[size].text, "font-bold text-foreground tracking-tight")}>
          MEDI<span className="text-primary">THOS</span>
        </span>
      )}
    </div>
  );
}
