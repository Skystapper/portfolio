import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { AnimatedIcon3D } from './AnimatedIcon3D';
import { Suspense } from 'react';

interface IconSceneProps {
  iconPath: string;
  className?: string;
  scale?: number;
  hoverScale?: number;
  floatIntensity?: number;
  spinAxis?: 'x' | 'y' | 'z';
}

export function IconScene({ 
  iconPath, 
  className = '',
  scale = 1,
  hoverScale = 1.2,
  floatIntensity = 0.1,
  spinAxis = 'y'
}: IconSceneProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 30 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={0.4}
            adjustCamera={false}
            preset="rembrandt"
            shadows={false}
          >
            <AnimatedIcon3D
              path={iconPath}
              scale={scale}
              hoverScale={hoverScale}
              floatIntensity={floatIntensity}
              spinAxis={spinAxis}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
          </Stage>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 