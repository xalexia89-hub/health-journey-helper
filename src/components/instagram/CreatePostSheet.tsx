import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Image, 
  Film, 
  Camera,
  MapPin,
  Tag,
  GraduationCap,
  Loader2,
  X
} from "lucide-react";
import type { VerifiedProfile } from "./types";

type ContentMode = 'post' | 'story' | 'reel';

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: VerifiedProfile | null;
  onSubmit: (data: {
    mode: ContentMode;
    caption: string;
    location?: string;
    tags: string[];
    isEducational: boolean;
    mediaUrl?: string;
  }) => Promise<void>;
}

export function CreatePostSheet({ 
  open, 
  onOpenChange, 
  profile,
  onSubmit 
}: CreatePostSheetProps) {
  const [mode, setMode] = useState<ContentMode>('post');
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isEducational, setIsEducational] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!caption.trim() && !mediaUrl) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        mode,
        caption,
        location: location || undefined,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        isEducational,
        mediaUrl: mediaUrl || undefined,
      });

      // Reset form
      setCaption("");
      setLocation("");
      setTagsInput("");
      setIsEducational(false);
      setMediaUrl("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modes: { id: ContentMode; icon: React.ReactNode; label: string }[] = [
    { id: 'post', icon: <Image className="h-5 w-5" />, label: 'Post' },
    { id: 'story', icon: <Camera className="h-5 w-5" />, label: 'Story' },
    { id: 'reel', icon: <Film className="h-5 w-5" />, label: 'Reel' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center">Create New {mode.charAt(0).toUpperCase() + mode.slice(1)}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pb-6">
          {/* Mode Selector */}
          <div className="flex justify-center gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  mode === m.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {m.icon}
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Profile Preview */}
          {profile && (
            <div className="flex items-center gap-3 px-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-secondary">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.specialty || 'Healthcare Professional'}</p>
              </div>
            </div>
          )}

          {/* Media Preview/Input */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Media</Label>
            {mediaUrl ? (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img 
                  src={mediaUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setMediaUrl("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border">
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Image className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Camera className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Film className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Select or capture media</p>
              </div>
            )}
            <Input
              placeholder="Or paste image URL..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Caption</Label>
            <Textarea
              placeholder={
                mode === 'reel' 
                  ? "Describe your medical insight or experience..."
                  : "Share your thoughts with the medical community..."
              }
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Add location (hospital, city...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="cardiology, surgery, education..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Educational Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">Educational Content</p>
                <p className="text-xs text-muted-foreground">Boost credibility score</p>
              </div>
            </div>
            <Switch 
              checked={isEducational}
              onCheckedChange={setIsEducational}
            />
          </div>

          {/* Submit */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || (!caption.trim() && !mediaUrl)}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Share {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
