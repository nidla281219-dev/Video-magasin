import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

// The Cash'ngo logo on a white card (the logo artwork has a white background),
// with a light reflection sweeping across.
export const LogoCard: React.FC<{ width: number; shineStart?: number }> = ({
  width,
  shineStart = 10,
}) => {
  const frame = useCurrentFrame();
  const shineX = interpolate(frame - shineStart, [0, 30], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        padding: width * 0.06,
        background: "#fff",
        borderRadius: width * 0.07,
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.55), 0 0 0 6px rgba(232,181,71,0.85), 0 0 60px rgba(232,181,71,0.35)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile("cashngo-logo.jpg")}
        style={{ width: "100%", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${shineX - 15}%, rgba(255,255,255,0.0) ${shineX - 10}%, rgba(255,230,160,0.55) ${shineX}%, rgba(255,255,255,0) ${shineX + 10}%)`,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};
