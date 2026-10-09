import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CategoryType } from '../types';

export interface CategoryOrbitConfig {
  id: string;
  name: CategoryType;
  slug: string;
  radius: number;
  angle: number;
  color: string;
  secondaryColor?: string;
  tagline: string;
  atmosphere: string;
  size: number;
  planetType:
    | 'academic-pressure'
    | 'career-anxiety'
    | 'family-expectations'
    | 'financial-stress'
    | 'social-comparison'
    | 'sleep-burnout'
    | 'relationships'
    | 'balance';
}

interface CategoryPlanetProps {
  config: CategoryOrbitConfig;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (category: CategoryType) => void;
}

export const CategoryPlanet: React.FC<CategoryPlanetProps> = ({
  config,
  isSelected,
  isDimmed,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // Orbital position
  const posX = Math.cos(config.angle) * config.radius;
  const posZ = Math.sin(config.angle) * config.radius;
  const posY = Math.sin(config.angle * 2) * 0.15; // subtle celestial wave elevation

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
      ringRef.current.rotation.y += delta * 0.12;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.18;
      // Gentle atmospheric pulsation
      const pulse = 1 + Math.sin(time * 2 + config.angle) * 0.06;
      atmosphereRef.current.scale.set(pulse, pulse, pulse);
    }
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.15;
    }
    if (groupRef.current) {
      const targetScale = isDimmed ? 0.72 : isSelected ? 1.4 : hovered ? 1.22 : 1.0;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 5
      );
    }
    if (pointLightRef.current) {
      const targetIntensity = isSelected ? 3.0 : hovered ? 1.5 : 0.35;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        targetIntensity,
        delta * 4
      );
    }
  });

  // Render category-specific visual atmosphere & orbital elements
  const renderPlanetDetails = () => {
    switch (config.planetType) {
      case 'academic-pressure':
        // Electric Violet / Magenta: audio-wave resonance rings & floating frequency particles
        return (
          <group ref={ringRef} rotation={[0.35, 0.2, 0]}>
            {/* Vinyl record equatorial ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.25, config.size * 2.0, 48]} />
              <meshStandardMaterial
                color="#0f0714"
                roughness={0.2}
                metalness={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Audio wave concentric groove rings */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.5, config.size * 1.55, 48]} />
              <meshBasicMaterial color="#d946ef" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.8, config.size * 1.84, 48]} />
              <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>
            {/* Floating study frequency particles */}
            {[0, 1.6, 3.2, 4.8].map((a, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * config.size * 2.1,
                  Math.sin(a * 3) * 0.1,
                  Math.sin(a) * config.size * 2.1,
                ]}
              >
                <sphereGeometry args={[0.024, 8, 8]} />
                <meshBasicMaterial color="#f0abfc" />
              </mesh>
            ))}
          </group>
        );
      case 'sleep-burnout':
        // Crimson / Coral: stamina streaks & night study frames
        return (
          <group ref={ringRef}>
            {/* 35mm / all-nighter film spool ring */}
            <mesh rotation={[0.4, 0.3, 0]}>
              <torusGeometry args={[config.size * 1.5, 0.018, 8, 36]} />
              <meshStandardMaterial color="#f43f5e" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Perpendicular exhaustion arc */}
            <mesh rotation={[-0.4, -0.3, 0]}>
              <torusGeometry args={[config.size * 1.7, 0.015, 8, 36]} />
              <meshBasicMaterial color="#fda4af" transparent opacity={0.5} />
            </mesh>
            {/* Floating mini carrel frame */}
            <mesh position={[config.size * 1.6, 0.05, 0]} rotation={[0.1, 0.4, 0.2]}>
              <boxGeometry args={[0.12, 0.08, 0.005]} />
              <meshStandardMaterial color="#ffe4e6" roughness={0.5} />
            </mesh>
          </group>
        );
      case 'career-anxiety':
        // Emerald / Teal: coordinate particles, transit paths, latitude coordinate lines & location pulses
        return (
          <group ref={ringRef} rotation={[0.2, 0.4, 0]}>
            <mesh>
              <torusGeometry args={[config.size * 1.45, 0.012, 12, 48]} />
              <meshBasicMaterial color="#14b8a6" transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[config.size * 1.65, 0.012, 12, 48]} />
              <meshBasicMaterial color="#2dd4bf" transparent opacity={0.5} />
            </mesh>
            {/* Coordinate waypoint dots */}
            {[0, 2.1, 4.2].map((a, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * config.size * 1.5,
                  Math.sin(a * 2) * 0.05,
                  Math.sin(a) * config.size * 1.5,
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color="#5eead4" />
              </mesh>
            ))}
          </group>
        );
      case 'financial-stress':
        // Amber / Gold: receipt fragments, budget particles and subtle orbiting cards
        return (
          <group ref={ringRef} rotation={[0.3, 0.1, 0]}>
            {/* Copper thermal voucher ribbon around planet */}
            <mesh rotation={[-Math.PI / 3, 0, 0]}>
              <ringGeometry args={[config.size * 1.25, config.size * 1.6, 32]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.7}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Subtle orbiting miniature expense card */}
            <mesh position={[config.size * 1.7, 0, 0]} rotation={[0.2, 0.5, 0.1]}>
              <boxGeometry args={[0.16, 0.1, 0.005]} />
              <meshStandardMaterial color="#fde68a" roughness={0.4} />
            </mesh>
          </group>
        );
      case 'social-comparison':
        // Cyan / Sky Blue: floating milestone frames and camera reticle particles
        return (
          <group ref={ringRef}>
            {/* Orbiting milestone snapshot card */}
            <mesh position={[config.size * 1.55, 0.04, 0]} rotation={[0.1, 0.35, 0.1]}>
              <planeGeometry args={[0.24, 0.3]} />
              <meshStandardMaterial color="#e0f2fe" roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
            {/* Cyan focus reticle ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[config.size * 1.7, 0.01, 8, 36]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
            </mesh>
            {/* Camera flash node */}
            <mesh position={[-config.size * 1.6, 0.1, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color="#bae6fd" />
            </mesh>
          </group>
        );
      case 'relationships':
        // Rose / Pink: small message bubbles and connected dots
        return (
          <group ref={ringRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.35, config.size * 1.45, 32]} />
              <meshBasicMaterial color="#fb7185" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            {/* Message bubble nodes */}
            {[0.5, 2.5, 4.5].map((a, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * config.size * 1.65,
                  Math.sin(a * 2) * 0.06,
                  Math.sin(a) * config.size * 1.65,
                ]}
              >
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color="#fbcfe8" roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      case 'family-expectations':
        // Neon Blue: scanning expectation pulses, search paths and moving particles
        return (
          <group ref={ringRef}>
            {/* Scanning orbital trail */}
            <mesh rotation={[0.2, 0.6, 0]}>
              <ringGeometry args={[config.size * 1.4, config.size * 1.46, 48]} />
              <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
            {/* Moving query particles */}
            {[0, 1.8, 3.6, 5.2].map((a, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * config.size * 1.7,
                  Math.sin(a * 3) * 0.08,
                  Math.sin(a) * config.size * 1.7,
                ]}
              >
                <sphereGeometry args={[0.032, 10, 10]} />
                <meshBasicMaterial color="#93c5fd" />
              </mesh>
            ))}
          </group>
        );
      case 'balance':
        // Lavender / Soft Purple: affirmation note fragments & drifting paper-like particles
        return (
          <group ref={ringRef}>
            {/* Pinned note sheet */}
            <mesh position={[config.size * 1.4, 0.05, 0]} rotation={[0.2, 0.4, -0.1]}>
              <planeGeometry args={[0.2, 0.2]} />
              <meshStandardMaterial color="#ddd6fe" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Drifting paper flakes */}
            {[-1.2, 1.4, 3.2].map((a, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * config.size * 1.6,
                  Math.sin(a * 2) * 0.08,
                  Math.sin(a) * config.size * 1.6,
                ]}
                rotation={[0.3, 0.2, 0.1]}
              >
                <planeGeometry args={[0.06, 0.06]} />
                <meshBasicMaterial color="#c4b5fd" side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={[posX, posY, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(config.name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Dynamic Ambient Point Light radiating the planet's accent into the space atmosphere */}
      <pointLight
        ref={pointLightRef}
        color={config.color}
        distance={4.5}
        decay={2}
        intensity={isSelected ? 3.0 : hovered ? 1.5 : 0.35}
      />

      {/* Central Planet Orb */}
      <mesh ref={orbRef} castShadow receiveShadow>
        <sphereGeometry args={[config.size, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.25}
          metalness={0.4}
          emissive={config.color}
          emissiveIntensity={isSelected ? 0.95 : hovered ? 0.5 : 0.2}
          transparent
          opacity={isDimmed ? 0.25 : 1.0}
        />
      </mesh>

      {/* Atmospheric Glow Corona: spreads the accent color into space */}
      <group ref={atmosphereRef}>
        <mesh>
          <sphereGeometry args={[config.size * 1.25, 24, 24]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={isDimmed ? 0.04 : isSelected ? 0.45 : hovered ? 0.3 : 0.15}
            side={THREE.BackSide}
          />
        </mesh>
        {isSelected && (
          <mesh>
            <sphereGeometry args={[config.size * 1.55, 20, 20]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </group>

      {/* Unique Planetary Atmosphere & Geometry */}
      {!isDimmed && renderPlanetDetails()}

      {/* 3D Label & Tagline preview on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html position={[0, config.size + 0.38, 0]} center distanceFactor={7}>
          <div
            className="pointer-events-none select-none px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border text-[11px] font-mono whitespace-nowrap shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
            style={{ borderColor: `${config.color}60` }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-white font-semibold">{config.name}</span>
            <span className="text-white/40 text-[9px] uppercase tracking-wider">
              {config.tagline}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
