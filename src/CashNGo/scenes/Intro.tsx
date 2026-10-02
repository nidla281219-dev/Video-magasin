import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fadeUp, pop } from "../anim";
import { LogoCard } from "../LogoCard";
import { COLORS, FONT_FAMILY } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const s = pop(frame, 4, 13);
  const line = interpolate(frame, [28, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 70 }}
    >
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-6, 0])}deg)`,
          opacity: s,
        }}
      >
        <LogoCard width={820} shineStart={22} />
      </div>
      <div
        style={{
          width: 600 * line,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }}
      />
      <div
        style={{
          ...fadeUp(frame, 36),
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 54,
          letterSpacing: 18,
          color: COLORS.white,
          textAlign: "center",
          paddingLeft: 18,
        }}
      >
        RACHAT D'OR
      </div>
      <div
        style={{
          ...fadeUp(frame, 46),
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 6,
          color: COLORS.gold,
        }}
      >
        OR 22K • 18K • 14K
      </div>
    </AbsoluteFill>
  );
};
