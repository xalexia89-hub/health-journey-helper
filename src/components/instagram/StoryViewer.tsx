import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ChevronLeft, ChevronRight, Send, Heart, MoreHorizontal } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import type { StoryGroup, MedicalStory } from "./types";

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
  onReply?: (storyId: string, message: string) => void;
  onReact?: (storyId: string) => void;
}

export function StoryViewer({ 
  storyGroups, 
  initialGroupIndex,
  onClose,
  onReply,
  onReact
}: StoryViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];
  const storyDuration = currentStory?.duration_seconds || 5;

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentStoryIndex, currentGroupIndex, currentGroup?.stories.length, storyGroups.length, onClose]);

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
      setCurrentStoryIndex(storyGroups[currentGroupIndex - 1].stories.length - 1);
      setProgress(0);
    }
  }, [currentStoryIndex, currentGroupIndex, storyGroups]);

  // Progress timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + (100 / (storyDuration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, storyDuration, goToNextStory]);

  // Reset on story change
  useEffect(() => {
    setProgress(0);
  }, [currentGroupIndex, currentStoryIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevStory();
      if (e.key === 'ArrowRight') goToNextStory();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPaused(p => !p);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevStory, goToNextStory, onClose]);

  const handleReply = () => {
    if (replyText.trim() && currentStory && onReply) {
      onReply(currentStory.id, replyText);
      setReplyText("");
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Story Content */}
      <div 
        className="relative h-full w-full"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image/Video */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentStory.media_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
        </div>

        {/* Navigation Zones */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
          onClick={goToPrevStory}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
          onClick={goToNextStory}
        />

        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 z-30 flex gap-1">
          {currentGroup.stories.map((_, idx) => (
            <div 
              key={idx}
              className="flex-1 h-0.5 bg-foreground/30 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-foreground transition-all duration-100"
                style={{ 
                  width: idx < currentStoryIndex 
                    ? '100%' 
                    : idx === currentStoryIndex 
                      ? `${progress}%` 
                      : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-0 right-0 z-30 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary">
                <AvatarImage src={currentGroup.profile.avatar_url} />
                <AvatarFallback className="bg-secondary">
                  {currentGroup.profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground">
                    {currentGroup.profile.username}
                  </span>
                  <VerificationBadge 
                    type={currentGroup.profile.type}
                    status={currentGroup.profile.verification_status}
                    size="sm"
                  />
                </div>
                <span className="text-xs text-foreground/70">
                  {formatTimeAgo(currentStory.created_at)}
                  {currentStory.location && ` • ${currentStory.location}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-foreground"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-24 left-4 right-4 z-30">
            <p className="text-sm text-foreground drop-shadow-lg">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Reply Input */}
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Reply to story..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              className="flex-1 bg-background/30 backdrop-blur-sm border-foreground/20 text-foreground placeholder:text-foreground/50"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-foreground"
              onClick={() => onReact?.(currentStory.id)}
            >
              <Heart className="h-6 w-6" />
            </Button>
            {replyText.trim() && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 text-primary"
                onClick={handleReply}
              >
                <Send className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Arrows (Desktop) */}
        {currentGroupIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 bg-background/30 backdrop-blur-sm hidden md:flex"
            onClick={goToPrevStory}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {currentGroupIndex < storyGroups.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 bg-background/30 backdrop-blur-sm hidden md:flex"
            onClick={goToNextStory}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
