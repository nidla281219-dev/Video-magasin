import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 450;

// Scene boundaries (frames)
export const S1 = 0;
export const S2 = 120;
export const S3 = 235;
export const S4 = 340;

export const COLORS = {
  black: "#060606",
  cream: "#F5EFE3",
  gold: "#D9AE55",
  goldLight: "#F6DE9C",
  goldDeep: "#9A7027",
  blue: "#1E9BE0", // Cash'ngo brand blue
};

export const SERIF = "Cormorant Garamond";
export const SANS = "Montserrat";

const FONTS: [string, string, string, string][] = [
  [SERIF, "500", "normal", "cormorant-garamond-latin-500-normal.woff2"],
  [SERIF, "600", "normal", "cormorant-garamond-latin-600-normal.woff2"],
  [SERIF, "600", "italic", "cormorant-garamond-latin-600-italic.woff2"],
  [SANS, "500", "normal", "montserrat-latin-500-normal.woff2"],
  [SANS, "600", "normal", "montserrat-latin-600-normal.woff2"],
];
for (const [family, weight, style, file] of FONTS) {
  loadFont({ family, weight, style, url: staticFile(`fonts/${file}`) });
}

export const GOLD_TEXT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 55%, ${COLORS.goldDeep} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Interpolate through keyframes [frame, value] with an ease on every segment.
export const keyframes = (
  frame: number,
  keys: [number, number][],
  easing = easeInOut,
) =>
  interpolate(
    frame,
    keys.map((k) => k[0]),
    keys.map((k) => k[1]),
    { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
