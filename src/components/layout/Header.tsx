"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, CONTACT } from "@/content/site";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { StatusDot } from "@/components/ui/StatusDot";
import { getLenis } from "./SmoothScroll";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Close the menu on navigation (derived during render, per React guidance).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a
        href="#main"
        className="tech-label fixed left-4 top-3 z-[60] -translate-y-24 bg-cyan px-3 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-(--header-h) transition-[transform,background-color,border-color] duration-500 ease-(--ease-out-expo)",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled || open ? "border-b border-steel/70 bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container-x flex h-full items-center justify-between gap-6">
          <Logo onClick={() => setOpen(false)} />

          <nav aria-label="Primary" className="hidden items-center xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2 px-3.5 py-2 text-[13.5px] tracking-[0.01em] transition-colors xl:px-4",
                  isActive(item.href) ? "text-white" : "text-mute hover:text-white",
                )}
              >
                <span className={cn("font-mono text-[9.5px] tracking-[0.12em] transition-colors", isActive(item.href) ? "text-cyan" : "text-dim group-hover:text-cyan")}>
                  {item.code}
                </span>
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 -bottom-px h-px origin-left bg-cyan transition-transform duration-500 ease-(--ease-mech) xl:inset-x-4",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="tech-label hidden items-center gap-2 text-[10px] text-dim 2xl:flex">
              <StatusDot tone="green" /> Systems online
            </span>
            <span className="hidden sm:block">
              <CircuitButton href="/contact" variant="primary" arrow={false}>
                Start Your Project
              </CircuitButton>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex size-11 items-center justify-center border border-steel-2/70 xl:hidden"
            >
              <span className={cn("absolute h-px w-5 bg-white transition-transform duration-500 ease-(--ease-mech)", open ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={cn("absolute h-px w-5 bg-white transition-transform duration-500 ease-(--ease-mech)", open ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
        <span
          ref={progressRef}
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-cyan/30 via-cyan to-green"
        />
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-40 overflow-y-auto bg-ink pt-(--header-h) transition-[clip-path,visibility] duration-[600ms] ease-(--ease-mech) xl:hidden",
          open ? "visible [clip-path:inset(0_0_0%_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
        data-lenis-prevent
      >
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 mask-fade-b" />
        <nav aria-label="Mobile" className="container-x relative flex min-h-full flex-col py-8">
          <span className="tech-label mb-6 text-dim">Index · Armtronix ecosystem</span>
          <ul className="border-t border-steel/70">
            {[{ label: "Home", href: "/", code: "00" }, ...NAV, { label: "Contact", href: "/contact", code: "CT" }].map((item, i) => (
              <li
                key={item.href}
                className={cn("border-b border-steel/70 transition-[opacity,transform] duration-500 ease-(--ease-out-expo)", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
                style={{ transitionDelay: open ? `${150 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between py-4"
                >
                  <span className="display text-[28px] font-wide xs:text-[32px]">{item.label}</span>
                  <span className={cn("font-mono text-[11px] tracking-[0.14em]", pathname === item.href ? "text-cyan" : "text-dim")}>{item.code}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-6 pt-10">
            <CircuitButton href="/contact" size="lg" className="w-full" onClick={() => setOpen(false)}>
              Start Your Project
            </CircuitButton>
            <div className="grid gap-1.5 font-mono text-[12px] text-mute">
              <a href={CONTACT.phoneHref} className="hover:text-white">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="hover:text-white">
                {CONTACT.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
