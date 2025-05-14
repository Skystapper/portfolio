'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from '@/components/common/CustomCursor';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import SmoothScroll from '@/components/common/SmoothScroll';
import Navbar from '@/components/common/Navbar';
import { IconShowcase } from '@/components/sections/IconShowcase';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Initialize page animation
      gsap.fromTo(
        '.main-content',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={mainRef} className="relative bg-black text-white">
      <CustomCursor />
      <Navbar />
      <SmoothScroll>
        <div className="main-content">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <IconShowcase />
        </div>
      </SmoothScroll>
    </main>
  );
} 