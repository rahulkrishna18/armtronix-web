import { createContext, useContext } from "react";

/** Reduced-motion flag provided inside each Canvas (kept free of three.js imports). */
export const MotionCtx = createContext({ reduced: false });
export const useMotion = () => useContext(MotionCtx);
