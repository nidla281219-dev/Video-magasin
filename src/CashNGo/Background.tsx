import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "./theme";

const PARTICLES = new Array(45).fill(0).map((_, i) => ({
  x: random(`x${i}`) * WIDTH,
  y: random(`y${i}`) * HEIGHT,
  size: 2 + random(`s${i}`) * 6,
  speed: 0.4 + random(`v${i}`) * 1.4,
  phase: random(`p${i}`) * Math.PI * 2,
}));

// Deep brand-blue backdrop with slowly rotating golden light rays and floating gold dust.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, ${COLORS.blueDeep} 0%, ${COLORS.navy} 62%, #020B16 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          width: 2600,
          height: 2600,
          left: (WIDTH - 2600) / 2,
          top: HEIGHT * 0.38 - 1300,
          background: `repeating-conic-gradient(from 0deg, rgba(232,181,71,0.10) 0deg 6deg, transparent 6deg 22deg)`,
          transform: `rotate(${frame * 0.15}deg)`,
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 55%)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 55%)",
        }}
      />
      {PARTICLES.map((p, i) => {
        const y = (((p.y - frame * p.speed * 2) % HEIGHT) + HEIGHT) % HEIGHT;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / 18 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + Math.sin(frame / 40 + p.phase) * 20,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: COLORS.goldLight,
              opacity: twinkle * 0.7,
              boxShadow: `0 0 ${p.size * 3}px ${COLORS.gold}`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
