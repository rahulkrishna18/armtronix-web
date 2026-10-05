import type { DivisionSlug } from "./divisions";

/** The five physical-to-digital layers of the Armtronix ecosystem, bottom to top. */
export const ECOSYSTEM_LAYERS: {
  id: string;
  label: string;
  division: DivisionSlug;
  divisionName: string;
  pillar: string;
  body: string;
  tags: string[];
}[] = [
  {
    id: "foundation",
    label: "Foundation",
    division: "construction",
    divisionName: "Armtronix Construction",
    pillar: "Foundation",
    body: "Delivering G7-grade industrial shells and heavy civil infrastructure.",
    tags: ["Civil Engineering", "Concrete Foundations", "Site Development"],
  },
  {
    id: "facility",
    label: "Facility",
    division: "construction",
    divisionName: "Armtronix Construction",
    pillar: "Foundation",
    body: "Infrastructure engineered for uptime, resilience, redundancy, and continuous operational performance.",
    tags: ["Structural Steel", "Digital Construction Planning", "Safety & Compliance"],
  },
  {
    id: "systems",
    label: "Engineering Systems",
    division: "engineering",
    divisionName: "Armtronix Engineering",
    pillar: "Systemization",
    body: "Integrating HVAC, vertical transport, and intelligent fire suppression systems.",
    tags: ["MEP Systems", "Cooling & Thermal", "CIDB Grade 7"],
  },
  {
    id: "power-network",
    label: "Power + Network",
    division: "transmission",
    divisionName: "Armtronix Transmission",
    pillar: "Connectivity",
    body: "Providing high-voltage power and 5G utility interconnections.",
    tags: ["High-Voltage Lines", "Substation Design", "Fiber Optic Networks"],
  },
  {
    id: "intelligence",
    label: "Digital Intelligence",
    division: "technologies",
    divisionName: "Armtronix Technologies",
    pillar: "Intelligence",
    body: "Deploying secure cloud architecture, cybersecurity frameworks, and IIoT stacks.",
    tags: ["IIoT", "Cybersecurity", "AI-Powered Analytics"],
  },
];

/** Engineered Intelligence — physical → connected → intelligent. */
export const PHILOSOPHY_STAGES = [
  {
    id: "physical",
    label: "Physical",
    title: "Physical infrastructure",
    items: ["Concrete", "Steel", "Power", "Cooling", "Mechanical systems"],
  },
  {
    id: "connected",
    label: "Connected",
    title: "Communication networks",
    items: ["Fiber", "Networks", "Sensors", "Controllers"],
  },
  {
    id: "intelligent",
    label: "Intelligent",
    title: "Digital technologies",
    items: ["IIoT", "Automation", "Analytics", "AI", "Operational visibility"],
  },
] as const;

export const PHILOSOPHY_COPY = {
  eyebrow: "Engineered Intelligence",
  title: ["One Ecosystem.", "Infinite Possibilities."],
  body: "At the core of Armtronix lies the philosophy of Engineered Intelligence — a seamless integration of physical infrastructure, energy systems, communication networks, and digital technologies into one coordinated operational framework.",
  outcome: "Real-time visibility, operational resilience, advanced cybersecurity, and intelligent automation across every infrastructure layer.",
  closing:
    "Infrastructure is no longer isolated systems operating independently. At Armtronix, every component functions as a connected ecosystem designed, built, secured, and optimized for long-term performance.",
};

