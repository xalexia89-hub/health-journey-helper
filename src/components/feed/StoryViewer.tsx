import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Heart, Send, Eye, Stethoscope, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Story {
  id: string;
  name: string;
  avatarUrl: string;
  type: "doctor" | "clinic";
  specialty?: string;
  is_verified?: boolean;
}

interface StoryContent {
  id: string;
  imageUrl: string;
  caption?: string;
  timeAgo: string;
}

const getDefaultStoryContent = (story: Story): StoryContent[] => {
  const images = [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=900&fit=crop",
  ];
  const captions = [
    `Καλημέρα από ${story.name}! 🏥`,
    `${story.specialty || 'Φροντίδα υγείας'} ✨`,
  ];
  const num = (story.id.charCodeAt(0) % 2) + 1;
  return Array.from({ length: num }, (_, i) => ({
    id: `${story.id}-${i}`,
    imageUrl: images[(story.id.charCodeAt(0) + i) % images.length],
    caption: captions[i % captions.length],
    timeAgo: `${i + 1}ω`,
  }));
};

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000;

export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState("");
  const [cache, setCache] = useState<Record<string, StoryContent[]>>({});

  const currentStory = stories[currentStoryIndex];
  const storyContents = cache[currentStory?.id] || getDefaultStoryContent(currentStory);
  const currentContent = storyContents[currentContentIndex];

  useEffect(() => {
    if (currentStory && !cache[currentStory.id]) {
      setCache(prev => ({ ...prev, [currentStory.id]: getDefaultStoryContent(currentStory) }));
    }
  }, [currentStory]);

  const goToNextContent = useCallback(() => {
    if (currentContentIndex < storyContents.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentContentIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentContentIndex, storyContents.length, currentStoryIndex, stories.length, onClose]);

  const goToPrevContent = useCallback(() => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentContentIndex(0);
      setProgress(0);
    }
  }, [currentContentIndex, currentStoryIndex]);

  useEffect(() => {
    if (isPaused || !currentContent) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { goToNextContent(); return 0; }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, currentContent, goToNextContent]);

  useEffect(() => { setProgress(0); setCurrentContentIndex(0); }, [currentStoryIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevContent();
      if (e.key === "ArrowRight") goToNextContent();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevContent, goToNextContent]);

  if (!currentStory || !currentContent) return null;

  const handleTap = (e: React.MouseEvent) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const w = e.currentTarget.getBoundingClientRect().width;
    if (x < w / 3) goToPrevContent();
    else if (x > (w * 2) / 3) goToNextContent();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div 
        className="relative w-full max-w-md h-full max-h-[90vh] mx-auto"
        onClick={handleTap}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <img src={currentContent.imageUrl} alt="Story" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>

        <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
          {storyContents.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all" style={{ width: i < currentContentIndex ? "100%" : i === currentContentIndex ? `${progress}%` : "0%" }} />
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-3 right-3 flex items-center gap-2.5 z-10">
          <Avatar className="h-10 w-10 ring-2 ring-white/50">
            <AvatarImage src={currentStory.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{currentStory.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm truncate">{currentStory.name}</span>
              {currentStory.is_verified && <BadgeCheck className="h-4 w-4 text-white shrink-0" />}
            </div>
            <span className="text-white/70 text-[10px]">{currentStory.type === "doctor" ? "Ιατρός" : "Κλινική"} • {currentContent.timeAgo}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {currentContent.caption && (
          <div className="absolute bottom-24 left-3 right-3 z-10">
            <p className="text-white text-sm font-medium drop-shadow-lg">{currentContent.caption}</p>
          </div>
        )}

        <div className="absolute bottom-4 left-3 right-3 flex items-center gap-2 z-10">
          <Input placeholder="Στείλε μήνυμα..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9 text-sm" onClick={(e) => e.stopPropagation()} />
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9" onClick={(e) => e.stopPropagation()}><Heart className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9" onClick={(e) => e.stopPropagation()}><Send className="h-5 w-5" /></Button>
        </div>

        {currentStoryIndex > 0 && (
          <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:bg-white/20 hidden md:flex" onClick={(e) => { e.stopPropagation(); goToPrevContent(); }}>
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:bg-white/20 hidden md:flex" onClick={(e) => { e.stopPropagation(); goToNextContent(); }}>
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
}
