import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      canvas: ReactThreeFiber.Object3DNode<THREE.Canvas, typeof THREE.Canvas>
    }
  }
} 