/** Exploded engineering module layers (bottom → top). */
export const ENGINEERING_LAYERS = [
  { id: "structure", label: "Structure", system: "Structural frame", note: "Structural steel & concrete foundations", color: "#9FB3BE" },
  { id: "power", label: "Power", system: "High-capacity power", note: "Reliable high-load distribution with built-in redundancy", color: "#168BFF" },
  { id: "cooling", label: "Cooling", system: "Thermal management", note: "Precision thermal control for high-density compute", color: "#7FDBFF" },
  { id: "mechanical", label: "Mechanical", system: "HVAC & vertical transport", note: "HVAC, vertical transport & fire suppression", color: "#E9F0F2" },
  { id: "automation", label: "Automation", system: "Automation controls", note: "HVAC, automation & controls in unified building systems", color: "#4DFF9A" },
  { id: "connectivity", label: "Connectivity", system: "Structured cabling", note: "Fiber optic & structured cabling systems", color: "#00C8E8" },
  { id: "monitoring", label: "Monitoring", system: "Infrastructure monitoring", note: "Continuous monitoring with proactive performance tuning", color: "#4DFF9A" },
] as const;

export const TRANSMISSION_FLOWS = [
  { id: "energy", from: "Energy", to: "Facility", color: "#168BFF", body: "High-capacity power infrastructure connecting facilities to the national grid." },
  { id: "data", from: "Data", to: "Network", color: "#00C8E8", body: "Fiber infrastructure connecting facilities to carrier networks." },
  { id: "sensors", from: "Sensors", to: "Intelligence", color: "#4DFF9A", body: "Continuous monitoring with proactive performance tuning." },
] as const;

/** Technologies capabilities mapped to verified delivery items. */
export const TECH_CAPABILITIES = [
  { id: "iiot", label: "IIoT", source: "IoT-enabled monitoring systems", body: "Sensor-driven visibility across every asset and system.", tier: 1 },
  { id: "automation", label: "Automation", source: "AI-powered infrastructure automation", body: "Autonomous operations driven by AI across critical infrastructure.", tier: 2 },
  { id: "monitoring", label: "Operational Monitoring", source: "Operational command & control systems", body: "One control layer for full situational awareness and rapid response.", tier: 2 },
  { id: "analytics", label: "Analytics", source: "Predictive analytics & reporting", body: "Turning operational data into predictive, actionable insight.", tier: 3 },
  { id: "cloud", label: "Cloud Infrastructure", source: "Digital infrastructure integration", body: "Connecting cloud, edge, and on-prem into one unified fabric.", tier: 3 },
  { id: "security", label: "Cybersecurity", source: "Cybersecurity frameworks", body: "Advanced cybersecurity frameworks across every infrastructure layer.", tier: 3 },
  { id: "intelligent", label: "Intelligent Systems", source: "Smart building intelligence platforms", body: "Unified intelligence for smart, responsive building operations.", tier: 3 },
] as const;

export type TechCapabilityId = (typeof TECH_CAPABILITIES)[number]["id"];

export const INDUSTRIES = [
  { id: "datacenters", name: "Datacenters", code: "DC", tags: ["Tier III+ environments", "2N power redundancy", "Precision cooling"] },
  { id: "industrial", name: "Industrial Facilities", code: "IN", tags: ["Integrated mechatronics", "Automation controls", "Structural steel"] },
  { id: "smart-buildings", name: "Smart Buildings", code: "SB", tags: ["Building systems integration", "Smart building intelligence", "HVAC & controls"] },
  { id: "telecom", name: "Telecommunications", code: "TC", tags: ["Fiber optic networks", "5G utility interconnections", "Redundant networks"] },
  { id: "government", name: "Government Infrastructure", code: "GV", tags: ["National digital sovereignty", "Infrastructure governance", "Sovereign digital assets"] },
  { id: "cloud", name: "Cloud & Digital Ecosystems", code: "CL", tags: ["Secure cloud architecture", "Cloud computing environments", "Digital integration"] },
  { id: "energy", name: "Energy Infrastructure", code: "EN", tags: ["High-voltage lines", "Substation design", "Smart grid integration"] },
  { id: "security", name: "High-Security Facilities", code: "HS", tags: ["High-security datacenter operations", "Cybersecurity frameworks", "Secure data & power"] },
] as const;

export type IndustryId = (typeof INDUSTRIES)[number]["id"];

