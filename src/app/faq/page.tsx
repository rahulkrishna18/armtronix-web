import type { Metadata } from "next";
import Image from "next/image";
import { FAQS } from "@/content/company";
import { FaqList } from "@/components/faq/FaqList";
import { TechLabel } from "@/components/ui/TechLabel";
import { Brackets } from "@/components/ui/Brackets";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Armtronix infrastructure, engineering, transmission and technology solutions.",
  alternates: { canonical: "/faq" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section aria-labelledby="faq-title" className="relative overflow-clip pt-[calc(var(--header-h)+48px)] pb-24 lg:pb-32">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 mask-fade-b" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              <TechLabel dot tone="cyan">
                Frequently asked questions
              </TechLabel>
              <h1 id="faq-title" className="display mt-7 text-[clamp(2.3rem,4.6vw,4.2rem)]">
                Everything you need to know
                <span className="block text-mute">about Armtronix.</span>
              </h1>
              <p className="mt-6 max-w-sm text-[15.5px] leading-relaxed text-mute">
                Discover answers to the most common questions about our infrastructure, engineering, transmission, and technology solutions.
              </p>
              <div className="photo-grade relative mt-10 hidden aspect-[4/3] border border-steel lg:block">
                <Image src="/images/explore2.webp" alt="Illuminated industrial infrastructure structure at night" fill sizes="30vw" className="object-cover" />
                <Brackets className="z-[4] m-3" tone="border-white/40" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={FAQS} />
          </div>
        </div>
      </section>
      <CtaBand label="Still have questions?" title={["Talk to", "our team."]} cta="Contact Armtronix" />
    </>
  );
}
