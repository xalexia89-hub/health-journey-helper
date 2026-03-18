export type RiskLevel = "nominal" | "deviation" | "critical";

export interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  angle: number;
  risk: RiskLevel;
}

export interface DataPacket {
  id: number;
  fromAngle: number;
  risk: RiskLevel;
  progress: number;
}

export interface AdvisorMessage {
  risk: RiskLevel;
  title: string;
  detail: string;
  action: string;
}

export const RISK_STYLES: Record<RiskLevel, { hex: string; glow: string; bg: string }> = {
  nominal:   { hex: "#22c55e", glow: "0 0 20px rgba(34,197,94,0.35)",  bg: "rgba(34,197,94,0.08)" },
  deviation: { hex: "#f59e0b", glow: "0 0 20px rgba(245,158,11,0.35)", bg: "rgba(245,158,11,0.08)" },
  critical:  { hex: "#ef4444", glow: "0 0 20px rgba(239,68,68,0.35)",  bg: "rgba(239,68,68,0.08)" },
};

export const NODES: FlowNode[] = [
  { id: "user",      label: "User",             sublabel: "Input Source",     icon: "👤", angle: 0,     risk: "nominal" },
  { id: "medical",   label: "Medical Data",     sublabel: "EHR / Labs",      icon: "🧬", angle: 45,    risk: "nominal" },
  { id: "behavioral",label: "Behavior Signals", sublabel: "Wearable / IoT",  icon: "📡", angle: 90,    risk: "deviation" },
  { id: "risk",      label: "Risk Analysis",    sublabel: "AI Engine",       icon: "🧠", angle: 135,   risk: "critical" },
  { id: "decision",  label: "Decision",         sublabel: "Routing Logic",   icon: "⚡", angle: 180,   risk: "deviation" },
  { id: "doctor",    label: "Doctor",           sublabel: "Primary Care",    icon: "👨‍⚕️", angle: 225,   risk: "nominal" },
  { id: "hospital",  label: "Hospital",         sublabel: "Emergency / Ref", icon: "🏥", angle: 270,   risk: "nominal" },
  { id: "insurance", label: "Insurance",        sublabel: "Governance",      icon: "🛡️", angle: 315,   risk: "nominal" },
];

export const ADVISOR_MESSAGES: AdvisorMessage[] = [
  {
    risk: "deviation",
    title: "Deviation detected",
    detail: "Sleep pattern anomaly identified. Heart rate variability dropped 18% over 72h.",
    action: "Risk level: medium — Suggested action: contact doctor",
  },
  {
    risk: "critical",
    title: "Critical escalation",
    detail: "Cardiac rhythm deviation exceeds safe threshold by 23%. Immediate routing engaged.",
    action: "Risk level: high — Action: emergency referral to cardiology",
  },
  {
    risk: "nominal",
    title: "System nominal",
    detail: "All health parameters within expected corridors. No deviations detected.",
    action: "Risk level: low — Continue passive monitoring cycle",
  },
  {
    risk: "deviation",
    title: "Behavioral drift",
    detail: "Medication adherence dropped below 70%. Activity levels declining for 5 days.",
    action: "Risk level: medium — Suggested action: preventive consultation",
  },
];
