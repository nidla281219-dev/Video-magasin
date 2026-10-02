import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fadeUp, pop } from "../anim";
import { COLORS, FONT_FAMILY, goldFill } from "../theme";

const KARATS = ["22K", "18K", "14K"];
const ITEMS = ["Bijoux", "Chaînes", "Bagues", "Lingots"];

export const Karats: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", gap: 80 }}
    >
      <div
        style={{
          ...fadeUp(frame, 0),
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 64,
          color: COLORS.white,
          letterSpacing: 6,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        TOUT TYPE D'OR
        <div
          style={{ color: COLORS.gold, fontSize: 40, letterSpacing: 10 }}
        >
          ACCEPTÉ
        </div>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        {KARATS.map((k, i) => {
          const p = pop(frame, 10 + i * 7, 10);
          return (
            <div
              key={k}
              style={{
                width: 270,
                height: 270,
                borderRadius: "50%",
                ...goldFill(frame + i * 25, 700, 5),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-90, 0])}deg)`,
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.55), inset 0 0 0 10px rgba(255,255,255,0.25), inset 0 0 0 14px rgba(138,94,18,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 92,
                  color: COLORS.navy,
                  textShadow: "0 2px 0 rgba(255,241,184,0.6)",
                }}
              >
                {k}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          width: 720,
        }}
      >
        {ITEMS.map((item, i) => {
          const p = pop(frame, 38 + i * 5, 12);
          return (
            <div
              key={item}
              style={{
                transform: `scale(${p})`,
                padding: "22px 46px",
                borderRadius: 999,
                background: COLORS.blue,
                border: `3px solid ${COLORS.gold}`,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 46,
                color: COLORS.white,
                boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
