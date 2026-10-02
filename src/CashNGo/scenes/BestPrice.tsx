import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { pop } from "../anim";
import { GoldBar } from "../GoldBar";
import { GoldText } from "../GoldText";
import { COLORS, FONT_FAMILY } from "../theme";

const Line: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 200);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 8 }}>
      <div
        style={{
          transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)`,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 96,
          whiteSpace: "nowrap",
          lineHeight: 1.05,
          color: COLORS.white,
          textShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Bars drop in one after the other, then get a shine pass.
const BARS = [
  { x: -170, y: 90, delay: 40 },
  { x: 170, y: 90, delay: 48 },
  { x: 0, y: -40, delay: 58 },
];

export const BestPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const price = pop(frame, 22, 9);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <div style={{ textAlign: "center" }}>
        <Line delay={0}>NOUS ACHETONS</Line>
        <Line delay={6}>VOTRE OR</Line>
      </div>
      <div
        style={{
          marginTop: 30,
          textAlign: "center",
          transform: `scale(${interpolate(price, [0, 1], [1.6, 1])})`,
          opacity: Math.min(1, price * 1.5),
        }}
      >
        <GoldText fontSize={118} style={{ whiteSpace: "nowrap" }}>
          AU MEILLEUR
        </GoldText>
        <br />
        <GoldText fontSize={230} style={{ letterSpacing: 6 }}>
          PRIX
        </GoldText>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1330 }}>
        {BARS.map((b, i) => {
          const p = pop(frame, b.delay, 14);
          const shine = interpolate(frame, [b.delay + 25, b.delay + 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x - 190,
                top: b.y - 100 + interpolate(p, [0, 1], [-900, 0]),
                opacity: Math.min(1, p * 3),
              }}
            >
              <GoldBar width={380} shine={shine} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
