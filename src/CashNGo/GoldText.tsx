import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT_FAMILY, goldFill } from "./theme";

// Text filled with a moving metallic gold gradient.
export const GoldText: React.FC<{
  children: React.ReactNode;
  fontSize: number;
  style?: React.CSSProperties;
}> = ({ children, fontSize, style }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.05,
        ...goldFill(frame, fontSize * 8, 5),
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
