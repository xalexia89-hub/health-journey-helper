import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  id: string;
  name: string;
  specialty?: string;
  type: 'doctor' | 'clinic' | 'hospital';
  rating?: number;
  reviewCount?: number;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  onClick?: () => void;
  className?: string;
}

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
  isVerified,
  onClick,
  className,
}: ProviderCardProps) {
  const typeColors = {
    doctor: 'bg-health-mint-light text-primary',
    clinic: 'bg-health-blue-light text-health-blue',
    hospital: 'bg-health-coral-light text-health-coral',
  };

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return 'Price varies';
    if (min === max) return `€${min}`;
    return `€${min} - €${max}`;
  };

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
                {type}
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
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
