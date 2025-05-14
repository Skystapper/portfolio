'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Define props interface
interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    let smoother: any;

    // Create ScrollSmoother instance
    if (smoothWrapperRef.current && contentRef.current) {
      smoother = ScrollSmoother.create({
        smooth: 1.5, // Adjust smoothness (higher = smoother but more delay)
        effects: true, // Enables special scroll effects
        wrapper: smoothWrapperRef.current,
        content: contentRef.current,
        normalizeScroll: true, // Prevents jerky scrolling on some devices
        ignoreMobileResize: true, // Prevents issues on mobile devices when address bar shows/hides
      });
    }

    // Clean up
    return () => {
      if (smoother) {
        smoother.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={smoothWrapperRef} className="smooth-scroll">
      <div ref={contentRef} className="scroll-content">
        {children}
      </div>
    </div>
  );
} 