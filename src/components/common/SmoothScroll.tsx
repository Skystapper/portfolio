'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Define props interface
interface SmoothScrollProps {
  children: ReactNode;
  speed?: number;
}

export default function SmoothScroll({ children, speed = 0.8 }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<any>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Detect if device is mobile/touch device
    const isMobile = typeof window !== 'undefined' && 
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Ensure GSAP is properly loaded
    if (!gsap.registerPlugin) {
      console.error("GSAP not loaded properly");
      return;
    }
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Initialize ScrollSmoother when component mounts
    if (wrapperRef.current && contentRef.current && !isInitialized.current) {
      // Create a delay to ensure DOM is fully ready and Canvas elements are loaded
      const initTimeout = setTimeout(() => {
        try {
          // Different settings for mobile vs desktop
          const scrollSettings = isMobile ? {
            smooth: 0.4, // Lighter smoothing for mobile
            effects: false, // Disable effects for better mobile performance
            wrapper: wrapperRef.current,
            content: contentRef.current,
            normalizeScroll: true, // Enable for better mobile touch handling
            ignoreMobileResize: false,
            smoothTouch: 0.3, // Enable smooth touch with lighter value
            onUpdate: (self: any) => {
              // Less frequent updates on mobile for better performance
              if (performance.now() % 5 === 0) { // Only update every 5th frame
                ScrollTrigger.update();
              }
              
              // Ensure Canvas elements remain protected
              if (performance.now() % 15 === 0) { // Check every 15th frame
                const canvasElements = document.querySelectorAll('canvas:not([data-speed="0"])');
                canvasElements.forEach(canvas => {
                  canvas.setAttribute('data-speed', '0');
                  (canvas as HTMLElement).style.transform = 'none';
                });
              }
            },
          } : {
            // Desktop settings (existing)
            smooth: speed,
            effects: true,
            wrapper: wrapperRef.current,
            content: contentRef.current,
            normalizeScroll: false,
            ignoreMobileResize: true,
            smoothTouch: false,
            onUpdate: (self: any) => {
              if (performance.now() % 3 === 0) {
                ScrollTrigger.update();
              }
              
              if (performance.now() % 10 === 0) {
                const canvasElements = document.querySelectorAll('canvas:not([data-speed="0"])');
                canvasElements.forEach(canvas => {
                  canvas.setAttribute('data-speed', '0');
                  (canvas as HTMLElement).style.transform = 'none';
                });
              }
            },
          };

          // ScrollSmoother settings with mobile optimization
          smootherRef.current = ScrollSmoother.create(scrollSettings);
          
          isInitialized.current = true;
           
          // Ensure Canvas elements are not affected by smooth scroll
          const canvasElements = document.querySelectorAll('canvas');
          canvasElements.forEach(canvas => {
            canvas.style.transform = 'none';
            canvas.style.willChange = 'auto';
            canvas.setAttribute('data-speed', '0');
            const parent = canvas.closest('.icon-scene, .iconShowcase, [class*="canvas"]');
            if (parent) {
              (parent as HTMLElement).setAttribute('data-speed', '0');
            }
          });
           
          // Delayed refresh to ensure everything is properly initialized
          setTimeout(() => {
            if (smootherRef.current) {
              ScrollTrigger.refresh();
              setTimeout(() => {
                ScrollTrigger.refresh();
                
                const horizontalElements = document.querySelectorAll('.panel, .projects-slider');
                if (horizontalElements.length > 0) {
                  ScrollTrigger.refresh();
                }
              }, 100);
            }
          }, 200);
          
        } catch (error) {
          console.warn('ScrollSmoother initialization failed:', error);
          isInitialized.current = false;
          
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      }, isMobile ? 100 : 250); // Faster initialization on mobile
      
      return () => clearTimeout(initTimeout);
    }

    // Optimized resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (smootherRef.current && isInitialized.current) {
          try {
            smootherRef.current.refresh();
            ScrollTrigger.refresh();
          } catch (error) {
            console.warn('Resize refresh failed:', error);
          }
        }
      }, isMobile ? 150 : 250); // Faster resize handling on mobile
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      
      if (smootherRef.current) {
        try {
          smootherRef.current.kill();
        } catch (error) {
          console.warn('ScrollSmoother cleanup failed:', error);
        }
        smootherRef.current = null;
      }
      
      ScrollTrigger.getAll().forEach(st => {
        try {
          st.kill();
        } catch (error) {
          console.warn('ScrollTrigger cleanup failed:', error);
        }
      });
      
      isInitialized.current = false;
    };
  }, [speed]);

  return (
    <div 
      ref={wrapperRef} 
      id="smooth-wrapper" 
      className="relative w-full h-screen overflow-hidden"
      style={{
        // Enable momentum scrolling on iOS
        WebkitOverflowScrolling: 'touch',
        // Improve touch responsiveness
        touchAction: 'pan-y',
      }}
    >
      <div 
        ref={contentRef} 
        id="smooth-content" 
        className="relative h-auto"
        style={{
          contain: 'layout style',
          willChange: 'transform',
          // Additional mobile optimizations
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
} 