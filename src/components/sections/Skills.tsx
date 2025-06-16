'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useHeadingReveal } from '@/hooks/useAnimation';
import SectionBackground from '../common/SectionBackground';

interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'animation' | 'backend' | 'design';
  color: string;
}

interface SkillCategory {
  title: string;
  color: string;
  description: string;
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const skillsWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useHeadingReveal(0.5);
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const categories: Record<string, SkillCategory> = {
    frontend: {
      title: 'Frontend Development',
      color: '#5d8cff',
      description: 'Building responsive, accessible, and performant user interfaces with the latest technologies'
    },
    animation: {
      title: 'Creative Animation',
      color: '#5dff8f',
      description: 'Bringing websites to life with mind-blowing animations and interactive effects'
    },
    backend: {
      title: 'Backend Systems',
      color: '#5dffd6',
      description: 'Creating robust server-side applications and APIs to power modern web apps'
    },
    design: {
      title: 'Digital Design',
      color: '#ff8f5d',
      description: 'Crafting beautiful, intuitive user experiences that delight and engage'
    }
  };

  const skills: Skill[] = [
    { name: 'HTML/CSS', level: 95, category: 'frontend', color: '#5d8cff' },
    { name: 'JavaScript', level: 90, category: 'frontend', color: '#5d8cff' },
    { name: 'React', level: 85, category: 'frontend', color: '#5d8cff' },
    { name: 'TypeScript', level: 80, category: 'frontend', color: '#5d8cff' },
    { name: 'Next.js', level: 88, category: 'frontend', color: '#5d8cff' },
    
    { name: 'GSAP', level: 92, category: 'animation', color: '#5dff8f' },
    { name: 'Three.js', level: 75, category: 'animation', color: '#5dff8f' },
    { name: 'WebGL', level: 65, category: 'animation', color: '#5dff8f' },
    { name: 'Framer Motion', level: 85, category: 'animation', color: '#5dff8f' }, 
    { name: 'Lottie', level: 70, category: 'animation', color: '#5dff8f' },
    
    { name: 'Node.js', level: 70, category: 'backend', color: '#5dffd6' },
    { name: 'Express', level: 65, category: 'backend', color: '#5dffd6' },
    { name: 'GraphQL', level: 60, category: 'backend', color: '#5dffd6' },
    { name: 'MongoDB', level: 55, category: 'backend', color: '#5dffd6' },
    
    { name: 'UI/UX Design', level: 85, category: 'design', color: '#ff8f5d' },
    { name: 'Figma', level: 80, category: 'design', color: '#ff8f5d' },
    { name: 'Motion Design', level: 78, category: 'design', color: '#ff8f5d' },
    { name: 'Prototyping', level: 82, category: 'design', color: '#ff8f5d' },
  ];

  const filteredSkills = skills.filter(skill => skill.category === activeCategory);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip, DrawSVGPlugin);

    const ctx = gsap.context(() => {
      // Initialize skill counters
      const counters = document.querySelectorAll('.skill-counter');
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              counter,
              { innerText: 0 },
              {
                innerText: target,
                duration: 1.5,
                ease: 'power2.out',
                snap: { innerText: 1 },
                modifiers: {
                  innerText: value => `${Math.round(parseFloat(value))}%`
                }
              }
            );
          },
          once: true
        });
      });

      // Create parallax layers
      gsap.utils.toArray<HTMLElement>('.parallax-layer').forEach(layer => {
        const depth = layer.getAttribute('data-depth') || '0.1';
        
        gsap.to(layer, {
          y: () => -parseFloat(depth) * 100 + '%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // SVG line animation
      const lineElements = document.querySelectorAll('.animate-line');
      lineElements.forEach(line => {
        gsap.fromTo(
          line,
          { width: 0 },
          {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: line,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Category tabs animation
      const tabs = gsap.utils.toArray<HTMLElement>('.category-tab');
      ScrollTrigger.create({
        trigger: '.category-tabs',
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            tabs, 
            { 
              y: 30, 
              opacity: 0, 
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.1,
              duration: 0.7,
              ease: 'back.out(1.7)'
            }
          );
        },
        once: true
      });

      // Initial skill cards reveal
      const cards = gsap.utils.toArray<HTMLElement>('.skill-card');
      gsap.fromTo(
        cards,
        { 
          opacity: 0, 
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: skillsWrapperRef.current,
            start: 'top 70%'
          }
        }
      );

      // Skill bar animations
      gsap.fromTo(
        '.skill-progress',
        { 
          width: 0 
        },
        {
          width: 'var(--progress)',
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: skillsWrapperRef.current,
            start: 'top 70%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    if (isAnimating || category === activeCategory) return;
    
    setIsAnimating(true);
    
    // Use GSAP's Flip plugin for smooth transitions
    const state = Flip.getState('.skill-card');
    setActiveCategory(category);
    
    // Allow time for DOM update
    setTimeout(() => {
      Flip.from(state, {
        targets: '.skill-card',
        duration: 0.7,
        ease: 'power2.inOut',
        stagger: 0.05,
        absolute: true,
        onComplete: () => setIsAnimating(false)
      });
    }, 10);
  };

  return (
    <SectionBackground
      section="skills"
      className="min-h-screen flex flex-col justify-center py-20"
      particleDensity={150}
    >
      <section id="skills" className="container mx-auto px-4">
        <h2 ref={headingRef} className="text-5xl md:text-7xl font-bold mb-24 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Technical Expertise</span>
        </h2>
        
        {/* Category tabs */}
        <div className="category-tabs max-w-4xl mx-auto mb-20">
          <div className="text-center mb-8">
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              My technical toolkit spans multiple disciplines, allowing me to create complete digital experiences from concept to execution.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className={`category-tab flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 border ${
                  activeCategory === key
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/5 hover:border-white/10 bg-white/5'
                }`}
                onClick={() => handleCategoryChange(key)}
              >
                <span className="h-0.5 w-16 mb-4 animate-line" style={{ 
                  background: category.color,
                  display: 'block'
                }}></span>
                <h3 className="font-medium">{category.title}</h3>
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-white/60">{categories[activeCategory].description}</p>
          </div>
        </div>
        
        {/* Skills grid */}
        <div ref={parentRef} className="relative mt-16">
          <div 
            ref={skillsWrapperRef}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {filteredSkills.map((skill, index) => (
              <div 
                key={`${activeCategory}-${index}`}
                className="skill-card border border-white/10 rounded-lg p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-lg">{skill.name}</h4>
                  <span 
                    className="skill-counter font-mono"
                    data-target={skill.level}
                  >
                    0%
                  </span>
                </div>
                
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="skill-progress h-full rounded-full transition-all duration-300"
                    style={{ 
                      '--progress': `${skill.level}%`,
                      background: `linear-gradient(to right, white, ${skill.color})` 
                    } as React.CSSProperties}
                  ></div>
                </div>
                
                <div className="mt-3 text-white/60 text-sm">
                  {skill.level < 60 && 'Competent'}
                  {skill.level >= 60 && skill.level < 75 && 'Proficient'}
                  {skill.level >= 75 && skill.level < 90 && 'Advanced'}
                  {skill.level >= 90 && 'Expert'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Learning section */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-6">Always Learning</h3>
          <div className="relative h-0.5 w-16 bg-white/20 mx-auto mb-6">
            <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
          </div>
          <p className="text-white/60">
            I believe in continuous learning and skill development. Currently exploring new techniques in WebGL shaders, 3D web experiences, and advanced animation concepts.
          </p>
      </div>
    </section>
    </SectionBackground>
  );
} 