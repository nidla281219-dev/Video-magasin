import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Finish } from "./Atmosphere";
import { GoldBars3D } from "./GoldBars3D";
import { Overlay } from "./Overlay";

export const CashNGoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Backdrop />
    <GoldBars3D />
    <Overlay />
    <Finish />
  </AbsoluteFill>
);
