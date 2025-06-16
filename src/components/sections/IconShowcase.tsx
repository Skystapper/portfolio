import { useRef, useEffect } from 'react';
import { IconScene } from '../common/IconScene';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import SplitType from 'split-type';
import SectionBackground from '../common/SectionBackground';

export default function IconShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Initialize text animations
    if (headingRef.current && descriptionRef.current) {
      // Split text into characters for animation
      const headingSplit = new SplitType(headingRef.current, { 
        types: ['chars', 'words'],
        absolute: false
      });
      
      const descriptionSplit = new SplitType(descriptionRef.current, { 
        types: ['words'],
        absolute: false
      });

      // Animate heading characters
      gsap.from(headingSplit.chars, {
        opacity: 0,
        y: 20,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top bottom",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      });

      // Animate description words
      gsap.from(descriptionSplit.words, {
        opacity: 0,
        y: 20,
        stagger: 0.03,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top bottom",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      });
    }

    // Create horizontal scrolling effects for additional icons
    if (imagesRef.current) {
      gsap.to(imagesRef.current, {
        x: () => -(imagesRef.current!.scrollWidth - window.innerWidth + 32),
        ease: "none",
        scrollTrigger: {
          trigger: imagesRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SectionBackground
      section="iconShowcase"
      className="min-h-screen flex flex-col justify-center py-20"
      particleDensity={200}
      gradientColors={["transparent", "black/20", "black/50"]}
    >
      <section id="icon-showcase" className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 
            ref={headingRef} 
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Interactive Experience
          </h2>
          <p 
            ref={descriptionRef} 
            className="text-xl text-gray-300 leading-relaxed"
          >
            Discover our captivating 3D elements that bring your digital experience to life with smooth animations and interactive features
          </p>
        </div>
        
        <div className="relative h-[50vh] flex items-center justify-center mb-20">
          <IconScene 
            iconPath="/icons/spiral-abstract-shape-animated-3d-icon-713416610389.glb"
            className="transform-gpu"
            scale={0.8}
          />
        </div>
        
        {/* Horizontal scrolling gallery */}
        <div className="overflow-hidden relative">
          <h3 className="text-2xl font-semibold mb-8 text-center">Explore More Models</h3>
          <div 
            ref={imagesRef}
            className="flex space-x-8 pb-12 cursor-grab"
          >
            <div className="min-w-[280px] h-[280px]">
              <IconScene 
                iconPath="/icons/circle-abstract-shape-animated-3d-icon-1692045000019.glb"
                scale={0.6}
                className="h-full"
              />
            </div>
            <div className="min-w-[280px] h-[280px]">
              <IconScene 
                iconPath="/icons/floating-cubes-loading-animated-3d-icon-514489560289.glb"
                scale={0.6}
                className="h-full"
              />
            </div>
            <div className="min-w-[280px] h-[280px]">
              <IconScene 
                iconPath="/icons/star-abstract-shape-animated-3d-icon-1042881958811.glb"
                scale={0.6}
                className="h-full"
              />
            </div>
            <div className="min-w-[280px] h-[280px]">
              <IconScene 
                iconPath="/icons/sphere-abstract-shape-animated-3d-icon-430778994990.glb"
                scale={0.6}
                className="h-full"
              />
            </div>
            <div className="min-w-[280px] h-[280px]">
              <IconScene 
                iconPath="/icons/twisted-circle-abstract-shape-animated-3d-icon-1057449839409.glb"
                scale={0.6}
                className="h-full"
              />
          </div>
        </div>
      </div>
    </section>
    </SectionBackground>
  );
} 