"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

type RevealProps = {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "li" | "span" | "section" | "figure" | "blockquote";
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "clip";
  style?: CSSProperties;
  id?: string;
};

/** Lightweight reveal-on-view: toggles `.is-in` once the element enters the viewport. */
export function Reveal({ as = "div", children, className, delay = 0, variant = "up", style, id }: RevealProps) {
  // A single concrete tag type keeps the polymorphic ref simple.
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant === "clip" ? "clip" : ""}
      className={className}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
