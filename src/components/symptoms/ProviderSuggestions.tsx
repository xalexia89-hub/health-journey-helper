import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Building2, 
  Hospital,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

interface Provider {
  id: string;
  name: string;
  specialty: string;
  type: string;
  rating: number | null;
  review_count: number | null;
  address: string | null;
  avatar_url: string | null;
}

interface ProviderSuggestionsProps {
  bodyAreas: BodyArea[];
  urgencyLevel: "low" | "medium" | "high";
  symptoms: string[];
  className?: string;
}

// Mapping from body areas to specialties
const bodyAreaToSpecialties: Record<string, string[]> = {
  head: ["Νευρολόγος", "General Practice", "Neurology"],
  face: ["Οφθαλμολογία", "Δερματολογία", "Dermatology", "General Practice"],
  neck: ["Ωτορινολαρυγγολογία", "Ενδοκρινολογία", "General Practice", "ENT"],
  chest: ["Καρδιολογία", "Πνευμονολογία", "Cardiology", "Pulmonology", "General Practice"],
  upper_back: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  lower_back: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  left_shoulder: ["Ορθοπεδική", "Orthopedics"],
  right_shoulder: ["Ορθοπεδική", "Orthopedics"],
  left_arm: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  right_arm: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  left_hand: ["Ορθοπεδική", "Orthopedics", "Δερματολογία"],
  right_hand: ["Ορθοπεδική", "Orthopedics", "Δερματολογία"],
  abdomen: ["Γαστρεντερολογία", "Gastroenterology", "General Practice"],
  pelvis: ["Ουρολογία", "Γυναικολογία", "Urology", "Gynecology", "General Practice"],
  left_leg: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  right_leg: ["Ορθοπεδική", "Orthopedics", "General Practice"],
  left_foot: ["Ορθοπεδική", "Orthopedics", "Podiatry"],
  right_foot: ["Ορθοπεδική", "Orthopedics", "Podiatry"],
};

// Specialty translations
const specialtyLabels: Record<string, string> = {
  "Cardiology": "Καρδιολογία",
  "General Practice": "Γενική Ιατρική",
  "Dermatology": "Δερματολογία",
  "Orthopedics": "Ορθοπεδική",
  "Pediatrics": "Παιδιατρική",
  "Neurology": "Νευρολογία",
  "Gastroenterology": "Γαστρεντερολογία",
  "Pulmonology": "Πνευμονολογία",
  "Urology": "Ουρολογία",
  "Gynecology": "Γυναικολογία",
  "ENT": "ΩΡΛ",
};

export function ProviderSuggestions({ 
  bodyAreas, 
  urgencyLevel, 
  symptoms,
  className 
}: ProviderSuggestionsProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedSpecialties, setSuggestedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchSuggestedProviders();
  }, [bodyAreas, symptoms]);

  const fetchSuggestedProviders = async () => {
    setLoading(true);
    
    // Determine relevant specialties based on body areas
    const specialties = new Set<string>();
    
    // Always add General Practice for initial consultation
    specialties.add("General Practice");
    
    // Add specialties based on body areas
    bodyAreas.forEach(area => {
      const areaSpecialties = bodyAreaToSpecialties[area] || [];
      areaSpecialties.forEach(s => specialties.add(s));
    });
    
    // For high urgency, prioritize emergency-capable providers
    if (urgencyLevel === "high") {
      specialties.add("General Practice");
    }
    
    const specialtyArray = Array.from(specialties);
    setSuggestedSpecialties(specialtyArray);
    
    // Fetch providers matching these specialties
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, specialty, type, rating, review_count, address, avatar_url")
      .in("specialty", specialtyArray)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(6);
    
    if (error) {
      console.error("Error fetching providers:", error);
    } else {
      setProviders(data || []);
    }
    
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hospital": return Hospital;
      case "clinic": return Building2;
      default: return Stethoscope;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hospital": return "Νοσοκομείο";
      case "clinic": return "Κλινική";
      case "nurse": return "Νοσηλευτής";
      default: return "Γιατρός";
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    return specialtyLabels[specialty] || specialty;
  };

  if (loading) {
    return (
      <Card className={cn("border-primary/30", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-5 w-5 text-primary" />
            Αναζήτηση κατάλληλων παρόχων...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0) {
    return (
      <Card className={cn("border-primary/30", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-5 w-5 text-primary" />
            Προτεινόμενοι Πάροχοι
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Δεν βρέθηκαν πάροχοι για τα συγκεκριμένα συμπτώματα.
          </p>
          <Link to="/providers">
            <Button className="w-full">
              Δείτε όλους τους παρόχους
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-primary/30 overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-success" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Stethoscope className="h-5 w-5 text-primary" />
            Προτεινόμενοι Πάροχοι
          </div>
          <Badge variant="secondary" className="text-xs">
            {providers.length} διαθέσιμοι
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Βάσει των συμπτωμάτων σας, προτείνουμε:
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Suggested specialties */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {suggestedSpecialties.slice(0, 4).map((specialty, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-primary/5">
              {getSpecialtyLabel(specialty)}
            </Badge>
          ))}
        </div>
        
        {/* Provider cards */}
        <div className="space-y-2">
          {providers.slice(0, 3).map((provider) => {
            const TypeIcon = getTypeIcon(provider.type);
            
            return (
              <Link 
                key={provider.id} 
                to={`/providers/${provider.id}`}
                className="block"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all group">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    {provider.avatar_url ? (
                      <AvatarImage src={provider.avatar_url} alt={provider.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{provider.name}</h4>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {getTypeLabel(provider.type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {getSpecialtyLabel(provider.specialty)}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {provider.rating && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>{provider.rating}</span>
                          {provider.review_count && (
                            <span className="text-muted-foreground">
                              ({provider.review_count})
                            </span>
                          )}
                        </div>
                      )}
                      {provider.address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{provider.address.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* CTA buttons */}
        <div className="flex gap-2 pt-2">
          <Link to={`/providers?specialty=${encodeURIComponent(suggestedSpecialties[0] || '')}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Κλείστε Ραντεβού
            </Button>
          </Link>
          <Link to="/providers" className="flex-1">
            <Button className="w-full gap-2">
              Όλοι οι Πάροχοι
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Urgency notice */}
        {urgencyLevel === "high" && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mt-2">
            <p className="text-xs text-destructive font-medium">
              ⚠️ Λόγω υψηλού επείγοντος, συνιστούμε άμεση επικοινωνία με γιατρό ή επίσκεψη σε νοσοκομείο.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
