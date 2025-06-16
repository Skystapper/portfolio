'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackground from '../common/SectionBackground';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionBackground
      section="hero"
      className="min-h-screen flex items-center justify-center overflow-visible py-20"
      particleDensity={200}
    >
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
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm uppercase tracking-widest mb-2 text-white/60">Scroll</span>
        <div className="w-1 h-10 bg-white/20 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-white/60 animate-scroll"></div>
        </div>
      </div>
    </SectionBackground>
  );
} 