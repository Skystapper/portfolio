'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconScene } from '../common/IconScene';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Text animations - Splitting the headline
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || '';
        headlineRef.current.innerHTML = '';
        
        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.className = 'inline-block opacity-0';
          headlineRef.current?.appendChild(span);
        });
        
        gsap.to(headlineRef.current.children, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.2,
        });
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1 }
      );

      // CTA button animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 1.3 }
      );

      // Animate floating shapes
      const shapes = shapesRef.current?.children;
      if (shapes) {
        Array.from(shapes).forEach((shape, index) => {
          // Random starting position
          gsap.set(shape, {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            rotation: Math.random() * 360,
            opacity: 0,
          });

          // Floating animation
          gsap.to(shape, {
            x: `random(-100, 100)`,
            y: `random(-100, 100)`,
            rotation: `random(-45, 45)`,
            opacity: 0.5,
            duration: 15 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2,
          });
      });
      }

      // Scroll animations for parallax effect
      ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
        onUpdate: (self) => {
          // Parallax text movement
          gsap.to(textRef.current, {
            y: self.progress * 100,
            duration: 0.1,
          });
          
          // Parallax shapes movement
          gsap.to(shapesRef.current, {
            y: self.progress * -100,
            duration: 0.1,
          });
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-visible py-20"
    >
      {/* Floating icon background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <IconScene
          iconPath="/icons/floating-cubes-loading-animated-3d-icon-514489560289.glb"
          className="h-full"
        />
      </div>
      
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-pink-600/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute w-32 h-32 rounded-full bg-purple-500/10"></div>
        <div className="absolute w-24 h-24 rounded-full bg-blue-500/10"></div>
        <div className="absolute w-40 h-40 rounded-full bg-pink-500/10"></div>
        <div className="absolute w-20 h-20 rounded-full bg-indigo-500/10"></div>
        <div className="absolute w-36 h-36 rounded-full bg-green-500/10"></div>
        <div className="absolute w-28 h-28 rounded-full bg-yellow-500/10"></div>
      </div>
      
      {/* Hero content */}
      <div 
        ref={textRef} 
        className="relative z-20 text-center px-4 max-w-4xl mx-auto"
      >
        <h1 
          ref={headlineRef} 
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Creative Developer & Designer
        </h1>
        
        <p 
          ref={subtitleRef} 
          className="mt-6 text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
        >
          Crafting immersive digital experiences with cutting-edge web technologies and creative animations.
        </p>
        
        <div ref={ctaRef} className="mt-10">
          <a 
            href="#projects" 
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 
                      rounded-full transition-all duration-300 inline-block"
          >
            View Projects
          </a>
        </div>
        
        {/* Main interactive icon */}
        <div className="mx-auto w-64 h-64 mb-8 mt-10">
          <IconScene
            iconPath="/icons/rotating-cube-loading-animated-3d-icon-323338265846.glb"
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm uppercase tracking-widest mb-2 text-white/60">Scroll</span>
        <div className="w-1 h-10 bg-white/20 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-white/60 animate-scroll"></div>
        </div>
      </div>
    </section>
  );
} 