import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type RiskLevel = "normal" | "deviation" | "urgent";

interface FlowNode {
  id: string;
  label: string;
  icon: string;
  angle: number; // degrees on the orbit
  risk: RiskLevel;
}

interface DataPacket {
  id: number;
  fromAngle: number;
  toAngle: number;
  risk: RiskLevel;
  progress: number;
}

// --- Constants ---
const NODES: FlowNode[] = [
  { id: "user", label: "User", icon: "👤", angle: 0, risk: "normal" },
  { id: "medical", label: "Medical Data", icon: "🧬", angle: 51.4, risk: "normal" },
  { id: "behavioral", label: "Behavioral Signals", icon: "📡", angle: 102.8, risk: "deviation" },
  { id: "ai", label: "AI Risk Analysis", icon: "🧠", angle: 154.3, risk: "urgent" },
  { id: "decision", label: "Decision Layer", icon: "⚡", angle: 205.7, risk: "deviation" },
  { id: "doctor", label: "Doctor / Hospital", icon: "🏥", angle: 257.1, risk: "normal" },
  { id: "insurance", label: "Insurance", icon: "🛡️", angle: 308.5, risk: "normal" },
];

const RISK_COLORS: Record<RiskLevel, { glow: string; bg: string; text: string; hex: string }> = {
  normal: { glow: "0 0 30px rgba(34,197,94,0.6)", bg: "rgba(34,197,94,0.15)", text: "#22c55e", hex: "#22c55e" },
  deviation: { glow: "0 0 30px rgba(234,179,8,0.6)", bg: "rgba(234,179,8,0.15)", text: "#eab308", hex: "#eab308" },
  urgent: { glow: "0 0 30px rgba(239,68,68,0.6)", bg: "rgba(239,68,68,0.15)", text: "#ef4444", hex: "#ef4444" },
};

const AVATAR_MESSAGES = [
  { risk: "deviation" as RiskLevel, title: "Deviation Detected", detail: "Behavioral pattern anomaly identified in sleep cycle data.", action: "Suggested: Schedule preventive consultation within 48h" },
  { risk: "urgent" as RiskLevel, title: "Risk Escalation", detail: "Cardiac rhythm deviation exceeds threshold by 23%.", action: "Action: Route to cardiology — priority queue activated" },
  { risk: "normal" as RiskLevel, title: "System Nominal", detail: "All health parameters within expected deviation corridors.", action: "Status: Continue passive monitoring cycle" },
  { risk: "deviation" as RiskLevel, title: "Cost Anomaly", detail: "Claims frequency increased 18% above baseline for cohort.", action: "Suggested: Trigger behavioral compliance review" },
];

