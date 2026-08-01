import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Stars,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Read a CSS custom property (HSL triple) from the document root and parse
 * it into a THREE.Color. Falls back to a soft lavender if the variable is
 * missing (e.g. SSR / first render before stylesheet applies).
 */
function readCssColor(varName: string, fallbackHsl: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallbackHsl);
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  if (!raw) return new THREE.Color(fallbackHsl);
  const [h, s, l] = raw.split(/\s+/);
  if (!h || !s || !l) return new THREE.Color(fallbackHsl);
  const css = `hsl(${h}, ${s}, ${l})`;
  try {
    return new THREE.Color(css);
  } catch {
    return new THREE.Color(fallbackHsl);
  }
}

/**
 * Sir Hootington — the user-supplied textured GLB (Cozy Hoodie Owl),
 * loaded as-is with its embedded materials/textures intact. Animated
 * like a clay figure (gentle breathing, figure-8 sway, slow auto-rotate
 * that pauses while the user is dragging).
 */
const SirHootington = ({
  isOrbiting,
  modelUrl,
}: {
  isOrbiting: React.MutableRefObject<boolean>;
  modelUrl: string;
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Load the GLB. useGLTF caches by URL so re-renders don't re-fetch.
  const gltf = useGLTF(modelUrl);
  const scene = gltf.scene as THREE.Group;

  // Enable shadows on every sub-mesh once the scene is loaded — we don't
  // touch materials/textures so the embedded PBR look is preserved.
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [scene]);

  // Detect reduced motion for the inner animation loop.
  const reduceMotion = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mq.matches;
    const onChange = () => {
      reduceMotion.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const reduce = reduceMotion.current;

    // Gentle breathing on the model — small Y scale wobble.
    if (modelRef.current) {
      const breathAmp = reduce ? 0.004 : 0.012;
      const cycle = 3.5;
      const phase = Math.sin((t / cycle) * Math.PI * 2);
      modelRef.current.scale.y = 1 + phase * breathAmp;
      modelRef.current.scale.x = 1 + phase * breathAmp * 0.5;
    }

    // Slight head-tilt sway (the whole figure sways like it's curious).
    if (modelRef.current) {
      const zAmp = reduce ? 0.04 : 0.1;
      const xAmp = reduce ? 0.025 : 0.07;
      modelRef.current.rotation.z = Math.sin(t * 0.5) * zAmp;
      modelRef.current.rotation.x = Math.sin(t * 0.4) * xAmp;
    }

    // Slow auto-rotation when user is not dragging.
    if (rootRef.current && !isOrbiting.current) {
      const speed = reduce ? 0.04 : 0.18; // rad/sec
      rootRef.current.rotation.y += (speed * Math.PI) / 60; // ~60fps assumption
    }

    // delta is unused here but kept to silence the unused-arg lint
    void delta;
  });

  return (
    <group ref={rootRef}>
      <group ref={modelRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

/**
 * Halos — two thin tori that rotate around the owl slowly.
 */
const Halos = ({
  accentColor,
  ringColor,
}: {
  accentColor: THREE.Color;
  ringColor: THREE.Color;
}) => {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.1;
    if (ring1Ref.current) ring1Ref.current.rotation.y = Math.sin(t * 0.2) * 0.12;
    if (ring2Ref.current) ring2Ref.current.rotation.y = Math.cos(t * 0.15) * 0.12;
  });

  return (
    <>
      <group ref={ring1Ref} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[2.6, 0.012, 16, 200]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.55} />
        </mesh>
      </group>
      <group ref={ring2Ref} rotation={[Math.PI / 1.8, -0.3, 0]}>
        <mesh>
          <torusGeometry args={[3.1, 0.008, 12, 160]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  );
};

/**
 * Inner scene contents — runs inside the <Canvas>. Holds the owl, halos,
 * lights, and OrbitControls. Reads theme tokens and rerenders on change.
 */
