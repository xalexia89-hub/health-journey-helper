import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Provider {
  id: string;
  name: string;
  avatar_url: string | null;
  specialty: string | null;
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
  onSubmit: (content: string, postType: string, imageUrl?: string) => Promise<void>;
}

export function CreatePostDialog({ open, onOpenChange, provider, onSubmit }: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("update");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !provider) return;
    
    setLoading(true);
    try {
      await onSubmit(content, postType, imageUrl || undefined);
      setContent("");
      setPostType("update");
      setImageUrl("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const postTypes = [
    { value: 'update', label: 'Ενημέρωση' },
    { value: 'article', label: 'Άρθρο' },
    { value: 'case_study', label: 'Κλινική Περίπτωση' },
    { value: 'event', label: 'Εκδήλωση' },
    { value: 'announcement', label: 'Ανακοίνωση' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Νέα Δημοσίευση</DialogTitle>
        </DialogHeader>
        
        {provider && (
          <div className="flex items-center gap-3 pb-3 border-b">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.avatar_url || undefined} />
              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{provider.name}</p>
              <p className="text-xs text-muted-foreground">{provider.specialty || 'Πάροχος Υγείας'}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Τύπος δημοσίευσης</Label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {postTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Περιεχόμενο</Label>
            <Textarea
              placeholder="Τι θέλετε να μοιραστείτε με την κοινότητα;"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Εικόνα (προαιρετικό)</Label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="URL εικόνας..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
              <Button type="button" variant="outline" size="icon" className="h-9 w-9">
                <ImagePlus className="h-4 w-4" />
              </Button>
            </div>
            
            {imageUrl && (
              <div className="relative mt-2">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                  onError={() => setImageUrl("")}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setImageUrl("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ακύρωση
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Δημοσίευση
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
