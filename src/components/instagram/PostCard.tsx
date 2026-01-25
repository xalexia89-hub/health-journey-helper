import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import { CredibilityScore } from "./CredibilityScore";
import type { MedicalPost } from "./types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PostCardProps {
  post: MedicalPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
  onProfileClick: (profileId: string) => void;
  className?: string;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onSave,
  onProfileClick,
  className 
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(post.id);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const captionPreviewLength = 120;
  const shouldTruncate = post.caption.length > captionPreviewLength;

  return (
    <article className={cn(
      "bg-card border-y border-border",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onProfileClick(post.author.id)}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground">
                {post.author.username}
              </span>
              <VerificationBadge 
                type={post.author.type} 
                status={post.author.verification_status}
                size="sm"
              />
              {post.is_educational && (
                <GraduationCap className="h-3.5 w-3.5 text-accent" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {post.author.specialty && (
                <span>{post.author.specialty}</span>
              )}
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Media */}
      <div className="relative aspect-square bg-muted">
        {post.content_type === 'carousel' && post.media_urls.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {post.media_urls.map((url, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <img 
                    src={url} 
                    alt={`${post.author.name}'s post ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm" />
          </Carousel>
        ) : (
          <img 
            src={post.media_urls[0]} 
            alt={`${post.author.name}'s post`}
            className="w-full h-full object-cover"
            onDoubleClick={handleLike}
          />
        )}

        {/* Educational Badge */}
        {post.is_educational && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-medium flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            Educational
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={handleLike}
            >
              <Heart className={cn(
                "h-6 w-6 transition-all",
                isLiked 
                  ? "fill-destructive text-destructive scale-110" 
                  : "text-foreground hover:text-destructive"
              )} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => onComment(post.id)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => onShare(post.id)}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleSave}
          >
            <Bookmark className={cn(
              "h-6 w-6 transition-all",
              isSaved 
                ? "fill-foreground text-foreground" 
                : "text-foreground"
            )} />
          </Button>
        </div>

        {/* Likes & Credibility */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            {formatCount(likesCount)} likes
          </span>
          {post.credibility_boost > 0 && (
            <span className="text-xs text-accent flex items-center gap-1">
              +{post.credibility_boost} credibility
            </span>
          )}
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span 
            className="font-semibold mr-1 cursor-pointer hover:underline"
            onClick={() => onProfileClick(post.author.id)}
          >
            {post.author.username}
          </span>
          <span className="text-foreground">
            {showFullCaption || !shouldTruncate 
              ? post.caption 
              : `${post.caption.slice(0, captionPreviewLength)}...`
            }
          </span>
          {shouldTruncate && !showFullCaption && (
            <button 
              className="text-muted-foreground ml-1 hover:text-foreground"
              onClick={() => setShowFullCaption(true)}
            >
              more
            </button>
          )}
        </div>

        {/* Tags */}
        {post.specialty_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.specialty_tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Preview */}
        {post.comments_count > 0 && (
          <button 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => onComment(post.id)}
          >
            View all {formatCount(post.comments_count)} comments
          </button>
        )}

        {/* Timestamp */}
        <time className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {new Date(post.created_at).toLocaleDateString('el-GR', {
            day: 'numeric',
            month: 'short'
          })}
        </time>
      </div>
    </article>
  );
}
