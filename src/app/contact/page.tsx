import type { Metadata } from "next";
import { CONTACT } from "@/content/site";
import { DIVISIONS } from "@/content/divisions";
import { INTERESTS } from "@/lib/contact";
import { ContactForm } from "@/components/contact/ContactForm";
import { TechLabel } from "@/components/ui/TechLabel";
import { StatusDot } from "@/components/ui/StatusDot";
import { Brackets } from "@/components/ui/Brackets";

export const metadata: Metadata = {
  title: "Contact",
  description: "Schedule a complimentary consultation with the Armtronix team — construction, engineering, transmission and technologies for mission-critical infrastructure.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ division?: string }> }) {
  const { division } = await searchParams;
  const match = DIVISIONS.find((d) => d.slug === division);
  const defaultInterest = match && INTERESTS.includes(match.name as (typeof INTERESTS)[number]) ? match.name : undefined;

  const channels = [
    { label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
    { label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
    { label: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref, external: true },
    { label: "LinkedIn", value: "company/armtronix", href: CONTACT.linkedin, external: true },
  ];

  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-24 lg:pb-32">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 mask-fade-b" />
      <div className="container-x relative">
        <TechLabel dot tone="cyan">
          Contact us · Start your project
        </TechLabel>
        <h1 id="contact-title" className="display mt-7 max-w-5xl text-[clamp(2.3rem,5.4vw,5rem)] text-balance">
          Schedule a complimentary consultation <span className="text-mute">with our team.</span>
        </h1>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Direct channels */}
          <div className="lg:col-span-4">
            <div className="border border-steel/70">
              <div className="flex items-center justify-between border-b border-steel/70 px-5 py-3">
                <span className="tech-label text-[10px] text-dim">Direct channels</span>
                <span className="tech-label flex items-center gap-2 text-[10px] text-green">
                  <StatusDot tone="green" /> Open
                </span>
              </div>
              <ul>
                {channels.map((c) => (
                  <li key={c.label} className="border-b border-steel/70 last:border-b-0">
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-graphite"
                    >
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{c.label}</span>
                      <span className="font-mono text-[13px] text-white transition-colors group-hover:text-cyan">{c.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-px border border-steel/70 bg-steel/70">
              {CONTACT.offices.map((o) => (
                <address key={o.id} className="bg-ink p-5 not-italic">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-medium">{o.name}</span>
                    <span className="font-mono text-[10px] text-dim">{o.coords}</span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-mute">
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </p>
                </address>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="relative border border-steel bg-graphite/50 p-6 sm:p-10 lg:col-span-8">
            <Brackets className="m-2" />
            <div className="mb-10 flex items-center justify-between">
              <span className="tech-label text-[10px] text-mute">Send us a message</span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-dim">FORM · ATX-01</span>
            </div>
            <ContactForm defaultInterest={defaultInterest} />
          </div>
        </div>
      </div>
    </section>
  );
}
