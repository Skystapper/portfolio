import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { AnimatedIcon3D } from './AnimatedIcon3D';
import { Suspense, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface IconSceneProps {
  iconPath: string;
  className?: string;
  scale?: number;
}

export function IconScene({ iconPath, className = "", scale = 1 }: IconSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Make sure GSAP is properly loaded
    if (!gsap.registerPlugin) {
      console.error("GSAP not loaded properly");
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Create a context to properly manage and clean up animations
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        // Add a subtle animation when the icon comes into view
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.8, 
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);
    
    // Clean up all animations when component unmounts
    return () => {
      ctx.revert();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full icon-scene ${className}`}
      style={{ 
        isolation: 'isolate',
        transform: 'translateZ(0)', // Force GPU layer
        willChange: 'auto'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        style={{ 
          background: 'transparent',
          transform: 'none',
          willChange: 'auto'
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#5d85ff" />
        <pointLight position={[0, 0, 5]} intensity={1.0} color="#9f45ff" />
        
        <Suspense fallback={null}>
          <Float
            speed={2} // Animation speed
            rotationIntensity={0.5} // Rotation intensity
            floatIntensity={0.5} // Float intensity
          >
            <AnimatedIcon3D 
              path={iconPath} 
              scale={scale} 
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
          </Float>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
} 