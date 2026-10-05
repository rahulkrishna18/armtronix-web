// Label content + anchor positions for the 3D scenes. Kept free of three.js so
// section components can render label DOM without pulling the WebGL bundle.
type P = [number, number, number];

/** Hero telemetry callouts — values are simulated UI content. */
export const HERO_LABELS: { id: string; p: P; code: string; value: string; tone: string; at: number }[] = [
  { id: "tx", p: [-7.6, 1.68, -4.8], code: "TX-01 · POWER", value: "Energized", tone: "#168BFF", at: 0.3 },
  { id: "chiller", p: [3, 4.64, -1.6], code: "CH-03 · COOLING", value: "18.4 °C supply", tone: "#7FDBFF", at: 0.34 },
  { id: "fiber", p: [9, 2.93, -2.2], code: "FIBER · CARRIER", value: "Link up", tone: "#00C8E8", at: 0.5 },
  { id: "rack", p: [0.53, 2.38, 1.05], code: "RACK B-07", value: "6.4 kW · 24.1 °C", tone: "#4DFF9A", at: 0.72 },
  { id: "core", p: [-0.8, 7.68, -0.6], code: "ATX · INTELLIGENCE", value: "16/16 sensors", tone: "#00C8E8", at: 0.94 },
];

export const TRANSMISSION_LABELS: { id: string; p: P; title: string; sub?: string; color: string }[] = [
  { id: "grid", p: [-13, 4.6, 0], title: "NATIONAL GRID", sub: "Substation", color: "#168BFF" },
  { id: "facility", p: [1.5, 4.0, 0], title: "FACILITY", sub: "Mission-critical load", color: "#E9F0F2" },
  { id: "telecom", p: [8, 9.4, 0], title: "TELECOM · 5G", sub: "Utility interconnection", color: "#00C8E8" },
  { id: "carrier", p: [13, 2.6, 0], title: "CARRIER NETWORK", sub: "Exchange", color: "#00C8E8" },
  { id: "intel", p: [1.5, 8.3, 0], title: "INTELLIGENCE", sub: "Monitoring & optimization", color: "#4DFF9A" },
  { id: "section", p: [8.5, -1.25, 0.9], title: "FIBER · SECTION VIEW", color: "#5F6F78" },
];

export const NETWORK_NODES = [
  { id: "monitoring", label: "Monitoring" },
  { id: "analytics", label: "Analytics" },
  { id: "automation", label: "Automation" },
  { id: "cloud", label: "Cloud" },
  { id: "security", label: "Security" },
] as const;

export const ECOSYSTEM_LAYER_STYLE = [
  { label: "Foundation", color: "#C9D6DC" },
  { label: "Facility", color: "#E9F0F2" },
  { label: "Engineering Systems", color: "#4DFF9A" },
  { label: "Power + Network", color: "#168BFF" },
  { label: "Digital Intelligence", color: "#00C8E8" },
];
