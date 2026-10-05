import type { Metadata } from "next";
import { getDivision } from "@/content/divisions";
import { DivisionPage } from "@/components/sections/division/DivisionPage";

const division = getDivision("transmission");

export const metadata: Metadata = {
  title: "Transmission",
  description: division.hero.body,
  alternates: { canonical: "/transmission" },
  openGraph: { title: `${division.fullName} | Armtronix`, description: division.hero.body, url: "/transmission" },
};

export default function TransmissionPage() {
  return <DivisionPage division={division} />;
}
