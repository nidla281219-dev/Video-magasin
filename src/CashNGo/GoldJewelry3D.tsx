import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { easeOut, HEIGHT, keyframes, S2, S3, S4, WIDTH } from "./theme";

// ---------- Materials & environment ----------

const makeGold = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#EDB54E"),
    metalness: 1,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.08,
  });

// Studio environment: warm gradient dome + bright softbox strips, which gives
// polished gold its crisp, high-contrast reflections.
const useStudioEnvironment = () => {
  const { gl, scene } = useThree();
  useState(() => {
    const env = new THREE.Scene();
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#5a4a30");
    grad.addColorStop(0.42, "#a8946f");
    grad.addColorStop(0.5, "#fff3dc");
    grad.addColorStop(0.58, "#7d6a4a");
    grad.addColorStop(1, "#1a140c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 256);
    const domeTex = new THREE.CanvasTexture(c);
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
    panel(9, 0.5, [0, 4.5, 8], 3); // thin front strip
    panel(9, 0.8, [0, 3.5, -8], 2.5); // back strip
    panel(0.6, 0.6, [3, 5, 6], 12); // small hot spot for sparkle
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(env, 0.02).texture;
    return true;
  });
};

// ---------- Geometry ----------

// A ring made by spinning a rounded (superellipse) cross-section around the Y axis.
const makeBand = (radius: number, thickness: number, width: number) => {
  const pts: THREE.Vector2[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const e = 0.45; // <1 = rounded-rectangle profile
    const x = Math.sign(c) * Math.abs(c) ** e * (thickness / 2);
    const y = Math.sign(s) * Math.abs(s) ** e * (width / 2);
    pts.push(new THREE.Vector2(radius + thickness / 2 + x, y));
  }
  const g = new THREE.LatheGeometry(pts, 128);
  g.computeVertexNormals();
  return g;
};

// Round brilliant cut approximation: faceted lathe (flat shading does the facets).
const makeGem = (r: number) => {
  const pts = [
    new THREE.Vector2(0, -r * 0.86),
    new THREE.Vector2(r, -r * 0.02),
    new THREE.Vector2(r, r * 0.06),
    new THREE.Vector2(r * 0.58, r * 0.38),
    new THREE.Vector2(0, r * 0.38),
  ];
  return new THREE.LatheGeometry(pts, 16);
};

// Oval chain link (torus stretched along X).
const LINK_R = 0.055;
const LINK_TUBE = 0.017;
const LINK_STRETCH = 1.55;
const LINK_PITCH = 2 * (LINK_R * LINK_STRETCH - LINK_TUBE) * 0.98;
const makeLink = () => {
  const g = new THREE.TorusGeometry(LINK_R, LINK_TUBE, 14, 36);
  g.scale(LINK_STRETCH, 1, 1);
  return g;
};

// Lay links along a curve, every other one turned 90° (classic cable chain).
const chainMatrices = (curve: THREE.Curve<THREE.Vector3>) => {
  const count = Math.floor(curve.getLength() / LINK_PITCH);
  const out: THREE.Matrix4[] = [];
  const X = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i < count; i++) {
    const u = i / count;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(X, t);
    const roll = new THREE.Quaternion().setFromAxisAngle(t, (i % 2) * (Math.PI / 2) + 0.3);
    q.premultiply(roll);
    out.push(new THREE.Matrix4().compose(p, q, new THREE.Vector3(1, 1, 1)));
  }
  return out;
};

const Chain: React.FC<{
  curve: THREE.Curve<THREE.Vector3>;
  material: THREE.Material;
}> = ({ curve, material }) => {
  const geometry = useMemo(makeLink, []);
  const matrices = useMemo(() => chainMatrices(curve), [curve]);
  const [mesh] = useState(
    () => new THREE.InstancedMesh(geometry, material, matrices.length),
  );
  useLayoutEffect(() => {
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [mesh, matrices]);
  return <primitive object={mesh} />;
};

// ---------- Camera ----------

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  // [frame, x, y, z, targetX, targetY, targetZ]
  const keys: number[][] = [
    [0, 1.3, 0.3, 4.9, 0, 0.95, 0.4],
    [S2 - 5, 0.5, 0.25, 5.3, 0, 0.95, 0.4],
    [S2 + 45, 0, 0.5, 8.4, 0, 0.85, 0],
    [S3 - 5, -0.5, 0.6, 8.1, 0, 0.85, 0],
    [S3 + 30, -0.55, 0.2, -0.3, -0.2, 0.08, -1.35],
    [S4 - 5, 0.55, 0.2, -0.3, 0.2, 0.08, -1.35],
    [S4 + 40, 0, 0.45, 9.6, 0, 0.8, 0],
    [450, 0, 0.55, 9.1, 0, 0.8, 0],
  ];
  const at = (i: number) =>
    keyframes(
      frame,
      keys.map((k) => [k[0], k[i]] as [number, number]),
    );
  useLayoutEffect(() => {
    camera.position.set(at(1), at(2), at(3));
    camera.lookAt(at(4), at(5), at(6));
  });
  return null;
};

