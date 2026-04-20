import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface GalleryImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface GalleryUploadSectionProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  maxImages?: number;
}

export function GalleryUploadSection({
  images,
  onImagesChange,
  maxImages = 5,
}: GalleryUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast({
        title: "Όριο φωτογραφιών",
        description: `Μπορείτε να ανεβάσετε μέχρι ${maxImages} φωτογραφίες.`,
        variant: "destructive",
      });
      return;
    }

    const newImages: GalleryImage[] = [];
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Μη έγκυρο αρχείο", description: `${file.name} δεν είναι εικόνα`, variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Πολύ μεγάλο", description: `${file.name} > 5MB`, variant: "destructive" });
        return;
      }
      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });

    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.previewUrl);
    onImagesChange(images.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Φωτογραφίες Προφίλ ({images.length}/{maxImages})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Ανεβάστε έως {maxImages} φωτογραφίες (ιατρείο, εξοπλισμός, ομάδα κ.λπ.). Προαιρετικό.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={img.previewUrl} alt="Gallery preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Αφαίρεση"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Προσθήκη</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
