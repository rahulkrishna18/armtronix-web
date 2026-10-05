"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getLenis } from "./SmoothScroll";

type Item = { id: string; label: string };

/** Fixed index of page sections, styled like a measurement scale. Desktop only. */
export function SectionRail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 2xl:block",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol className="flex flex-col items-end gap-2.5">
        {items.map((item, i) => {
          const on = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  const el = document.getElementById(item.id);
                  const lenis = getLenis();
                  if (el && lenis) {
                    e.preventDefault();
                    lenis.scrollTo(el, { offset: -60, duration: 1.4 });
                  }
                }}
                className="group flex items-center gap-3"
                aria-current={on ? "true" : undefined}
              >
                <span className={cn("font-mono text-[9.5px] uppercase tracking-[0.14em] transition-all duration-300", on ? "text-cyan opacity-100" : "text-dim opacity-0 group-hover:opacity-100")}>
                  {item.label}
                </span>
                <span className="font-mono text-[9px] text-dim">{String(i).padStart(2, "0")}</span>
                <span className={cn("h-px transition-all duration-300", on ? "w-6 bg-cyan" : "w-3 bg-steel-2 group-hover:w-5")} />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
