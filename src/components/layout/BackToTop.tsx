"use client";

import { getLenis } from "./SmoothScroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="tech-label group inline-flex items-center gap-2 text-[10px] text-mute transition-colors hover:text-cyan"
    >
      Back to top
      <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden>
        <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
