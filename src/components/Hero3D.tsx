import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ProceduralHouse() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });

  // Warm brass/bronze tone for accents
  const wood = new THREE.MeshStandardMaterial({ color: "#3a2a1f", roughness: 0.85, metalness: 0.1 });
  const wall = new THREE.MeshStandardMaterial({ color: "#1a1612", roughness: 0.6, metalness: 0.05 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#5fb8d6", roughness: 0.05, metalness: 0.1,
    transmission: 0.85, thickness: 0.5, envMapIntensity: 1.2,
  });
  const roof = new THREE.MeshStandardMaterial({ color: "#0e0c0a", roughness: 0.7, metalness: 0.2 });
  const accent = new THREE.MeshStandardMaterial({ color: "#d4a35a", roughness: 0.3, metalness: 0.85, emissive: "#7a4a1a", emissiveIntensity: 0.2 });

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={1.05}>
      {/* Foundation */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[5, 0.1, 3.5]} />
        <primitive object={wood} attach="material" />
      </mesh>

      {/* Main wing */}
      <mesh position={[-1.2, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.4, 3]} />
        <primitive object={wall} attach="material" />
      </mesh>

      {/* Glass great room (right wing) */}
      <mesh position={[1.2, 0.65, 0]} castShadow>
        <boxGeometry args={[2.2, 1.3, 2.8]} />
        <primitive object={glass} attach="material" />
      </mesh>

      {/* Roof — sloped */}
      <mesh position={[-1.2, 1.55, 0]} castShadow>
        <boxGeometry args={[2.6, 0.12, 3.2]} />
        <primitive object={roof} attach="material" />
      </mesh>
      <mesh position={[1.2, 1.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.1, 3.0]} />
        <primitive object={roof} attach="material" />
      </mesh>

      {/* Bronze trim accents */}
      <mesh position={[0, 0.7, 1.51]}>
        <boxGeometry args={[5, 0.05, 0.04]} />
        <primitive object={accent} attach="material" />
      </mesh>
      <mesh position={[0, 1.4, 1.51]}>
        <boxGeometry args={[5, 0.04, 0.04]} />
        <primitive object={accent} attach="material" />
      </mesh>

      {/* Windows on left wing */}
      {[-0.6, 0, 0.6].map((z, i) => (
        <mesh key={i} position={[-2.41, 0.85, z]}>
          <boxGeometry args={[0.02, 0.7, 0.4]} />
          <primitive object={glass} attach="material" />
        </mesh>
      ))}

      {/* Door */}
      <mesh position={[-1.2, 0.4, 1.52]}>
        <boxGeometry args={[0.5, 0.85, 0.04]} />
        <primitive object={accent} attach="material" />
      </mesh>

      {/* Chimney */}
      <mesh position={[-1.8, 1.95, -0.8]} castShadow>
        <boxGeometry args={[0.35, 0.7, 0.35]} />
        <primitive object={wall} attach="material" />
      </mesh>
    </group>
  );
}

function GLBHouse({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(url);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
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
        dpr={[1, 1.6]}
        camera={{ position: [6, 3, 6], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 2, -2]} intensity={0.5} color="#d4a35a" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
            {modelUrl ? <GLBHouse url={modelUrl} /> : <ProceduralHouse />}
          </Float>
          <ContactShadows position={[0, -0.6, 0]} opacity={0.55} scale={10} blur={2.4} far={4} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
