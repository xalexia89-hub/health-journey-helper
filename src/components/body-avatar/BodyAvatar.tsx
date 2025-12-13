import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, MapPin, Clock, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

type BodyArea = Database['public']['Enums']['body_area'];

interface BodyAvatarProps {
  selectedAreas: BodyArea[];
  onAreaClick: (area: BodyArea) => void;
  className?: string;
  onSubcategorySelect?: (subcategory: string) => void;
}

// Body areas with Greek labels
const bodyAreas: { id: BodyArea; label: string; labelGr: string; path: string }[] = [
  { id: 'head', label: 'Head', labelGr: 'Κεφάλι', path: 'M150,20 C180,20 200,50 200,80 C200,110 180,130 150,130 C120,130 100,110 100,80 C100,50 120,20 150,20' },
  { id: 'face', label: 'Face', labelGr: 'Πρόσωπο', path: 'M150,50 C170,50 185,70 185,90 C185,110 170,125 150,125 C130,125 115,110 115,90 C115,70 130,50 150,50' },
  { id: 'neck', label: 'Neck', labelGr: 'Λαιμός', path: 'M135,130 L165,130 L165,155 L135,155 Z' },
  { id: 'chest', label: 'Chest', labelGr: 'Στήθος', path: 'M100,155 L200,155 L210,250 L90,250 Z' },
  { id: 'abdomen', label: 'Abdomen', labelGr: 'Κοιλιά', path: 'M90,250 L210,250 L215,340 L85,340 Z' },
  { id: 'pelvis', label: 'Pelvis', labelGr: 'Λεκάνη', path: 'M85,340 L215,340 L200,390 L100,390 Z' },
  { id: 'left_shoulder', label: 'Left Shoulder', labelGr: 'Αριστερός Ώμος', path: 'M60,155 L100,155 L95,200 L50,190 Z' },
  { id: 'right_shoulder', label: 'Right Shoulder', labelGr: 'Δεξιός Ώμος', path: 'M200,155 L240,155 L250,190 L205,200 Z' },
  { id: 'left_arm', label: 'Left Arm', labelGr: 'Αριστερό Χέρι', path: 'M50,190 L80,200 L70,300 L40,290 Z' },
  { id: 'right_arm', label: 'Right Arm', labelGr: 'Δεξί Χέρι', path: 'M220,200 L250,190 L260,290 L230,300 Z' },
  { id: 'left_hand', label: 'Left Hand', labelGr: 'Αριστερή Παλάμη', path: 'M40,290 L70,300 L75,350 L35,345 Z' },
  { id: 'right_hand', label: 'Right Hand', labelGr: 'Δεξιά Παλάμη', path: 'M230,300 L260,290 L265,345 L225,350 Z' },
  { id: 'left_leg', label: 'Left Leg', labelGr: 'Αριστερό Πόδι', path: 'M100,390 L150,390 L145,550 L90,550 Z' },
  { id: 'right_leg', label: 'Right Leg', labelGr: 'Δεξί Πόδι', path: 'M150,390 L200,390 L210,550 L155,550 Z' },
  { id: 'left_foot', label: 'Left Foot', labelGr: 'Αριστερό Πέλμα', path: 'M85,550 L145,550 L140,590 L75,590 Z' },
  { id: 'right_foot', label: 'Right Foot', labelGr: 'Δεξί Πέλμα', path: 'M155,550 L215,550 L225,590 L160,590 Z' },
  { id: 'upper_back', label: 'Upper Back', labelGr: 'Άνω Πλάτη', path: '' },
  { id: 'lower_back', label: 'Lower Back', labelGr: 'Κάτω Πλάτη', path: '' },
];

// Subcategories for each body area
const subcategories: Record<string, { id: string; label: string; specialty: string; icon?: string }[]> = {
  head: [
    { id: 'eyes', label: 'Μάτια', specialty: 'Οφθαλμολογία' },
    { id: 'ears', label: 'Αυτιά', specialty: 'Ωτορινολαρυγγολογία' },
    { id: 'scalp', label: 'Τριχωτό Κεφαλής', specialty: 'Δερματολογία' },
    { id: 'migraine', label: 'Πονοκέφαλος/Ημικρανία', specialty: 'Νευρολόγος' },
    { id: 'brain', label: 'Εγκεφαλικά', specialty: 'Νευρολόγος' },
  ],
  face: [
    { id: 'eyes', label: 'Μάτια', specialty: 'Οφθαλμολογία' },
    { id: 'nose', label: 'Μύτη', specialty: 'Ωτορινολαρυγγολογία' },
    { id: 'mouth', label: 'Στόμα', specialty: 'Οδοντιατρική' },
    { id: 'jaw', label: 'Σαγόνι', specialty: 'Γναθοχειρουργική' },
    { id: 'skin', label: 'Δέρμα Προσώπου', specialty: 'Δερματολογία' },
  ],
  neck: [
    { id: 'throat', label: 'Λαιμός/Φάρυγγας', specialty: 'Ωτορινολαρυγγολογία' },
    { id: 'thyroid', label: 'Θυρεοειδής', specialty: 'Ενδοκρινολογία' },
    { id: 'spine', label: 'Αυχενική Μοίρα', specialty: 'Ορθοπεδική' },
  ],
  chest: [
    { id: 'heart', label: 'Καρδιά', specialty: 'Καρδιολογία' },
    { id: 'lungs', label: 'Πνεύμονες', specialty: 'Πνευμονολογία' },
    { id: 'breast', label: 'Μαστός', specialty: 'Μαστολογία' },
    { id: 'ribs', label: 'Πλευρά', specialty: 'Ορθοπεδική' },
  ],
  abdomen: [
    { id: 'stomach', label: 'Στομάχι', specialty: 'Γαστρεντερολογία' },
    { id: 'liver', label: 'Συκώτι', specialty: 'Γαστρεντερολογία' },
    { id: 'intestines', label: 'Έντερα', specialty: 'Γαστρεντερολογία' },
    { id: 'kidneys', label: 'Νεφρά', specialty: 'Νεφρολογία' },
  ],
  pelvis: [
    { id: 'bladder', label: 'Ουροδόχος Κύστη', specialty: 'Ουρολογία' },
    { id: 'reproductive', label: 'Αναπαραγωγικό', specialty: 'Γυναικολογία' },
    { id: 'hip', label: 'Ισχίο', specialty: 'Ορθοπεδική' },
  ],
};

