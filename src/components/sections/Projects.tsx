'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';
import { IconScene } from '../common/IconScene';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  color: string;
  link: string;
  category: string;
}

const ProjectIcon = ({ type }: { type: string }) => {
  const ICON_MAP = {
    ecommerce: '/icons/Animated_Editable_Online_Shopping_Free/shopping-on-mobile-1678135375206.glb',
    ai: '/icons/Animated_Editable_Robot_Icon_Pack/robot-head-3d-animated-icon-467093345245.glb',
    security: '/icons/security-lock-animated-3d-icon-396548429996.glb',
    default: '/icons/file-setting-3d-animated-icon-611806266477.glb'
  };

  return (
    <div className="absolute right-4 bottom-4 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity">
      <IconScene
        iconPath={ICON_MAP[type as keyof typeof ICON_MAP] || ICON_MAP.default}
        scale={0.5}
        spinAxis="x"
      />
    </div>
  );
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Immersive 3D Experience',
      description: 'An interactive 3D web experience built with Three.js and GSAP. Features animated camera movements and custom shaders for a unique visual effect.',
      tags: ['Three.js', 'GSAP', 'WebGL', 'JavaScript'],
      color: '#8b5cf6',
      link: '#',
      category: 'default',
    },
    {
      id: 2,
      title: 'Animated E-commerce Platform',
      description: 'A modern e-commerce platform with fluid page transitions, scroll-based animations, and interactive product showcases.',
      tags: ['Next.js', 'GSAP', 'React', 'Tailwind CSS'],
      color: '#ec4899',
      link: '#',
      category: 'ecommerce',
    },
    {
      id: 3,
      title: 'Interactive Data Visualization',
      description: 'Dynamic data visualization dashboard that brings statistics to life with animated charts, graphs, and interactive elements.',
      tags: ['D3.js', 'GSAP', 'SVG', 'React'],
      color: '#0ea5e9',
      link: '#',
      category: 'default',
    },
    {
      id: 4,
      title: 'Digital Agency Website',
      description: 'Award-winning agency website featuring custom cursor interactions, parallax scrolling, and creative page transitions.',
      tags: ['GSAP', 'JavaScript', 'HTML/CSS', 'Locomotive Scroll'],
      color: '#10b981',
      link: '#',
      category: 'default',
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.projects-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.projects-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Project cards animation - staggered entry
      gsap.fromTo(
        '.project-card',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Project visual elements animation
      document.querySelectorAll('.project-visual').forEach((element, index) => {
        // Floating animation
        gsap.to(element, {
          y: -10 + (index % 2 ? 5 : -5),
          rotation: index % 2 ? 5 : -5,
          duration: 2 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      });

      // Horizontal scroll for projects section on desktop
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        gsap.to('.projects-slider', {
          x: () => {
            const totalWidth = projects.length * 520; // Width of each card + gap
            const availableWidth = window.innerWidth;
            return -(totalWidth - availableWidth + 80);
          },
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 20%',
            end: () => `+=${projects.length * 600}`,
            pin: true,
            scrub: 1,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length]);

  // Animation for project card hover
  const handleProjectHover = (id: number) => {
    setActiveProject(id);
    gsap.to(`.project-${id} .project-content`, {
      opacity: 1,
      y: 0,
      duration: 0.3,
    });
    gsap.to(`.project-${id} .project-visual`, {
      scale: 1.1,
      duration: 0.3,
    });
  };

  const handleProjectLeave = (id: number) => {
    setActiveProject(null);
    gsap.to(`.project-${id} .project-content`, {
      opacity: 0,
      y: 20,
      duration: 0.3,
    });
    gsap.to(`.project-${id} .project-visual`, {
      scale: 1,
      duration: 0.3,
    });
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef} 
      className="relative py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 mb-12">
        <h2 className="projects-title text-4xl md:text-5xl font-bold text-center">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Projects</span>
        </h2>
      </div>
      
      <div className="overflow-visible">
      <div 
        ref={projectsRef} 
          className="projects-slider flex flex-col md:flex-row gap-6 px-4 md:px-20 mt-20 md:min-w-max"
      >
          {projects.map((project) => {
            return (
          <div 
            key={project.id}
                className={`project-card project-${project.id} w-full md:w-[480px] h-[500px] flex-shrink-0 
                          relative bg-white/5 rounded-2xl backdrop-blur-sm overflow-hidden border border-white/10
                          cursor-pointer transition-all duration-300`}
            onMouseEnter={() => handleProjectHover(project.id)}
            onMouseLeave={() => handleProjectLeave(project.id)}
          >
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-20" 
                  style={{ background: `radial-gradient(circle at center, ${project.color}, transparent 70%)` }}
                ></div>
                
                {/* Visual element - instead of 3D model */}
                <div className="project-visual absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-60 h-60 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${project.color}40, ${project.color}20 50%, transparent)` }}>
                    <div className="absolute inset-10 rounded-full blur-xl" style={{ background: `radial-gradient(circle at 40% 40%, ${project.color}30, transparent 70%)` }}></div>
                    {project.id % 2 === 0 ? (
                      <div className="absolute inset-16 rounded-lg border border-white/20" style={{ transform: 'rotate(15deg)' }}></div>
                    ) : (
                      <div className="absolute inset-20 rounded-full border border-white/20"></div>
                    )}
                  </div>
            </div>
            
                {/* Content overlay - initially hidden */}
                <div className="project-content absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 transform translate-y-20 z-20">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-white/80 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-white/10 rounded-full text-xs"
                        style={{ background: `${project.color}30` }}
                      >
                    {tag}
                  </span>
                ))}
              </div>
              
              <a 
                href={project.link} 
                className="inline-block self-start px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                View Project
              </a>
            </div>
            <ProjectIcon type={project.category} />
          </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center mt-16">
        <a 
          href="#" 
          className="px-8 py-3 border border-white/30 hover:border-white/80 rounded-full transition-colors duration-300"
        >
          View All Projects
        </a>
      </div>
    </section>
  );
} 