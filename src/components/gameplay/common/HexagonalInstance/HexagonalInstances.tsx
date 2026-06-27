import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instance, Instances, useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

interface HexagonalInstancesProps {
  width?: number;
  height?: number;
  hexSize?: number;
  InstanceSize?: number;
  InstanceColor?: string;
  waveSpeed?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
}

/**
 * Convertit les coordonnées hexagonales en position 2D
 * Utilise le système de coordonnées axial pour les hexagones flat-topped
 */
function hexToPosition(q: number, r: number, size: number): [number, number] {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * (3 / 2) * r;
  return [x, y];
}

/**
 * Composant de particules disposées en grille hexagonale avec animation sinusoïdale
 */
export function HexagonalInstances({
  width = 10,
  height = 10,
  hexSize = 1,
  InstanceSize = 0.2,
  InstanceColor = '#00ff88',
  waveSpeed = 1,
  waveAmplitude = 0.5,
  waveFrequency = 0.5,
}: HexagonalInstancesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Générer les positions et les données pour l'animation
  const { positions, phases } = useMemo(() => {
    const positions: Vector3[] = [];
    const phases: number[] = [];
    const totalInstances = width * height;

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const [x, y] = hexToPosition(q, r, hexSize);
        
        // Position initiale [x, y, z]
        positions.push(new Vector3(x, 0, y));
        
        // Phase pour l'animation sinusoïdale (déphasage basé sur la position)
        const phase = (q / width + r / height) * Math.PI * 2 * waveFrequency;
        phases.push(phase);
      }
    }

    return { positions, phases };
  }, [width, height, hexSize, waveFrequency]);

  // Animation sinusoïdale
  useFrame((state) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime * waveSpeed;

    for (let i = 0; i < phases.length; i++) {
      const y = Math.sin(time + phases[i]) * waveAmplitude;
      positionAttribute.setY(i, y);
    }

    positionAttribute.needsUpdate = true;
  });

  const texture = useTexture("./level/japaneese/cercles-concentriques.png");
  return (
    <Instances ref={pointsRef}>
      <sprite>
        <spriteMaterial map={texture}/>
      </sprite>
      {positions.map((pos,i) => {
        <Instance
           position={[pos.x, pos.y, pos.z]}
        />
      })}

    </Instances>
  );
}

