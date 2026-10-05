import Link from "next/link";
import { CONTACT, FOOTER_CAPABILITIES, SITE } from "@/content/site";
import { DIVISIONS } from "@/content/divisions";
import { Logo } from "./Logo";
import { TechLabel } from "@/components/ui/TechLabel";
import { StatusDot } from "@/components/ui/StatusDot";
import { Ruler } from "@/components/ui/Ruler";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-steel/70 bg-ink">
      <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-50 mask-fade-b" />
      <div className="container-x relative pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mute">{SITE.footerBlurb}</p>
            <div className="mt-8 flex items-center gap-3">
              <StatusDot tone="green" />
              <span className="tech-label text-dim">Engineered Intelligence · Foundation to frontier</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4 lg:gap-8">
            <div>
              <TechLabel className="text-dim">Divisions</TechLabel>
              <ul className="mt-5 grid gap-3 text-[14px]">
                {DIVISIONS.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/${d.slug}`} className="group inline-flex items-center gap-2 text-white/85 transition-colors hover:text-cyan">
                      <span className="font-mono text-[10px] text-dim group-hover:text-cyan">{d.code}</span>
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <TechLabel className="mt-9 block text-dim">Company</TechLabel>
              <ul className="mt-5 grid gap-3 text-[14px]">
                {[
                  { href: "/about", label: "About" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/contact", label: "Contact" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/85 transition-colors hover:text-cyan">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {Object.entries(FOOTER_CAPABILITIES).map(([group, items]) => (
              <div key={group}>
                <TechLabel className="text-dim">{group}</TechLabel>
                <ul className="mt-5 grid gap-3 text-[14px] text-mute">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <TechLabel className="text-dim">Contact</TechLabel>
              <ul className="mt-5 grid gap-3 text-[14px]">
                <li>
                  <a href={CONTACT.phoneHref} className="font-mono text-[13px] text-white/85 hover:text-cyan">
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.emailHref} className="font-mono text-[13px] text-white/85 hover:text-cyan">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-cyan">
                    LinkedIn ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px border border-steel/70 bg-steel/70 sm:grid-cols-2">
          {CONTACT.offices.map((o) => (
            <address key={o.id} className="bg-ink p-6 not-italic lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-medium">{o.name}</span>
                <span className="font-mono text-[10.5px] tracking-[0.1em] text-dim">{o.coords}</span>
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

        <Ruler ticks={60} major={10} className="mt-14 opacity-60" />
        <div className="flex flex-col gap-4 py-6 text-[12.5px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Armtronix. All rights reserved.</span>
          <span className="tech-label text-[10px]">ATX · Construction / Engineering / Transmission / Technologies</span>
          <BackToTop />
        </div>
      </div>

      <div aria-hidden className="relative -mb-[2.2vw] select-none overflow-hidden">
        <p className="display font-xwide whitespace-nowrap text-center text-[12.6vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--color-steel)]">
          ARMTRONIX
        </p>
      </div>
    </footer>
  );
}
