'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackground from '../common/SectionBackground';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  features: string[];
  color: string;
  links: {
    live: string;
    github: string;
  };
  image: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Immersive 3D Experience',
      description: 'An interactive 3D web experience built with Three.js and GSAP.',
      longDescription: 'An interactive 3D web experience that pushes the boundaries of what\'s possible in the browser. Built with Three.js and GSAP, this project features advanced camera movements, custom shaders, and particle systems that create a truly immersive digital environment. The experience adapts to user interactions and creates a unique journey through 3D space.',
      tags: ['Three.js', 'GSAP', 'WebGL', 'JavaScript'],
      features: ['Real-time 3D rendering', 'Custom shader effects', 'Interactive camera controls', 'Particle systems', 'Performance optimization'],
      color: '#8b5cf6',
      links: {
        live: '#',
        github: '#',
      },
      image: '/api/placeholder/600/400',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Animated E-commerce Platform',
      description: 'A modern e-commerce platform with fluid animations and interactive showcases.',
      longDescription: 'A cutting-edge e-commerce platform that combines seamless user experience with stunning visual design. Features fluid page transitions powered by GSAP, interactive product showcases, and a responsive design that works flawlessly across all devices. The platform includes advanced filtering, smooth cart animations, and optimized performance.',
      tags: ['Next.js', 'GSAP', 'React', 'Tailwind CSS'],
      features: ['Smooth page transitions', 'Interactive product gallery', 'Advanced filtering system', 'Optimized cart experience', 'Mobile-first design'],
      color: '#ec4899',
      links: {
        live: '#',
        github: '#',
      },
      image: '/api/placeholder/600/400',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Interactive Data Visualization',
      description: 'Dynamic dashboard that brings statistics to life with animated charts.',
      longDescription: 'A comprehensive data visualization dashboard that transforms complex datasets into engaging, interactive experiences. Built with D3.js and React, it features real-time data updates, customizable chart types, and smooth animations that help users understand trends and patterns. The dashboard supports multiple data sources and export formats.',
      tags: ['D3.js', 'GSAP', 'SVG', 'React'],
      features: ['Real-time data updates', 'Multiple chart types', 'Interactive filtering', 'Data export functionality', 'Responsive design'],
      color: '#0ea5e9',
      links: {
        live: '#',
        github: '#',
    },
      image: '/api/placeholder/600/400',
      status: 'completed',
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

      // Parallax effect for project images
      document.querySelectorAll('.project-image').forEach((element) => {
        gsap.to(element, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
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
    <SectionBackground
      section="projects"
      className="py-20"
      particleDensity={80}
      gradientColors={["transparent", "black/40", "black/70"]}
    >
      <section id="projects" ref={sectionRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="projects-title text-4xl md:text-5xl font-bold mb-6">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Projects</span>
        </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              A showcase of my latest work, from interactive 3D experiences to modern web applications.
            </p>
      </div>
      
          {/* Projects Grid */}
          <div ref={projectsRef} className="space-y-32">
            {projects.map((project, index) => (
          <div 
            key={project.id}
                className={`project-card project-${project.id} grid lg:grid-cols-2 gap-12 items-center
                          ${index % 2 === 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-2'}`}
              >
                {/* Project Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="project-image relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="aspect-[4/3] relative">
                <div 
                        className="absolute inset-0 opacity-30" 
                  style={{ background: `radial-gradient(circle at center, ${project.color}, transparent 70%)` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/50 text-6xl">
                          {project.id === 1 && '🌌'}
                          {project.id === 2 && '🛒'}
                          {project.id === 3 && '📊'}
                        </div>
                      </div>
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                            project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-blue-500/20 text-blue-400'}`}>
                          {project.status === 'completed' ? 'Completed' : 
                           project.status === 'in-progress' ? 'In Progress' : 'Planned'}
                        </span>
                      </div>
                    </div>
                  </div>
            </div>
            
                {/* Project Details */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <h3 className="text-3xl font-bold mb-3">{project.title}</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">{project.longDescription}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-white/90">Key Features:</h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-white/70">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: project.color }}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-white/90">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                      <span 
                          key={tagIndex} 
                          className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/80 border border-white/20"
                      >
                    {tag}
                  </span>
                ))}
                    </div>
              </div>
              
                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <a 
                      href={project.links.live} 
                      className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-center"
                    >
                      View Live Demo
                    </a>
                    <a 
                      href={project.links.github} 
                      className="flex-1 md:flex-none px-8 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-center"
              >
                      View Code
              </a>
            </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
    </SectionBackground>
  );
} 