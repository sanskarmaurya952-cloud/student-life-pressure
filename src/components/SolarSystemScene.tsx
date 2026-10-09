import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { CategoryPlanet, CategoryOrbitConfig } from './CategoryPlanet';
import { ArchiveArtifact } from './ArchiveArtifact';
import { SceneParticles } from './SceneParticles';
import { SceneEnvironment } from './SceneEnvironment';
import { ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArtifactData, CategoryType, MomentData } from '../types';

export const CATEGORY_ORBITS: CategoryOrbitConfig[] = [
  {
    id: 'financial-stress',
    name: 'Financial Stress',
    slug: 'financial-stress',
    radius: 2.3,
    angle: 0,
    color: '#f59e0b',
    secondaryColor: '#d97706',
    tagline: 'THE COST OF AN EDUCATION.',
    atmosphere: 'Receipt fragments, tuition vouchers and budget calculations',
    size: 0.28,
    planetType: 'financial-stress',
  },
  {
    id: 'social-comparison',
    name: 'Social Comparison',
    slug: 'social-comparison',
    radius: 2.8,
    angle: 0.78,
    color: '#06b6d4',
    secondaryColor: '#0284c7',
    tagline: 'THE CURATED LIVES OF PEERS.',
    atmosphere: 'Floating milestone snapshots and curated highlight feeds',
    size: 0.26,
    planetType: 'social-comparison',
  },
  {
    id: 'academic-pressure',
    name: 'Academic Pressure',
    slug: 'academic-pressure',
    radius: 3.3,
    angle: 1.57,
    color: '#d946ef',
    secondaryColor: '#a855f7',
    tagline: 'THE CHASE FOR PERFECTION.',
    atmosphere: 'Audio-wave focus rings and late-night study frequency particles',
    size: 0.32,
    planetType: 'academic-pressure',
  },
  {
    id: 'balance',
    name: 'Balance',
    slug: 'balance',
    radius: 3.8,
    angle: 2.35,
    color: '#a78bfa',
    secondaryColor: '#8b5cf6',
    tagline: 'FINDING STILLNESS IN THE NOISE.',
    atmosphere: 'Affirmation sticky notes and mindful pause particles',
    size: 0.25,
    planetType: 'balance',
  },
  {
    id: 'career-anxiety',
    name: 'Career Anxiety',
    slug: 'career-anxiety',
    radius: 4.3,
    angle: 3.14,
    color: '#14b8a6',
    secondaryColor: '#0d9488',
    tagline: 'THE RACE BEFORE GRADUATION.',
    atmosphere: 'Interview transit coordinates and recruiting waypoints',
    size: 0.3,
    planetType: 'career-anxiety',
  },
  {
    id: 'sleep-burnout',
    name: 'Sleep & Burnout',
    slug: 'sleep-burnout',
    radius: 4.8,
    angle: 3.92,
    color: '#f43f5e',
    secondaryColor: '#e11d48',
    tagline: 'BURNING THE CANDLE AT BOTH ENDS.',
    atmosphere: 'Overnight library streaks and stamina deficit indicators',
    size: 0.28,
    planetType: 'sleep-burnout',
  },
  {
    id: 'relationships',
    name: 'Relationships',
    slug: 'relationships',
    radius: 5.3,
    angle: 4.71,
    color: '#fb7185',
    secondaryColor: '#ec4899',
    tagline: 'WORDS OF ANCHOR AND STRAIN.',
    atmosphere: 'Connected chat bubbles and roommate support nodes',
    size: 0.26,
    planetType: 'relationships',
  },
  {
    id: 'family-expectations',
    name: 'Family Expectations',
    slug: 'family-expectations',
    radius: 5.8,
    angle: 5.49,
    color: '#3b82f6',
    secondaryColor: '#2563eb',
    tagline: 'THE HOPES CARRIED ON YOUR SHOULDERS.',
    atmosphere: 'Search inquiry radar and expectation resonance waves',
    size: 0.27,
    planetType: 'family-expectations',
  },
];

export type ZoomLevel = 'system' | 'category' | 'trace';

interface SolarSystemSceneProps {
  zoomLevel: ZoomLevel;
  selectedCategory: CategoryType | null;
  selectedArtifact: ArtifactData | null;
  activeMoment: MomentData | null;
  connectedTraceIds: string[];
  onSelectCategory: (category: CategoryType) => void;
  onSelectArtifact: (artifact: ArtifactData) => void;
  onResetToSystem: () => void;
  controlsRef: React.RefObject<OrbitControlsType | null>;
}

