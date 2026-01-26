import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  id: string;
  name: string;
  specialty?: string;
  type: 'doctor' | 'clinic' | 'hospital' | 'nurse' | 'lab';
  rating?: number;
  reviewCount?: number;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  isVerified?: boolean;
  onClick?: () => void;
  className?: string;
}

const typeLabels: Record<string, string> = {
  doctor: 'Γιατρός',
  clinic: 'Κλινική',
  hospital: 'Νοσοκομείο',
  nurse: 'Νοσηλευτής/τρια',
  lab: 'Εργαστήριο'
};

// Default cover images for clinics and hospitals (multiple options)
const clinicImages = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop',
];

const hospitalImages = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop',
];

// Get a consistent image based on provider name (so same provider always gets same image)
const getDefaultCoverImage = (type: string, name: string): string => {
  const images = type === 'clinic' ? clinicImages : hospitalImages;
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

export function ProviderCard({
  name,
  specialty,
  type,
  rating = 0,
  reviewCount = 0,
  priceMin,
  priceMax,
  city,
  avatarUrl,
  coverImageUrl,
  isVerified,
  onClick,
  className,
}: ProviderCardProps) {
  const typeColors: Record<string, string> = {
    doctor: 'bg-health-mint-light text-primary',
    clinic: 'bg-health-blue-light text-health-blue',
    hospital: 'bg-health-coral-light text-health-coral',
    nurse: 'bg-pink-100 text-pink-600',
    lab: 'bg-amber-100 text-amber-600',
  };

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return 'Τιμή κατόπιν συνεννόησης';
    if (min === max) return `€${min}`;
    return `€${min} - €${max}`;
  };

  const isClinicOrHospitalOrLab = type === 'clinic' || type === 'hospital' || type === 'lab';
  const coverImage = coverImageUrl || (isClinicOrHospitalOrLab ? getDefaultCoverImage(type, name) : undefined);

  // Card with cover image for clinics and hospitals
  if (isClinicOrHospitalOrLab) {
    return (
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] overflow-hidden",
          className
        )}
        onClick={onClick}
      >
        {/* Cover Image */}
        <div className="relative h-40 bg-muted">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className={cn("text-xs capitalize backdrop-blur-sm", typeColors[type])}>
              {typeLabels[type]}
            </Badge>
            {isVerified && (
              <Badge variant="secondary" className="text-xs border-0 bg-success/90 text-success-foreground backdrop-blur-sm">
                ✓ Πιστοποιημένο
              </Badge>
            )}
          </div>

          {/* Name overlay on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-lg drop-shadow-lg">{name}</h3>
            {specialty && (
              <p className="text-white/80 text-sm drop-shadow-md">{specialty}</p>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                <span>({reviewCount})</span>
              </div>
              {city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{city}</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-primary">
              {formatPrice(priceMin, priceMax)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Original card layout for doctors
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 rounded-xl border-2 border-primary/10">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                {specialty && (
                  <p className="text-sm text-muted-foreground">{specialty}</p>
                )}
              </div>
              <Badge variant="secondary" className={cn("shrink-0 text-xs capitalize", typeColors[type])}>
                {typeLabels[type]}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                <span>({reviewCount})</span>
              </div>
              {city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{city}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-primary">
                {formatPrice(priceMin, priceMax)}
              </span>
              {isVerified && (
                <Badge variant="outline" className="text-xs border-success text-success">
                  Πιστοποιημένος
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
