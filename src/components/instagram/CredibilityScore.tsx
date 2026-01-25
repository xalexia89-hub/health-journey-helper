import { cn } from "@/lib/utils";
import { TrendingUp, Award, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CredibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTrend?: boolean;
  className?: string;
}

export function CredibilityScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  showTrend = false,
  className 
}: CredibilityScoreProps) {
  const getScoreColor = () => {
    if (score >= 90) return 'text-primary';
    if (score >= 75) return 'text-accent';
    if (score >= 50) return 'text-success';
    if (score >= 25) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getScoreGlow = () => {
    if (score >= 90) return 'drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]';
    if (score >= 75) return 'drop-shadow-[0_0_4px_hsl(var(--accent)/0.5)]';
    return '';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Expert';
    if (score >= 75) return 'Trusted';
    if (score >= 50) return 'Established';
    if (score >= 25) return 'Growing';
    return 'New';
  };

  const sizeClasses = {
    sm: { icon: 'h-3 w-3', text: 'text-xs', container: 'gap-1' },
    md: { icon: 'h-4 w-4', text: 'text-sm', container: 'gap-1.5' },
    lg: { icon: 'h-5 w-5', text: 'text-base', container: 'gap-2' },
  };

  const Icon = score >= 90 ? Sparkles : score >= 50 ? Award : TrendingUp;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "inline-flex items-center",
          sizeClasses[size].container,
          className
        )}>
          <div className={cn(
            "flex items-center justify-center",
            getScoreColor(),
            getScoreGlow()
          )}>
            <Icon className={sizeClasses[size].icon} />
          </div>
          <span className={cn(
            "font-semibold tabular-nums",
            sizeClasses[size].text,
            getScoreColor()
          )}>
            {score}
          </span>
          {showLabel && (
            <span className={cn(
              "text-muted-foreground",
              size === 'sm' ? 'text-[10px]' : 'text-xs'
            )}>
              {getScoreLabel()}
            </span>
          )}
          {showTrend && (
            <TrendingUp className={cn(
              "text-success",
              size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'
            )} />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="glass-strong">
        <div className="text-xs space-y-1">
          <p className="font-medium">Credibility Score: {score}/100</p>
          <p className="text-muted-foreground">
            Based on educational content, peer engagement, and accuracy
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
