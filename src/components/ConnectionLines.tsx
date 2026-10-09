import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ArtifactData, MomentData, ViewMode } from '../types';
import { ARCHIVE_ARTIFACTS } from '../data/artifacts';

interface ConnectionLinesProps {
  viewMode: ViewMode;
  selectedArtifact: ArtifactData | null;
  activeMoment: MomentData | null;
}

interface ArcLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
  highlighted?: boolean;
}

const ArcLine: React.FC<ArcLineProps> = ({
  start,
  end,
  color,
  speed = 1.0,
  highlighted = false,
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    // Arc upward slightly proportional to distance
    const dist = p1.distanceTo(p2);
    mid.y += Math.max(0.25, dist * 0.22);
    return new THREE.QuadraticBezierCurve3(p1, mid, p2);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(32), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: highlighted ? 0.85 : 0.4,
      linewidth: highlighted ? 2 : 1,
    });
    return new THREE.Line(geometry, mat);
  }, [geometry, color, highlighted]);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 0.4 * speed) % 1;
      const pos = curve.getPoint(t);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Curved glowing path line */}
      <primitive object={lineObject} ref={lineRef} />

      {/* Traveling energy bead */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[highlighted ? 0.045 : 0.03, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  viewMode,
  selectedArtifact,
  activeMoment,
}) => {
  const artifactMap = useMemo(() => {
    const map = new Map<string, ArtifactData>();
    ARCHIVE_ARTIFACTS.forEach((a) => map.set(a.id, a));
    return map;
  }, []);

  // Compute connections to display based on active view mode
  const connections = useMemo(() => {
    const pairs: Array<{
      start: [number, number, number];
      end: [number, number, number];
      color: string;
      id: string;
      highlighted: boolean;
    }> = [];

    if (viewMode === 'connections' && selectedArtifact) {
      // Connect selected artifact to each of its connected neighbors
      selectedArtifact.connectedTo.forEach((targetId) => {
        const target = artifactMap.get(targetId);
        if (target) {
          pairs.push({
            id: `${selectedArtifact.id}-${target.id}`,
            start: selectedArtifact.position,
            end: target.position,
            color: selectedArtifact.accentColor,
            highlighted: true,
          });
        }
      });
    } else if (viewMode === 'moments' && activeMoment) {
      // Connect the sequence in order: e.g. 0->1, 1->2, 2->3
      for (let i = 0; i < activeMoment.traceIds.length - 1; i++) {
        const from = artifactMap.get(activeMoment.traceIds[i]);
        const to = artifactMap.get(activeMoment.traceIds[i + 1]);
        if (from && to) {
          pairs.push({
            id: `moment-${from.id}-${to.id}`,
            start: from.position,
            end: to.position,
            color: activeMoment.themeColor,
            highlighted: true,
          });
        }
      }
    } else if (viewMode === 'story') {
      // Full archival constellation web
      const seen = new Set<string>();
      ARCHIVE_ARTIFACTS.forEach((artifact) => {
        artifact.connectedTo.forEach((targetId) => {
          const key = [artifact.id, targetId].sort().join('--');
          if (!seen.has(key)) {
            seen.add(key);
            const target = artifactMap.get(targetId);
            if (target) {
              pairs.push({
                id: key,
                start: artifact.position,
                end: target.position,
                color: artifact.accentColor,
                highlighted: false,
              });
            }
          }
        });
      });
    }

    return pairs;
  }, [viewMode, selectedArtifact, activeMoment, artifactMap]);

  if (connections.length === 0) return null;

  return (
    <group>
      {connections.map((conn) => (
        <ArcLine
          key={conn.id}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          highlighted={conn.highlighted}
        />
      ))}
    </group>
  );
};
