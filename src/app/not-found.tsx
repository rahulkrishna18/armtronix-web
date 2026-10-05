import Link from "next/link";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { DIVISIONS } from "@/content/divisions";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-(--header-h)">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 mask-fade-y" />
      <div className="container-x relative py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber">Error 404 · Signal lost</p>
        <h1 className="display mt-6 text-[clamp(3rem,10vw,9rem)]">
          No route
          <span className="block text-mute">to this node.</span>
        </h1>
        <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-mute">The page you requested isn’t part of the network. Reconnect through one of the system layers below.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CircuitButton href="/" size="lg">
            Return to overview
          </CircuitButton>
          <CircuitButton href="/contact" variant="ghost" size="lg">
            Contact us
          </CircuitButton>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[12px] uppercase tracking-[0.12em]">
          {DIVISIONS.map((d) => (
            <li key={d.slug}>
              <Link href={`/${d.slug}`} className="text-mute transition-colors hover:text-cyan">
                <span className="text-dim">{d.code}</span> {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
