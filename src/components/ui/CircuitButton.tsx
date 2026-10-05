import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Renders a trailing arrow glyph that advances on hover. */
  arrow?: boolean;
};

type LinkProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type ButtonProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[12.5px]",
  lg: "h-13 px-6 text-[13px] sm:h-14 sm:px-7",
};

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow: boolean }) {
  return (
    <>
      {variant === "primary" ? (
        // Charge sweep: a darker band travels across the button on hover.
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/35 opacity-0 transition-[left,opacity] duration-700 ease-(--ease-mech) group-hover:left-[120%] group-hover:opacity-100"
        />
      ) : (
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible" preserveAspectRatio="none">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            pathLength={100}
            fill="none"
            stroke="var(--color-cyan)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="trace-rect"
            style={{ ["--trace-len" as string]: 100 }}
          />
        </svg>
      )}
      <span
        aria-hidden
        className={cn(
          "relative size-1.5 shrink-0 transition-colors duration-300",
          variant === "primary" ? "bg-ink" : "bg-steel-2 group-hover:bg-cyan",
        )}
      />
      <span className="relative">{children}</span>
      {arrow && (
        <span aria-hidden className="relative size-4 shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 16 16"
            className="absolute inset-0 size-4 transition-transform duration-500 ease-(--ease-mech) group-hover:translate-x-full"
          >
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className="absolute inset-0 size-4 -translate-x-full transition-transform duration-500 ease-(--ease-mech) group-hover:translate-x-0"
          >
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      )}
    </>
  );
}

/**
 * Primary interactive control. Primary = energised cyan with chamfered corner;
 * ghost = steel outline that traces itself in cyan on hover, like a circuit closing.
 */
export function CircuitButton(props: LinkProps | ButtonProps) {
  const { children, variant = "primary", size = "md", className, arrow = true } = props;
  const classes = cn(
    "group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden font-medium uppercase tracking-[0.14em] transition-colors duration-300",
    sizes[size],
    variant === "primary"
      ? "bg-cyan text-ink [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] hover:bg-[#33d6f0]"
      : "border border-steel-2/80 bg-ink/40 text-white backdrop-blur-sm hover:border-transparent hover:text-white",
    className,
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, children: _c, variant: _v, size: _s, className: _cl, arrow: _a, ...rest } = props as LinkProps;
    return (
      <Link href={href} className={classes} {...rest}>
        <Inner variant={variant} arrow={arrow}>
          {children}
        </Inner>
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _c, variant: _v, size: _s, className: _cl, arrow: _a, type, ...rest } = props as ButtonProps;
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
