import type { Metadata } from "next";
import { getDivision } from "@/content/divisions";
import { DivisionPage } from "@/components/sections/division/DivisionPage";

const division = getDivision("engineering");

export const metadata: Metadata = {
  title: "Engineering",
  description: division.hero.body,
  alternates: { canonical: "/engineering" },
  openGraph: { title: `${division.fullName} | Armtronix`, description: division.hero.body, url: "/engineering" },
};

export default function EngineeringPage() {
  return <DivisionPage division={division} />;
}
