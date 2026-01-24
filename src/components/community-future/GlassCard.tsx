import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'holographic' | 'ambient';
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, variant = 'default', className, onClick }: GlassCardProps) {
  const variants = {
    default: `
      bg-white/70 dark:bg-slate-900/50
      backdrop-blur-xl
      border border-white/20 dark:border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.06)]
    `,
    elevated: `
      bg-white/80 dark:bg-slate-900/60
      backdrop-blur-2xl
      border border-white/30 dark:border-white/15
      shadow-[0_16px_48px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.1)_inset]
    `,
    holographic: `
      bg-gradient-to-br from-white/60 via-white/40 to-white/60
      dark:from-slate-900/60 dark:via-slate-800/40 dark:to-slate-900/60
      backdrop-blur-2xl
      border border-white/40 dark:border-white/20
      shadow-[0_8px_32px_rgba(0,150,136,0.08),0_0_60px_rgba(0,150,136,0.03)]
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
      before:opacity-0 hover:before:opacity-100
      before:transition-opacity before:duration-700
      before:pointer-events-none
    `,
    ambient: `
      bg-gradient-to-br from-slate-50/90 to-white/80
      dark:from-slate-900/70 dark:to-slate-800/60
      backdrop-blur-3xl
      border border-slate-200/50 dark:border-white/10
      shadow-[0_20px_60px_rgba(0,0,0,0.05),0_0_1px_rgba(0,0,0,0.1)]
    `
  };

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500",
        variants[variant],
        onClick && "cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
