// All copy in /content is sourced from the existing armtronix.com website.
// Do not add business claims here that cannot be traced back to that source.

export const SITE = {
  name: "Armtronix",
  legalName: "Armtronix Group",
  url: "https://armtronix.com",
  title: "Armtronix | Engineering Intelligent Infrastructure For A Connected Future",
  description:
    "Armtronix Group weaves construction, engineering, transmission and digital technologies into a single, intelligent ecosystem — delivering the full lifecycle of mission-critical environments.",
  tagline: "Engineered Intelligence",
  heroHeadline: ["Bridging Physical Foundations", "and Digital Frontiers."],
  heroBody:
    "Where infrastructure is no longer just a building or a network, Armtronix Group weaves it all into a single, intelligent ecosystem. We deliver the seamless integration of physical reliability and digital agility.",
  footerBlurb:
    "Premier provider of industrial construction, high-voltage transmission engineering, and next-generation datacenter technologies. Building the infrastructure of tomorrow.",
} as const;

export const CONTACT = {
  phone: "+6012 699 1921",
  phoneHref: "tel:+60126991921",
  whatsapp: "+603 3093 4878",
  whatsappHref: "https://wa.me/60330934878",
  email: "sales@armtronix.one",
  emailHref: "mailto:sales@armtronix.one",
  linkedin: "https://www.linkedin.com/company/armtronix/",
  offices: [
    {
      id: "hq",
      name: "Armtronix Headquarters",
      lines: ["Premier Suite 1501, One Mont Kiara", "One Jalan Kiara, Mont Kiara", "50480 Federal Territory of Kuala Lumpur", "Malaysia"],
      coords: "3.17°N 101.65°E",
    },
    {
      id: "northops",
      name: "Armtronix NorthOps",
      lines: ["2A-G, 2A-1 & 2A-2, Jalan Vervea 10", "Bandar Cassia, Aspen Vision City", "14110 Penang", "Malaysia"],
      coords: "5.23°N 100.44°E",
    },
  ],
} as const;

export type NavItem = { label: string; href: string; code: string };

export const NAV: NavItem[] = [
  { label: "Construction", href: "/construction", code: "L1" },
  { label: "Engineering", href: "/engineering", code: "L2" },
  { label: "Transmission", href: "/transmission", code: "L3" },
  { label: "Technologies", href: "/technologies", code: "L4" },
  { label: "About", href: "/about", code: "CO" },
  { label: "FAQ", href: "/faq", code: "QA" },
];

export const FOOTER_CAPABILITIES = {
  "Construction & Engineering": [
    "Civil Engineering",
    "Structural Steel",
    "Concrete Foundations",
    "MEP Systems",
    "Site Development",
    "Safety & Compliance",
  ],
  "Transmission & Technologies": [
    "High-Voltage Lines",
    "Substation Design",
    "Datacenter Cooling",
    "Fiber Optic Networks",
    "Power Distribution Units",
    "Smart Grid Integration",
  ],
} as const;
