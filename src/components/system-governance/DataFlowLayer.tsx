import { NODES, RISK_STYLES, DataPacket } from "./types";
import { polarToXY } from "./OrbitNode";

interface DataFlowLayerProps {
  radius: number;
  cx: number;
  cy: number;
  packets: DataPacket[];
}

export function DataFlowLayer({ radius, cx, cy, packets }: DataFlowLayerProps) {
  return (
    <svg className="absolute inset-0 z-10 pointer-events-none w-full h-full">
      <defs>
        <filter id="pkt-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      {NODES.map((node) => {
        const pos = polarToXY(node.angle, radius, cx, cy);
        return (
          <line
            key={node.id}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke="rgba(100,200,255,0.06)"
            strokeWidth={1}
            strokeDasharray="3 8"
          />
        );
      })}

      {/* Packets */}
      {packets.map((pkt) => {
        const from = polarToXY(pkt.fromAngle, radius, cx, cy);
        const x = from.x + (cx - from.x) * pkt.progress;
        const y = from.y + (cy - from.y) * pkt.progress;
        const s = RISK_STYLES[pkt.risk];
        return (
          <circle
            key={pkt.id}
            cx={x}
            cy={y}
            r={2.5}
            fill={s.hex}
            filter="url(#pkt-glow)"
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}
