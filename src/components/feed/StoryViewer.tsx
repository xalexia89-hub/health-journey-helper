import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  name: string;
  avatarUrl: string;
  type: "doctor" | "clinic";
  specialty?: string;
}

interface StoryContent {
  id: string;
  imageUrl: string;
  caption?: string;
  timeAgo: string;
}

// Mock story content for each provider
const mockStoryContent: Record<string, StoryContent[]> = {
  "1": [
    {
      id: "s1-1",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=900&fit=crop",
      caption: "Σήμερα στο ιατρείο! Νέος εξοπλισμός για καρδιολογικές εξετάσεις 🫀",
      timeAgo: "2ω",
    },
    {
      id: "s1-2",
      imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=900&fit=crop",
      caption: "Τακτικός έλεγχος = υγιής καρδιά ❤️",
      timeAgo: "5ω",
    },
  ],
  "2": [
    {
      id: "s2-1",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=900&fit=crop",
      caption: "Η κλινική μας είναι έτοιμη να σας υποδεχτεί!",
      timeAgo: "1ω",
    },
  ],
  "3": [
    {
      id: "s3-1",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=900&fit=crop",
      caption: "Συμβουλές για υγιές δέρμα 🌟",
      timeAgo: "3ω",
    },
    {
      id: "s3-2",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=900&fit=crop",
      caption: "Μην ξεχνάτε το αντηλιακό!",
      timeAgo: "6ω",
    },
    {
      id: "s3-3",
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=900&fit=crop",
      caption: "Νέες θεραπείες διαθέσιμες",
      timeAgo: "12ω",
    },
  ],
  "4": [
    {
      id: "s4-1",
      imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=900&fit=crop",
      caption: "MedCenter - Εξειδικευμένη φροντίδα",
      timeAgo: "4ω",
    },
  ],
  "5": [
    {
      id: "s5-1",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=900&fit=crop",
      caption: "Ορθοπεδικές συμβουλές για αθλητές 🏃",
      timeAgo: "2ω",
    },
  ],
  "6": [
    {
      id: "s6-1",
      imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=900&fit=crop",
      caption: "HealthCare Plus - Η υγεία σας, η προτεραιότητά μας",
      timeAgo: "1ω",
    },
  ],
};

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState("");

  const currentStory = stories[currentStoryIndex];
  const storyContents = mockStoryContent[currentStory?.id] || [];
  const currentContent = storyContents[currentContentIndex];

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
      const prevStoryContents = mockStoryContent[stories[currentStoryIndex - 1]?.id] || [];
      setCurrentContentIndex(prevStoryContents.length - 1);
      setProgress(0);
    }
  }, [currentContentIndex, currentStoryIndex, stories]);

  // Progress timer
  useEffect(() => {
    if (isPaused || !currentContent) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextContent();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, currentContent, goToNextContent]);

  // Reset when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentContentIndex]);

  // Keyboard navigation
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

  const handleTapNavigation = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      goToPrevContent();
    } else if (x > (width * 2) / 3) {
      goToNextContent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Story Container */}
      <div 
        className="relative w-full max-w-md h-full max-h-[90vh] mx-auto"
        onClick={handleTapNavigation}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <img
            src={currentContent.imageUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>

        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
          {storyContents.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index < currentContentIndex 
                    ? "100%" 
                    : index === currentContentIndex 
                      ? `${progress}%` 
                      : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-3 right-3 flex items-center gap-3 z-10">
          <Avatar className="h-10 w-10 ring-2 ring-white/50">
            <AvatarImage src={currentStory.avatarUrl} alt={currentStory.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {currentStory.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{currentStory.name}</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px]">
                {currentStory.type === "doctor" ? "Γιατρός" : "Κλινική"}
              </Badge>
            </div>
            <span className="text-white/70 text-xs">{currentContent.timeAgo}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Caption */}
        {currentContent.caption && (
          <div className="absolute bottom-24 left-4 right-4 z-10">
            <p className="text-white text-sm font-medium drop-shadow-lg">
              {currentContent.caption}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="absolute bottom-4 left-3 right-3 flex items-center gap-2 z-10">
          <Input
            placeholder="Στείλε μήνυμα..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Arrows (Desktop) */}
        {currentStoryIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:bg-white/20 hidden md:flex"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevContent();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:bg-white/20 hidden md:flex"
            onClick={(e) => {
              e.stopPropagation();
              goToNextContent();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
}
