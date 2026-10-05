import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { Ecosystem } from "@/components/sections/home/Ecosystem";
import { EngineeredIntelligence } from "@/components/sections/home/EngineeredIntelligence";
import { Telemetry } from "@/components/sections/home/Telemetry";
import { EngineeringSystems } from "@/components/sections/home/EngineeringSystems";
import { Transmission } from "@/components/sections/home/Transmission";
import { Technologies } from "@/components/sections/home/Technologies";
import { Industries } from "@/components/sections/home/Industries";
import { Process } from "@/components/sections/home/Process";
import { Showcase } from "@/components/sections/home/Showcase";
import { Advantage } from "@/components/sections/home/Advantage";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { SectionRail } from "@/components/layout/SectionRail";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  alternates: { canonical: "/" },
};

const RAIL = [
  { id: "top", label: "Overview" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "engineered-intelligence", label: "Engineered intelligence" },
  { id: "telemetry", label: "Telemetry" },
  { id: "engineering-systems", label: "Engineering" },
  { id: "transmission", label: "Transmission" },
  { id: "technologies", label: "Technologies" },
  { id: "industries", label: "Industries" },
  { id: "process", label: "Process" },
  { id: "showcase", label: "Showcase" },
  { id: "advantage", label: "Advantage" },
  { id: "start", label: "Start" },
];

export default function HomePage() {
  return (
    <>
      <SectionRail items={RAIL} />
      <Hero />
      <Ecosystem />
      <EngineeredIntelligence />
      <Telemetry />
      <EngineeringSystems />
      <Transmission />
      <Technologies />
      <Industries />
      <Process />
      <Showcase />
      <Advantage />
      <FinalCta />
    </>
  );
}
