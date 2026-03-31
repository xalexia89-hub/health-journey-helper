import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BodyArea = Database['public']['Enums']['body_area'];

interface InteractiveAvatarProps {
  selectedAreas: BodyArea[];
  onAreaClick: (area: BodyArea) => void;
  state: "idle" | "listening" | "processing" | "responding";
  className?: string;
}

const bodyAreas: { id: BodyArea; label: string; hitPath: string; labelSide: 'left' | 'right' }[] = [
  { id: 'head', label: 'Κεφάλι', hitPath: 'M138,18 C162,18 178,38 178,62 C178,86 162,100 150,100 C138,100 122,86 122,62 C122,38 138,18 150,18 Z', labelSide: 'right' },
  { id: 'neck', label: 'Λαιμός', hitPath: 'M140,100 L160,100 L162,120 L138,120 Z', labelSide: 'left' },
  { id: 'chest', label: 'Στήθος', hitPath: 'M108,120 L192,120 L198,200 L102,200 Z', labelSide: 'right' },
  { id: 'left_shoulder', label: 'Αρ. Ώμος', hitPath: 'M68,120 L108,120 L105,155 L62,148 Z', labelSide: 'left' },
  { id: 'right_shoulder', label: 'Δεξ. Ώμος', hitPath: 'M192,120 L232,120 L238,148 L195,155 Z', labelSide: 'right' },
  { id: 'abdomen', label: 'Κοιλιά', hitPath: 'M102,200 L198,200 L200,280 L100,280 Z', labelSide: 'left' },
  { id: 'left_arm', label: 'Αρ. Χέρι', hitPath: 'M55,148 L80,155 L68,270 L42,260 Z', labelSide: 'left' },
  { id: 'right_arm', label: 'Δεξ. Χέρι', hitPath: 'M220,155 L245,148 L258,260 L232,270 Z', labelSide: 'right' },
  { id: 'pelvis', label: 'Λεκάνη', hitPath: 'M100,280 L200,280 L195,330 L105,330 Z', labelSide: 'right' },
  { id: 'left_hand', label: 'Αρ. Παλάμη', hitPath: 'M38,260 L65,270 L60,320 L32,310 Z', labelSide: 'left' },
  { id: 'right_hand', label: 'Δεξ. Παλάμη', hitPath: 'M235,270 L262,260 L268,310 L240,320 Z', labelSide: 'right' },
  { id: 'left_leg', label: 'Αρ. Πόδι', hitPath: 'M105,330 L148,330 L142,480 L95,480 Z', labelSide: 'left' },
  { id: 'right_leg', label: 'Δεξ. Πόδι', hitPath: 'M152,330 L195,330 L205,480 L158,480 Z', labelSide: 'right' },
  { id: 'left_foot', label: 'Αρ. Πέλμα', hitPath: 'M90,480 L142,480 L138,520 L82,520 Z', labelSide: 'left' },
  { id: 'right_foot', label: 'Δεξ. Πέλμα', hitPath: 'M158,480 L210,480 L218,520 L162,520 Z', labelSide: 'right' },
];

