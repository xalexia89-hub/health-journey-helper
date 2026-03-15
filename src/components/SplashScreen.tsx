import { useState, useEffect } from "react";
import medithoLogo from "@/assets/medithos-new-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "fadeout">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fadeout"), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-600 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 40%, hsl(190 70% 55% / 0.15), hsl(215 50% 8%) 70%)",
      }}
    >
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[300px] h-[300px] rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]"
          style={{ opacity: phase === "logo" ? 0 : 0.6, transition: "opacity 0.8s" }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[220px] h-[220px] rounded-full border border-accent/15 animate-[spin_15s_linear_infinite_reverse]"
          style={{ opacity: phase === "logo" ? 0 : 0.4, transition: "opacity 1s" }}
        />
      </div>

      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 animate-float"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + (i * 17) % 70}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: phase !== "logo" ? 0.6 : 0,
            transition: "opacity 0.6s",
          }}
        />
      ))}

      {/* Logo */}
      <div
        className="relative transition-all duration-700 ease-out"
        style={{
          transform: phase === "logo" ? "scale(0.7)" : "scale(1)",
          opacity: phase === "logo" ? 0 : 1,
        }}
      >
        {/* Glow behind logo */}
        <div className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <img
          src={medithoLogo}
          alt="Medithos"
          className="w-24 h-24 rounded-2xl object-contain relative z-10 drop-shadow-[0_0_30px_hsl(190_70%_55%/0.6)]"
        />
      </div>

      {/* Text */}
      <div
        className="mt-8 text-center transition-all duration-700 ease-out"
        style={{
          transform: phase === "text" || phase === "fadeout" ? "translateY(0)" : "translateY(12px)",
          opacity: phase === "text" || phase === "fadeout" ? 1 : 0,
        }}
      >
        <h1 className="text-4xl font-bold tracking-widest">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(190_70%_55%/0.5)]">
            MEDITHOS
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground tracking-[0.2em] uppercase">
          AI Health Navigator
        </p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-48 h-0.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all ease-out"
          style={{
            width: phase === "logo" ? "0%" : phase === "text" ? "60%" : "100%",
            transitionDuration: phase === "text" ? "1.6s" : "0.5s",
          }}
        />
      </div>
    </div>
  );
}