// --- Helpers ---
function polarToCartesian(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// --- Components ---
function GlowingCore() {
  return (
    <motion.div
      className="absolute z-20 flex flex-col items-center justify-center"
      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
    >
      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 160 + i * 60,
            height: 160 + i * 60,
            borderColor: `rgba(0,212,255,${0.15 - i * 0.04})`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.4 - i * 0.1, 0.2, 0.4 - i * 0.1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Core glow */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: 150,
          height: 150,
          background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.05) 50%, transparent 70%)",
          boxShadow: "0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,212,255,0.1)",
        }}
        animate={{
          boxShadow: [
            "0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,212,255,0.1)",
            "0 0 80px rgba(0,212,255,0.5), 0 0 160px rgba(0,212,255,0.15), inset 0 0 60px rgba(0,212,255,0.15)",
            "0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,212,255,0.1)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-light tracking-[0.3em] uppercase" style={{ color: "rgba(0,212,255,0.7)" }}>
          MEDITHOS
        </span>
        <span className="text-[13px] font-semibold tracking-wider mt-0.5" style={{ color: "#00d4ff" }}>
          Decision Engine
        </span>
        <motion.div
          className="mt-2 h-[1px] rounded-full"
          style={{ background: "rgba(0,212,255,0.4)", width: 60 }}
          animate={{ width: [40, 70, 40], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: "50%",
        top: "50%",
        width: radius * 2,
        height: radius * 2,
        transform: "translate(-50%, -50%)",
        border: "1px solid rgba(0,212,255,0.08)",
      }}
    />
  );
}

function NodeElement({ node, radius, cx, cy }: { node: FlowNode; radius: number; cx: number; cy: number }) {
  const pos = polarToCartesian(node.angle, radius, cx, cy);
  const colors = RISK_COLORS[node.risk];

  return (
    <motion.div
      className="absolute z-30 flex flex-col items-center"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + NODES.indexOf(node) * 0.1, duration: 0.6, ease: "backOut" }}
    >
      {/* Node body */}
      <motion.div
        className="flex items-center justify-center rounded-full relative"
        style={{
          width: 52,
          height: 52,
          background: colors.bg,
          border: `1px solid ${colors.text}33`,
          boxShadow: colors.glow,
        }}
        animate={{
          boxShadow: [
            colors.glow,
            colors.glow.replace("0.6", "0.9"),
            colors.glow,
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xl">{node.icon}</span>
        
        {/* Status indicator */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 rounded-full"
          style={{
            width: 10,
            height: 10,
            background: colors.hex,
            boxShadow: `0 0 8px ${colors.hex}`,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Label */}
      <span
        className="mt-1.5 text-[9px] font-medium tracking-wider uppercase whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {node.label}
      </span>
    </motion.div>
  );
}

function DataFlowSVG({ radius, cx, cy, packets }: { radius: number; cx: number; cy: number; packets: DataPacket[] }) {
  return (
    <svg
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-yellow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connection lines from nodes to center */}
      {NODES.map((node) => {
        const pos = polarToCartesian(node.angle, radius, cx, cy);
        const colors = RISK_COLORS[node.risk];
        return (
          <line
            key={node.id}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke={colors.hex}
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        );
      })}

      {/* Animated packets */}
      {packets.map((pkt) => {
        const fromPos = polarToCartesian(pkt.fromAngle, radius, cx, cy);
        const toX = cx;
        const toY = cy;
        const x = fromPos.x + (toX - fromPos.x) * pkt.progress;
        const y = fromPos.y + (toY - fromPos.y) * pkt.progress;
        const colors = RISK_COLORS[pkt.risk];
        const filterName = pkt.risk === "normal" ? "glow-green" : pkt.risk === "deviation" ? "glow-yellow" : "glow-red";
        return (
          <circle
            key={pkt.id}
            cx={x}
            cy={y}
            r={3}
            fill={colors.hex}
            filter={`url(#${filterName})`}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

function AvatarAdvisor({ message }: { message: typeof AVATAR_MESSAGES[0] }) {
  const colors = RISK_COLORS[message.risk];

  return (
    <motion.div
      className="absolute z-40 right-6 bottom-6 md:right-10 md:bottom-10"
      style={{ maxWidth: 320 }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="rounded-xl p-4 backdrop-blur-xl"
        style={{
          background: "rgba(10,15,30,0.85)",
          border: `1px solid ${colors.hex}22`,
          boxShadow: `0 0 40px rgba(0,0,0,0.5), 0 0 20px ${colors.hex}15`,
        }}
      >
        {/* Avatar indicator */}
        <div className="flex items-center gap-2.5 mb-3">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: colors.bg, border: `1px solid ${colors.hex}44` }}
            animate={{ boxShadow: [`0 0 10px ${colors.hex}33`, `0 0 20px ${colors.hex}55`, `0 0 10px ${colors.hex}33`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🤖
          </motion.div>
          <div>
            <span className="text-[10px] font-light tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
              System Advisor
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: colors.hex }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                {message.title}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
          {message.detail}
        </p>

        <div
          className="rounded-lg px-3 py-2 text-[10px] font-medium"
          style={{ background: `${colors.hex}10`, color: colors.text, border: `1px solid ${colors.hex}20` }}
        >
          {message.action}
        </div>
      </div>
    </motion.div>
  );
}

function FlowLegend() {
  return (
    <div
      className="absolute left-6 bottom-6 md:left-10 md:bottom-10 z-40 flex flex-col gap-2 rounded-xl px-4 py-3 backdrop-blur-xl"
      style={{
        background: "rgba(10,15,30,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-[9px] font-light tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
        Risk Classification
      </span>
      {(["normal", "deviation", "urgent"] as RiskLevel[]).map((level) => (
        <div key={level} className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: RISK_COLORS[level].hex, boxShadow: `0 0 6px ${RISK_COLORS[level].hex}` }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] capitalize" style={{ color: "rgba(255,255,255,0.5)" }}>
            {level === "deviation" ? "Deviation" : level === "urgent" ? "Urgent" : "Normal"}
          </span>
        </div>
      ))}
    </div>
  );
}

function FlowSteps() {
  const steps = [
    "Data enters system",
    "Detect deviation",
    "Evaluate risk score",
    "Route to action",
  ];
  return (
    <div
      className="absolute left-6 top-6 md:left-10 md:top-10 z-40 flex items-center gap-1 rounded-xl px-4 py-2.5 backdrop-blur-xl"
      style={{
        background: "rgba(10,15,30,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.3 }}
        >
          <span
            className="text-[9px] font-medium tracking-wider whitespace-nowrap"
            style={{ color: "rgba(0,212,255,0.6)" }}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <motion.span
              style={{ color: "rgba(255,255,255,0.2)" }}
              className="text-xs mx-1"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            >
              →
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function HeaderBadge() {
  return (
    <motion.div
      className="absolute top-6 right-6 md:top-10 md:right-10 z-40 flex items-center gap-2 rounded-xl px-4 py-2 backdrop-blur-xl"
      style={{
        background: "rgba(10,15,30,0.7)",
        border: "1px solid rgba(0,212,255,0.1)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-[10px] font-medium tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
        SYSTEM ACTIVE
      </span>
      <span className="text-[9px] font-light" style={{ color: "rgba(0,212,255,0.5)" }}>
        v2.1
      </span>
    </motion.div>
  );
}

// --- Main Page ---
export default function SystemGovernance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [msgIndex, setMsgIndex] = useState(0);
  const packetIdRef = useRef(0);

  // Responsive sizing
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const radius = Math.min(dims.w, dims.h) * 0.33;

  // Generate data packets
  useEffect(() => {
    const interval = setInterval(() => {
      const node = NODES[Math.floor(Math.random() * NODES.length)];
      const risk: RiskLevel = Math.random() > 0.7 ? "urgent" : Math.random() > 0.5 ? "deviation" : "normal";
      packetIdRef.current += 1;
      setPackets((prev) => [
        ...prev.slice(-12),
        { id: packetIdRef.current, fromAngle: node.angle, toAngle: 0, risk, progress: 0 },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Animate packets
  useEffect(() => {
    const raf = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 0.02 }))
          .filter((p) => p.progress <= 1)
      );
    }, 30);
    return () => clearInterval(raf);
  }, []);

  // Cycle avatar messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % AVATAR_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0a0f1e 0%, #060a14 50%, #030508 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] z-[5]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.08), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbit ring */}
      <OrbitRing radius={radius} />
      <OrbitRing radius={radius * 0.6} />

      {/* SVG data flows */}
      <DataFlowSVG radius={radius} cx={cx} cy={cy} packets={packets} />

      {/* Core */}
      <GlowingCore />

      {/* Nodes */}
      {NODES.map((node) => (
        <NodeElement key={node.id} node={node} radius={radius} cx={cx} cy={cy} />
      ))}

      {/* UI Overlays */}
      <FlowSteps />
      <HeaderBadge />
      <FlowLegend />

      <AnimatePresence mode="wait">
        <AvatarAdvisor key={msgIndex} message={AVATAR_MESSAGES[msgIndex]} />
      </AnimatePresence>

      {/* Title watermark */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-center">
        <span className="text-[9px] font-light tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
          Real-Time Health Risk Governance Infrastructure
        </span>
      </div>
    </div>
  );
}
