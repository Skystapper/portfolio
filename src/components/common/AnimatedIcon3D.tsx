import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
}

export function AnimatedIcon3D({ 
  path, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}: AnimatedIcon3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(path) as GLTFResult;
  const { viewport, mouse } = useThree();
  
  // Use refs to avoid unnecessary re-renders
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isAnimating = useRef(false);
  
  useEffect(() => {
    if (hovered && meshRef.current && !isAnimating.current) {
      isAnimating.current = true;
      
      // More stable scale animation
      const originalScale = meshRef.current.scale.clone();
      const targetScale = originalScale.clone().multiplyScalar(1.1);
      
      // Create smooth scale animation
      let startTime = performance.now();
      const duration = 500; // ms
      
      const animateScale = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (meshRef.current) {
          if (progress < 0.5) {
            // Scale up
            const factor = progress * 2;
            const currentScale = originalScale.clone().lerp(targetScale, factor);
            meshRef.current.scale.copy(currentScale);
          } else {
            // Scale down
            const factor = (progress - 0.5) * 2;
            const currentScale = targetScale.clone().lerp(originalScale, factor);
            meshRef.current.scale.copy(currentScale);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animateScale);
          } else {
            isAnimating.current = false;
            // Reset to original scale
            meshRef.current.scale.copy(originalScale);
          }
        }
      };
      
      requestAnimationFrame(animateScale);
      
      // Subtle emissive effect
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.emissive) {
            const originalEmissive = material.emissiveIntensity;
            let emissiveStart = performance.now();
            
            const animateEmissive = (currentTime: number) => {
              const elapsed = currentTime - emissiveStart;
              const progress = Math.min(elapsed / 300, 1);
              
              if (progress < 0.5) {
                material.emissiveIntensity = originalEmissive + (0.3 * progress * 2);
              } else {
                material.emissiveIntensity = originalEmissive + (0.3 * (1 - (progress - 0.5) * 2));
              }
              
              if (progress < 1) {
                requestAnimationFrame(animateEmissive);
              } else {
                material.emissiveIntensity = originalEmissive;
              }
            };
            
            requestAnimationFrame(animateEmissive);
          }
        }
      });
    }
  }, [hovered, scene]);

  // Optimized animation loop with stable performance
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Stable, smooth rotation based on mouse with interpolation
    targetRotation.current.x = mouse.y * 0.2;
    targetRotation.current.y = mouse.x * 0.5;
    
    // Smooth interpolation to prevent jitters
    const lerpFactor = 0.05; // Reduced for stability
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;
    
    // Apply smooth rotation
    meshRef.current.rotation.x = currentRotation.current.x;
    meshRef.current.rotation.y = currentRotation.current.y + state.clock.elapsedTime * 0.1; // Slower base rotation
    
    // Reduced breathing animation to prevent conflicts
    const breathingIntensity = 0.02; // Reduced intensity
    const breathingScale = scale * (1 + Math.sin(state.clock.elapsedTime * 1.2) * breathingIntensity);
    
    // Only apply breathing if not being animated by hover
    if (!isAnimating.current) {
      meshRef.current.scale.setScalar(breathingScale);
    }
    
    // Subtle float animation
    const floatAmplitude = 0.03; // Reduced amplitude
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * floatAmplitude;
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