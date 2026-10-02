import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Kicker, MaskLine, Reveal } from "./Text";
import {
  COLORS,
  DURATION,
  easeOut,
  GOLD_TEXT,
  S2,
  S3,
  S4,
  SANS,
  SERIF,
} from "./theme";

const top: React.CSSProperties = {
  position: "absolute",
  top: 250,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const headline: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 600,
  fontSize: 132,
  lineHeight: 1,
  color: COLORS.cream,
  letterSpacing: -1,
};

const Hook: React.FC = () => (
  <Reveal start={8} end={S2 + 6} style={top}>
    <Kicker delay={10}>Cash'ngo · Rachat d'or</Kicker>
    <div style={{ height: 40 }} />
    <MaskLine delay={18} style={headline}>
      Nous achetons
    </MaskLine>
    <MaskLine delay={26} style={headline}>
      votre or
    </MaskLine>
    <MaskLine
      delay={40}
      style={{ ...headline, ...GOLD_TEXT, fontStyle: "italic", fontSize: 120 }}
    >
      au meilleur prix
    </MaskLine>
  </Reveal>
);

const Karats: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["22K", "18K", "14K"];
  return (
    <Reveal start={S2 + 14} end={S3 + 4} style={top}>
      <Kicker delay={S2 + 14}>Tout type d'or accepté</Kicker>
      <div style={{ height: 50 }} />
      <div style={{ display: "flex", alignItems: "center" }}>
        {items.map((k, i) => {
          const p = interpolate(frame, [S2 + 24 + i * 6, S2 + 50 + i * 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          });
          return (
            <React.Fragment key={k}>
              {i > 0 ? (
                <div
                  style={{
                    width: 1.5,
                    height: 120 * p,
                    background: COLORS.gold,
                    opacity: 0.6,
                    margin: "0 44px",
                  }}
                />
              ) : null}
              <div
                style={{
                  ...headline,
                  ...GOLD_TEXT,
                  fontSize: 170,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 40}px)`,
                }}
              >
                {k}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ height: 36 }} />
      <Reveal start={S2 + 50} end={10_000}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 8,
            color: COLORS.cream,
            opacity: 0.8,
          }}
        >
          CHAÎNES · BAGUES · BRACELETS
        </div>
      </Reveal>
    </Reveal>
  );
};

const STEPS = ["Apportez votre or", "Estimation sur place", "Repartez avec votre cash"];

const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const shade = interpolate(frame, [S3, S3 + 20, S4 - 10, S4 + 5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: shade,
          background:
            "linear-gradient(180deg, rgba(6,6,6,0.92) 0%, rgba(6,6,6,0.75) 45%, rgba(6,6,6,0) 75%)",
        }}
      />
      <Reveal start={S3 + 8} end={S4 + 2} style={top}>
        <Kicker delay={S3 + 8}>Simple & rapide</Kicker>
        <div style={{ height: 50 }} />
        {STEPS.map((step, i) => (
          <Reveal key={step} start={S3 + 16 + i * 9} end={10_000}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 34,
                width: 820,
                padding: "26px 0",
                borderBottom:
                  i < STEPS.length - 1 ? "1px solid rgba(217,174,85,0.35)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: 64,
                  ...GOLD_TEXT,
                }}
              >
                0{i + 1}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 72,
                  color: COLORS.cream,
                }}
              >
                {step}
              </span>
            </div>
          </Reveal>
        ))}
      </Reveal>
    </>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [S4 + 30, S4 + 60], [-30, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Reveal start={S4 + 6} end={DURATION + 100} style={{ ...top, top: 230 }}>
      <div
        style={{
          width: 560,
          padding: "28px 38px",
          background: "#fff",
          borderRadius: 24,
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "0 40px 90px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(217,174,85,0.9), 0 0 0 10px rgba(217,174,85,0.12)",
        }}
      >
        <Img src={staticFile("cashngo-logo.jpg")} style={{ width: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(246,222,156,0.45) ${sweep}%, transparent ${sweep + 12}%)`,
            mixBlendMode: "multiply",
          }}
        />
      </div>
      <div style={{ height: 56 }} />
      <MaskLine delay={S4 + 20} style={{ ...headline, fontSize: 100 }}>
        Rachat d'or
      </MaskLine>
      <MaskLine delay={S4 + 27} style={{ ...headline, fontSize: 100 }}>
        dans le magasin
      </MaskLine>
      <MaskLine
        delay={S4 + 36}
        style={{ ...headline, ...GOLD_TEXT, fontStyle: "italic", fontSize: 108 }}
      >
        depuis 1997
      </MaskLine>
      <div style={{ height: 30 }} />
      <Kicker delay={S4 + 48}>cashngo.ch</Kicker>
    </Reveal>
  );
};

export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 18], [1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,6,6,0.75) 0%, rgba(6,6,6,0.45) 35%, rgba(6,6,6,0) 55%)",
        }}
      />
      <Hook />
      <Karats />
      <Steps />
      <EndCard />
      <AbsoluteFill style={{ background: "#000", opacity: fadeIn }} />
    </AbsoluteFill>
  );
};
