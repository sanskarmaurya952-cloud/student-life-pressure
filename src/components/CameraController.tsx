import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { ArtifactData, MomentData, ViewMode } from '../types';
import { ARCHIVE_ARTIFACTS } from '../data/artifacts';

interface CameraControllerProps {
  viewMode: ViewMode;
  selectedArtifact: ArtifactData | null;
  activeMoment: MomentData | null;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  isUserInteracting: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  viewMode,
  selectedArtifact,
  activeMoment,
  controlsRef,
  isUserInteracting,
}) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 2.2, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame((state, delta) => {
    // Determine target camera framing based on viewMode and selections
    if (viewMode === 'story') {
      // Zoom out to reveal the whole celestial archive
      const t = state.clock.getElapsedTime() * 0.1;
      const radius = 8.2;
      targetCamPos.current.set(
        Math.sin(t) * 1.5,
        4.8,
        radius
      );
      targetLookAt.current.set(0, 0, 0);
    } else if (viewMode === 'archive') {
      // Elevated gallery layout perspective
      if (selectedArtifact) {
        targetCamPos.current.set(
          selectedArtifact.position[0] * 0.7,
          selectedArtifact.position[1] + 0.8,
          selectedArtifact.position[2] + 2.8
        );
        targetLookAt.current.set(...selectedArtifact.position);
      } else {
        targetCamPos.current.set(0, 3.4, 4.6);
        targetLookAt.current.set(0, 0.1, 0);
      }
    } else if (viewMode === 'moments' && activeMoment) {
      // Frame the bounding center of the moment's traces
      const traces = ARCHIVE_ARTIFACTS.filter((a) =>
        activeMoment.traceIds.includes(a.id)
      );
      if (traces.length > 0) {
        let avgX = 0,
          avgY = 0,
          avgZ = 0;
        traces.forEach((t) => {
          avgX += t.position[0];
          avgY += t.position[1];
          avgZ += t.position[2];
        });
        avgX /= traces.length;
        avgY /= traces.length;
        avgZ /= traces.length;
        targetCamPos.current.set(avgX * 0.8, avgY + 1.6, avgZ + 4.2);
        targetLookAt.current.set(avgX, avgY, avgZ);
      }
    } else if (viewMode === 'connections' && selectedArtifact) {
      // Smoothly move camera along the connection to frame the artifact cluster
      const connectedArtifacts = ARCHIVE_ARTIFACTS.filter((a) =>
        selectedArtifact.connectedTo.includes(a.id)
      );
      if (connectedArtifacts.length > 0) {
        // Find center of source and first connected object
        const target = connectedArtifacts[0];
        const midX = (selectedArtifact.position[0] + target.position[0]) * 0.5;
        const midY = (selectedArtifact.position[1] + target.position[1]) * 0.5;
        const midZ = (selectedArtifact.position[2] + target.position[2]) * 0.5;
        targetCamPos.current.set(midX * 0.9, midY + 1.4, midZ + 3.8);
        targetLookAt.current.set(midX, midY, midZ);
      } else {
        targetCamPos.current.set(
          selectedArtifact.position[0] * 0.8,
          selectedArtifact.position[1] + 0.6,
          selectedArtifact.position[2] + 2.8
        );
        targetLookAt.current.set(...selectedArtifact.position);
      }
    } else if (selectedArtifact) {
      // Explore mode with artifact focus
      targetCamPos.current.set(
        selectedArtifact.position[0] * 0.7,
        selectedArtifact.position[1] + 0.6,
        selectedArtifact.position[2] + 2.6
      );
      targetLookAt.current.set(...selectedArtifact.position);
    } else {
      // Default cinematic framing
      targetCamPos.current.set(0, 2.2, 5.2);
      targetLookAt.current.set(0, 0.2, 0);
    }

    // Only apply programmatic lerp when user is not manually dragging orbit controls
    if (!isUserInteracting && controlsRef.current) {
      camera.position.lerp(targetCamPos.current, delta * 2.8);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 2.8);
      controlsRef.current.update();
    }
  });

  return null;
};
