'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconScene } from '../common/IconScene';

interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'animation' | 'backend' | 'design';
  color: string;
}

const SKILL_ICONS = {
  frontend: '/icons/Animated_Editable_Technology_3D_Animated_Icons_Free/computer-3d-animated-icon-444929331394.glb',
  animation: '/icons/Animated_Editable_Technology_3D_Animated_Icons_Free/hologram-3d-animated-icon-1570496087492.glb',
  backend: '/icons/Animated_Editable_Technology_3D_Animated_Icons_Free/server-3d-animated-icon-436615778910.glb',
  design: '/icons/Animated_Editable_Technology_3D_Animated_Icons_Free/smartphone-3d-animated-icon-789765147476.glb'
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const skills: Skill[] = [
    { name: 'HTML/CSS', level: 95, category: 'frontend', color: '#ff5d5d' },
    { name: 'JavaScript', level: 90, category: 'frontend', color: '#ffdf5d' },
    { name: 'React', level: 85, category: 'frontend', color: '#5dafff' },
    { name: 'TypeScript', level: 80, category: 'frontend', color: '#5d8cff' },
    { name: 'GSAP', level: 92, category: 'animation', color: '#5dff8f' },
    { name: 'Three.js', level: 75, category: 'animation', color: '#ff5db8' },
    { name: 'WebGL', level: 65, category: 'animation', color: '#b85dff' },
    { name: 'Node.js', level: 70, category: 'backend', color: '#5dffd6' },
    { name: 'UI/UX Design', level: 85, category: 'design', color: '#ff8f5d' },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        '.skills-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.skills-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skill bar animations
      gsap.fromTo(
        '.skill-bar',
        { width: 0 },
        {
          width: 'var(--skill-level)',
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skill name animations
      gsap.fromTo(
        '.skill-name',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Category icons animation
      gsap.fromTo(
        '.category-icon',
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.categories',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Marquee animation
      gsap.to('.skills-marquee', {
        xPercent: -50,
        ease: 'none',
        repeat: -1,
        duration: 25,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels = {
    frontend: 'Frontend Development',
    animation: 'Animation & Motion',
    backend: 'Backend Development',
    design: 'Design',
  };

  return (
    <section 
      id="skills" 
      ref={sectionRef} 
      className="min-h-screen relative py-24 overflow-hidden"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/5"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="skills-title text-4xl md:text-5xl font-bold mb-20 text-center">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Expertise</span>
        </h2>
        
        {/* Skills marquee */}
        <div className="marquee-container overflow-hidden mb-20">
          <div className="skills-marquee flex whitespace-nowrap">
            {[...skills, ...skills].map((skill, index) => (
              <div 
                key={index} 
                className="mx-4 px-6 py-2 rounded-full text-black font-medium"
                style={{ backgroundColor: skill.color }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Skills bars */}
        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {Object.entries(categories).map(([category, categorySkills]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-medium mb-6 flex items-center">
                <span className="category-icon h-8 w-8 rounded-full flex items-center justify-center mr-3" style={{ background: categorySkills[0].color }}>
                  {category === 'frontend' && <span>🖥️</span>}
                  {category === 'animation' && <span>✨</span>}
                  {category === 'backend' && <span>⚙️</span>}
                  {category === 'design' && <span>🎨</span>}
                </span>
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              
              <div className="space-y-6">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between mb-2">
                      <span className="skill-name font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="skill-bar h-full rounded-full"
                        style={{ 
                          '--skill-level': `${skill.level}%`,
                          backgroundColor: skill.color 
                        } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Categories circles */}
        <div className="categories flex justify-center space-x-6 mt-16">
          {Object.entries(categories).map(([category, skills]) => (
            <div 
              key={category} 
              className="category-icon w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
              style={{ borderColor: skills[0].color }}
            >
              {category === 'frontend' && <span>🖥️</span>}
              {category === 'animation' && <span>✨</span>}
              {category === 'backend' && <span>⚙️</span>}
              {category === 'design' && <span>🎨</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 