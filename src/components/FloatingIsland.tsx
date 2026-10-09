import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const FloatingIsland: React.FC = () => {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.04;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Central museum archival platform - Top slab */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.8, 2.9, 0.22, 64]} />
        <meshStandardMaterial
          color="#16181d"
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* Brass / bronze chamfered rim accent */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[2.82, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Terraced lower plinth */}
      <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.25, 48]} />
        <meshStandardMaterial
          color="#101114"
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>

      {/* Floating base monolith core */}
      <mesh ref={coreRef} castShadow position={[0, -0.65, 0]}>
        <coneGeometry args={[2.2, 0.75, 8]} />
        <meshStandardMaterial
          color="#0c0d10"
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Rotating Archival Ring / Celestial Meridian */}
      <group ref={ringsRef} position={[0, 0.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.22, 64]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.45, 3.46, 64]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Small orbital coordinate markers on the outer ring */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 3.21,
              0.02,
              Math.sin(angle) * 3.21,
            ]}
          >
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color="#e2d8b7" />
          </mesh>
        ))}
      </group>

      {/* Subtle underglow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
        <circleGeometry args={[2.7, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
