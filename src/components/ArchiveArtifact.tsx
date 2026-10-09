import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ArtifactData } from '../types';
import {
  createReceiptTexture,
  createPolaroidTexture,
  createVinylTexture,
  createTicketTexture,
  createBoardingPassTexture,
  createMessageBubbleTexture,
  createSearchPillTexture,
  createStickyNoteTexture,
  createCinemaTicketTexture,
} from '../utils/textures';

interface ArchiveArtifactProps {
  data: ArtifactData;
  isSelected: boolean;
  onSelect: (artifact: ArtifactData) => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  sequenceNumber?: number;
}

export const ArchiveArtifact: React.FC<ArchiveArtifactProps> = ({
  data,
  isSelected,
  onSelect,
  isHighlighted = false,
  isDimmed = false,
  sequenceNumber,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate the category-specific texture
  const texture = useMemo(() => {
    switch (data.category) {
      case 'Financial Stress':
        return createReceiptTexture();
      case 'Social Comparison':
        return createPolaroidTexture();
      case 'Academic Pressure':
        return createVinylTexture();
      case 'Balance':
        return createStickyNoteTexture();
      case 'Career Anxiety':
        return createBoardingPassTexture();
      case 'Relationships':
        return createMessageBubbleTexture();
      case 'Family Expectations':
        return createSearchPillTexture();
      case 'Sleep & Burnout':
        return createCinemaTicketTexture();
      default:
        return createReceiptTexture();
    }
  }, [data.category]);

  // Unique phase offset for subtle floating
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const spinSpeed = useMemo(
    () => (data.category === 'Academic Pressure' ? 0.4 : 0),
    [data.category]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle natural floating bobbing
    const floatY = Math.sin(t * 1.5 + phase) * 0.04;
    const targetY =
      data.position[1] +
      floatY +
      (hovered || isSelected || isHighlighted ? 0.14 : isDimmed ? -0.08 : 0);

    // Smooth lerp to target vertical position
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 5
    );

    // Subtle hover / highlight scale
    const targetScale = isDimmed
      ? 0.86
      : hovered || isSelected || isHighlighted
      ? 1.12
      : 1.0;

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 8
    );

    // Vinyl slow spin if Academic Focus LP
    if (data.category === 'Academic Pressure' && meshRef.current) {
      meshRef.current.rotation.z += delta * spinSpeed;
    }
  });

  const renderGeometry = () => {
    switch (data.category) {
      case 'Financial Stress':
        // Thermal bookstore / tuition receipt sheet with spindle
        return (
          <group>
            {/* The receipt sheet */}
            <mesh
              castShadow
              receiveShadow
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            >
              <boxGeometry args={[0.56, 1.12, 0.012]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.8}
                metalness={0.05}
                color={hovered ? '#ffffff' : '#f5f3ec'}
              />
            </mesh>
            {/* Brass receipt spindle base */}
            <mesh position={[0, -0.65, 0]}>
              <cylinderGeometry args={[0.12, 0.14, 0.04, 24]} />
              <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.6, 12]} />
              <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        );
      case 'Social Comparison':
        // Milestone snapshot frame with layered depth
        return (
          <group>
            {/* Photo body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.78, 0.94, 0.02]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.7}
                metalness={0.1}
                color={hovered ? '#ffffff' : '#fbf9f4'}
              />
            </mesh>
            {/* Minimalist brass photo stand clip at bottom */}
            <mesh position={[0, -0.52, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.1]} />
              <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        );
      case 'Academic Pressure':
        // Binaural focus study disc on cradle
        return (
          <group>
            {/* Vinyl record disc */}
            <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.5, 0.5, 0.015, 48]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.25}
                metalness={0.4}
              />
            </mesh>
            {/* Minimalist museum cradle */}
            <mesh position={[0, -0.45, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.2]} />
              <meshStandardMaterial
                color="#20222a"
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          </group>
        );
      case 'Career Anxiety':
        // Assessment center interview commuter pass
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.08, 0.45, 0.015]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.6}
                metalness={0.1}
                color={hovered ? '#ffffff' : '#fafafa'}
              />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        );
      case 'Relationships':
        // 3D Chat pill capsule
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.46, 0.03]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.3}
                metalness={0.3}
              />
            </mesh>
          </group>
        );
      case 'Family Expectations':
        // Search inquiry badge
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.32, 0.025]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.35}
                metalness={0.2}
              />
            </mesh>
          </group>
        );
      case 'Balance':
        // Affirmation sticky note with brass pushpin
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.62, 0.62, 0.015]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.85}
                metalness={0.05}
                color={hovered ? '#ffffff' : '#fffbeb'}
              />
            </mesh>
            {/* Brass pushpin on top edge */}
            <mesh position={[0, 0.28, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      case 'Sleep & Burnout':
        // 24-Hour library overnight carrel pass
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.05, 0.46, 0.015]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.4}
                metalness={0.2}
                color={hovered ? '#ffffff' : '#f8eff2'}
              />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
              <meshStandardMaterial color="#e11d48" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={data.position}
      rotation={data.rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
    >
      {/* 3D Geometry */}
      {renderGeometry()}

      {/* Floating Category Beacon & Museum Tag */}
      {(hovered || isSelected || isHighlighted || sequenceNumber !== undefined) && (
        <Html
          position={[0, 0.78, 0]}
          center
          distanceFactor={7}
          className="pointer-events-none select-none transition-all duration-300"
        >
          <div className="flex flex-col items-center gap-1.5 whitespace-nowrap">
            <div
              className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase backdrop-blur-md shadow-lg border flex items-center gap-1.5"
              style={{
                backgroundColor: 'rgba(15, 17, 23, 0.94)',
                borderColor: data.accentColor,
                color: data.accentColor,
              }}
            >
              {sequenceNumber !== undefined && (
                <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[9px] font-bold">
                  {sequenceNumber}
                </span>
              )}
              <span>{data.category}</span>
            </div>
            <div className="bg-[#111319]/90 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-medium border border-white/10 shadow-xl">
              {data.title}
            </div>
          </div>
        </Html>
      )}

      {/* Subtle glowing anchor beacon under each item */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, isHighlighted ? 0.22 : 0.12, 24]} />
        <meshBasicMaterial
          color={data.accentColor}
          transparent
          opacity={hovered || isSelected || isHighlighted ? 0.85 : isDimmed ? 0.08 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
