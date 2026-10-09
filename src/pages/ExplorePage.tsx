import React, { useState, useRef } from 'react';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { PageTransition } from '../components/PageTransition';
import { SolarSystemScene, ZoomLevel } from '../components/SolarSystemScene';
import { SolarSystemHUD } from '../components/SolarSystemHUD';
import { ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArtifactData, CategoryType, MomentData } from '../types';
import { useArchive } from '../context/ArchiveContext';

export const ExplorePage: React.FC = () => {
  const { markCategoryVisited, markArtifactVisited } = useArchive();
  const controlsRef = useRef<OrbitControlsType | null>(null);

  // Solar System State
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('system');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactData | null>(null);
  const [activeMoment, setActiveMoment] = useState<MomentData | null>(null);
  const [activeTab, setActiveTab] = useState<'solar' | 'moment' | 'archive'>('solar');

  // Connection thread state for "FOLLOW CONNECTION"
  const [connectionStepIndex, setConnectionStepIndex] = useState<number>(0);
  const connectionChain = ['academic-1', 'career-1', 'financial-1', 'sleep-1'];

  // Handle Category Selection
  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setZoomLevel('category');
    markCategoryVisited(category.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    // If an artifact in this category exists, pre-select it
    const art = ARCHIVE_ARTIFACTS.find((a) => a.category === category);
    if (art) {
      setSelectedArtifact(art);
    }
  };

  // Handle Trace / Artifact Selection
  const handleSelectArtifact = (artifact: ArtifactData) => {
    setSelectedArtifact(artifact);
    setSelectedCategory(artifact.category);
    setZoomLevel('trace');
    markArtifactVisited(artifact.id);
  };

  // Reset to full Solar System Overview
  const handleResetToSystem = () => {
    setZoomLevel('system');
    setSelectedCategory(null);
    setSelectedArtifact(null);
    setActiveMoment(null);
  };

  // Follow connection sequence: smoothly cycle through connected nodes
  const handleFollowConnection = () => {
    const nextIdx = (connectionStepIndex + 1) % connectionChain.length;
    setConnectionStepIndex(nextIdx);
    const nextArtifactId = connectionChain[nextIdx];
    const nextArtifact = ARCHIVE_ARTIFACTS.find((a) => a.id === nextArtifactId);
    if (nextArtifact) {
      handleSelectArtifact(nextArtifact);
    }
  };

  // Active connected trace IDs to draw connection lines
  const connectedTraceIds = selectedArtifact
    ? [selectedArtifact.id, ...selectedArtifact.connectedTo]
    : connectionChain;

  return (
    <PageTransition variant="fade">
      <div className="relative w-screen h-screen overflow-hidden bg-[#08090c]">
        {/* Deep Space Archival Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, #151824 0%, #0c0e14 55%, #050608 100%)',
          }}
        />

        {/* Archival Celestial Grid */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(rgba(212, 175, 55, 0.25) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* 3D Interactive Data Solar System Canvas */}
        <div className="absolute inset-0 z-1">
          <SolarSystemScene
            zoomLevel={zoomLevel}
            selectedCategory={selectedCategory}
            selectedArtifact={selectedArtifact}
            activeMoment={activeMoment}
            connectedTraceIds={connectedTraceIds}
            onSelectCategory={handleSelectCategory}
            onSelectArtifact={handleSelectArtifact}
            onResetToSystem={handleResetToSystem}
            controlsRef={controlsRef}
          />
        </div>

        {/* Interactive HUD Overlay with Zoom Controls, Info Panel, Moment & Archive Views */}
        <SolarSystemHUD
          zoomLevel={zoomLevel}
          selectedCategory={selectedCategory}
          selectedArtifact={selectedArtifact}
          activeMoment={activeMoment}
          activeTab={activeTab}
          onZoomChange={setZoomLevel}
          onSelectCategory={handleSelectCategory}
          onSelectArtifact={handleSelectArtifact}
          onResetToSystem={handleResetToSystem}
          onTabChange={setActiveTab}
          onFollowConnection={handleFollowConnection}
        />
      </div>
    </PageTransition>
  );
};
