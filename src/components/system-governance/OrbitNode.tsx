import { motion } from "framer-motion";
import { FlowNode, RISK_STYLES, NODES } from "./types";

function polarToXY(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

interface OrbitNodeProps {
  node: FlowNode;
  radius: number;
  cx: number;
  cy: number;
}

export function OrbitNode({ node, radius, cx, cy }: OrbitNodeProps) {
  const pos = polarToXY(node.angle, radius, cx, cy);
  const s = RISK_STYLES[node.risk];

  return (
    <motion.div
      className="absolute z-30 flex flex-col items-center"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + NODES.indexOf(node) * 0.08, duration: 0.5, ease: "backOut" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full relative"
        style={{
          width: 48,
          height: 48,
          background: s.bg,
          border: `1px solid ${s.hex}22`,
          boxShadow: s.glow,
        }}
        animate={{
          boxShadow: [s.glow, s.glow.replace("0.35", "0.55"), s.glow],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-lg">{node.icon}</span>

        {/* Status dot */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 rounded-full"
          style={{ width: 8, height: 8, background: s.hex, boxShadow: `0 0 6px ${s.hex}` }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>

      <span
        className="mt-1 text-[8px] font-medium tracking-wider uppercase whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {node.label}
      </span>
      <span
        className="text-[7px] tracking-wide whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        {node.sublabel}
      </span>
    </motion.div>
  );
}

export { polarToXY };
