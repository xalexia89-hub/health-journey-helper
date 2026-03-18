import { motion } from "framer-motion";
import { RISK_STYLES, RiskLevel } from "./types";

export function FlowSteps() {
  const steps = ["Data enters", "Detect deviation", "Evaluate risk", "Route decision", "Guide user"];
  return (
    <div
      className="absolute left-3 top-3 md:left-8 md:top-8 z-40 flex flex-wrap items-center gap-1 rounded-lg px-3 py-2 backdrop-blur-xl"
      style={{ background: "rgba(8,12,24,0.75)", border: "1px solid rgba(255,255,255,0.04)", maxWidth: "calc(100% - 130px)" }}
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.2 }}
        >
          <span className="text-[8px] font-medium tracking-wider whitespace-nowrap" style={{ color: "rgba(100,200,255,0.5)" }}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <motion.span
              className="text-[9px] mx-0.5"
              style={{ color: "rgba(255,255,255,0.15)" }}
              animate={{ opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
            >
              →
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export function StatusBadge() {
  return (
    <motion.div
      className="absolute top-3 right-3 md:top-8 md:right-8 z-40 flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-xl"
      style={{ background: "rgba(8,12,24,0.75)", border: "1px solid rgba(100,200,255,0.08)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-[9px] font-medium tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
        ACTIVE
      </span>
    </motion.div>
  );
}

export function Legend() {
  const levels: { level: RiskLevel; label: string }[] = [
    { level: "nominal", label: "Nominal" },
    { level: "deviation", label: "Deviation" },
    { level: "critical", label: "Critical" },
  ];

  return (
    <div
      className="absolute left-3 bottom-14 md:left-8 md:bottom-8 z-40 flex flex-col gap-1.5 rounded-lg px-3 py-2.5 backdrop-blur-xl"
      style={{ background: "rgba(8,12,24,0.75)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <span className="text-[7px] font-light tracking-[0.25em] uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
        Risk Classification
      </span>
      {levels.map(({ level, label }) => (
        <div key={level} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_STYLES[level].hex }} />
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function Watermark() {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 text-center">
      <span className="text-[8px] font-light tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.1)" }}>
        Real-Time Health Risk Governance
      </span>
    </div>
  );
}
