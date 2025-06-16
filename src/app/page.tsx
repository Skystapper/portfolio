'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';

// Components
import CustomCursor from '@/components/ui/CustomCursor';
import Starfield from '@/components/ui/Starfield';
import Nebula from '@/components/ui/Nebula';
import Animated3DBackground from '@/components/ui/Animated3DBackground';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';
import DiscordSection from '@/components/sections/DiscordSection';
import WheelNavbar from '@/components/ui/WheelNavbar';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, Draggable);
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling and animations
    const ctx = gsap.context(() => {
      // Set up scroll-triggered animations
      gsap.utils.toArray('.fade-in-up').forEach((element: any) => {
        gsap.fromTo(element, 
          { 
            opacity: 0, 
            y: 50 
          },
        { 
          opacity: 1, 
          y: 0, 
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      gsap.utils.toArray('.fade-in-left').forEach((element: any) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: -50
          },
            {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
              scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
              }
            }
          );
      });

      gsap.utils.toArray('.fade-in-right').forEach((element: any) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: 50
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Parallax effects for floating elements
      gsap.utils.toArray('.float').forEach((element: any) => {
        gsap.to(element, {
          y: -30,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });
      
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Background Effects */}
      <Starfield />
      <Nebula />
      <Animated3DBackground />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Wheel Navigation */}
      <WheelNavbar />
      
      {/* Main Content */}
      <main ref={mainRef} className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* About Section */}
        <AboutSection />
        
        {/* Discord Profile Section */}
        <DiscordSection />
        
        {/* Projects Section */}
        <ProjectsSection />
        
        {/* Skills Section */}
        <SkillsSection />
        
        {/* Contact Section */}
        <ContactSection />
    </main>
    </>
  );
} 