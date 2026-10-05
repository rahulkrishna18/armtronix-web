import { ADVANTAGES } from "@/content/home";
import { TechLabel } from "@/components/ui/TechLabel";
import { Reveal } from "@/components/ui/Reveal";
import { StatusDot } from "@/components/ui/StatusDot";

export function Advantage() {
  return (
    <section id="advantage" data-section="10" aria-labelledby="advantage-title" className="relative border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
            <TechLabel index="10">Why choose Armtronix</TechLabel>
            <Reveal as="h2" className="display mt-6 text-[clamp(2.1rem,4.2vw,3.8rem)]">
              <span id="advantage-title">
                The Engineered
                <span className="block text-mute">Intelligence advantage.</span>
              </span>
            </Reveal>
            <Reveal as="blockquote" delay={150} className="mt-10 border-l border-cyan/60 pl-5">
              <p className="text-[18px] leading-snug text-white/90">“Technology enhances thinking — it doesn’t replace it.”</p>
            </Reveal>
          </div>
        </div>
        <ol className="border-t border-steel/70 lg:col-span-8">
          {ADVANTAGES.map((a, i) => (
            <Reveal as="li" key={a.title} delay={i * 60} className="group relative grid grid-cols-[3rem_1fr] gap-x-4 border-b border-steel/70 py-7 transition-colors hover:bg-graphite/50 sm:grid-cols-[4rem_1fr_auto] sm:py-9 lg:px-4">
              <span aria-hidden className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-cyan transition-transform duration-500 group-hover:scale-y-100" />
              <span className="pt-1 font-mono text-[12px] text-cyan">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[clamp(1.25rem,2vw,1.65rem)] font-medium tracking-[-0.01em] font-wide">{a.title}</h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mute">{a.body}</p>
              </div>
              <span className="tech-label col-start-2 mt-4 flex items-center gap-2 self-start text-[10px] text-dim sm:col-start-3 sm:mt-1.5">
                <StatusDot tone="green" pulse={false} /> Integrated
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
