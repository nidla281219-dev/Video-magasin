import type React from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COLORS = {
  // Cash'ngo brand blue (logo) and darker shades for depth
  blue: "#1E9BE0",
  blueDeep: "#0A3D6B",
  navy: "#061B33",
  white: "#FFFFFF",
  grey: "#8E8E8E",
  // Gold palette (poster / gold bars)
  goldLight: "#FFF1B8",
  gold: "#E8B547",
  goldMid: "#C9932A",
  goldDark: "#8A5E12",
};

// Starts and ends on the same colour so it tiles seamlessly when scrolled.
export const GOLD_GRADIENT = `linear-gradient(100deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 18%, ${COLORS.gold} 34%, ${COLORS.goldDark} 50%, ${COLORS.goldMid} 66%, ${COLORS.goldLight} 84%, ${COLORS.gold} 100%)`;

// Scrolling metallic gold background (for text and shapes).
export const goldFill = (
  frame: number,
  tileWidth: number,
  speed = 4,
): React.CSSProperties => ({
  backgroundImage: GOLD_GRADIENT,
  backgroundSize: `${tileWidth}px 100%`,
  backgroundRepeat: "repeat-x",
  backgroundPosition: `${-frame * speed}px 0`,
});

export const FONT_FAMILY = "Montserrat";

for (const weight of ["600", "800", "900"]) {
  loadFont({
    family: FONT_FAMILY,
    url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`),
    weight,
  });
}

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