// Camera controller handling smooth zoom levels
const SolarCameraController: React.FC<{
  zoomLevel: ZoomLevel;
  selectedCategory: CategoryType | null;
  selectedArtifact: ArtifactData | null;
  activeMoment: MomentData | null;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  isUserInteracting: boolean;
}> = ({
  zoomLevel,
  selectedCategory,
  selectedArtifact,
  controlsRef,
  isUserInteracting,
}) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 6.2, 9.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (zoomLevel === 'system') {
      targetCamPos.current.set(0, 6.2, 9.2);
      targetLookAt.current.set(0, 0, 0);
    } else if (zoomLevel === 'category' && selectedCategory) {
      const orbit = CATEGORY_ORBITS.find((o) => o.name === selectedCategory);
      if (orbit) {
        const px = Math.cos(orbit.angle) * orbit.radius;
        const pz = Math.sin(orbit.angle) * orbit.radius;
        const py = Math.sin(orbit.angle * 2) * 0.15;
        targetCamPos.current.set(px * 0.72, py + 1.4, pz * 0.72 + 2.4);
        targetLookAt.current.set(px, py, pz);
      }
    } else if (zoomLevel === 'trace' && selectedArtifact) {
      const orbit = CATEGORY_ORBITS.find(
        (o) => o.name === selectedArtifact.category
      );
      if (orbit) {
        const px = Math.cos(orbit.angle) * orbit.radius + 0.45;
        const pz = Math.sin(orbit.angle) * orbit.radius + 0.35;
        const py = Math.sin(orbit.angle * 2) * 0.15 + 0.2;
        targetCamPos.current.set(px * 0.85, py + 0.6, pz + 1.8);
        targetLookAt.current.set(px, py, pz);
      } else {
        targetCamPos.current.set(0, 2.5, 4.5);
        targetLookAt.current.set(0, 0, 0);
      }
    }

    if (!isUserInteracting && controlsRef.current) {
      camera.position.lerp(targetCamPos.current, delta * 3.2);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 3.2);
      controlsRef.current.update();
    }
  });

  return null;
};

// Smooth atmosphere illumination spreading the active category's color into space
const DynamicAtmosphereLight: React.FC<{
  activeColor: string;
  isCategoryActive: boolean;
}> = ({ activeColor, isCategoryActive }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetColor = useMemo(() => new THREE.Color(activeColor), [activeColor]);

  useFrame((_, delta) => {
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, delta * 3);
      const targetIntensity = isCategoryActive ? 2.2 : 0.8;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        delta * 3
      );
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 4.0, 0]}
      distance={18}
      decay={2}
      intensity={0.8}
    />
  );
};

// Animated Central Archive Core (The Sun / Living Core)
const ArchiveCentralSun: React.FC<{
  onReset: () => void;
  accentColor: string;
}> = ({ onReset, accentColor }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const flareColor = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.05;
      ringsRef.current.rotation.z -= delta * 0.02;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]} onClick={onReset}>
      {/* Radiant Glowing Center Sphere */}
      <mesh ref={coreRef} castShadow>
        <sphereGeometry args={[0.9, 36, 36]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.8}
          emissive="#d4af37"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Atmospheric Golden Sun Flare */}
      <mesh>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial
          color="#d4af37"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Dynamic Aura Ring that subtly picks up the active category's color */}
      <mesh>
        <sphereGeometry args={[1.35, 24, 24]} />
        <meshBasicMaterial
          color={flareColor}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equatorial Monolith Pedestal */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.2, 1.35, 0.18, 48]} />
        <meshStandardMaterial
          color="#16181f"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Rotating Sun Meridian Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.38, 64]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[0.4, 0, 0]}>
          <ringGeometry args={[1.5, 1.52, 64]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

// Spline Arc Line with pulse
const SolarArcLine: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
}> = ({ start, end, color = '#d4af37' }) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 0.8;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(32), [curve]);
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  const lineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geometry, mat);
  }, [geometry, color]);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 0.5) % 1;
      const pos = curve.getPoint(t);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <primitive object={lineObject} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// Animated 3D Splines connecting related traces in the solar system
