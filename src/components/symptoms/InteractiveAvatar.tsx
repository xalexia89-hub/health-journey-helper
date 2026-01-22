import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

interface InteractiveAvatarProps {
  selectedAreas: BodyArea[];
  onAreaClick: (area: BodyArea) => void;
  state: "idle" | "listening" | "processing" | "responding";
  className?: string;
}

// Body areas with SVG paths
const bodyAreas: { id: BodyArea; label: string; path: string }[] = [
  { id: 'head', label: 'Κεφάλι', path: 'M150,20 C180,20 200,50 200,80 C200,110 180,130 150,130 C120,130 100,110 100,80 C100,50 120,20 150,20' },
  { id: 'face', label: 'Πρόσωπο', path: 'M150,50 C170,50 185,70 185,90 C185,110 170,125 150,125 C130,125 115,110 115,90 C115,70 130,50 150,50' },
  { id: 'neck', label: 'Λαιμός', path: 'M135,130 L165,130 L165,155 L135,155 Z' },
  { id: 'chest', label: 'Στήθος', path: 'M100,155 L200,155 L210,250 L90,250 Z' },
  { id: 'abdomen', label: 'Κοιλιά', path: 'M90,250 L210,250 L215,340 L85,340 Z' },
  { id: 'pelvis', label: 'Λεκάνη', path: 'M85,340 L215,340 L200,390 L100,390 Z' },
  { id: 'left_shoulder', label: 'Αριστερός Ώμος', path: 'M60,155 L100,155 L95,200 L50,190 Z' },
  { id: 'right_shoulder', label: 'Δεξιός Ώμος', path: 'M200,155 L240,155 L250,190 L205,200 Z' },
  { id: 'left_arm', label: 'Αριστερό Χέρι', path: 'M50,190 L80,200 L70,300 L40,290 Z' },
  { id: 'right_arm', label: 'Δεξί Χέρι', path: 'M220,200 L250,190 L260,290 L230,300 Z' },
  { id: 'left_hand', label: 'Αριστερή Παλάμη', path: 'M40,290 L70,300 L75,350 L35,345 Z' },
  { id: 'right_hand', label: 'Δεξιά Παλάμη', path: 'M230,300 L260,290 L265,345 L225,350 Z' },
  { id: 'left_leg', label: 'Αριστερό Πόδι', path: 'M100,390 L150,390 L145,550 L90,550 Z' },
  { id: 'right_leg', label: 'Δεξί Πόδι', path: 'M150,390 L200,390 L210,550 L155,550 Z' },
  { id: 'left_foot', label: 'Αριστερό Πέλμα', path: 'M85,550 L145,550 L140,590 L75,590 Z' },
  { id: 'right_foot', label: 'Δεξί Πέλμα', path: 'M155,550 L215,550 L225,590 L160,590 Z' },
];

