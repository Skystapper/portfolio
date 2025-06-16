import { useRef, useState, useEffect, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Preload, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AnimatedIcon3D } from './AnimatedIcon3D';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Type for icon configuration
interface IconConfig {
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  floatIntensity?: number;
  speed?: number;
  animationType: 'rotate' | 'scale' | 'move' | 'path' | 'none';
}

// Custom component for a 3D icon with scroll-based animation
function AnimatedScrollIcon({ 
  config, 
  scrollProgress = 0, 
  index = 0 
}: { 
  config: IconConfig, 
  scrollProgress: number, 
  index: number 
}) {
  const { scene } = useGLTF(config.path);
  const initialRotation = useRef(config.rotation);
  const initialPosition = useRef(config.position);
  const initialScale = useRef(config.scale);
  
  useEffect(() => {
    // Apply custom material
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        if ('metalness' in child.material) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.2;
        }
      }
    });
  }, [scene, index]);

  // Apply different animation types based on scroll progress
  useEffect(() => {
    const animationFactor = Math.sin(scrollProgress * Math.PI) * (index % 2 === 0 ? 1 : -1);
    
    switch (config.animationType) {
      case 'rotate':
        gsap.to(scene.rotation, {
          x: initialRotation.current[0] + scrollProgress * Math.PI * (index % 3 === 0 ? 1 : 2),
          y: initialRotation.current[1] + scrollProgress * Math.PI * 2,
          z: initialRotation.current[2] + scrollProgress * Math.PI * (index % 2 === 0 ? 0.5 : 1),
          duration: 0.5,
          ease: 'power2.out'
        });
        break;
        
      case 'scale':
        const scaleFactor = 1 + scrollProgress * 0.5;
        gsap.to(scene.scale, {
          x: initialScale.current * (1 + animationFactor * 0.2),
          y: initialScale.current * (1 + animationFactor * 0.2),
          z: initialScale.current * (1 + animationFactor * 0.2),
          duration: 0.5,
          ease: 'power2.out'
        });
        break;
        
      case 'move':
        gsap.to(scene.position, {
          x: initialPosition.current[0] + animationFactor * 3,
          y: initialPosition.current[1] + scrollProgress * 2 * (index % 2 === 0 ? 1 : -1),
          z: initialPosition.current[2],
          duration: 0.5,
          ease: 'power2.out'
        });
        break;
        
      case 'path':
        const angle = scrollProgress * Math.PI * 2 + (index * Math.PI / 4);
        const radius = 3 + index % 3;
        gsap.to(scene.position, {
          x: Math.sin(angle) * radius,
          y: Math.cos(angle) * radius * (index % 2 === 0 ? 1 : 0.5),
          z: initialPosition.current[2] + Math.sin(scrollProgress * Math.PI * 4) * 2,
          duration: 0.5,
          ease: 'power2.out'
        });
        gsap.to(scene.rotation, {
          y: angle,
          duration: 0.5,
          ease: 'power2.out'
        });
        break;
        
      default:
        gsap.to(scene.position, {
          y: initialPosition.current[1] + scrollProgress * 0.5,
          duration: 0.5,
          ease: 'power2.out'
        });
    }
  }, [scrollProgress, config.animationType, scene, index]);
  
  return (
    <Float
      speed={config.speed || 1.5}
      rotationIntensity={0.2}
      floatIntensity={config.floatIntensity || 0.5}
      key={config.path}
    >
      <AnimatedIcon3D
        path={config.path}
        scale={config.scale}
        rotation={config.rotation}
      />
    </Float>
  );
}

// Background scene component
function BackgroundIcons({ 
  icons, 
  scrollProgress, 
  density = 100
}: { 
  icons: IconConfig[], 
  scrollProgress: number,
  density: number
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting setup */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#5d85ff" />
      <pointLight position={[0, 0, 8]} intensity={1.5} color="#9f45ff" />
      
      {/* Render each icon */}
      {icons.map((icon, index) => (
        <AnimatedScrollIcon
          key={`${icon.path}-${index}`}
          config={icon}
          scrollProgress={scrollProgress}
          index={index}
        />
      ))}
      
      {/* Optional background particles */}
      {density > 0 && <Particles count={density} />}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <Preload all />
    </Canvas>
  );
}

// Particle component for background depth
function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useRef(new Float32Array(count * 3));
  
  useEffect(() => {
    const positionArray = positions.current;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create a sphere of particles
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positionArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positionArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positionArray[i3 + 2] = radius * Math.cos(phi);
    }
  }, [count]);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.current}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  );
}

interface SectionBackgroundProps {
  children?: ReactNode;
  section: string;
  className?: string;
  gradientColors?: string[];
  particleDensity?: number;
}

