import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "./theme";

const BOKEH = new Array(16).fill(0).map((_, i) => ({
  x: random(`bx${i}`) * WIDTH,
  y: random(`by${i}`) * HEIGHT,
  size: 30 + random(`bs${i}`) * 110,
  drift: 0.15 + random(`bd${i}`) * 0.35,
  phase: random(`bp${i}`) * Math.PI * 2,
}));

// Behind the 3D layer: warm spotlight on black plus soft out-of-focus gold bokeh.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 45% at 50% 70%, #2a2114 0%, #120f0a 45%, ${COLORS.black} 100%)`,
      }}
    >
      {BOKEH.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x + Math.sin(frame / 60 + b.phase) * 30,
            top: b.y - frame * b.drift,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(246,222,156,0.22) 0%, rgba(217,174,85,0.08) 55%, transparent 72%)`,
            opacity: 0.5 + 0.5 * Math.sin(frame / 25 + b.phase),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// On top of everything: vignette and fine film grain.
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <svg width={WIDTH} height={HEIGHT} style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={frame % 8}
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
