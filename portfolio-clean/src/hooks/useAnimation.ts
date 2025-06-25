import { useEffect, useRef } from 'react';
import { 
  headingReveal, 
  createMarquee, 
  staggeredFadeIn, 
  createMagneticEffect,
  createTiltEffect,
  parallaxImages
} from '@/utils/animations';
import gsap from 'gsap';

/**
 * Custom hook to apply heading reveal animation
 */
export const useHeadingReveal = (delay = 0) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const animation = headingReveal(elementRef.current, delay);
    
    return () => {
      animation.kill();
    };
  }, [delay]);
  
  return elementRef;
};

/**
 * Custom hook to apply marquee animation
 */
export const useMarquee = (speed = 20, reversed = false) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const animation = createMarquee(elementRef.current, speed, reversed);
    
    return () => {
      if (animation) animation.kill();
    };
  }, [speed, reversed]);
  
  return elementRef;
};

/**
 * Custom hook to apply staggered fade-in animation
 */
export const useStaggeredFadeIn = (stagger = 0.1, y = 40) => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const elements = Array.from(containerRef.current.children) as HTMLElement[];
    const animation = staggeredFadeIn(elements, stagger, y);
    
    return () => {
      animation.kill();
    };
  }, [stagger, y]);
  
  return containerRef;
};

/**
 * Custom hook to apply magnetic effect to an element
 */
export const useMagneticEffect = (strength = 30) => {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const cleanup = createMagneticEffect(elementRef.current, strength);
    
    return cleanup;
  }, [strength]);
  
  return elementRef;
};

/**
 * Custom hook to apply 3D tilt effect to an element
 */
export const useTiltEffect = () => {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const cleanup = createTiltEffect(elementRef.current);
    
    return cleanup;
  }, []);
  
  return elementRef;
};

/**
 * Custom hook to apply parallax effect to images
 */
export const useParallaxImages = (speed = 0.5) => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const images = Array.from(containerRef.current.querySelectorAll('img')) as HTMLElement[];
    parallaxImages(images, speed);
    
    return () => {
      gsap.killTweensOf(images);
    };
  }, [speed]);
  
  return containerRef;
}; 