export function InteractiveAvatar({ 
  selectedAreas, 
  onAreaClick, 
  state,
  className 
}: InteractiveAvatarProps) {
  
  // Get state-based styling
  const getStateStyles = () => {
    switch (state) {
      case "listening":
        return "ring-4 ring-primary/50 ring-offset-2 ring-offset-background";
      case "processing":
        return "animate-pulse";
      case "responding":
        return "ring-4 ring-success/50 ring-offset-2 ring-offset-background";
      default:
        return "";
    }
  };

  // Get pulse animation for state indicator
  const getIndicatorAnimation = () => {
    switch (state) {
      case "listening":
        return "animate-ping";
      case "processing":
        return "animate-spin";
      case "responding":
        return "animate-pulse";
      default:
        return "";
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
      {/* State indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "w-3 h-3 rounded-full transition-all duration-300",
          state === "idle" && "bg-muted",
          state === "listening" && "bg-primary",
          state === "processing" && "bg-warning",
          state === "responding" && "bg-success",
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full",
            state === "listening" && "bg-primary animate-ping",
            state === "processing" && "bg-warning animate-pulse",
            state === "responding" && "bg-success animate-ping",
          )} />
        </div>
        <span className="text-sm text-muted-foreground">
          {state === "idle" && "Πατήστε για να επιλέξετε περιοχή"}
          {state === "listening" && "Σας ακούω..."}
          {state === "processing" && "Επεξεργάζομαι..."}
          {state === "responding" && "Απαντώ..."}
        </span>
      </div>

      {/* Avatar SVG */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500 bg-gradient-to-b from-secondary/50 to-background p-4",
        getStateStyles()
      )}>
        <svg
          viewBox="0 0 300 600"
          className="w-full max-w-[220px] h-auto"
          style={{ maxHeight: '50vh' }}
        >
          {/* Glow filters */}
          <defs>
            <filter id="avatarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="selectedGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
            </linearGradient>
            <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </linearGradient>
            {/* Breathing animation for responding state */}
            {state === "responding" && (
              <animate
                xlinkHref="#torsoArea"
                attributeName="opacity"
                values="0.4;0.6;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </defs>

          {/* Background silhouette */}
          <g opacity="0.3" fill="url(#avatarGradient)">
            <ellipse cx="150" cy="80" rx="45" ry="55" />
            <rect x="130" y="130" width="40" height="25" rx="5" />
            <path d="M80,155 L220,155 L225,340 L75,340 Z" />
            <path d="M75,340 L225,340 L210,390 L90,390 Z" />
            <path d="M90,390 L150,390 L145,590 L75,590 Z" />
            <path d="M150,390 L210,390 L225,590 L155,590 Z" />
            <path d="M50,170 L80,160 L60,340 L30,330 Z" />
            <path d="M220,160 L250,170 L270,330 L240,340 Z" />
          </g>

          {/* Clickable body areas */}
          {bodyAreas.filter(area => area.path).map((area) => {
            const isSelected = selectedAreas.includes(area.id);
            return (
              <path
                key={area.id}
                d={area.path}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  isSelected 
                    ? "fill-primary stroke-primary-foreground stroke-2" 
                    : "fill-primary/10 stroke-primary/30 stroke-1 hover:fill-primary/30 hover:stroke-primary"
                )}
                onClick={() => onAreaClick(area.id)}
                filter={isSelected ? "url(#selectedGlow)" : undefined}
              >
                <title>{area.label}</title>
              </path>
            );
          })}

          {/* Face features (eyes, mouth) that react to state */}
          <g className="pointer-events-none">
            {/* Eyes */}
            <ellipse 
              cx="135" cy="75" rx="8" ry="6" 
              className={cn(
                "fill-primary/60 transition-all duration-300",
                state === "processing" && "animate-pulse"
              )}
            />
            <ellipse 
              cx="165" cy="75" rx="8" ry="6" 
              className={cn(
                "fill-primary/60 transition-all duration-300",
                state === "processing" && "animate-pulse"
              )}
            />
            {/* Eye highlights */}
            <ellipse cx="137" cy="73" rx="3" ry="2" className="fill-white/60" />
            <ellipse cx="167" cy="73" rx="3" ry="2" className="fill-white/60" />
            
            {/* Mouth - changes based on state */}
            {state === "idle" && (
              <path d="M140,100 Q150,105 160,100" className="stroke-primary/60 stroke-2 fill-none" />
            )}
            {state === "listening" && (
              <ellipse cx="150" cy="102" rx="8" ry="5" className="fill-primary/40 animate-pulse" />
            )}
            {state === "processing" && (
              <path d="M140,102 L160,102" className="stroke-primary/60 stroke-2" />
            )}
            {state === "responding" && (
              <ellipse cx="150" cy="102" rx="10" ry="6" className="fill-primary/50">
                <animate attributeName="ry" values="6;8;6" dur="0.5s" repeatCount="indefinite" />
              </ellipse>
            )}
          </g>

          {/* Center line */}
          <line 
            x1="150" y1="130" x2="150" y2="390" 
            stroke="hsl(var(--border))" 
            strokeWidth="1" 
            strokeDasharray="4 4" 
            opacity="0.3" 
          />

          {/* Pulse rings for selected areas */}
          {selectedAreas.map(area => {
            const areaData = bodyAreas.find(a => a.id === area);
            if (!areaData) return null;
            
            // Calculate center from path (simplified)
            const centers: Record<string, { cx: number; cy: number }> = {
              head: { cx: 150, cy: 75 },
              face: { cx: 150, cy: 90 },
              neck: { cx: 150, cy: 142 },
              chest: { cx: 150, cy: 200 },
              abdomen: { cx: 150, cy: 295 },
              pelvis: { cx: 150, cy: 365 },
              left_shoulder: { cx: 75, cy: 177 },
              right_shoulder: { cx: 225, cy: 177 },
              left_arm: { cx: 55, cy: 245 },
              right_arm: { cx: 245, cy: 245 },
              left_hand: { cx: 55, cy: 320 },
              right_hand: { cx: 245, cy: 320 },
              left_leg: { cx: 120, cy: 470 },
              right_leg: { cx: 180, cy: 470 },
              left_foot: { cx: 110, cy: 570 },
              right_foot: { cx: 190, cy: 570 },
            };
            
            const center = centers[area];
            if (!center) return null;
            
            return (
              <circle
                key={`pulse-${area}`}
                cx={center.cx}
                cy={center.cy}
                r="15"
                className="fill-none stroke-primary stroke-2 opacity-60"
              >
                <animate 
                  attributeName="r" 
                  values="15;25;15" 
                  dur="1.5s" 
                  repeatCount="indefinite" 
                />
                <animate 
                  attributeName="opacity" 
                  values="0.6;0;0.6" 
                  dur="1.5s" 
                  repeatCount="indefinite" 
                />
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Πατήστε στο σώμα για να δείξετε πού αισθάνεστε ενόχληση
      </p>
    </div>
  );
}
