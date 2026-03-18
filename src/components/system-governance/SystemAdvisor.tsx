import { motion } from "framer-motion";
import { AdvisorMessage, RISK_STYLES } from "./types";

interface SystemAdvisorProps {
  message: AdvisorMessage;
}

export function SystemAdvisor({ message }: SystemAdvisorProps) {
  const s = RISK_STYLES[message.risk];

  return (
    <motion.div
      className="absolute z-40 right-3 bottom-14 md:right-8 md:bottom-8"
      style={{ maxWidth: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="rounded-lg p-3.5 backdrop-blur-xl"
        style={{
          background: "rgba(8,12,24,0.9)",
          border: `1px solid ${s.hex}18`,
          boxShadow: `0 0 30px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ background: s.bg, border: `1px solid ${s.hex}30` }}
          >
            🤖
          </div>
          <div>
            <span className="text-[8px] font-light tracking-[0.2em] uppercase block" style={{ color: "rgba(255,255,255,0.3)" }}>
              System Advisor
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: s.hex }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-[11px] font-medium" style={{ color: s.hex }}>
                {message.title}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
          {message.detail}
        </p>

        <div
          className="rounded px-2.5 py-1.5 text-[9px] font-medium"
          style={{ background: `${s.hex}0a`, color: s.hex, border: `1px solid ${s.hex}15` }}
        >
          {message.action}
        </div>
      </div>
    </motion.div>
  );
}
