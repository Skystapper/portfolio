import { IconScene } from '../common/IconScene';

export function IconShowcase() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <IconScene 
            iconPath="/icons/spiral-abstract-shape-animated-3d-icon-713416610389.glb"
            className="hover:scale-105 transition-transform duration-500 mb-8"
          />
          <h2 className="text-3xl font-bold mb-4">
            Interactive 3D Element
          </h2>
          <p className="text-gray-300">
            Drag to rotate • Hover to scale
          </p>
        </div>
      </div>
    </div>
  );
} 