import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  easeOut,
  HEIGHT,
  keyframes,
  S2,
  S3,
  S4,
  SANS,
  SERIF,
  WIDTH,
} from "./theme";

// Ingot dimensions (scene units)
const W = 2;
const H = 0.5;
const D = 1;
const TAPER_X = 0.16;
const TAPER_Z = 0.26;

const makeIngotGeometry = () => {
  const g = new RoundedBoxGeometry(W, H, D, 6, 0.07);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + H / 2) / H; // 0 at the base, 1 on top
    pos.setX(i, pos.getX(i) * (1 - TAPER_X * t));
    pos.setZ(i, pos.getZ(i) * (1 - TAPER_Z * t));
  }
  g.computeVertexNormals();
  return g;
};

// Studio "softbox" environment: dark room with a few bright panels, which gives
// metal its crisp, high-contrast reflections.
const useStudioEnvironment = () => {
  const { gl, scene } = useThree();
  useState(() => {
    const env = new THREE.Scene();
    // Gradient dome: dark ceiling, bright warm horizon, dim floor.
    const g = document.createElement("canvas");
    g.width = 4;
    g.height = 256;
    const gctx = g.getContext("2d")!;
    const grad = gctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#5a4a30");
    grad.addColorStop(0.42, "#a8946f");
    grad.addColorStop(0.5, "#fff3dc");
    grad.addColorStop(0.58, "#7d6a4a");
    grad.addColorStop(1, "#1a140c");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 4, 256);
    const domeTex = new THREE.CanvasTexture(g);
    domeTex.colorSpace = THREE.SRGBColorSpace;
    env.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(20, 32, 32),
        new THREE.MeshBasicMaterial({ map: domeTex, side: THREE.BackSide }),
      ),
    );
    const panel = (
      w: number,
      h: number,
      p: [number, number, number],
      intensity: number,
      color = 0xfff4e0,
    ) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color).multiplyScalar(intensity),
          side: THREE.DoubleSide,
        }),
      );
      m.position.set(...p);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel(7, 7, [0, 9, 2], 1.5); // top softbox
    panel(1.2, 9, [-7, 2, 3], 4); // key strip left
    panel(1.2, 9, [7, 2, -1], 3.2, 0xffd9a0); // warm rim right
    panel(9, 0.5, [0, 4.5, 8], 3); // thin front strip (highlight line)
    panel(9, 0.8, [0, 3.5, -8], 2.5); // back strip
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(env, 0.03).texture;
    return true;
  });
};

const drawEngraving = (c: HTMLCanvasElement) => {
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(40, 40, c.width - 80, c.height - 80, 26);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.font = `600 50px "${SANS}"`;
  ctx.letterSpacing = "14px";
  ctx.fillText("FINE GOLD", c.width / 2 + 7, 130);
  ctx.letterSpacing = "4px";
  ctx.font = `600 130px "${SERIF}"`;
  ctx.fillText("999.9", c.width / 2, 255);
  ctx.font = `600 40px "${SANS}"`;
  ctx.letterSpacing = "10px";
  ctx.fillText("1000 g", c.width / 2 + 5, 350);
};

// "FINE GOLD 999.9" stamp, used as an alpha mask on the top face. It is drawn
// right away and redrawn once the web fonts are available.
const useEngravingTexture = () => {
  const [{ texture, canvas }] = useState(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 440;
    drawEngraving(c);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return { texture: tex, canvas: c };
  });
  const [handle] = useState(() => delayRender("engraving fonts"));

  useLayoutEffect(() => {
    Promise.all([
      document.fonts.load(`600 100px "${SERIF}"`),
      document.fonts.load(`600 40px "${SANS}"`),
    ]).then(() => {
      drawEngraving(canvas);
      texture.needsUpdate = true;
      continueRender(handle);
    });
  }, [canvas, texture, handle]);

  return texture;
};