export default function SectionBackground({
  children,
  section,
  className = "",
  gradientColors = ["transparent", "black/30", "black/60"],
  particleDensity = 100
}: SectionBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Different icon configurations for each section
  const sectionIcons: Record<string, IconConfig[]> = {
    hero: [
      { 
        path: '/icons/abstract-shape-animated-3d-icon-1573750599827.glb', 
        scale: 2.0, 
        position: [0, -2, 0], 
        rotation: [0.1, 0.2, 0], 
        animationType: 'rotate',
        floatIntensity: 0.4
      }
    ],
    about: [
      { 
        path: '/icons/spiral-abstract-shape-animated-3d-icon-713416610389.glb', 
        scale: 1.75, 
        position: [-8, -2, 0], 
        rotation: [0.1, 0.2, 0], 
        animationType: 'rotate',
        floatIntensity: 0.3
      },
      { 
        path: '/icons/twisted-circle-abstract-shape-animated-3d-icon-1057449839409.glb', 
        scale: 1.25, 
        position: [8, 3, -2], 
        rotation: [0.2, 0.1, 0.3], 
        animationType: 'rotate',
        floatIntensity: 0.4
      },
      { 
        path: '/icons/sphere-abstract-shape-animated-3d-icon-430778994990.glb', 
        scale: 1.0, 
        position: [0, -5, -1], 
        rotation: [0.3, 0.2, 0.1], 
        animationType: 'move',
        floatIntensity: 0.2
      }
    ],
    skills: [
      { 
        path: '/icons/cube-abstract-shape-animated-3d-icon-1284210180529.glb', 
        scale: 1.8, 
        position: [-6, 4, 0], 
        rotation: [0.1, 0.2, 0.3], 
        animationType: 'scale',
        floatIntensity: 0.5
      },
      { 
        path: '/icons/cube-abstract-shape-animated-3d-icon-1108000545873.glb', 
        scale: 1.5, 
        position: [6, -4, -1], 
        rotation: [0.2, 0.3, 0.1], 
        animationType: 'scale',
        floatIntensity: 0.3
      },
      { 
        path: '/icons/circle-abstract-shape-animated-3d-icon-89237357186.glb', 
        scale: 2.0, 
        position: [-4, -3, -2], 
        rotation: [0.3, 0.1, 0.2], 
        animationType: 'scale',
        floatIntensity: 0.4
      },
      { 
        path: '/icons/circle-abstract-shape-animated-3d-icon-1692045000019.glb', 
        scale: 1.7, 
        position: [4, 3, -3], 
        rotation: [0.1, 0.3, 0.2], 
        animationType: 'scale',
        floatIntensity: 0.6
      },
      { 
        path: '/icons/star-abstract-shape-animated-3d-icon-1042881958811.glb', 
        scale: 2.2, 
        position: [0, 0, -1], 
        rotation: [0.2, 0.2, 0.2], 
        animationType: 'scale',
        floatIntensity: 0.2
      }
    ],
    projects: [
      { 
        path: '/icons/waving-plane-abstract-animated-3d-icon-772525492989.glb', 
        scale: 4.0, 
        position: [-6, 3, -1], 
        rotation: [0.1, 0.3, 0.2], 
        animationType: 'move',
        floatIntensity: 0.5
      },
      { 
        path: '/icons/spheres-abstract-shape-animated-3d-icon-1668763368472.glb', 
        scale: 3.5, 
        position: [6, -3, -2], 
        rotation: [0.2, 0.1, 0.3], 
        animationType: 'move',
        floatIntensity: 0.4
      }
    ],
    iconShowcase: [
      { 
        path: '/icons/twisted-cubes-abstract-shape-animated-3d-icon-495212321593.glb', 
        scale: 1.5, 
        position: [5, 5, 0], 
        rotation: [0.1, 0.2, 0.3], 
        animationType: 'path',
        floatIntensity: 0.3
      },
      { 
        path: '/icons/star-abstract-shape-animated-3d-icon-1042881958811.glb', 
        scale: 1.2, 
        position: [-5, -5, -1], 
        rotation: [0.2, 0.3, 0.1], 
        animationType: 'path',
        floatIntensity: 0.2
      },
      { 
        path: '/icons/sphere-abstract-shape-animated-3d-icon-430778994990.glb', 
        scale: 1.0, 
        position: [-5, 5, -2], 
        rotation: [0.3, 0.1, 0.2], 
        animationType: 'path',
        floatIntensity: 0.4
      },
      { 
        path: '/icons/circle-abstract-shape-animated-3d-icon-89237357186.glb', 
        scale: 1.3, 
        position: [5, -5, -3], 
        rotation: [0.1, 0.3, 0.2], 
        animationType: 'path',
        floatIntensity: 0.5
      },
      { 
        path: '/icons/spiral-abstract-shape-animated-3d-icon-713416610389.glb', 
        scale: 1.1, 
        position: [0, 0, -1], 
        rotation: [0.2, 0.2, 0.2], 
        animationType: 'path',
        floatIntensity: 0.3
      }
    ]
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create scroll trigger for this section
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Get icons for current section or return empty array if not found
  const icons = sectionIcons[section] || [];

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {/* 3D Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <BackgroundIcons 
          icons={icons} 
          scrollProgress={scrollProgress} 
          density={particleDensity}
        />
        
        {/* Gradient overlay for better content readability */}
        <div 
          className={`absolute inset-0 bg-gradient-radial from-${gradientColors[0]} via-${gradientColors[1]} to-${gradientColors[2]} z-10`}
        ></div>
      </div>
      
      {/* Section content */}
      {children}
    </div>
  );
} 