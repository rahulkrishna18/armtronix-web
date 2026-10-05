import { cn } from "@/lib/cn";

/**
 * Static stand-in for a 3D scene: shown while the scene streams in and
 * permanently on devices without WebGL. Drawn as an isometric line study.
 */
export function ScenePoster({ className, label = "Initialising visualisation" }: { className?: string; label?: string }) {
  // Isometric helpers (30°)
  const iso = (x: number, y: number, z: number) => {
    const cx = 400 + (x - z) * 0.866 * 26;
    const cy = 300 + (x + z) * 0.5 * 26 - y * 26;
    return `${cx.toFixed(1)},${cy.toFixed(1)}`;
  };
  const box = (x: number, y: number, z: number, w: number, h: number, d: number) => {
    const p = [
      iso(x, y, z),
      iso(x + w, y, z),
      iso(x + w, y, z + d),
      iso(x, y, z + d),
      iso(x, y + h, z),
      iso(x + w, y + h, z),
      iso(x + w, y + h, z + d),
      iso(x, y + h, z + d),
    ];
    return `M${p[0]}L${p[1]}L${p[2]}L${p[3]}Z M${p[4]}L${p[5]}L${p[6]}L${p[7]}Z M${p[0]}L${p[4]} M${p[1]}L${p[5]} M${p[2]}L${p[6]} M${p[3]}L${p[7]}`;
  };
  const grid: string[] = [];
  for (let i = -8; i <= 8; i++) {
    grid.push(`M${iso(i, 0, -8)}L${iso(i, 0, 8)}`, `M${iso(-8, 0, i)}L${iso(8, 0, i)}`);
  }
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-hidden", className)}>
      <svg viewBox="0 0 800 600" className="h-full w-full max-w-[1100px] opacity-70" aria-hidden>
        <path d={grid.join(" ")} stroke="var(--color-steel)" strokeWidth="0.6" fill="none" opacity="0.6" />
        <path d={box(-5, 0, -3, 10, 0.4, 6)} stroke="var(--color-steel-2)" strokeWidth="1" fill="none" />
        <path d={box(-5, 0.4, -3, 10, 3.2, 6)} stroke="var(--color-steel-2)" strokeWidth="0.8" fill="none" strokeDasharray="3 4" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={box(-3.6 + i * 0.9, 0.4, -1.6, 0.6, 2, 1)} stroke="var(--color-steel-2)" strokeWidth="0.7" fill="none" />
        ))}
        <path d={`M${iso(-8, 0.5, 1.5)}L${iso(-5, 0.5, 1.5)}L${iso(-4, 2.6, 1.5)}L${iso(4, 2.6, 1.5)}`} stroke="var(--color-blue)" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d={`M${iso(8, 0.05, -2.2)}L${iso(4.7, 0.5, -2.2)}L${iso(4.7, 2.9, -1)}L${iso(-4, 2.9, -1)}`} stroke="var(--color-cyan)" strokeWidth="1.2" fill="none" opacity="0.6" />
      </svg>
      <span className="tech-label absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-dim">{label}</span>
    </div>
  );
}
