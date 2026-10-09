import React from 'react';
import { ContactShadows } from '@react-three/drei';

export const SceneEnvironment: React.FC = () => {
  return (
    <>
      {/* Editorial museum soft ambient fill */}
      <ambientLight intensity={0.65} color="#ede8dd" />

      {/* Primary Key Light - Warm golden directional museum spotlight */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* Secondary Soft Fill Light - Cool lavender/sky for depth */}
      <directionalLight
        position={[-5, 4, -3]}
        intensity={0.6}
        color="#93c5fd"
      />

      {/* Rim light from behind to accentuate silhouettes */}
      <spotLight
        position={[0, 8, -6]}
        angle={0.6}
        penumbra={0.8}
        intensity={1.2}
        color="#c5a059"
      />

      {/* Subtle under-fill light */}
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#38bdf8" />

      {/* Soft Contact Shadows on the base */}
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.6}
        scale={8}
        blur={2.4}
        far={3.5}
        color="#000000"
      />

      {/* Archival atmospheric depth fog */}
      <fog attach="fog" args={['#090a0d', 7, 18]} />
    </>
  );
};
