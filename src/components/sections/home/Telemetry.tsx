import { SectionHeader } from "@/components/ui/SectionHeader";
import { TelemetryConsole } from "@/components/telemetry/TelemetryConsole";
import { Reveal } from "@/components/ui/Reveal";

export function Telemetry() {
  return (
    <section id="telemetry" data-section="03" aria-labelledby="telemetry-title" className="relative overflow-x-clip border-t border-steel/70 py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[1100px] -translate-x-1/2 rounded-[50%] bg-cyan/[0.04] blur-3xl" />
      <div className="container-x relative">
        <SectionHeader
          index="03"
          label="IIoT · Live telemetry"
          title={
            <span id="telemetry-title">
              Look inside an
              <span className="block text-mute">intelligent facility.</span>
            </span>
          }
          body={
            <>
              Sensor-driven visibility across every asset and system — live operational data feeding smarter, faster decisions. Explore a digital twin of a data hall, then trigger a
              fault and watch automation respond.
              <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.12em] text-amber/80">
                Demonstration only · all values are simulated
              </span>
            </>
          }
        />
        <Reveal className="mt-14 lg:mt-20">
          <TelemetryConsole />
        </Reveal>
      </div>
    </section>
  );
}
