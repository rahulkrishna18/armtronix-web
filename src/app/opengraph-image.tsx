import { ImageResponse } from "next/og";

export const alt = "Armtronix | Bridging Physical Foundations and Digital Frontiers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const grid = [];
  for (let x = 0; x <= 1200; x += 60) grid.push(<div key={`x${x}`} style={{ position: "absolute", left: x, top: 0, width: 1, height: 630, background: "rgba(40,52,60,0.55)" }} />);
  for (let y = 0; y <= 630; y += 60) grid.push(<div key={`y${y}`} style={{ position: "absolute", top: y, left: 0, height: 1, width: 1200, background: "rgba(40,52,60,0.55)" }} />);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#080B0D", padding: 72, position: "relative", color: "#E9F0F2", fontFamily: "sans-serif" }}>
        {grid}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 8, color: "#00C8E8" }}>
          <div style={{ width: 12, height: 12, background: "#00C8E8" }} />
          ARMTRONIX · ENGINEERED INTELLIGENCE
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, fontWeight: 600 }}>
          <span>Bridging Physical Foundations</span>
          <span style={{ color: "#8D9DA6" }}>and Digital Frontiers.</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 20, letterSpacing: 4, color: "#8D9DA6" }}>
          <span>CONSTRUCTION</span>
          <span style={{ color: "#3A4851" }}>/</span>
          <span>ENGINEERING</span>
          <span style={{ color: "#3A4851" }}>/</span>
          <span>TRANSMISSION</span>
          <span style={{ color: "#3A4851" }}>/</span>
          <span>TECHNOLOGIES</span>
        </div>
      </div>
    ),
    size,
  );
}