export function InteractiveAvatar({ 
  selectedAreas, 
  onAreaClick, 
  state,
  className 
}: InteractiveAvatarProps) {
  
  const getStateStyles = () => {
    switch (state) {
      case "listening": return "hologram-listening";
      case "processing": return "hologram-processing";
      case "responding": return "hologram-responding";
      default: return "";
    }
  };

  const leftAreas = selectedAreas.filter(a => bodyAreas.find(b => b.id === a)?.labelSide === 'left');
  const rightAreas = selectedAreas.filter(a => bodyAreas.find(b => b.id === a)?.labelSide === 'right');

  return (
    <div className={cn("relative flex flex-col items-center gap-3", className)}>
      {/* State indicator */}
      <div className="flex items-center gap-2 mb-1">
        <div className={cn(
          "w-3 h-3 rounded-full transition-all duration-300 relative",
          state === "idle" && "bg-cyan-500/50",
          state === "listening" && "bg-cyan-400",
          state === "processing" && "bg-cyan-300",
          state === "responding" && "bg-emerald-400",
        )}>
          <div className={cn(
            "absolute inset-0 w-3 h-3 rounded-full",
            state === "listening" && "bg-cyan-400 animate-ping",
            state === "processing" && "bg-cyan-300 animate-pulse",
            state === "responding" && "bg-emerald-400 animate-ping",
          )} />
        </div>
        <span className="text-xs text-cyan-300/80 font-mono tracking-wider">
          {state === "idle" && "// READY FOR INPUT"}
          {state === "listening" && "// LISTENING..."}
          {state === "processing" && "// ANALYZING..."}
          {state === "responding" && "// RESPONDING..."}
        </span>
      </div>

      {/* Avatar with side labels */}
      <div className="relative flex items-start justify-center gap-2">
        {/* Left side labels */}
        <div className="flex flex-col gap-1 min-w-[80px] items-end pt-8">
          {leftAreas.map(area => {
            const areaData = bodyAreas.find(a => a.id === area);
            if (!areaData) return null;
            return (
              <button
                key={area}
                onClick={() => onAreaClick(area)}
                className="flex items-center gap-1 px-2 py-1 rounded border border-cyan-400/60 bg-cyan-950/40 text-cyan-300 text-xs font-mono transition-all hover:bg-cyan-900/50 hover:border-cyan-300 animate-fade-in backdrop-blur-sm shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                <span>{areaData.label}</span>
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>

        {/* Holographic Avatar Container */}
        <div className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-500",
          "bg-gradient-to-b from-[#030d14] via-[#020a10] to-[#030d14]",
          "border border-cyan-500/20 p-4",
          "shadow-[0_0_40px_rgba(34,211,238,0.1),inset_0_0_30px_rgba(34,211,238,0.03)]",
          getStateStyles()
        )}>
          {/* Scan lines overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.02) 3px, rgba(34,211,238,0.02) 4px)',
            }}
          />
          
          {/* Moving scan line */}
          <div 
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-10"
            style={{ animation: 'scanline 4s linear infinite' }}
          />

          {/* Ambient glow from below */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-400/8 blur-2xl rounded-full pointer-events-none" />

          <svg
            viewBox="0 0 300 540"
            className="w-[170px] h-auto relative z-0"
            style={{ maxHeight: '48vh' }}
          >
            <defs>
              {/* Outer body glow */}
              <filter id="bodyGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b1"/>
                <feGaussianBlur stdDeviation="8" result="b2"/>
                <feMerge>
                  <feMergeNode in="b2"/>
                  <feMergeNode in="b1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Selected glow */}
              <filter id="selGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="b1"/>
                <feGaussianBlur stdDeviation="16" result="b2"/>
                <feMerge>
                  <feMergeNode in="b2"/>
                  <feMergeNode in="b1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Spine glow */}
              <filter id="spineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <linearGradient id="bodyFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.06)" />
                <stop offset="40%" stopColor="rgba(34,211,238,0.03)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0.08)" />
              </linearGradient>

              <linearGradient id="selFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0.3)" />
              </linearGradient>
            </defs>

            {/* ==================== ANATOMICAL BODY OUTLINE ==================== */}
            {/* Full body silhouette - translucent */}
            <g filter="url(#bodyGlow)">
              {/* Head */}
              <ellipse cx="150" cy="55" rx="30" ry="38" fill="url(#bodyFill)" stroke="rgba(34,211,238,0.35)" strokeWidth="0.8" />
              
              {/* Neck */}
              <path d="M140,92 L160,92 L162,118 L138,118 Z" fill="url(#bodyFill)" stroke="rgba(34,211,238,0.25)" strokeWidth="0.6" />
              
              {/* Torso */}
              <path d="M108,118 C105,118 90,125 82,135 L62,135 C58,135 55,140 58,148 L62,155 
                       C60,160 52,170 48,190 L42,250 C40,265 42,270 48,272 L60,280 
                       L68,310 L60,318 C58,320 58,325 62,325 L78,325 
                       L100,280 L100,330 
                       L105,340 L95,480 L88,510 C86,518 88,522 92,522 L138,522 C142,522 142,518 140,510 
                       L142,480 L148,340 
                       L150,330 
                       L152,340 L158,480 
                       L160,510 C158,518 158,522 162,522 L208,522 C212,522 214,518 212,510 
                       L205,480 L195,340 L200,330 
                       L200,280 L222,325 L238,325 C242,325 242,320 240,318 
                       L232,310 L240,280 L252,272 C258,270 260,265 258,250 
                       L252,190 C248,170 240,160 238,155 L242,148 C245,140 242,135 238,135 
                       L218,135 C210,125 195,118 192,118 Z"
                fill="url(#bodyFill)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
            </g>

            {/* ==================== SKELETAL STRUCTURE ==================== */}
            <g stroke="rgba(34,211,238,0.5)" strokeWidth="0.6" fill="none" filter="url(#spineGlow)">
              {/* Skull outline */}
              <ellipse cx="150" cy="48" rx="22" ry="28" strokeWidth="0.8" />
              <path d="M135,58 C135,50 145,42 150,42 C155,42 165,50 165,58" strokeWidth="0.5" />
              {/* Jaw */}
              <path d="M133,62 C133,75 143,82 150,82 C157,82 167,75 167,62" strokeWidth="0.5" />
              
              {/* Spine - vertebrae */}
              {Array.from({ length: 22 }, (_, i) => {
                const y = 95 + i * 10;
                const w = i < 7 ? 8 : i < 12 ? 10 : i < 17 ? 12 : 14;
                return (
                  <g key={`v${i}`}>
                    <rect x={150 - w/2} y={y} width={w} height={6} rx="1.5" 
                          stroke="rgba(34,211,238,0.4)" fill="rgba(34,211,238,0.06)" />
                  </g>
                );
              })}
              
              {/* Rib cage */}
              {Array.from({ length: 10 }, (_, i) => {
                const y = 128 + i * 12;
                const spread = 20 + i * 4;
                const curvature = 12 + i * 2;
                return (
                  <g key={`rib${i}`}>
                    <path d={`M${150 - 6},${y} C${150 - spread},${y - curvature} ${150 - spread - 10},${y + 5} ${150 - spread},${y + 8}`} 
                          stroke="rgba(34,211,238,0.25)" strokeWidth="0.5" />
                    <path d={`M${150 + 6},${y} C${150 + spread},${y - curvature} ${150 + spread + 10},${y + 5} ${150 + spread},${y + 8}`} 
                          stroke="rgba(34,211,238,0.25)" strokeWidth="0.5" />
                  </g>
                );
              })}

              {/* Pelvis */}
              <path d="M115,310 C100,295 95,315 100,335 L148,345" stroke="rgba(34,211,238,0.35)" strokeWidth="0.7" />
              <path d="M185,310 C200,295 205,315 200,335 L152,345" stroke="rgba(34,211,238,0.35)" strokeWidth="0.7" />

              {/* Clavicles */}
              <path d="M150,120 C130,115 110,122 90,130" strokeWidth="0.7" />
              <path d="M150,120 C170,115 190,122 210,130" strokeWidth="0.7" />

              {/* Shoulder joints */}
              <circle cx="88" cy="132" r="6" stroke="rgba(34,211,238,0.3)" fill="rgba(34,211,238,0.05)" />
              <circle cx="212" cy="132" r="6" stroke="rgba(34,211,238,0.3)" fill="rgba(34,211,238,0.05)" />

              {/* Left arm bones */}
              <line x1="85" y1="138" x2="68" y2="250" strokeWidth="0.7" />
              <line x1="82" y1="138" x2="62" y2="248" strokeWidth="0.5" />
              {/* Elbow joint */}
              <circle cx="65" cy="250" r="4" stroke="rgba(34,211,238,0.25)" fill="rgba(34,211,238,0.04)" />
              {/* Forearm */}
              <line x1="65" y1="254" x2="55" y2="310" strokeWidth="0.6" />
              <line x1="68" y1="254" x2="60" y2="312" strokeWidth="0.4" />

              {/* Right arm bones */}
              <line x1="215" y1="138" x2="232" y2="250" strokeWidth="0.7" />
              <line x1="218" y1="138" x2="238" y2="248" strokeWidth="0.5" />
              <circle cx="235" cy="250" r="4" stroke="rgba(34,211,238,0.25)" fill="rgba(34,211,238,0.04)" />
              <line x1="235" y1="254" x2="245" y2="310" strokeWidth="0.6" />
              <line x1="232" y1="254" x2="240" y2="312" strokeWidth="0.4" />

              {/* Hand bones - left */}
              {[0,1,2,3,4].map(i => (
                <line key={`lh${i}`} x1="55" y1="312" x2={45 + i * 5} y2="328" strokeWidth="0.3" stroke="rgba(34,211,238,0.2)" />
              ))}
              
              {/* Hand bones - right */}
              {[0,1,2,3,4].map(i => (
                <line key={`rh${i}`} x1="245" y1="312" x2={235 + i * 5} y2="328" strokeWidth="0.3" stroke="rgba(34,211,238,0.2)" />
              ))}

              {/* Femur - left */}
              <line x1="130" y1="345" x2="122" y2="460" strokeWidth="0.8" />
              {/* Knee joint */}
              <circle cx="120" cy="462" r="5" stroke="rgba(34,211,238,0.3)" fill="rgba(34,211,238,0.04)" />
              {/* Tibia/Fibula - left */}
              <line x1="120" y1="467" x2="112" y2="510" strokeWidth="0.7" />
              <line x1="122" y1="467" x2="116" y2="510" strokeWidth="0.4" />

              {/* Femur - right */}
              <line x1="170" y1="345" x2="178" y2="460" strokeWidth="0.8" />
              <circle cx="180" cy="462" r="5" stroke="rgba(34,211,238,0.3)" fill="rgba(34,211,238,0.04)" />
              <line x1="180" y1="467" x2="188" y2="510" strokeWidth="0.7" />
              <line x1="178" y1="467" x2="184" y2="510" strokeWidth="0.4" />

              {/* Feet bones */}
              <path d="M108,510 L95,518 L92,522" strokeWidth="0.4" stroke="rgba(34,211,238,0.25)" />
              <path d="M118,510 L125,520" strokeWidth="0.4" stroke="rgba(34,211,238,0.25)" />
              <path d="M192,510 L205,518 L208,522" strokeWidth="0.4" stroke="rgba(34,211,238,0.25)" />
              <path d="M182,510 L175,520" strokeWidth="0.4" stroke="rgba(34,211,238,0.25)" />
            </g>

            {/* ==================== ORGAN HINTS ==================== */}
            {/* Heart */}
            <g filter="url(#spineGlow)">
              <path d="M142,165 C138,158 130,158 130,165 C130,172 142,182 142,182 C142,182 154,172 154,165 C154,158 146,158 142,165 Z"
                    fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="0.5">
                <animate attributeName="fill" values="rgba(239,68,68,0.15);rgba(239,68,68,0.25);rgba(239,68,68,0.15)" dur="1.2s" repeatCount="indefinite" />
              </path>
            </g>

            {/* ==================== CLICKABLE HIT AREAS ==================== */}
            {bodyAreas.map((area) => {
              const isSelected = selectedAreas.includes(area.id);
              return (
                <path
                  key={area.id}
                  d={area.hitPath}
                  className="cursor-pointer transition-all duration-300"
                  fill={isSelected ? "rgba(34,211,238,0.2)" : "transparent"}
                  stroke={isSelected ? "rgba(34,211,238,0.7)" : "transparent"}
                  strokeWidth={isSelected ? "1.5" : "0"}
                  onClick={() => onAreaClick(area.id)}
                  filter={isSelected ? "url(#selGlow)" : undefined}
                  style={{ pointerEvents: 'all' }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.target as SVGPathElement).setAttribute('fill', 'rgba(34,211,238,0.08)');
                      (e.target as SVGPathElement).setAttribute('stroke', 'rgba(34,211,238,0.3)');
                      (e.target as SVGPathElement).setAttribute('stroke-width', '1');
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.target as SVGPathElement).setAttribute('fill', 'transparent');
                      (e.target as SVGPathElement).setAttribute('stroke', 'transparent');
                      (e.target as SVGPathElement).setAttribute('stroke-width', '0');
                    }
                  }}
                >
                  <title>{area.label}</title>
                </path>
              );
            })}

            {/* ==================== PULSE RINGS ON SELECTED ==================== */}
            {selectedAreas.map(area => {
              const centers: Record<string, { cx: number; cy: number }> = {
                head: { cx: 150, cy: 55 },
                neck: { cx: 150, cy: 108 },
                chest: { cx: 150, cy: 170 },
                left_shoulder: { cx: 88, cy: 132 },
                right_shoulder: { cx: 212, cy: 132 },
                abdomen: { cx: 150, cy: 240 },
                left_arm: { cx: 65, cy: 200 },
                right_arm: { cx: 235, cy: 200 },
                pelvis: { cx: 150, cy: 310 },
                left_hand: { cx: 55, cy: 315 },
                right_hand: { cx: 245, cy: 315 },
                left_leg: { cx: 125, cy: 410 },
                right_leg: { cx: 175, cy: 410 },
                left_foot: { cx: 112, cy: 515 },
                right_foot: { cx: 188, cy: 515 },
              };
              const center = centers[area];
              if (!center) return null;
              return (
                <g key={`pulse-${area}`}>
                  <circle cx={center.cx} cy={center.cy} r="8" className="fill-none stroke-cyan-400 stroke-1" filter="url(#selGlow)">
                    <animate attributeName="r" values="8;22;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={center.cx} cy={center.cy} r="4" className="fill-cyan-400/70" filter="url(#selGlow)" />
                </g>
              );
            })}

            {/* ==================== FLOATING DATA PARTICLES ==================== */}
            {[
              { cx: 70, cy: 180, delay: 0 },
              { cx: 230, cy: 200, delay: 0.5 },
              { cx: 150, cy: 400, delay: 1 },
              { cx: 120, cy: 300, delay: 1.5 },
              { cx: 180, cy: 150, delay: 2 },
            ].map((p, i) => (
              <circle key={`particle-${i}`} cx={p.cx} cy={p.cy} r="1" className="fill-cyan-400/40">
                <animate attributeName="cy" values={`${p.cy};${p.cy - 30};${p.cy}`} dur="4s" begin={`${p.delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" begin={`${p.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-cyan-400/30" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-cyan-400/30" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-cyan-400/30" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-cyan-400/30" />
        </div>

        {/* Right side labels */}
        <div className="flex flex-col gap-1 min-w-[80px] items-start pt-8">
          {rightAreas.map(area => {
            const areaData = bodyAreas.find(a => a.id === area);
            if (!areaData) return null;
            return (
              <button
                key={area}
                onClick={() => onAreaClick(area)}
                className="flex items-center gap-1 px-2 py-1 rounded border border-cyan-400/60 bg-cyan-950/40 text-cyan-300 text-xs font-mono transition-all hover:bg-cyan-900/50 hover:border-cyan-300 animate-fade-in backdrop-blur-sm shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                <span>{areaData.label}</span>
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      {selectedAreas.length === 0 && (
        <p className="text-xs text-cyan-400/70 text-center max-w-[250px] font-mono">
          [ Πατήστε στο σώμα για επιλογή περιοχής ]
        </p>
      )}

      {/* Selected count */}
      {selectedAreas.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1 rounded border border-cyan-400/40 bg-cyan-950/30 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-xs text-cyan-300 font-mono">
            {selectedAreas.length} περιοχ{selectedAreas.length === 1 ? 'ή' : 'ές'} ενεργ{selectedAreas.length === 1 ? 'ή' : 'ές'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        .hologram-listening {
          box-shadow: 0 0 30px rgba(34,211,238,0.3), 0 0 60px rgba(34,211,238,0.15), inset 0 0 30px rgba(34,211,238,0.08);
        }
        
        .hologram-processing {
          animation: hologramPulse 1s ease-in-out infinite;
        }
        
        .hologram-responding {
          box-shadow: 0 0 40px rgba(52,211,153,0.3), 0 0 80px rgba(52,211,153,0.15), inset 0 0 30px rgba(52,211,153,0.08);
        }
        
        @keyframes hologramPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(34,211,238,0.2), inset 0 0 20px rgba(34,211,238,0.03); }
          50% { box-shadow: 0 0 40px rgba(34,211,238,0.4), inset 0 0 40px rgba(34,211,238,0.08); }
        }
      `}</style>
    </div>
  );
}
