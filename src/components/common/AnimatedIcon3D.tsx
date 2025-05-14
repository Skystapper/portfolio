import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

interface AnimatedIcon3DProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  hoverScale?: number;
  spinAxis?: 'x' | 'y' | 'z';
  floatIntensity?: number;
}

export function AnimatedIcon3D({ 
  path, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  hoverScale = 1.2,
  spinAxis = 'y',
  floatIntensity = 0.1
}: AnimatedIcon3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(path) as GLTFResult;

  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Axis-specific rotation
    meshRef.current.rotation[spinAxis] += delta * 0.5;

    // Enhanced hover effect
    const targetScale = hovered ? scale * hoverScale : scale;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Configurable float intensity
    meshRef.current.position.y = position[1] + 
      Math.sin(state.clock.elapsedTime * 1.5) * floatIntensity;
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </group>
  );
} 