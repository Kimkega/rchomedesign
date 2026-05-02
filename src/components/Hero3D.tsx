import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, useGLTF, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic procedural luxury house — modern dark architectural,
 * warm interior glow, glass curtain wall, sloped roof, planted base,
 * stone chimney, wood deck, landscape lighting.
 */
function RealisticHouse() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  const mats = useMemo(() => ({
    darkWall: new THREE.MeshStandardMaterial({ color: "#1d1916", roughness: 0.78, metalness: 0.06 }),
    charcoal: new THREE.MeshStandardMaterial({ color: "#0f0d0c", roughness: 0.68, metalness: 0.18 }),
    stone:    new THREE.MeshStandardMaterial({ color: "#3a342e", roughness: 0.95, metalness: 0.02 }),
    wood:     new THREE.MeshStandardMaterial({ color: "#5a3a22", roughness: 0.82, metalness: 0.05 }),
    deck:     new THREE.MeshStandardMaterial({ color: "#7a5230", roughness: 0.7,  metalness: 0.04 }),
    glass:    new THREE.MeshPhysicalMaterial({
      color: "#ffd089", roughness: 0.05, metalness: 0.0,
      transmission: 0.6, thickness: 0.4, ior: 1.45,
      emissive: "#ffb259", emissiveIntensity: 0.55,
      envMapIntensity: 1.4, transparent: true, opacity: 0.9,
    }),
    coolGlass: new THREE.MeshPhysicalMaterial({
      color: "#90c2d8", roughness: 0.04, metalness: 0.05,
      transmission: 0.85, thickness: 0.3, envMapIntensity: 1.2,
    }),
    bronze:   new THREE.MeshStandardMaterial({ color: "#d4a35a", roughness: 0.28, metalness: 0.92, emissive: "#7a4a1a", emissiveIntensity: 0.28 }),
    grass:    new THREE.MeshStandardMaterial({ color: "#1b2418", roughness: 1.0 }),
    concrete: new THREE.MeshStandardMaterial({ color: "#23201d", roughness: 0.9 }),
  }), []);

  return (
    <group ref={group} position={[0, -0.6, 0]} scale={0.95}>
      {/* Ground / lawn */}
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <cylinderGeometry args={[5.5, 5.5, 0.1, 64]} />
        <primitive object={mats.grass} attach="material" />
      </mesh>
      {/* Concrete pad */}
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.08, 3.8]} />
        <primitive object={mats.concrete} attach="material" />
      </mesh>

      {/* ---- LEFT WING (private / bedrooms) ---- */}
      <mesh position={[-1.55, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.4, 2.6]} />
        <primitive object={mats.darkWall} attach="material" />
      </mesh>
      {/* Stone accent wall on side */}
      <mesh position={[-2.56, 0.7, 0]} castShadow>
        <boxGeometry args={[0.05, 1.4, 2.6]} />
        <primitive object={mats.stone} attach="material" />
      </mesh>
      {/* Wood slat panel front */}
      <mesh position={[-1.55, 0.7, 1.31]} castShadow>
        <boxGeometry args={[1.4, 1.2, 0.04]} />
        <primitive object={mats.wood} attach="material" />
      </mesh>
      {/* Window strip on left wing */}
      <mesh position={[-1.55, 1.05, 1.33]}>
        <boxGeometry args={[1.6, 0.32, 0.02]} />
        <primitive object={mats.glass} attach="material" />
      </mesh>
      {/* Side bedroom windows */}
      {[-0.7, 0.0, 0.7].map((z, i) => (
        <mesh key={i} position={[-2.59, 0.85, z]}>
          <boxGeometry args={[0.02, 0.55, 0.45]} />
          <primitive object={mats.glass} attach="material" />
        </mesh>
      ))}

      {/* ---- LINKING CORE (entry + bronze portal) ---- */}
      <mesh position={[-0.3, 0.65, 0]} castShadow>
        <boxGeometry args={[0.7, 1.3, 2.4]} />
        <primitive object={mats.charcoal} attach="material" />
      </mesh>
      {/* Bronze entry portal frame */}
      <mesh position={[-0.3, 0.7, 1.21]}>
        <boxGeometry args={[0.55, 1.1, 0.03]} />
        <primitive object={mats.bronze} attach="material" />
      </mesh>
      {/* Door */}
      <mesh position={[-0.3, 0.5, 1.225]}>
        <boxGeometry args={[0.42, 0.85, 0.02]} />
        <primitive object={mats.glass} attach="material" />
      </mesh>

      {/* ---- RIGHT WING (great room / glass box) ---- */}
      <mesh position={[1.4, 0.65, 0]} castShadow>
        <boxGeometry args={[2.2, 1.3, 2.6]} />
        <primitive object={mats.glass} attach="material" />
      </mesh>
      {/* Vertical bronze mullions */}
      {[-0.95, -0.5, -0.05, 0.4, 0.85].map((x, i) => (
        <mesh key={i} position={[1.4 + x, 0.65, 1.31]}>
          <boxGeometry args={[0.025, 1.3, 0.02]} />
          <primitive object={mats.bronze} attach="material" />
        </mesh>
      ))}
      {/* Horizontal mullions */}
      {[0.05, 1.25].map((y, i) => (
        <mesh key={i} position={[1.4, y, 1.31]}>
          <boxGeometry args={[2.25, 0.03, 0.02]} />
          <primitive object={mats.bronze} attach="material" />
        </mesh>
      ))}
      {/* Solid back wall behind the glass */}
      <mesh position={[1.4, 0.65, -1.3]} castShadow>
        <boxGeometry args={[2.2, 1.3, 0.05]} />
        <primitive object={mats.darkWall} attach="material" />
      </mesh>

      {/* ---- ROOFS (low-slope cantilevered) ---- */}
      {/* Left wing roof */}
      <mesh position={[-1.55, 1.45, 0]} castShadow>
        <boxGeometry args={[2.3, 0.08, 2.95]} />
        <primitive object={mats.charcoal} attach="material" />
      </mesh>
      {/* Linking core roof (slightly higher) */}
      <mesh position={[-0.3, 1.36, 0]} castShadow>
        <boxGeometry args={[0.85, 0.08, 2.7]} />
        <primitive object={mats.charcoal} attach="material" />
      </mesh>
      {/* Right wing flat roof with deep eave */}
      <mesh position={[1.4, 1.36, 0.15]} castShadow>
        <boxGeometry args={[2.5, 0.08, 3.2]} />
        <primitive object={mats.charcoal} attach="material" />
      </mesh>
      {/* Bronze fascia trim */}
      <mesh position={[1.4, 1.32, 1.76]}>
        <boxGeometry args={[2.5, 0.03, 0.03]} />
        <primitive object={mats.bronze} attach="material" />
      </mesh>

      {/* ---- DECK + STEPS ---- */}
      <mesh position={[0.4, 0.04, 1.95]} receiveShadow>
        <boxGeometry args={[3.4, 0.05, 1.0]} />
        <primitive object={mats.deck} attach="material" />
      </mesh>
      <mesh position={[0.4, 0.0, 2.3]} receiveShadow>
        <boxGeometry args={[3.0, 0.04, 0.4]} />
        <primitive object={mats.deck} attach="material" />
      </mesh>

      {/* ---- CHIMNEY (stone) ---- */}
      <mesh position={[-2.2, 1.85, -0.5]} castShadow>
        <boxGeometry args={[0.4, 1.0, 0.4]} />
        <primitive object={mats.stone} attach="material" />
      </mesh>

      {/* ---- LANDSCAPE: small hedges + trees ---- */}
      {[[-3.2, 0, 1.6], [-3.2, 0, -1.6], [3.0, 0, -1.7]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#1f2b1d" roughness={1} />
        </mesh>
      ))}
      {/* Tree */}
      <group position={[3.4, 0, 1.5]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 1, 8]} />
          <meshStandardMaterial color="#2a1d12" roughness={1} />
        </mesh>
        <mesh castShadow position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.45, 18, 18]} />
          <meshStandardMaterial color="#2a3b22" roughness={1} />
        </mesh>
      </group>

      {/* ---- POOL strip + reflections ---- */}
      <mesh position={[2.0, 0.005, 2.4]} receiveShadow>
        <boxGeometry args={[1.4, 0.02, 0.5]} />
        <meshPhysicalMaterial color="#0a3a4a" roughness={0.05} metalness={0.1} transmission={0.4} thickness={0.2} />
      </mesh>

      {/* ---- WARM POINT LIGHTS (interior) ---- */}
      <pointLight position={[1.4, 0.7, 0]} intensity={0.9} color="#ffb060" distance={4} />
      <pointLight position={[-1.4, 0.7, 0]} intensity={0.4} color="#ffb060" distance={3} />
      <pointLight position={[-0.3, 0.6, 0.6]} intensity={0.35} color="#ffd6a0" distance={2} />
    </group>
  );
}

function GLBHouse({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(url);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });
  return <primitive ref={group} object={scene} />;
}

interface Props {
  modelUrl?: string | null;
  className?: string;
}

export default function Hero3D({ modelUrl, className }: Props) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [6.5, 3.2, 6.5], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Key light = warm sun */}
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.4}
          color="#ffd9a8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        {/* Cool fill */}
        <directionalLight position={[-5, 4, -3]} intensity={0.45} color="#7aa6c4" />
        {/* Ambient */}
        <ambientLight intensity={0.28} />
        {/* Rim accent */}
        <pointLight position={[-4, 2.5, -2]} intensity={0.6} color="#d4a35a" distance={10} />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.18}>
            {modelUrl ? <GLBHouse url={modelUrl} /> : <RealisticHouse />}
          </Float>
          <ContactShadows position={[0, -0.65, 0]} opacity={0.7} scale={12} blur={2.6} far={5} />
          <Environment preset="sunset" />
        </Suspense>

        {/* Soft fog for depth */}
        <fog attach="fog" args={["#0d0a08", 12, 22]} />
      </Canvas>
    </div>
  );
}
