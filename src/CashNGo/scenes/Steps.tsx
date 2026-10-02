import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fadeUp, pop } from "../anim";
import { GoldText } from "../GoldText";
import { COLORS, FONT_FAMILY } from "../theme";

const STEPS = [
  "Apportez votre or",
  "Estimation sur place",
  "Recevez votre cash",
];

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", gap: 90 }}
    >
      <div style={{ ...fadeUp(frame, 0), textAlign: "center" }}>
        <GoldText fontSize={110}>
          SIMPLE
          <br />& RAPIDE
        </GoldText>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {STEPS.map((step, i) => {
          const p = pop(frame, 14 + i * 10, 15);
          return (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                width: 900,
                padding: "26px 36px",
                borderRadius: 36,
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(232,181,71,0.45)",
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-700, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: COLORS.blue,
                  border: `5px solid ${COLORS.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 60,
                  color: COLORS.white,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 52,
                  color: COLORS.white,
                  lineHeight: 1.15,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