export function BodyAvatar({ selectedAreas, onAreaClick, onSubcategorySelect, className }: BodyAvatarProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const currentArea = selectedAreas[selectedAreas.length - 1];
  const currentSubcategories = currentArea ? subcategories[currentArea] || [] : [];

  const handleSubcategoryClick = (subcatId: string) => {
    setSelectedSubcategory(subcatId);
    onSubcategorySelect?.(subcatId);
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 300 600"
        className="w-full max-w-[280px] h-auto"
        style={{ maxHeight: '45vh' }}
      >
        {/* Body outline glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--medithos-lavender-light))" />
            <stop offset="100%" stopColor="hsl(var(--medithos-purple-light))" />
          </linearGradient>
        </defs>

        {/* Background silhouette */}
        <ellipse cx="150" cy="80" rx="45" ry="55" fill="url(#bodyGradient)" opacity="0.3" />
        <rect x="130" y="130" width="40" height="25" fill="url(#bodyGradient)" opacity="0.3" rx="5" />
        <path d="M80,155 L220,155 L225,340 L75,340 Z" fill="url(#bodyGradient)" opacity="0.3" />
        <path d="M75,340 L225,340 L210,390 L90,390 Z" fill="url(#bodyGradient)" opacity="0.3" />
        <path d="M90,390 L150,390 L145,590 L75,590 Z" fill="url(#bodyGradient)" opacity="0.3" />
        <path d="M150,390 L210,390 L225,590 L155,590 Z" fill="url(#bodyGradient)" opacity="0.3" />
        <path d="M50,170 L80,160 L60,340 L30,330 Z" fill="url(#bodyGradient)" opacity="0.3" />
        <path d="M220,160 L250,170 L270,330 L240,340 Z" fill="url(#bodyGradient)" opacity="0.3" />

        {/* Clickable areas */}
        {bodyAreas.filter(area => area.path).map((area) => (
          <path
            key={area.id}
            d={area.path}
            className={cn(
              "body-area",
              selectedAreas.includes(area.id) && "selected"
            )}
            onClick={() => onAreaClick(area.id)}
            filter={selectedAreas.includes(area.id) ? "url(#glow)" : undefined}
          >
            <title>{area.labelGr}</title>
          </path>
        ))}

        {/* Center line */}
        <line x1="150" y1="130" x2="150" y2="390" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      </svg>

      {/* Selected areas display */}
      {selectedAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {selectedAreas.map(area => {
            const areaInfo = bodyAreas.find(a => a.id === area);
            return (
              <span
                key={area}
                className="px-3 py-1.5 bg-primary/15 text-primary text-sm font-medium rounded-full border border-primary/30"
              >
                {areaInfo?.labelGr || area}
              </span>
            );
          })}
        </div>
      )}

      {/* Subcategories Panel */}
      {currentArea && currentSubcategories.length > 0 && (
        <Card className="mt-6 w-full border-primary/20 bg-card">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Τι ακριβώς σας ενοχλεί στο {bodyAreas.find(a => a.id === currentArea)?.labelGr};
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentSubcategories.map((subcat) => (
                <Badge
                  key={subcat.id}
                  variant={selectedSubcategory === subcat.id ? "default" : "outline"}
                  className="cursor-pointer py-2 px-3 text-sm transition-all hover:scale-105"
                  onClick={() => handleSubcategoryClick(subcat.id)}
                >
                  {subcat.label}
                </Badge>
              ))}
            </div>

            {/* Provider Suggestions */}
            {selectedSubcategory && (
              <div className="mt-5 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Θέλετε να δείτε {currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty};
                </h4>
                
                <div className="space-y-2">
                  <Link to={`/providers?specialty=${encodeURIComponent(currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty || '')}&sort=rating`}>
                    <Button variant="outline" className="w-full justify-between group hover:border-primary">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-warning" />
                        <span>Με την καλύτερη βαθμολογία</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link to={`/providers?specialty=${encodeURIComponent(currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty || '')}&sort=distance`}>
                    <Button variant="outline" className="w-full justify-between group hover:border-primary">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-health-coral" />
                        <span>Κοντινότερος γιατρός</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link to={`/providers?specialty=${encodeURIComponent(currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty || '')}&available=now`}>
                    <Button variant="outline" className="w-full justify-between group hover:border-primary">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-health-info" />
                        <span>Εφημερεύον / Διαθέσιμος τώρα</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link to={`/providers?specialty=${encodeURIComponent(currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty || '')}`}>
                    <Button variant="default" className="w-full justify-between group mt-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span>Όλοι οι {currentSubcategories.find(s => s.id === selectedSubcategory)?.specialty}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { bodyAreas, subcategories };
