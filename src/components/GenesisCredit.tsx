import { Link } from "react-router-dom";
import genesisLogo from "@/assets/genesis-logo.png";

interface GenesisCreditProps {
  variant?: "compact" | "full";
  className?: string;
}

export function GenesisCredit({ variant = "compact", className = "" }: GenesisCreditProps) {
  if (variant === "full") {
    return (
      <Link
        to="/about"
        className={`group inline-flex items-center gap-3 rounded-xl bg-black/60 backdrop-blur-md px-4 py-2.5 border border-white/10 hover:border-cyan-400/40 transition-all ${className}`}
      >
        <img src={genesisLogo} alt="Genesis" className="h-7 w-7 object-contain" />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/70">Powered by</span>
          <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
            Genesis
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/about"
      className={`inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      <img src={genesisLogo} alt="Genesis" className="h-5 w-5 object-contain opacity-80" />
      <span>
        Powered by <span className="font-semibold text-foreground">Genesis</span>
      </span>
    </Link>
  );
}