const SceneContents = ({
  mouseX,
  mouseY,
  isOrbiting,
  themeKey,
  modelUrl,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  isOrbiting: React.MutableRefObject<boolean>;
  themeKey: number;
  modelUrl: string;
}) => {
  const sceneRef = useRef<THREE.Group>(null);
  const spotTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const accentColor = useMemo(() => readCssColor("--accent", "hsl(283, 45%, 75%)"), [themeKey]);
  const ringColor = useMemo(() => readCssColor("--ring", "hsl(270, 47%, 63%)"), [themeKey]);

  // Mouse parallax on the whole scene group (does not fight OrbitControls
  // because OrbitControls operates on the camera, not on the scene graph).
  useFrame(() => {
    if (!sceneRef.current) return;
    const targetX = mouseY.current * 0.1;
    const targetY = mouseX.current * 0.1;
    sceneRef.current.rotation.x += (targetX - sceneRef.current.rotation.x) * 0.04;
    sceneRef.current.rotation.y += (targetY - sceneRef.current.rotation.y) * 0.04;
  });

  return (
    <group ref={sceneRef}>
      <SirHootington
        isOrbiting={isOrbiting}
        modelUrl={modelUrl}
      />
      <Halos accentColor={accentColor} ringColor={ringColor} />

      {/* Lighting rig — 3-point setup tuned for a textured PBR model
         - Key (warm, upper-front-right) carves out form and texture detail
         - Rim (cool, behind) separates the owl from the dark background
         - Fill (accent-tinted, lower-front-left) lifts the shadow side
         - Top spot adds a soft highlight on the hood/cap
         - Ambient keeps deep shadows readable */}
      <ambientLight intensity={0.9} />

      {/* Key light — main shaper, warm white */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.2}
        color="#fff5e6"
      />

      {/* Rim light — cool back-light, defines silhouette */}
      <directionalLight
        position={[-4, 3, -5]}
        intensity={1.6}
        color="#cfe2ff"
      />

      {/* Fill light — accent color from the front-left, lifts shadows */}
      <pointLight
        position={[-3, 0, 4]}
        intensity={1.4}
        distance={14}
        decay={1.6}
        color={accentColor}
      />

      {/* Top spot — pings the hood for sparkle */}
      <pointLight
        position={[0, 4, 2]}
        intensity={0.9}
        distance={10}
        decay={1.8}
        color="#ffffff"
      />

      {/* Subject-tracking spotlight — points at the owl so it stays lit
         even as it rotates / the camera moves. target is a stable Object3D
         at the origin; spotlight.position is in world space. */}
      <primitive object={spotTargetRef.current} position={[0, 0, 0]} />
      <spotLight
        position={[0, 7, 3]}
        intensity={2.4}
        angle={0.55}
        penumbra={0.7}
        distance={20}
        decay={1.4}
        color="#fff8e6"
        target={spotTargetRef.current}
      />

      {/* Soft contact shadow grounds the owl */}
      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.55}
        scale={5}
        blur={2.4}
        far={2.5}
        resolution={256}
      />
    </group>
  );
};

interface HeroSceneProps {
  className?: string;
  /** Optional override of the GLB URL. Defaults to the user-supplied mesh. */
  modelUrl?: string;
}

/**
 * 3D hero scene — Sir Hootington owl rendered from the white_mesh.glb,
 * painted with the theme's `--primary` color, surrounded by halo rings,
 * a starfield, contact shadow, and drag-to-rotate. Theme-aware via the
 * `--primary` / `--accent` / `--ring` tokens. Re-reads colors on the
 * existing `themeChange` event.
 *
 * Honors prefers-reduced-motion — reduces animation amplitude instead of
 * stopping completely (so the scene still reads as alive).
 */
export const HeroScene = ({
  className = "",
  modelUrl = "/cozy_owl.glb",
}: HeroSceneProps) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isOrbiting = useRef(false);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.current = nx;
      mouseY.current = -ny;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onThemeChange = () => setThemeKey((k) => k + 1);
    window.addEventListener("themeChange", onThemeChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("themeChange", onThemeChange);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`select-none cursor-grab active:cursor-grabbing ${className}`}
      key={themeKey}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
      >
        <Suspense fallback={null}>
          {/* Background starfield — keeps the scene feeling infinite */}
          <Stars
            radius={60}
            depth={40}
            count={1400}
            factor={3.2}
            saturation={0.4}
            fade
            speed={0.6}
          />
          <SceneContents
            mouseX={mouseX}
            mouseY={mouseY}
            isOrbiting={isOrbiting}
            themeKey={themeKey}
            modelUrl={modelUrl}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.45}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
            onStart={() => {
              isOrbiting.current = true;
            }}
            onEnd={() => {
              isOrbiting.current = false;
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the model so the first frame isn't empty
useGLTF.preload("/cozy_owl.glb");