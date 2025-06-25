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
    // Skip on mobile to avoid performance issues
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return;
    }
    
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
                     // ScrollSmoother settings with effects enabled for horizontal scrolling
        smootherRef.current = ScrollSmoother.create({
             smooth: speed, // Reduced default speed
             effects: true, // Re-enabled for horizontal scrolling but with protection
          wrapper: wrapperRef.current,
          content: contentRef.current,
             normalizeScroll: false, // Disabled to avoid conflicts
          ignoreMobileResize: true,
             smoothTouch: false, // Disabled for better performance
          onUpdate: self => {
               // Throttled ScrollTrigger updates
               if (performance.now() % 3 === 0) { // Only update every 3rd frame
            ScrollTrigger.update();
          }
               
               // Ensure Canvas elements remain protected
               if (performance.now() % 10 === 0) { // Check every 10th frame
                 const canvasElements = document.querySelectorAll('canvas:not([data-speed="0"])');
                 canvasElements.forEach(canvas => {
                   canvas.setAttribute('data-speed', '0');
                   (canvas as HTMLElement).style.transform = 'none';
                 });
               }
             },
            
          });
          
                     isInitialized.current = true;
           
           // Ensure Canvas elements are not affected by smooth scroll
           const canvasElements = document.querySelectorAll('canvas');
           canvasElements.forEach(canvas => {
             canvas.style.transform = 'none';
             canvas.style.willChange = 'auto';
             // Exclude from ScrollSmoother effects
             canvas.setAttribute('data-speed', '0');
             // Also protect the parent containers
             const parent = canvas.closest('.icon-scene, .iconShowcase, [class*="canvas"]');
             if (parent) {
               (parent as HTMLElement).setAttribute('data-speed', '0');
             }
           });
           
           // Delayed refresh to ensure everything is properly initialized
           setTimeout(() => {
             if (smootherRef.current) {
               ScrollTrigger.refresh();
               // Force refresh again to ensure horizontal scrolling works
               setTimeout(() => {
                 ScrollTrigger.refresh();
                 
                 // Check for horizontal scroll sections and ensure they're working
                 const horizontalElements = document.querySelectorAll('.panel, .projects-slider');
                 if (horizontalElements.length > 0) {
                   ScrollTrigger.refresh();
                 }
               }, 100);
             }
           }, 200);
          
                 } catch (error) {
           console.warn('ScrollSmoother initialization failed:', error);
           // Fallback to regular scroll if smooth scroll fails
           isInitialized.current = false;
           
           // Still enable ScrollTrigger for horizontal scrolling even without ScrollSmoother
           setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
             }, 250); // Further increased delay to ensure all components are mounted
      
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
      }, 250); // Debounced resize
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      
      // Clean up ScrollSmoother when component unmounts
      if (smootherRef.current) {
        try {
        smootherRef.current.kill();
        } catch (error) {
          console.warn('ScrollSmoother cleanup failed:', error);
        }
        smootherRef.current = null;
      }
      
      // Clean up ScrollTriggers
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
    >
      <div 
        ref={contentRef} 
        id="smooth-content" 
        className="relative h-auto"
        style={{
          // Ensure Canvas elements maintain proper rendering context
          contain: 'layout style',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
} 