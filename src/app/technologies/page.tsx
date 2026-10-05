import type { Metadata } from "next";
import { getDivision } from "@/content/divisions";
import { DivisionPage } from "@/components/sections/division/DivisionPage";

const division = getDivision("technologies");

export const metadata: Metadata = {
  title: "Technologies",
  description: division.hero.body,
  alternates: { canonical: "/technologies" },
  openGraph: { title: `${division.fullName} | Armtronix`, description: division.hero.body, url: "/technologies" },
};

export default function TechnologiesPage() {
  return <DivisionPage division={division} />;
}
