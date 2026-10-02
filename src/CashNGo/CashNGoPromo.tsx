import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Finish } from "./Atmosphere";
import { GoldJewelry3D } from "./GoldJewelry3D";
import { Overlay } from "./Overlay";

export const CashNGoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Backdrop />
    <GoldJewelry3D />
    <Overlay />
    <Finish />
  </AbsoluteFill>
);
