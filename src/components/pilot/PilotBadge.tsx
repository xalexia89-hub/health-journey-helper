import { FlaskConical, TestTube2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PilotBadgeProps {
  variant?: "header" | "corner" | "inline";
  className?: string;
}

export function PilotBadge({ variant = "header", className = "" }: PilotBadgeProps) {
  const BadgeContent = () => (
    <Badge 
      variant="outline" 
      className="bg-warning/10 text-warning border-warning/30 gap-1"
    >
      <FlaskConical className="h-3 w-3" />
      <span className="text-xs font-medium">PILOT</span>
    </Badge>
  );

  if (variant === "corner") {
    return (
      <div className={`fixed top-16 right-4 z-40 ${className}`}>
        <Tooltip>
          <TooltipTrigger>
            <BadgeContent />
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Πιλοτική Έκδοση - Δοκιμαστική Χρήση</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <TestTube2 className="h-3.5 w-3.5 text-warning" />
        <span className="text-xs text-warning font-medium">Pilot Version</span>
      </div>
    );
  }

  // Header variant (default)
  return (
    <Tooltip>
      <TooltipTrigger>
        <BadgeContent />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Πιλοτική Έκδοση - Δοκιμαστική Χρήση</p>
      </TooltipContent>
    </Tooltip>
  );
}
