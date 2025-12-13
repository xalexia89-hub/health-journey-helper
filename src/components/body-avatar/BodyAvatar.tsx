import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

interface BodyAvatarProps {
  selectedAreas: BodyArea[];
  onAreaClick: (area: BodyArea) => void;
  className?: string;
}

const bodyAreas: { id: BodyArea; label: string; path: string }[] = [
  { id: 'head', label: 'Head', path: 'M150,20 C180,20 200,50 200,80 C200,110 180,130 150,130 C120,130 100,110 100,80 C100,50 120,20 150,20' },
  { id: 'face', label: 'Face', path: 'M150,50 C170,50 185,70 185,90 C185,110 170,125 150,125 C130,125 115,110 115,90 C115,70 130,50 150,50' },
  { id: 'neck', label: 'Neck', path: 'M135,130 L165,130 L165,155 L135,155 Z' },
  { id: 'chest', label: 'Chest', path: 'M100,155 L200,155 L210,250 L90,250 Z' },
  { id: 'abdomen', label: 'Abdomen', path: 'M90,250 L210,250 L215,340 L85,340 Z' },
  { id: 'pelvis', label: 'Pelvis', path: 'M85,340 L215,340 L200,390 L100,390 Z' },
  { id: 'left_shoulder', label: 'Left Shoulder', path: 'M60,155 L100,155 L95,200 L50,190 Z' },
  { id: 'right_shoulder', label: 'Right Shoulder', path: 'M200,155 L240,155 L250,190 L205,200 Z' },
  { id: 'left_arm', label: 'Left Arm', path: 'M50,190 L80,200 L70,300 L40,290 Z' },
  { id: 'right_arm', label: 'Right Arm', path: 'M220,200 L250,190 L260,290 L230,300 Z' },
  { id: 'left_hand', label: 'Left Hand', path: 'M40,290 L70,300 L75,350 L35,345 Z' },
  { id: 'right_hand', label: 'Right Hand', path: 'M230,300 L260,290 L265,345 L225,350 Z' },
  { id: 'left_leg', label: 'Left Leg', path: 'M100,390 L150,390 L145,550 L90,550 Z' },
  { id: 'right_leg', label: 'Right Leg', path: 'M150,390 L200,390 L210,550 L155,550 Z' },
  { id: 'left_foot', label: 'Left Foot', path: 'M85,550 L145,550 L140,590 L75,590 Z' },
  { id: 'right_foot', label: 'Right Foot', path: 'M155,550 L215,550 L225,590 L160,590 Z' },
  { id: 'upper_back', label: 'Upper Back', path: '' },
  { id: 'lower_back', label: 'Lower Back', path: '' },
];

export function BodyAvatar({ selectedAreas, onAreaClick, className }: BodyAvatarProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 300 600"
        className="w-full max-w-[280px] h-auto"
        style={{ maxHeight: '60vh' }}
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
            <stop offset="0%" stopColor="hsl(var(--health-mint-light))" />
            <stop offset="100%" stopColor="hsl(var(--health-blue-light))" />
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
            <title>{area.label}</title>
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
                className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
              >
                {areaInfo?.label || area}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { bodyAreas };
