import type { Metadata } from "next";
import { getDivision } from "@/content/divisions";
import { DivisionPage } from "@/components/sections/division/DivisionPage";

const division = getDivision("construction");

export const metadata: Metadata = {
  title: "Construction",
  description: division.hero.body,
  alternates: { canonical: "/construction" },
  openGraph: { title: `${division.fullName} | Armtronix`, description: division.hero.body, url: "/construction" },
};

export default function ConstructionPage() {
  return <DivisionPage division={division} />;
}
