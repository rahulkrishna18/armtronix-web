// Division content mirrors the four division pages on armtronix.com.
// Context-free improvement percentages on the legacy site ("42% increase",
// "35% cooler", "30% optimized", "60% faster") are intentionally omitted.

export type DivisionSlug = "construction" | "engineering" | "transmission" | "technologies";

export type DeliverItem = {
  title: string;
  category: string;
  challenge: string;
  outcome: string;
  stat?: string;
};

export type Division = {
  slug: DivisionSlug;
  index: number;
  code: string;
  name: string;
  fullName: string;
  pillar: string;
  summary: string;
  about: string;
  credential?: string;
  /** Ecosystem stack layers (0 = foundation … 4 = digital intelligence) this division owns. */
  layers: number[];
  accent: string;
  image: { src: string; alt: string };
  hero: { eyebrow: string; title: [string, string]; body: string; cta: string };
  problem: { eyebrow: string; title: string; list: string[]; statement: [string, string] };
  approach: {
    eyebrow: string;
    title: [string, string];
    kicker: string;
    items: { title: string; body: string }[];
  };
  deliver: DeliverItem[];
  process: { intro: string; steps: string[]; closing: [string, string] };
};

export const DIVISIONS: Division[] = [
  {
    slug: "construction",
    index: 1,
    code: "L1",
    name: "Construction",
    fullName: "Armtronix Construction",
    pillar: "Foundation",
    summary: "Delivering G7-grade industrial shells and heavy civil infrastructure.",
    about:
      "Delivering high-performance civil infrastructure and integrated construction solutions for mission-critical developments and industrial environments.",
    credential: "G7-grade industrial shells",
    layers: [0, 1],
    accent: "#E9F0F2",
    image: { src: "/images/construction.webp", alt: "Aerial view of a large-scale infrastructure construction site" },
    hero: {
      eyebrow: "Armtronix Construction",
      title: ["Building The Physical Foundations", "Of Intelligent Infrastructure"],
      body: "Infrastructure engineered for resilience, scalability, and operational continuity — integrating construction, engineering, transmission, and systems intelligence.",
      cta: "Start Infrastructure Planning",
    },
    problem: {
      eyebrow: "Integrated Delivery",
      title: "Infrastructure That Performs Beyond Construction",
      list: [
        "Mission-critical operations",
        "Utility & network readiness",
        "Lifecycle-focused execution",
        "Integrated engineering",
        "Digital infrastructure",
      ],
      statement: [
        "Infrastructure without integration becomes operational complexity.",
        "Armtronix delivers unified infrastructure ecosystems.",
      ],
    },
    approach: {
      eyebrow: "Our Approach",
      title: ["We Don’t Just Construct Facilities.", "We Deliver Operational Infrastructure."],
      kicker: "The result is infrastructure engineered for scalability, resilience, and operational continuity.",
      items: [
        {
          title: "Integrated Infrastructure Design",
          body: "Architecture, engineering, utility coordination, and operational planning aligned within a unified delivery framework.",
        },
        {
          title: "Built for Mission-Critical",
          body: "Infrastructure engineered for uptime, resilience, redundancy, and continuous operational performance.",
        },
        {
          title: "Designed for Long-Term",
          body: "Flexible infrastructure systems supporting future expansion, evolving workloads, and lifecycle optimization.",
        },
      ],
    },
    deliver: [
      {
        title: "Digital Construction Planning",
        category: "Construction Planning",
        challenge: "BIM-driven planning for high-reliability, mission-critical construction environments.",
        outcome: "Improved visualization, coordination, and execution accuracy across the full project lifecycle.",
      },
      {
        title: "Smart Infrastructure Integration",
        category: "Systems Integration",
        challenge: "Unifying structural, mechanical, and digital systems into one delivery framework.",
        outcome: "Seamless integration that removes operational silos and accelerates commissioning.",
      },
      {
        title: "Structural Optimization",
        category: "Structural Engineering",
        challenge: "Engineering structures for resilience, load efficiency, and long-term performance.",
        outcome: "Optimized structural systems that reduce material waste and lifecycle cost.",
      },
      {
        title: "Construction Safety Systems",
        category: "Safety & Compliance",
        challenge: "Embedding safety and compliance into every phase of on-site execution.",
        outcome: "A zero-compromise safety culture with measurable risk reduction on every project.",
      },
    ],
    process: {
      intro:
        "A structured delivery framework aligning strategy, engineering, construction, systems integration, and operational readiness.",
      steps: ["Discovery", "Architecture", "Design", "Build", "Optimize"],
      closing: ["No fragmented infrastructure delivery.", "Everything operates as one coordinated ecosystem."],
    },
  },
  {
    slug: "engineering",
    index: 2,
    code: "L2",
    name: "Engineering",
    fullName: "Armtronix Engineering",
    pillar: "Systemization",
    summary: "Integrating HVAC, vertical transport, and intelligent fire suppression systems.",
    about:
      "Providing advanced mechatronics engineering, intelligent HVAC systems, automation controls, and large-scale infrastructure integration with CIDB Grade 7 certification.",
    credential: "CIDB Grade 7",
    layers: [2],
    accent: "#4DFF9A",
    image: { src: "/images/engineering.webp", alt: "Industrial mechanical plant with heavy machinery and access platforms" },
    hero: {
      eyebrow: "Armtronix Engineering",
      title: ["Engineering Infrastructure", "Built For Reliability"],
      body: "Advanced engineering solutions for mission-critical environments integrating power, cooling, mechanical systems, and operational continuity.",
      cta: "Start Engineering Consultation",
    },
    problem: {
      eyebrow: "Engineering Excellence",
      title: "Infrastructure Engineering Beyond Conventional Design",
      list: ["MEP engineering", "Power redundancy", "Utility coordination", "Cooling systems", "Data centre engineering"],
      statement: [
        "Engineering without integration creates operational risk.",
        "Armtronix engineers infrastructure for continuity and resilience.",
      ],
    },
    approach: {
      eyebrow: "Our Engineering Approach",
      title: ["We Don’t Just Engineer Systems.", "We Engineer Operational Stability."],
      kicker: "Infrastructure systems are designed to operate reliably under continuous demand, ensuring resilience.",
      items: [
        {
          title: "Integrated Systems Engineering",
          body: "Mechanical, electrical, cooling, and utility systems engineered within a coordinated operational framework.",
        },
        {
          title: "Built for Continuous Operations",
          body: "Performance-focused infrastructure engineered for uptime, fault tolerance, and operational continuity.",
        },
        {
          title: "Designed for High-Performance",
          body: "Scalable infrastructure optimized for data centers, industrial operations, and mission-critical facilities.",
        },
      ],
    },
    deliver: [
      {
        title: "Mechanical & electrical systems engineering",
        category: "M&E Engineering",
        challenge: "Coordinated M&E systems engineered for mission-critical operations.",
        outcome: "Designed for operational continuity, resilience, scalability, and long-term performance.",
      },
      {
        title: "Cooling & thermal management infrastructure",
        category: "Thermal Management",
        challenge: "Precision thermal control for high-density compute and industrial loads.",
        outcome: "Energy-efficient cooling that protects equipment and lowers operating cost.",
      },
      {
        title: "High-capacity power systems",
        category: "Power Systems",
        challenge: "Reliable high-load power distribution with built-in redundancy.",
        outcome: "Continuous, fault-tolerant power for uninterrupted operations.",
        stat: "2N redundancy",
      },
      {
        title: "Data centre engineering environments",
        category: "Data Centre",
        challenge: "Purpose-built engineering for hyperscale and edge data centres.",
        outcome: "Standards-aligned environments engineered for uptime and density.",
        stat: "Tier III+",
      },
      {
        title: "Utility & network coordination",
        category: "Utility Coordination",
        challenge: "Aligning utility, grid, and network interfaces into one plan.",
        outcome: "Coordinated interconnections that remove delays and costly rework.",
        stat: "100% aligned",
      },
      {
        title: "Building systems integration",
        category: "Building Systems",
        challenge: "Integrating HVAC, automation, and controls into unified building systems.",
        outcome: "Centralized control with improved efficiency and full operational visibility.",
        stat: "Single platform",
      },
      {
        title: "Infrastructure resilience & optimization",
        category: "Resilience",
        challenge: "Future-ready systems engineered for evolving, high-demand workloads.",
        outcome: "Resilient infrastructure tuned for performance and long-term lifecycle value.",
      },
    ],
    process: {
      intro:
        "A structured engineering methodology aligning operational requirements, technical precision, infrastructure resilience, and lifecycle performance.",
      steps: ["Assess", "Engineer", "Validate", "Integrate", "Optimize"],
      closing: ["No fragmented infrastructure delivery.", "Everything operates as one coordinated ecosystem."],
    },
  },
  {
    slug: "transmission",
    index: 3,
    code: "L3",
    name: "Transmission",
    fullName: "Armtronix Transmission",
    pillar: "Connectivity",
    summary: "Providing high-voltage power and 5G utility interconnections.",
    about:
      "Managing energy and connectivity infrastructure through high-voltage systems, telecommunications integration, fiber optics, and national utility interconnections.",
    layers: [3],
    accent: "#168BFF",
    image: { src: "/images/transmission1.webp", alt: "High-voltage transmission tower and overhead power lines" },
    hero: {
      eyebrow: "Armtronix Transmission",
      title: ["Data & Power Transmission", "Built for Connectivity"],
      body: "Intelligent transmission infrastructure engineered for uninterrupted connectivity, reliable power distribution, and high-performance communication networks across mission-critical environments.",
      cta: "Start Transmission Planning",
    },
    problem: {
      eyebrow: "Connectivity Infrastructure",
      title: "Transmission Systems Engineered Beyond Basic Connectivity",
      list: [
        "High-capacity transmission",
        "Redundant network architecture",
        "Power distribution stability",
        "Fiber optic integration",
        "Scalable connectivity systems",
      ],
      statement: [
        "Transmission infrastructure without reliability creates operational disruption.",
        "Armtronix delivers resilient connectivity ecosystems designed for continuous performance.",
      ],
    },
    approach: {
      eyebrow: "Our Transmission Approach",
      title: ["We Don’t Just Connect Infrastructure.", "We Engineer Reliable Network Continuity."],
      kicker: "Data and power transmission systems designed for reliability, scalability, and long-term operational performance.",
      items: [
        {
          title: "Integrated Transmission Engineering",
          body: "Unified power distribution, fiber connectivity, and communication systems engineered within one coordinated infrastructure framework.",
        },
        {
          title: "Built for Continuous Connectivity",
          body: "Redundant transmission systems designed for uptime, uninterrupted communication, and operational resilience.",
        },
        {
          title: "Designed for High-Speed Infrastructure",
          body: "Scalable transmission architecture optimized for industrial facilities, data centers, and digital infrastructure environments.",
        },
      ],
    },
    deliver: [
      {
        title: "Fiber optic & structured cabling systems",
        category: "Structured Cabling",
        challenge: "High-bandwidth structured cabling for dense connectivity environments.",
        outcome: "Future-proof backbones built for scale and ultra-low latency.",
        stat: "Up to 400G",
      },
      {
        title: "High-capacity power transmission infrastructure",
        category: "Transmission Performance",
        challenge: "Reliable transmission infrastructure for high-demand operational environments.",
        outcome: "Engineered for uninterrupted connectivity and long-term operational efficiency.",
        stat: "99.9% uptime",
      },
      {
        title: "Smart network integration systems",
        category: "Smart Networks",
        challenge: "Intelligent routing and automated network orchestration.",
        outcome: "Self-aware networks that adapt to load and faults in real time.",
        stat: "Automated",
      },
      {
        title: "Data centre connectivity infrastructure",
        category: "DC Connectivity",
        challenge: "Carrier-grade connectivity linking facilities and the edge.",
        outcome: "Resilient interconnects with diverse, redundant pathways.",
        stat: "Carrier-grade",
      },
      {
        title: "Redundant communication networks",
        category: "Redundant Networks",
        challenge: "Fail-safe communication designed for zero downtime.",
        outcome: "Redundant paths that keep critical operations always online.",
        stat: "Zero downtime",
      },
      {
        title: "Utility & telecom coordination",
        category: "Telecom Coordination",
        challenge: "Coordinating utility and telecom interfaces under one framework.",
        outcome: "Streamlined approvals and faster, conflict-free deployment.",
        stat: "Unified",
      },
      {
        title: "Infrastructure monitoring & optimization",
        category: "Monitoring",
        challenge: "Continuous monitoring with proactive performance tuning.",
        outcome: "Early fault detection and continuously optimized network performance.",
        stat: "24/7 monitored",
      },
    ],
    process: {
      intro:
        "A structured transmission methodology aligning connectivity, infrastructure reliability, network scalability, and operational continuity.",
      steps: ["Assess", "Plan", "Integrate", "Deploy", "Optimize"],
      closing: ["No disconnected transmission systems.", "Everything operates through one unified infrastructure ecosystem."],
    },
  },
  {
    slug: "technologies",
    index: 4,
    code: "L4",
    name: "Technologies",
    fullName: "Armtronix Technologies",
    pillar: "Intelligence",
    summary: "Deploying secure cloud architecture, cybersecurity frameworks, and IIoT stacks.",
    about:
      "Driving digital transformation through cloud infrastructure, cybersecurity frameworks, IIoT systems, AI-powered analytics, and intelligent operational platforms.",
    layers: [4],
    accent: "#00C8E8",
    image: { src: "/images/intelligence1.webp", alt: "Team reviewing an interactive digital infrastructure display" },
    hero: {
      eyebrow: "Armtronix Technologies",
      title: ["Intelligence Infrastructure", "Powered By Armtronix Technologies"],
      body: "AI-driven infrastructure systems engineered for intelligent automation, operational visibility, predictive analytics, and connected digital ecosystems across mission-critical environments.",
      cta: "Start Intelligence Consultation",
    },
    problem: {
      eyebrow: "Intelligent Infrastructure",
      title: "Smart Technology Systems Built Beyond Traditional Operations",
      list: [
        "AI-powered automation",
        "Predictive operational monitoring",
        "Real-time infrastructure analytics",
        "IoT ecosystem integration",
        "Scalable digital intelligence systems",
      ],
      statement: [
        "Technology without intelligence creates disconnected operations.",
        "Armtronix integrates smart infrastructure systems designed for visibility, automation, and long-term efficiency.",
      ],
    },
    approach: {
      eyebrow: "Our Intelligence Approach",
      title: ["We Don’t Just Deploy Technology.", "We Engineer Intelligent Operations."],
      kicker: "Smart infrastructure systems designed for automation, operational intelligence, and scalable digital transformation.",
      items: [
        {
          title: "Integrated Intelligence Systems",
          body: "AI, automation, IoT, and digital infrastructure unified into one intelligent operational ecosystem for connected decision-making.",
        },
        {
          title: "Built for Intelligent Automation",
          body: "Smart systems engineered to automate workflows, improve efficiency, reduce downtime, and optimize infrastructure performance.",
        },
        {
          title: "Designed for Scalable Innovation",
          body: "Future-ready intelligence platforms supporting enterprise growth, predictive analytics, and evolving digital operations.",
        },
      ],
    },
    deliver: [
      {
        title: "AI-powered infrastructure automation",
        category: "AI Automation",
        challenge: "Autonomous operations driven by AI across critical infrastructure.",
        outcome: "Automated operations, predictive monitoring, and scalable infrastructure intelligence.",
      },
      {
        title: "IoT-enabled monitoring systems",
        category: "IoT Monitoring",
        challenge: "Sensor-driven visibility across every asset and system.",
        outcome: "Live operational data feeding smarter, faster decisions.",
        stat: "Real-time",
      },
      {
        title: "Smart building intelligence platforms",
        category: "Smart Buildings",
        challenge: "Unified intelligence for smart, responsive building operations.",
        outcome: "Centralized control that cuts energy use and boosts comfort.",
        stat: "Single pane",
      },
      {
        title: "Predictive analytics & reporting",
        category: "Predictive Analytics",
        challenge: "Turning operational data into predictive, actionable insight.",
        outcome: "Forecast failures before they happen and plan with confidence.",
        stat: "Predictive",
      },
      {
        title: "Operational command & control systems",
        category: "Command & Control",
        challenge: "Centralized command for mission-critical operations.",
        outcome: "One control layer for full situational awareness and rapid response.",
        stat: "Centralized",
      },
      {
        title: "Digital infrastructure integration",
        category: "Digital Integration",
        challenge: "Connecting cloud, edge, and on-prem into one unified fabric.",
        outcome: "Seamless, secure integration across the entire digital estate.",
        stat: "Cloud-native",
      },
      {
        title: "Performance optimization & automation",
        category: "Optimization",
        challenge: "Continuously tuning systems for peak operational efficiency.",
        outcome: "Self-optimizing infrastructure that scales effortlessly.",
        stat: "Automated",
      },
    ],
    process: {
      intro:
        "A structured intelligence framework aligning automation, operational analytics, digital infrastructure, and scalable technology ecosystems.",
      steps: ["Analyze", "Strategize", "Integrate", "Automate", "Optimize"],
      closing: ["No disconnected technology systems.", "Everything operates through one intelligent ecosystem."],
    },
  },
];

export const getDivision = (slug: DivisionSlug) => DIVISIONS.find((d) => d.slug === slug)!;
