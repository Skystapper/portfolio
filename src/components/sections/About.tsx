'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const decorativeElementRef = useRef<HTMLDivElement>(null);

  // List of skills
  const skills = [
    'JavaScript', 'React', 'Next.js', 'TypeScript', 
    'GSAP', 'Three.js', 'Tailwind CSS', 'Node.js'
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal text animations
      const textElements = gsap.utils.toArray<HTMLElement>('.reveal-text');
      textElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Skills reveal
      gsap.fromTo(
        '.skill-item',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.skills-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Decorative element animations
      if (decorativeElementRef.current) {
        // Create floating animation
        gsap.to(decorativeElementRef.current, {
          y: -30,
          x: 20,
          rotation: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Parallax effect on scroll
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
          onUpdate: (self) => {
            gsap.to(decorativeElementRef.current, {
              y: -30 + (self.progress * -50),
              rotation: 10 + (self.progress * 20),
              duration: 0.1,
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative py-32 overflow-visible"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 to-purple-900/20"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center reveal-text">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Me</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          {/* Decorative visual element instead of 3D model */}
          <div className="relative md:col-span-1 flex justify-center">
            <div 
              ref={decorativeElementRef}
              className="w-80 h-80 relative z-10 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/30"
            >
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40 blur-sm"></div>
              <div className="absolute inset-20 rounded-full bg-gradient-to-tl from-pink-500/30 to-purple-500/30"></div>
              <div className="absolute inset-0 rounded-full border border-white/10"></div>
            </div>
          </div>
          
          {/* Content */}
          <div ref={contentRef} className="md:col-span-1 space-y-6 z-20">
            <p className="text-xl reveal-text">
              I'm a creative developer with a passion for building immersive digital experiences that combine 
              cutting-edge technology with stunning visuals.
            </p>
            
            <p className="text-white/80 reveal-text">
              My journey began with a fascination for both design and code. Over the years, I've honed my skills 
              in creating motion-rich interfaces that tell compelling stories and engage users on a deeper level.
            </p>
            
            <p className="text-white/80 reveal-text">
              I specialize in interactive websites with advanced animations, creative transitions, and unique user 
              experiences that push the boundaries of what's possible on the web.
            </p>
            
            <div className="skills-container mt-8">
              <h3 className="text-xl font-medium mb-4 reveal-text">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="skill-item px-4 py-2 bg-white/10 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 