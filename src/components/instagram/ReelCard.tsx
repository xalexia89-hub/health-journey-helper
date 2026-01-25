import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music2,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import type { MedicalReel } from "./types";

interface ReelCardProps {
  reel: MedicalReel;
  isActive: boolean;
  isMuted: boolean;
  onLike: (reelId: string) => void;
  onComment: (reelId: string) => void;
  onShare: (reelId: string) => void;
  onSave: (reelId: string) => void;
  onProfileClick: (profileId: string) => void;
  onToggleMute: () => void;
  className?: string;
}

export function ReelCard({ 
  reel, 
  isActive,
  isMuted,
  onLike, 
  onComment, 
  onShare, 
  onSave,
  onProfileClick,
  onToggleMute,
  className 
}: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.is_liked);
  const [isSaved, setIsSaved] = useState(reel.is_saved);
  const [isPaused, setIsPaused] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes_count);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(reel.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(reel.id);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'explainer': '🎓 Explainer',
      'day-on-shift': '👨‍⚕️ Day on Shift',
      'equipment': '🔬 Equipment',
      'team-culture': '👥 Team Culture',
      'procedure': '⚕️ Procedure'
    };
    return labels[category] || category;
  };

  return (
    <div className={cn(
      "relative h-full w-full bg-background",
      className
    )}>
      {/* Video Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${reel.thumbnail_url})` }}
        onClick={() => setIsPaused(!isPaused)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Play/Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-background/80 flex items-center justify-center">
              <Play className="h-10 w-10 text-foreground ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
          {getCategoryLabel(reel.category)}
        </span>
      </div>

      {/* Mute Button */}
      <button 
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
        onClick={onToggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Right Actions */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
        {/* Like */}
        <button 
          className="flex flex-col items-center gap-1"
          onClick={handleLike}
        >
          <div className={cn(
            "w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center",
            isLiked && "bg-destructive/20"
          )}>
            <Heart className={cn(
              "h-7 w-7 transition-all",
              isLiked 
                ? "fill-destructive text-destructive scale-110" 
                : "text-foreground"
            )} />
          </div>
          <span className="text-xs font-medium">{formatCount(likesCount)}</span>
        </button>

        {/* Comment */}
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => onComment(reel.id)}
        >
          <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="h-7 w-7" />
          </div>
          <span className="text-xs font-medium">{formatCount(reel.comments_count)}</span>
        </button>

        {/* Share */}
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => onShare(reel.id)}
        >
          <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
            <Send className="h-7 w-7" />
          </div>
          <span className="text-xs font-medium">{formatCount(reel.shares_count)}</span>
        </button>

        {/* Save */}
        <button 
          className="flex flex-col items-center gap-1"
          onClick={handleSave}
        >
          <div className={cn(
            "w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center",
            isSaved && "bg-foreground/20"
          )}>
            <Bookmark className={cn(
              "h-7 w-7 transition-all",
              isSaved && "fill-foreground"
            )} />
          </div>
        </button>

        {/* Author Avatar */}
        <button 
          className="relative"
          onClick={() => onProfileClick(reel.author.id)}
        >
          <Avatar className="h-12 w-12 ring-2 ring-primary">
            <AvatarImage src={reel.author.avatar_url} />
            <AvatarFallback className="bg-secondary text-sm">
              {reel.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {reel.author.verification_status === 'verified' && (
            <div className="absolute -bottom-1 -right-1">
              <VerificationBadge 
                type={reel.author.type} 
                status="verified" 
                size="sm" 
              />
            </div>
          )}
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-4 right-20 z-10 space-y-3">
        {/* Author Info */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onProfileClick(reel.author.id)}
        >
          <span className="font-semibold text-sm">{reel.author.username}</span>
          <VerificationBadge 
            type={reel.author.type} 
            status={reel.author.verification_status}
            size="sm"
          />
        </div>

        {/* Caption */}
        <p className="text-sm line-clamp-2">{reel.caption}</p>

        {/* Audio */}
        {reel.audio_name && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-background/30 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <Music2 className="h-4 w-4" />
            </div>
            <span className="text-xs text-muted-foreground">{reel.audio_name}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {reel.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="text-xs font-medium text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
