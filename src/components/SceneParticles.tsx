import React from 'react';
import { Sparkles } from '@react-three/drei';

export const SceneParticles: React.FC = () => {
  return (
    <group>
      {/* Warm archival dust particles floating in light rays */}
      <Sparkles
        count={50}
        scale={[8, 5, 8]}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#fef3c7"
      />
      {/* Subtle cooler ambient specks in background depth */}
      <Sparkles
        count={35}
        scale={[12, 7, 12]}
        size={1.5}
        speed={0.15}
        opacity={0.2}
        color="#93c5fd"
      />
    </group>
  );
};
