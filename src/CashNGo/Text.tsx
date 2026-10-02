import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, easeInOut, easeOut, SANS } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fades/blurs a block in at `start` and out at `end`.
export const Reveal: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, end, children, style }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [start, start + 24], [0, 1], { ...clamp, easing: easeOut });
  const outP = interpolate(frame, [end - 14, end], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <div
      style={{
        opacity: inP * (1 - outP),
        filter: `blur(${(1 - inP) * 12 + outP * 10}px)`,
        transform: `translateY(${(1 - inP) * 30 - outP * 20}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// A line that slides up from behind a mask.
export const MaskLine: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 26], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
      <div style={{ transform: `translateY(${(1 - p) * 105}%)`, ...style }}>
        {children}
      </div>
    </div>
  );
};

// Small spaced uppercase label with hairlines that draw outwards.
export const Kicker: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 30], [0, 1], { ...clamp, easing: easeOut });
  const line = (
    <div
      style={{
        width: 70 * p,
        height: 1.5,
        background: COLORS.gold,
        opacity: 0.8,
      }}
    />
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        opacity: p,
      }}
    >
      {line}
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: interpolate(p, [0, 1], [18, 9]),
          color: COLORS.gold,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      {line}
    </div>
  );
};
