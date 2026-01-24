import { cn } from "@/lib/utils";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";

interface CreatePulseButtonProps {
  onClick: () => void;
}

export function CreatePulseButton({ onClick }: CreatePulseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-24 right-4 z-40",
        "w-14 h-14 rounded-2xl",
        "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
        "shadow-[0_8px_32px_rgba(0,150,136,0.4)]",
        "flex items-center justify-center",
        "transition-all duration-500 ease-out",
        "hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,150,136,0.5)]",
        "active:scale-95",
        "group"
      )}
    >
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 blur-lg opacity-0 transition-opacity duration-500",
        isHovered && "opacity-50"
      )} />
      
      {/* Inner ring */}
      <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
      
      {/* Icon */}
      <div className="relative">
        {isHovered ? (
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </div>
      
      {/* Pulse rings */}
      <div className={cn(
        "absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping",
        !isHovered && "opacity-0"
      )} />
    </button>
  );
}