const Ingot: React.FC<{
  geometry: THREE.BufferGeometry;
  gold: THREE.Material;
  engraving: THREE.Material;
  position: [number, number, number];
  rotationY: number;
}> = ({ geometry, gold, engraving, position, rotationY }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh geometry={geometry} material={gold} />
    <mesh
      position={[0, H / 2 + 0.002, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={engraving}
    >
      <planeGeometry args={[1.42, 0.61]} />
    </mesh>
  </group>
);

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  // [frame, x, y, z, targetX, targetY]
  const keys: [number, number, number, number, number, number][] = [
    [0, 3.6, 1.0, 6.4, 0, 0.75],
    [S2 - 5, 1.8, 1.7, 7.4, 0, 0.85],
    [S2 + 45, 1.0, 3.2, 12.5, 0, 2.0],
    [S3 - 5, -1.4, 3.4, 12.0, 0, 2.0],
    [S3 + 30, -0.9, 3.7, 3.0, -0.2, 1.15],
    [S4 - 5, 0.8, 3.6, 3.0, 0.2, 1.15],
    [S4 + 40, 0, 5.6, 13.5, 0, 2.7],
    [450, 0, 5.8, 12.8, 0, 2.7],
  ];
  const at = (i: number) =>
    keyframes(
      frame,
      keys.map((k) => [k[0], k[i]]),
    );

  useLayoutEffect(() => {
    camera.position.set(at(1), at(2), at(3));
    camera.lookAt(at(4), at(5), 0);
  });
  return null;
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  useStudioEnvironment();
  const texture = useEngravingTexture();

  const geometry = useMemo(makeIngotGeometry, []);
  const gold = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#EDB54E"),
        metalness: 1,
        roughness: 0.26,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
      }),
    [],
  );
  const engraving = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#5E3E0E"),
        metalness: 0.7,
        roughness: 0.6,
        alphaMap: texture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    [texture],
  );
  const shadow = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(0,0,0,0.85)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Hero ingot: slow turn, then lifts onto the two others.
  const lift = keyframes(frame, [
    [S2, 0],
    [S2 + 28, 1],
  ]);
  const heroRot = keyframes(
    frame,
    [
      [0, -0.75],
      [S2, -0.2],
      [S2 + 30, 0],
    ],
    easeOut,
  );
  const slideIn = (start: number) =>
    keyframes(
      frame,
      [
        [start, 7],
        [start + 32, 1.06],
      ],
      easeOut,
    );
  const envIntensity = keyframes(frame, [
    [0, 0.15],
    [40, 1],
  ]);

  const { scene } = useThree();
  scene.environmentIntensity = envIntensity;

  return (
    <>
      <CameraRig />
      <directionalLight position={[-4, 6, 4]} intensity={1.2 * envIntensity} />
      <directionalLight position={[5, 3, -3]} intensity={0.8 * envIntensity} color="#ffd9a0" />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -H / 2 - 0.005, 0]}
        scale={[1 + lift * 1.6, 1 + lift * 0.4, 1]}
        material={shadow}
      >
        <planeGeometry args={[3.4, 2]} />
      </mesh>
      <Ingot
        geometry={geometry}
        gold={gold}
        engraving={engraving}
        position={[0, lift * (H + 0.004), 0]}
        rotationY={heroRot}
      />
      <Ingot
        geometry={geometry}
        gold={gold}
        engraving={engraving}
        position={[-slideIn(S2 + 6), 0, 0]}
        rotationY={0}
      />
      <Ingot
        geometry={geometry}
        gold={gold}
        engraving={engraving}
        position={[slideIn(S2 + 12), 0, 0]}
        rotationY={0}
      />
    </>
  );
};

export const GoldBars3D: React.FC = () => (
  <ThreeCanvas
    width={WIDTH}
    height={HEIGHT}
    camera={{ fov: 40, near: 0.1, far: 100, position: [3, 1, 6] }}
    gl={{ antialias: true, alpha: true }}
    style={{ position: "absolute", inset: 0 }}
  >
    <Scene />
  </ThreeCanvas>
);
