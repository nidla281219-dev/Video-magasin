import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fadeUp, pop } from "../anim";
import { GoldBar } from "../GoldBar";
import { LogoCard } from "../LogoCard";
import { COLORS, FONT_FAMILY, goldFill } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = pop(frame, 0, 13);
  const cta = pop(frame, 30, 10);
  const pulse = 1 + Math.sin(Math.max(0, frame - 45) / 6) * 0.03;
  const shine = interpolate(frame % 60, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", gap: 70 }}
    >
      <div style={{ transform: `scale(${logo})` }}>
        <LogoCard width={760} shineStart={15} />
      </div>
      <div
        style={{
          ...fadeUp(frame, 14),
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 110,
          color: COLORS.white,
          textShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        cashngo<span style={{ color: COLORS.blue }}>.ch</span>
      </div>
      <div
        style={{
          transform: `scale(${cta * pulse})`,
          padding: "34px 70px",
          borderRadius: 999,
          ...goldFill(frame, 1400, 6),
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 54,
          color: COLORS.navy,
          letterSpacing: 2,
          boxShadow: "0 18px 50px rgba(232,181,71,0.45)",
        }}
      >
        PASSEZ EN MAGASIN
      </div>
      <div style={{ ...fadeUp(frame, 40), display: "flex", gap: 10 }}>
        <GoldBar width={300} shine={shine} />
        <GoldBar width={300} shine={shine} />
      </div>
    </AbsoluteFill>
  );
};
