import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { FloatingIsland } from './FloatingIsland';
import { ArchiveArtifact } from './ArchiveArtifact';
import { SceneParticles } from './SceneParticles';
import { SceneEnvironment } from './SceneEnvironment';
import { ConnectionLines } from './ConnectionLines';
import { CameraController } from './CameraController';
import { ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArtifactData, CategoryType, MomentData, ViewMode } from '../types';

interface ExperienceProps {
  viewMode: ViewMode;
  selectedArtifact: ArtifactData | null;
  onSelectArtifact: (artifact: ArtifactData) => void;
  activeMoment: MomentData | null;
  selectedCategory: CategoryType | null;
  controlsRef: React.RefObject<OrbitControlsType | null>;
}

export const Experience: React.FC<ExperienceProps> = ({
  viewMode,
  selectedArtifact,
  onSelectArtifact,
  activeMoment,
  selectedCategory,
  controlsRef,
}) => {
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  return (
    <div id="canvas-container" className="w-full h-full relative">
      <Canvas
        shadows
        camera={{
          position: [0, 2.2, 5.2],
          fov: 42,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Camera Transition Controller */}
        <CameraController
          viewMode={viewMode}
          selectedArtifact={selectedArtifact}
          activeMoment={activeMoment}
          controlsRef={controlsRef}
          isUserInteracting={isUserInteracting}
        />

        {/* Cinematic Soft Lighting & Shadows */}
        <SceneEnvironment />

        {/* Floating Particles / Archival Dust */}
        <SceneParticles />

        {/* Central Floating Island World */}
        <Float
          speed={1.4}
          rotationIntensity={0.15}
          floatIntensity={0.35}
          floatingRange={[-0.06, 0.06]}
        >
          <group position={[0, 0, 0]}>
            <FloatingIsland />

            {/* Glowing 3D Connection Arcs */}
            <ConnectionLines
              viewMode={viewMode}
              selectedArtifact={selectedArtifact}
              activeMoment={activeMoment}
            />

            {/* Categorized Archive Artifacts */}
            {ARCHIVE_ARTIFACTS.map((artifact) => {
              const isSelected = selectedArtifact?.id === artifact.id;

              // Compute highlight and dim states based on current view
              let isHighlighted = false;
              let isDimmed = false;
              let sequenceNumber: number | undefined = undefined;

              if (viewMode === 'connections' && selectedArtifact) {
                const isDirectConnection =
                  selectedArtifact.connectedTo.includes(artifact.id);
                isHighlighted = isSelected || isDirectConnection;
                isDimmed = !isHighlighted;
              } else if (viewMode === 'moments' && activeMoment) {
                const idx = activeMoment.traceIds.indexOf(artifact.id);
                if (idx !== -1) {
                  isHighlighted = true;
                  sequenceNumber = idx + 1;
                } else {
                  isDimmed = true;
                }
              } else if (viewMode === 'archive' && selectedCategory) {
                isHighlighted = artifact.category === selectedCategory;
                isDimmed = !isHighlighted;
              } else if (viewMode === 'story') {
                isHighlighted = true;
              }

              return (
                <ArchiveArtifact
                  key={artifact.id}
                  data={artifact}
                  isSelected={isSelected}
                  onSelect={onSelectArtifact}
                  isHighlighted={isHighlighted}
                  isDimmed={isDimmed}
                  sequenceNumber={sequenceNumber}
                />
              );
            })}
          </group>
        </Float>

        {/* Interactive Camera Navigation with Soft Damping & Editorial Constraints */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={3.0}
          maxDistance={9.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + 0.05}
          onStart={() => setIsUserInteracting(true)}
          onEnd={() => setIsUserInteracting(false)}
        />
      </Canvas>
    </div>
  );
};
