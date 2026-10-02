import React, { useId } from "react";
import { COLORS } from "./theme";

// Stylised 3/4-view gold ingot drawn in SVG. `shine` (0 → 1) sweeps a highlight across it.
export const GoldBar: React.FC<{
  width: number;
  shine?: number;
  style?: React.CSSProperties;
}> = ({ width, shine = -1, style }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const top = "110,24 330,24 352,92 88,92";
  const front = "88,92 352,92 384,196 56,196";
  const side = "330,24 352,92 384,196 398,176 362,58";
  const sheenX = -200 + shine * 700;

  return (
    <svg
      viewBox="0 0 420 220"
      width={width}
      height={(width * 220) / 420}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={`top${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={COLORS.goldLight} />
          <stop offset="0.55" stopColor={COLORS.gold} />
          <stop offset="1" stopColor={COLORS.goldMid} />
        </linearGradient>
        <linearGradient id={`front${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7D477" />
          <stop offset="0.5" stopColor={COLORS.goldMid} />
          <stop offset="1" stopColor={COLORS.goldDark} />
        </linearGradient>
        <linearGradient id={`side${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A9761C" />
          <stop offset="1" stopColor="#5E3F08" />
        </linearGradient>
        <linearGradient id={`sheen${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <polygon points={top} />
          <polygon points={front} />
          <polygon points={side} />
        </clipPath>
      </defs>
      <ellipse cx="215" cy="204" rx="200" ry="14" fill="#000" opacity="0.35" />
      <polygon points={side} fill={`url(#side${id})`} />
      <polygon points={front} fill={`url(#front${id})`} />
      <polygon points={top} fill={`url(#top${id})`} />
      <polyline
        points="88,92 352,92"
        stroke={COLORS.goldLight}
        strokeWidth="2"
        opacity="0.8"
      />
      <g
        fill={COLORS.goldDark}
        opacity="0.55"
        fontFamily="Georgia, serif"
        textAnchor="middle"
      >
        <text x="220" y="52" fontSize="20" letterSpacing="3">
          FINE GOLD
        </text>
        <text x="220" y="80" fontSize="22" letterSpacing="2">
          999.9
        </text>
        <text x="220" y="156" fontSize="18" letterSpacing="2">
          1000 g
        </text>
      </g>
      <g clipPath={`url(#clip${id})`}>
        <rect
          x={sheenX}
          y="-40"
          width="90"
          height="300"
          fill={`url(#sheen${id})`}
          transform={`skewX(-25)`}
        />
      </g>
    </svg>
  );
};
