'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useThree, createRoot } from '@react-three/fiber';
import * as THREE from 'three';

// Context to share Three.js resources
type ThreeContextType = {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
};

const ThreeContext = createContext<ThreeContextType>({
  renderer: null,
  scene: null,
  camera: null,
});

export const useThreeContext = () => useContext(ThreeContext);

// Manages global WebGL context for efficient rendering of 3D elements
export default function ThreeWrapper({ children }: { children: ReactNode }) {
  const [threeContext, setThreeContext] = useState<ThreeContextType>({
    renderer: null,
    scene: null,
    camera: null,
  });

  useEffect(() => {
    // Initialize global Three.js objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Make renderer available globally but don't add to DOM
    // We'll use it in individual components
    
    setThreeContext({ renderer, scene, camera });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <ThreeContext.Provider value={threeContext}>
      {children}
    </ThreeContext.Provider>
  );
} 