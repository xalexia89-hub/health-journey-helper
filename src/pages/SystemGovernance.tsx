import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NODES, ADVISOR_MESSAGES, DataPacket, RiskLevel } from "@/components/system-governance/types";
import { CoreEngine } from "@/components/system-governance/CoreEngine";
import { OrbitNode } from "@/components/system-governance/OrbitNode";
import { DataFlowLayer } from "@/components/system-governance/DataFlowLayer";
import { SystemAdvisor } from "@/components/system-governance/SystemAdvisor";
import { FlowSteps, StatusBadge, Legend, Watermark } from "@/components/system-governance/Overlays";

export default function SystemGovernance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [msgIndex, setMsgIndex] = useState(0);
  const packetId = useRef(0);

  // Measure container
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
  const radius = Math.min(dims.w, dims.h) * 0.32;

  // Spawn packets
  useEffect(() => {
    const iv = setInterval(() => {
      const node = NODES[Math.floor(Math.random() * NODES.length)];
      const r: RiskLevel = Math.random() > 0.75 ? "critical" : Math.random() > 0.5 ? "deviation" : "nominal";
      packetId.current += 1;
      setPackets((p) => [...p.slice(-10), { id: packetId.current, fromAngle: node.angle, risk: r, progress: 0 }]);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Animate packets
  useEffect(() => {
    const iv = setInterval(() => {
      setPackets((p) => p.map((pk) => ({ ...pk, progress: pk.progress + 0.018 })).filter((pk) => pk.progress <= 1));
    }, 33);
    return () => clearInterval(iv);
  }, []);

  // Cycle advisor messages
  useEffect(() => {
    const iv = setInterval(() => setMsgIndex((i) => (i + 1) % ADVISOR_MESSAGES.length), 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #080c18 0%, #050810 50%, #020408 100%)" }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,200,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.3) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Slow scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px z-[5]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.05), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbit rings */}
      {[1, 0.65].map((scale) => (
        <div
          key={scale}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "50%",
            width: radius * 2 * scale,
            height: radius * 2 * scale,
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(100,200,255,0.05)",
          }}
        />
      ))}

      <DataFlowLayer radius={radius} cx={cx} cy={cy} packets={packets} />
      <CoreEngine />

      {NODES.map((node) => (
        <OrbitNode key={node.id} node={node} radius={radius} cx={cx} cy={cy} />
      ))}

      <FlowSteps />
      <StatusBadge />
      <Legend />
      <Watermark />

      <AnimatePresence mode="wait">
        <SystemAdvisor key={msgIndex} message={ADVISOR_MESSAGES[msgIndex]} />
      </AnimatePresence>
    </div>
  );
}
