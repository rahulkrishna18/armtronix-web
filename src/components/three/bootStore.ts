import { create } from "zustand";

/** The hero's power-on sequence: physical → digital, in six stages. */
export const BOOT_STAGES = [
  { id: "structure", label: "Physical structure", status: "Erected", at: 0 },
  { id: "power", label: "Power & cooling", status: "Energized", at: 0.2 },
  { id: "network", label: "Network paths", status: "Linked", at: 0.36 },
  { id: "sensors", label: "Sensor array", status: "Online", at: 0.5 },
  { id: "data", label: "Data flow", status: "Streaming", at: 0.64 },
  { id: "intelligence", label: "Intelligence layer", status: "Active", at: 0.8 },
] as const;

export const BOOT_DURATION = 8.5; // seconds

type BootState = {
  stage: number;
  run: number;
  setStage: (s: number) => void;
  replay: () => void;
};

export const useBoot = create<BootState>((set) => ({
  stage: -1,
  run: 0,
  setStage: (stage) => set({ stage }),
  replay: () => set((s) => ({ run: s.run + 1, stage: -1 })),
}));

export const stageAt = (p: number) => {
  let s = -1;
  for (let i = 0; i < BOOT_STAGES.length; i++) if (p >= BOOT_STAGES[i].at) s = i;
  return p >= 1 ? BOOT_STAGES.length : s;
};