// ---------- Scene ----------

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  useStudioEnvironment();

  const gold = useMemo(makeGold, []);
  const setting = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#FFFFFF"),
        metalness: 1,
        roughness: 0,
        flatShading: true,
        envMapIntensity: 2.2,
        iridescence: 1,
        iridescenceIOR: 2.4,
      }),
    [],
  );
  const heroBand = useMemo(() => makeBand(0.5, 0.09, 0.3), []);
  const thinBand = useMemo(() => makeBand(0.42, 0.06, 0.11), []);
  const gem = useMemo(() => makeGem(0.13), []);

  // Necklace hanging behind (U shape, ends leave the frame at the top).
  const necklace = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = -1 + (2 * i) / 40;
      pts.push(new THREE.Vector3(1.35 * t, -0.15 + 5.2 * t * t, -1.1 - 0.25 * (1 - t * t)));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  const bracelet = useMemo(
    () =>
      new THREE.EllipseCurve(0, 0, 0.6, 0.6, 0, Math.PI * 2, false, 0),
    [],
  );
  const bracelet3D = useMemo(() => {
    const pts = bracelet
      .getPoints(120)
      .map((p) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.CatmullRomCurve3(pts, true);
  }, [bracelet]);

  const enter = (start: number, from: number) =>
    keyframes(
      frame,
      [
        [start, from],
        [start + 40, 0],
      ],
      easeOut,
    );
  const sway = Math.sin(frame / 45) * 0.04;
  const envIntensity = keyframes(frame, [
    [0, 0.15],
    [40, 1],
  ]);
  const { scene } = useThree();
  scene.environmentIntensity = envIntensity;

  return (
    <>
      <CameraRig />
      <directionalLight position={[-4, 6, 4]} intensity={1.1 * envIntensity} />
      <directionalLight position={[5, 3, -3]} intensity={0.8 * envIntensity} color="#ffd9a0" />

      {/* Hero: wide polished band, turning slowly */}
      <mesh
        geometry={heroBand}
        material={gold}
        position={[0, 0, 0.4]}
        rotation={[Math.PI / 2 - 0.35, frame * 0.018, 0.25]}
      />

      {/* Necklace drops in from above */}
      <group
        position={[0, enter(S2 + 2, 6) + keyframes(frame, [[S4, 0], [S4 + 35, 7]]), 0]}
        rotation={[0, 0, sway]}
      >
        <Chain curve={necklace} material={gold} />
      </group>

      {/* Solitaire ring rises from below */}
      <group
        position={[-0.95, -0.95 + enter(S2 + 8, -5), 0.25]}
        rotation={[0.35, frame * 0.012 + 0.6, -0.3]}
      >
        <mesh geometry={thinBand} material={gold} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={gem} material={setting} position={[0, 0.58, 0]} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return (
            <mesh
              key={i}
              material={gold}
              position={[Math.cos(a) * 0.115, 0.52, Math.sin(a) * 0.115]}
            >
              <cylinderGeometry args={[0.014, 0.018, 0.16, 8]} />
            </mesh>
          );
        })}
      </group>

      {/* Bracelet rises from below */}
      <group
        position={[0.85, -1.1 + enter(S2 + 14, -5), -0.1]}
        rotation={[1.05, frame * -0.01, 0.35]}
      >
        <Chain curve={bracelet3D} material={gold} />
      </group>
    </>
  );
};

export const GoldJewelry3D: React.FC = () => (
  <ThreeCanvas
    width={WIDTH}
    height={HEIGHT}
    camera={{ fov: 40, near: 0.05, far: 100, position: [1, 0.4, 3.3] }}
    gl={{ antialias: true, alpha: true }}
    style={{ position: "absolute", inset: 0 }}
  >
    <Scene />
  </ThreeCanvas>
);
