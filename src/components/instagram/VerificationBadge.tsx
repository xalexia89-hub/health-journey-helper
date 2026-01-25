import { cn } from "@/lib/utils";
import { BadgeCheck, Shield, Building2, Stethoscope, HeartPulse } from "lucide-react";
import type { ProfileType, VerificationStatus } from "./types";

interface VerificationBadgeProps {
  type: ProfileType;
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function VerificationBadge({ 
  type, 
  status, 
  size = 'md', 
  showLabel = false,
  className 
}: VerificationBadgeProps) {
  if (status === 'unverified') return null;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const containerSizes = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  const getIcon = () => {
    if (status === 'pending') {
      return <Shield className={cn(sizeClasses[size], "text-warning")} />;
    }
    
    switch (type) {
      case 'hospital':
        return <Building2 className={cn(sizeClasses[size], "text-primary")} />;
      case 'clinic':
        return <Building2 className={cn(sizeClasses[size], "text-accent")} />;
      case 'nurse':
        return <HeartPulse className={cn(sizeClasses[size], "text-health-coral")} />;
      case 'doctor':
      default:
        return <BadgeCheck className={cn(sizeClasses[size], "text-primary")} />;
    }
  };

  const getLabel = () => {
    if (status === 'pending') return 'Pending';
    
    switch (type) {
      case 'hospital': return 'Hospital';
      case 'clinic': return 'Clinic';
      case 'nurse': return 'Nurse';
      case 'doctor': return 'Doctor';
      default: return 'Verified';
    }
  };

  return (
    <div className={cn(
      "inline-flex items-center",
      containerSizes[size],
      className
    )}>
      <div className={cn(
        "flex items-center justify-center",
        status === 'verified' && "drop-shadow-[0_0_3px_hsl(var(--primary)/0.5)]"
      )}>
        {getIcon()}
      </div>
      {showLabel && (
        <span className={cn(
          "text-muted-foreground",
          size === 'sm' && "text-[10px]",
          size === 'md' && "text-xs",
          size === 'lg' && "text-sm"
        )}>
          {getLabel()}
        </span>
      )}
    </div>
  );
}
