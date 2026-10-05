"use client";

import { ECOSYSTEM_LAYER_STYLE } from "./sceneLabels";
import { LabelLayer, LabelNode, type LabelRegistry } from "./labelRegistry";

/** DOM labels for the ecosystem stack plates (positioned by the scene). */
export function EcosystemLabels({ registry }: { registry: LabelRegistry }) {
  return (
    <LabelLayer>
      {ECOSYSTEM_LAYER_STYLE.map((l, i) => (
        <LabelNode key={l.label} registry={registry} id={`layer-${i}`}>
          <div
            className="flex -translate-y-1/2 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-mute transition-colors duration-300 in-data-[on=true]:text-(--c)"
            style={{ ["--c" as string]: l.color }}
          >
            <span className="h-px w-6 bg-current" />
            <span>L{i}</span>
            <span>{l.label}</span>
          </div>
        </LabelNode>
      ))}
    </LabelLayer>
  );
}
