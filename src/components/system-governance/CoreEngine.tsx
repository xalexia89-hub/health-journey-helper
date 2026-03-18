import { motion } from "framer-motion";

export function CoreEngine() {
  return (
    <div
      className="absolute z-20 flex flex-col items-center justify-center"
      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
    >
      {/* Subtle outer rings */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 140 + i * 50,
            height: 140 + i * 50,
            border: `1px solid rgba(100,200,255,${0.06 - i * 0.02})`,
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.25, 0.5] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}

      {/* Core */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: 130,
          height: 130,
          background: "radial-gradient(circle, rgba(100,200,255,0.1) 0%, transparent 70%)",
          boxShadow: "0 0 40px rgba(100,200,255,0.12), inset 0 0 30px rgba(100,200,255,0.06)",
        }}
        animate={{
          boxShadow: [
            "0 0 40px rgba(100,200,255,0.12), inset 0 0 30px rgba(100,200,255,0.06)",
            "0 0 60px rgba(100,200,255,0.2), inset 0 0 40px rgba(100,200,255,0.1)",
            "0 0 40px rgba(100,200,255,0.12), inset 0 0 30px rgba(100,200,255,0.06)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="text-[8px] font-light tracking-[0.35em] uppercase"
          style={{ color: "rgba(160,210,240,0.5)" }}
        >
          MEDITHOS CORE
        </span>
        <span
          className="text-[12px] font-medium tracking-widest mt-0.5"
          style={{ color: "rgba(160,210,240,0.85)" }}
        >
          Decision Engine
        </span>
        <motion.div
          className="mt-2 rounded-full"
          style={{ height: 1, background: "rgba(100,200,255,0.25)", width: 50 }}
          animate={{ width: [35, 60, 35], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
