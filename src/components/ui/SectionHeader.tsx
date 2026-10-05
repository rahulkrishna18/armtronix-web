import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TechLabel } from "./TechLabel";
import { Reveal } from "./Reveal";

/** Standard section opener: indexed technical label, display title, supporting copy. */
export function SectionHeader({
  index,
  label,
  title,
  body,
  className,
  titleClassName,
  aside,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
  titleClassName?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        <TechLabel index={index}>{label}</TechLabel>
        <Reveal as="h2" className={cn("display mt-6 text-[clamp(2.1rem,5vw,4.4rem)] text-balance", titleClassName)}>
          {title}
        </Reveal>
      </div>
      {(body || aside) && (
        <div className="lg:col-span-5 lg:pb-2">
          {body && (
            <Reveal delay={120} className="max-w-xl text-[15.5px] leading-relaxed text-mute sm:text-[16.5px]">
              {body}
            </Reveal>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