export const LIFECYCLE = {
  label: "Integrated lifecycle",
  intro:
    "Complete lifecycle solutions — from planning and engineering through construction, deployment, monitoring, optimization, and long-term operational support.",
  steps: ["Plan", "Engineer", "Construct", "Deploy", "Monitor", "Optimize", "Support"],
};

export const SHOWCASE = [
  {
    id: "mission-critical",
    index: "01",
    division: "Construction",
    title: "Mission-Critical Infrastructure Development",
    summary: "Delivered large-scale infrastructure environments engineered for high-density compute and continuous operations.",
    detail:
      "A large-scale infrastructure initiative engineered to support high-performance environments through integrated construction, controlled building systems, and lifecycle-ready design aligned with mission-critical requirements.",
    image: { src: "/images/construction.webp", alt: "Aerial view of a large-scale infrastructure development under construction" },
    annotations: [
      { label: "Integrated construction", x: 30, y: 58 },
      { label: "Controlled building systems", x: 62, y: 40 },
      { label: "Lifecycle-ready design", x: 78, y: 70 },
    ],
    specs: ["High-density compute", "Continuous operations", "Mission-critical requirements"],
    href: "/construction",
  },
  {
    id: "mechatronics",
    index: "02",
    division: "Engineering",
    title: "Integrated Mechatronics Engineering",
    summary: "Designed and deployed advanced engineering systems including power, cooling, and automation within complex environments.",
    detail:
      "Mechanical, electrical, cooling, and utility systems engineered within a coordinated operational framework — performance-focused infrastructure engineered for uptime, fault tolerance, and operational continuity.",
    image: { src: "/images/engineering.webp", alt: "Industrial plant with mechanical systems and service platforms" },
    annotations: [
      { label: "Power", x: 72, y: 26 },
      { label: "Mechanical systems", x: 40, y: 66 },
      { label: "Automation", x: 18, y: 34 },
    ],
    specs: ["Power", "Cooling", "Automation"],
    href: "/engineering",
  },
  {
    id: "transmission",
    index: "03",
    division: "Transmission",
    title: "Energy & Connectivity Transmission",
    summary: "Implemented high-capacity power and fiber infrastructure connecting facilities to national grid and carrier networks.",
    detail:
      "Unified power distribution, fiber connectivity, and communication systems engineered within one coordinated infrastructure framework — redundant systems designed for uptime and uninterrupted communication.",
    image: { src: "/images/transmission1.webp", alt: "High-voltage transmission tower carrying overhead lines across open land" },
    annotations: [
      { label: "High-capacity power", x: 58, y: 24 },
      { label: "National grid", x: 80, y: 52 },
      { label: "Carrier networks", x: 26, y: 46 },
    ],
    specs: ["National grid", "Carrier networks", "Fiber infrastructure"],
    href: "/transmission",
  },
] as const;

export const ADVANTAGES = [
  {
    title: "Single Point of Accountability",
    body: "Centralized governance and specialized divisions unify construction, engineering, transmission, and digital technologies into one coordinated ecosystem.",
  },
  {
    title: "Integrated Civil + Digital Expertise",
    body: "A unified force of physical, structural, and digital expertise covering the complete lifecycle of modern infrastructure.",
  },
  {
    title: "AI-Driven Predictive Infrastructure",
    body: "Intelligent monitoring systems and predictive maintenance strategies for maximum uptime. Technology enhances thinking — it doesn’t replace it.",
  },
  {
    title: "High-Security Data & Power Systems",
    body: "Resilient infrastructure architecture and advanced cybersecurity frameworks across every infrastructure layer.",
  },
  {
    title: "Sustainable & Energy-Efficient Solutions",
    body: "Energy-efficient systems, sustainable engineering practices, optimized power management, and future-ready infrastructure.",
  },
] as const;

export const FINAL_CTA = {
  eyebrow: "Foundation to frontier",
  title: ["Power the Future with", "Engineered Intelligence."],
  body: "Whether you are scaling a multinational facility, modernizing industrial infrastructure, or securing sovereign digital assets, Armtronix Group is ready to deliver integrated solutions from foundation to frontier.",
};
