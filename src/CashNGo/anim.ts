import { interpolate, spring } from "remotion";
import { FPS } from "./theme";

export const pop = (frame: number, delay = 0, damping = 12) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, mass: 0.8 } });

export const fadeUp = (frame: number, delay = 0, distance = 60) => {
  const p = spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  };
};
