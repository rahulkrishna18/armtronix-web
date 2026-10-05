import { CircuitButton } from "@/components/ui/CircuitButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { TechLabel } from "@/components/ui/TechLabel";
import { Reveal } from "@/components/ui/Reveal";

/** Closing conversion band used on inner pages. */
export function CtaBand({
  label = "Start your project",
  title = ["From foundation", "to frontier."],
  body = "Whether you are scaling a multinational facility, modernizing industrial infrastructure, or securing sovereign digital assets, Armtronix Group is ready to deliver integrated solutions from foundation to frontier.",
  cta = "Start Your Project",
}: {
  label?: string;
  title?: [string, string] | readonly string[];
  body?: string;
  cta?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-steel/70 py-24 lg:py-36">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 mask-fade-y" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-cyan/[0.06] blur-3xl"
      />
      <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <TechLabel dot tone="cyan">
            {label}
          </TechLabel>
          <Reveal as="h2" className="display mt-6 text-[clamp(2.4rem,6.4vw,6rem)] text-balance">
            {title[0]}
            <span className="block text-mute">{title[1]}</span>
          </Reveal>
        </div>
        <div className="lg:col-span-4">
          <p className="max-w-md text-[15.5px] leading-relaxed text-mute">{body}</p>
          <Magnetic className="mt-8 inline-block">
            <CircuitButton href="/contact" size="lg">
              {cta}
            </CircuitButton>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