const SolarConnectionLines: React.FC<{
  connectedTraceIds: string[];
  activeColor: string;
}> = ({ connectedTraceIds, activeColor }) => {
  const points = useMemo(() => {
    const list: THREE.Vector3[] = [];
    connectedTraceIds.forEach((id) => {
      const art = ARCHIVE_ARTIFACTS.find((a) => a.id === id);
      if (art) {
        const orbit = CATEGORY_ORBITS.find((o) => o.name === art.category);
        if (orbit) {
          const px = Math.cos(orbit.angle) * orbit.radius + 0.45;
          const pz = Math.sin(orbit.angle) * orbit.radius + 0.35;
          const py = Math.sin(orbit.angle * 2) * 0.15 + 0.2;
          list.push(new THREE.Vector3(px, py, pz));
        }
      }
    });
    return list;
  }, [connectedTraceIds]);

  if (points.length < 2) return null;

  return (
    <group>
      {points.map((pt, i) => {
        if (i === points.length - 1) return null;
        const next = points[i + 1];
        return <SolarArcLine key={i} start={pt} end={next} color={activeColor} />;
      })}
    </group>
  );
};

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  zoomLevel,
  selectedCategory,
  selectedArtifact,
  activeMoment,
  connectedTraceIds,
  onSelectCategory,
  onSelectArtifact,
  onResetToSystem,
  controlsRef,
}) => {
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Active Category accent color
  const activeOrbit = useMemo(() => {
    if (selectedCategory) {
      return CATEGORY_ORBITS.find((o) => o.name === selectedCategory);
    }
    if (selectedArtifact) {
      return CATEGORY_ORBITS.find((o) => o.name === selectedArtifact.category);
    }
    return null;
  }, [selectedCategory, selectedArtifact]);

  const activeColor = activeOrbit?.color || '#d4af37';

  // Map each artifact to its planet's orbit coordinate
  const artifactPositions = useMemo(() => {
    return ARCHIVE_ARTIFACTS.map((artifact) => {
      const orbit = CATEGORY_ORBITS.find((o) => o.name === artifact.category);
      if (!orbit) return artifact;
      const px = Math.cos(orbit.angle) * orbit.radius + 0.45;
      const pz = Math.sin(orbit.angle) * orbit.radius + 0.35;
      const py = Math.sin(orbit.angle * 2) * 0.15 + 0.2;
      return {
        ...artifact,
        position: [px, py, pz] as [number, number, number],
      };
    });
  }, []);

  return (
    <div id="solar-system-canvas-container" className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 6.2, 9.2], fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <SolarCameraController
          zoomLevel={zoomLevel}
          selectedCategory={selectedCategory}
          selectedArtifact={selectedArtifact}
          activeMoment={activeMoment}
          controlsRef={controlsRef}
          isUserInteracting={isUserInteracting}
        />

        <SceneEnvironment />
        <SceneParticles />

        {/* Dynamic smooth lighting spreading category accent into atmosphere */}
        <DynamicAtmosphereLight
          activeColor={activeColor}
          isCategoryActive={zoomLevel !== 'system'}
        />

        <group position={[0, 0, 0]}>
          {/* 1. Central Archive Sun / Core */}
          <ArchiveCentralSun
            onReset={onResetToSystem}
            accentColor={activeColor}
          />

          {/* 2. Concentric Orbital Rings */}
          {CATEGORY_ORBITS.map((orbit) => {
            const isCategoryActive =
              zoomLevel === 'category' && selectedCategory === orbit.name;
            const isDimmed =
              zoomLevel === 'category' && selectedCategory !== orbit.name;

            return (
              <group key={`ring-${orbit.id}`} position={[0, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry
                    args={[orbit.radius - 0.012, orbit.radius + 0.012, 96]}
                  />
                  <meshBasicMaterial
                    color={orbit.color}
                    transparent
                    opacity={isDimmed ? 0.05 : isCategoryActive ? 0.65 : 0.22}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}

          {/* 3. The 8 Category Planets */}
          {CATEGORY_ORBITS.map((orbit) => {
            const isSelected = selectedCategory === orbit.name;
            const isDimmed =
              (zoomLevel === 'category' && selectedCategory !== orbit.name) ||
              (zoomLevel === 'trace' &&
                selectedArtifact?.category !== orbit.name);

            return (
              <CategoryPlanet
                key={orbit.id}
                config={orbit}
                isSelected={isSelected}
                isDimmed={isDimmed}
                onSelect={(cat) => onSelectCategory(cat)}
              />
            );
          })}

          {/* 4. Physical 3D Artifacts Floating in Proximity */}
          {artifactPositions.map((artifact) => {
            const isSelected = selectedArtifact?.id === artifact.id;
            const isCategorySelected =
              selectedCategory === artifact.category ||
              selectedArtifact?.category === artifact.category;
            const isConnected = connectedTraceIds.includes(artifact.id);
            const isHighlighted = isSelected || isConnected;
            const isDimmed =
              zoomLevel === 'category'
                ? !isCategorySelected
                : zoomLevel === 'trace'
                ? !isHighlighted
                : false;

            return (
              <Float
                key={artifact.id}
                speed={1.5}
                rotationIntensity={0.2}
                floatIntensity={0.2}
              >
                <ArchiveArtifact
                  data={artifact}
                  isSelected={isSelected}
                  onSelect={onSelectArtifact}
                  isHighlighted={isHighlighted}
                  isDimmed={isDimmed}
                />
              </Float>
            );
          })}

          {/* 5. Animated Connection Lines with Dynamic Category Color */}
          <SolarConnectionLines
            connectedTraceIds={connectedTraceIds}
            activeColor={activeColor}
          />
        </group>

        {/* Orbit Controls with Responsive Touch & Zoom Constraints */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={2.2}
          maxDistance={14.0}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2 + 0.05}
          onStart={() => setIsUserInteracting(true)}
          onEnd={() => setIsUserInteracting(false)}
        />
      </Canvas>
    </div>
  );
};
