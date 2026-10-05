export const ABOUT = {
  eyebrow: "About Armtronix",
  title: ["Engineering Intelligent Infrastructure", "For A Connected Future"],
  intro:
    "Armtronix is an integrated infrastructure enterprise delivering the complete lifecycle of mission-critical environments with a strategic focus on data centres, industrial infrastructure, and intelligent digital ecosystems. Operating through four specialized divisions — Construction, Engineering, Transmission, and Technologies — the Group provides unified solutions under centralized governance and operational excellence.",
  short:
    "Armtronix is an integrated infrastructure enterprise delivering the full lifecycle of mission-critical environments with a strategic focus on data centres and critical infrastructure. Through centralized governance and specialized divisions, the group unifies construction, engineering, transmission, and digital technologies into one coordinated ecosystem.",
  positioning:
    "Built for mission-critical infrastructure, delivering intelligent engineering, secure connectivity, smart systems, and future-ready digital infrastructure solutions.",
  mission:
    "To deliver integrated infrastructure solutions that combine engineering precision, digital intelligence, and operational reliability for mission-critical environments worldwide.",
  vision:
    "To become a global leader in Engineered Intelligence by creating resilient, future-ready environments where physical and digital systems operate seamlessly as one intelligent ecosystem.",
  governance: {
    eyebrow: "Leadership & Governance",
    title: ["Driven by Expertise.", "Guided by Integrity."],
    body: [
      "Armtronix is led by a multidisciplinary leadership team with expertise spanning engineering, telecommunications, cloud infrastructure, digital technologies, energy systems, legal governance, and industrial operations.",
      "Our governance framework emphasizes operational transparency, long-term sustainability, strategic innovation, and risk-managed execution across every infrastructure ecosystem we build.",
    ],
    principles: ["Operational transparency", "Long-term sustainability", "Strategic innovation", "Risk-managed execution"],
  },
};

export const PRESENCE = {
  eyebrow: "Operational Presence",
  title: "Integrated Infrastructure Beyond Borders",
  body: "Armtronix operates through regionally incorporated entities under unified global standards, ensuring operational consistency, governance excellence, and scalable infrastructure delivery across multiple international markets.",
  regions: [
    {
      id: "my",
      country: "Malaysia",
      entity: "Armtronix Group",
      role: "Strategic headquarters for systems integration, infrastructure governance, and national digital sovereignty initiatives.",
      sites: ["Headquarters – Kuala Lumpur", "NorthOps – Penang"],
      // Map anchor (lon/lat). Malaysia sites use their verified office locations.
      anchor: { lon: 101.65, lat: 3.17 },
    },
    {
      id: "au",
      country: "Australia",
      entity: "Armtronix Pty Ltd",
      role: "Focused on high-security datacenter operations, cloud computing environments, and advanced hosting infrastructure.",
      sites: [],
      // Country-level marker only — no city is stated on the source site.
      anchor: { lon: 134, lat: -25 },
    },
    {
      id: "in",
      country: "India",
      entity: "Armtronix Pvt Ltd",
      role: "Serving as the Group’s global software development powerhouse, innovation center, and digital research & development hub.",
      sites: [],
      anchor: { lon: 79, lat: 22 },
    },
  ],
  sites: [
    { id: "hq", label: "HQ · Kuala Lumpur", lon: 101.65, lat: 3.17 },
    { id: "northops", label: "NorthOps · Penang", lon: 100.44, lat: 5.23 },
  ],
} as const;

export const LEADERSHIP = [
  { name: "Mardziatun Nisa", role: "Executive Chair", focus: "Board Leadership, Governance & Strategic Direction", image: "/images/team/mardziatun-nisa.webp" },
  { name: "Rajesh Nair", role: "Executive Director", focus: "Corporate Strategy, Operations & Business Growth", image: "/images/team/rajesh-nair.webp" },
  { name: "Arman Shahrique", role: "Managing Director", focus: "Technology Leadership & Digital Infrastructure", image: "/images/team/arman-shahrique.webp" },
  { name: "Wan Syakimah", role: "Executive Assistant to the Board", focus: "Executive Coordination & Administrative Support", image: "/images/team/wan-syakimah.webp" },
  { name: "Abinaash G. Murthy", role: "Country MD – Malaysia", focus: "Regional Operations & Governance", image: "/images/team/abinaash-g-murthy.webp" },
  { name: "Craig Marchant", role: "Country MD – Australia", focus: "Infrastructure Operations & Regional Expansion", image: "/images/team/craig-marchant.webp" },
  { name: "Mohd Azmi Bin Mohd Zahari", role: "Associate Director – Construction", focus: "Construction Planning & Project Execution", image: "/images/team/mohd-azmi.webp" },
  { name: "Muhammad Hafiz Talib", role: "Associate Director – Engineering", focus: "Mechanical Engineering & Technical Operations", image: "/images/team/muhammad-hafiz-talib.webp" },
  { name: "Ahmad Khairyl Ahmad Khair", role: "Associate Director – Transmission", focus: "Transmission Networks & Supply Chain Operations", image: "/images/team/ahmad-khairyl.webp" },
] as const;

export const FAQS = [
  {
    q: "What does Armtronix specialize in?",
    a: "Armtronix specializes in integrated infrastructure solutions including data centres, engineering systems, intelligent technologies, transmission networks, and mission-critical environments.",
  },
  {
    q: "What industries does Armtronix serve?",
    a: "We serve industries including telecommunications, energy, industrial infrastructure, smart cities, digital ecosystems, manufacturing, and enterprise technology sectors.",
  },
  {
    q: "What is Engineered Intelligence?",
    a: "Engineered Intelligence is Armtronix’s approach to integrating physical infrastructure, digital technologies, automation, cybersecurity, and operational systems into one connected ecosystem.",
  },
  {
    q: "Does Armtronix provide end-to-end infrastructure solutions?",
    a: "Yes, Armtronix delivers complete lifecycle solutions including planning, engineering, construction, deployment, monitoring, optimization, and long-term operational support.",
  },
  {
    q: "What makes Armtronix different from other companies?",
    a: "Our integrated approach combines engineering excellence, intelligent automation, cybersecurity, sustainability, and centralized operational governance into one scalable platform.",
  },
  {
    q: "Does Armtronix work on international projects?",
    a: "Yes, Armtronix operates globally and supports international infrastructure projects with scalable engineering and technology-driven solutions.",
  },
  {
    q: "How does Armtronix ensure operational reliability?",
    a: "We implement intelligent monitoring systems, resilient infrastructure architecture, advanced cybersecurity frameworks, and predictive maintenance strategies for maximum uptime.",
  },
  {
    q: "What technology services does Armtronix provide?",
    a: "Our technology division delivers digital infrastructure, cloud integration, cybersecurity, automation systems, intelligent analytics, and application development services.",
  },
  {
    q: "Is sustainability part of Armtronix’s infrastructure strategy?",
    a: "Absolutely. We focus on energy-efficient systems, sustainable engineering practices, optimized power management, and future-ready infrastructure solutions.",
  },
  {
    q: "How can I connect with Armtronix for business inquiries?",
    a: "You can connect with our team through the contact page, email support, or by submitting your project requirements for consultation and collaboration opportunities.",
  },
] as const;
