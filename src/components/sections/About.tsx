'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useHeadingReveal } from '@/hooks/useAnimation';
import SplitType from 'split-type';
import DiscordProfileCard from '../common/DiscordProfileCard';
import SectionBackground from '../common/SectionBackground';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const headingRef = useHeadingReveal(0.3);

  // List of skills
  const skills = [
    'JavaScript', 'React', 'Next.js', 'TypeScript', 
    'GSAP', 'Three.js', 'Tailwind CSS', 'Node.js'
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MotionPathPlugin);

    const ctx = gsap.context(() => {
      // Horizontal scroll panel
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        gsap.to('.panel', {
          xPercent: -100 * (3 - 1), // 3 panels
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            start: "top 30%",
            end: () => "+=" + (window.innerWidth * 2), // 2 additional panels
            scrub: 1,
          }
        });
      });

      // Bio text animation
      const bioTexts = gsap.utils.toArray<HTMLElement>('.bio-text');
      bioTexts.forEach((text) => {
        const splitText = new SplitType(text, { types: ['chars', 'words'] });
        
        gsap.from(splitText.words, {
          opacity: 0,
          y: 30,
          rotationX: -90,
          stagger: 0.03,
            duration: 0.8,
            scrollTrigger: {
            trigger: text,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Skills animation - staggered reveal
      gsap.from('.skill-item', {
        opacity: 0,
        scale: 0,
        y: 40,
        stagger: {
          each: 0.1,
          from: "random"
        },
        duration: 0.7,
        ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: '.skills-container',
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      // Background layers parallax
      gsap.utils.toArray<HTMLElement>('.bg-layer').forEach(layer => {
        const speed = layer.dataset.speed || "0.1";
        gsap.to(layer, {
          y: () => -parseFloat(speed) * 100 + '%',
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
      
      // Timeline for initial reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
      
      tl.from(".about-year-line", {
        height: 0,
        duration: 1.5,
        ease: "power3.inOut"
      })
      .from(".about-year-dot", {
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=1.2")
      .from(".about-year-label", {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.4
      }, "-=1");

      // Image reveal animations
      gsap.utils.toArray<HTMLElement>('.reveal-image').forEach(image => {
        const imgWrapper = image.querySelector('.img-wrapper');
        const imgReveal = image.querySelector('.img-reveal');
        
        if (imgWrapper && imgReveal) {
          gsap.set(imgWrapper, { opacity: 0 });
          
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: image,
              start: "top 50%",
              toggleActions: "play none none reverse"
            }
          });
          
          tl.to(imgReveal, {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut"
          })
          .set(imgWrapper, { opacity: 1 })
          .to(imgReveal, {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.8,
            ease: "power2.inOut"
        });
      }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionBackground
      section="about"
      className="min-h-screen flex flex-col justify-center py-20"
    >
      <section id="about" className="container mx-auto px-4">
        <h2 
          ref={headingRef}
          className="text-5xl md:text-7xl font-bold mb-20 text-center"
        >
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Me</span>
        </h2>
        
        <div ref={horizontalRef} className="overflow-hidden relative min-h-[60vh]">
          <div className="flex items-stretch" ref={panelRef}>
            {/* Panel 1: Introduction */}
            <div className="panel min-w-[100vw] flex items-center">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold mb-6 bio-text">My Journey</h3>
                    <p className="text-xl leading-relaxed bio-text">
                      I'm a creative developer passionate about building immersive digital experiences 
                      that combine cutting-edge technology with stunning visuals.
                    </p>
                    <p className="text-white/80 leading-relaxed bio-text">
                      My journey began with a fascination for both design and code. Over the years, I've 
                      honed my skills in creating motion-rich interfaces that tell compelling stories 
                      and engage users on a deeper level.
                    </p>
                  </div>
                  
                  <div className="reveal-image relative aspect-square md:aspect-auto md:h-[400px] flex justify-center overflow-hidden rounded-xl">
                    <div className="img-wrapper w-full h-full">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-[80%] h-auto p-5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="text-sm font-mono text-white/70">
                            <div className="mb-2">{'// Creative developer with focus on'}</div>
                            <div className="mb-2">{'// interactive web experiences'}</div>
                            <div className="mb-6">{'function createExperience() {'}</div>
                            <div className="pl-4 mb-1">{'const skills = ['}</div>
                            <div className="pl-8 mb-1">{'\'UI/UX design\','}</div>
                            <div className="pl-8 mb-1">{'\'Animation\','}</div>
                            <div className="pl-8 mb-1">{'\'Interactive development\','}</div>
                            <div className="pl-8 mb-1">{'\'Creative coding\''}</div>
                            <div className="pl-4 mb-1">{'];'}</div>
                            <div className="pl-4 mb-1">{'return buildProject(skills);'}</div>
                            <div className="mb-6">{'}'}</div>
                            <div>{'// Passionate about crafting memorable'}</div>
                            <div>{'// digital experiences'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="img-reveal absolute inset-0 bg-white/20 transform origin-left scale-x-0"></div>
                  </div>
                </div>
            </div>
          </div>
          
            {/* Panel 2: Experience Timeline */}
            <div className="panel min-w-[100vw] flex items-center">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold mb-12 bio-text">Professional Timeline</h3>
                <div className="relative min-h-[400px] max-w-3xl mx-auto">
                  {/* Vertical timeline line */}
                  <div className="about-year-line absolute h-full w-0.5 bg-white/30 left-1/2 -translate-x-1/2"></div>
                  
                  {/* Timeline Points */}
                  <div className="relative">
                    <div className="mb-24 relative z-10">
                      <div className="about-year-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"></div>
                      <div className="sm:ml-[calc(50%+2rem)] sm:pl-8 relative">
                        <h4 className="about-year-label text-xl font-semibold">2023 - Present</h4>
                        <div className="mt-3 space-y-3">
                          <h5 className="text-lg font-medium">Senior Creative Developer</h5>
                          <p className="text-gray-300">
                            Leading the development of interactive web experiences with cutting-edge animations and 3D effects.
                            Specialized in GSAP, Three.js, and WebGL for maximum visual impact.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-24 relative z-10">
                      <div className="about-year-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"></div>
                      <div className="sm:mr-[calc(50%+2rem)] sm:pr-8 text-right relative">
                        <h4 className="about-year-label text-xl font-semibold">2021 - 2023</h4>
                        <div className="mt-3 space-y-3">
                          <h5 className="text-lg font-medium">Frontend Developer</h5>
                          <p className="text-gray-300">
                            Developed responsive and interactive user interfaces for web applications.
                            Focused on React, Next.js, and animation libraries to create seamless user experiences.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="about-year-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"></div>
                      <div className="sm:ml-[calc(50%+2rem)] sm:pl-8 relative">
                        <h4 className="about-year-label text-xl font-semibold">2019 - 2021</h4>
                        <div className="mt-3 space-y-3">
                          <h5 className="text-lg font-medium">UI/UX Designer</h5>
                          <p className="text-gray-300">
                            Created user-centered designs and prototypes for web and mobile applications.
                            Collaborated with development teams to implement pixel-perfect interfaces.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Panel 3: Skills */}
            <div className="panel min-w-[100vw] flex items-center">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold mb-12 bio-text">Skills & Expertise</h3>
                <div className="skills-container max-w-3xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                      <div 
                    key={index} 
                        className="skill-item group aspect-square bg-white/10 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border border-white/10 transition-all duration-300 hover:border-white/30 hover:bg-white/15"
                  >
                        <span className="font-medium text-lg">{skill}</span>
                      </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </SectionBackground>
  );
} 