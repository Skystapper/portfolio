'use client'

import { Icon } from '@iconify/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const skills = [
  { name: 'Frontend Development', icon: 'material-symbols:code', level: 95 },
  { name: 'UI/UX Design', icon: 'material-symbols:palette-outline', level: 88 },
  { name: 'Animation & GSAP', icon: 'material-symbols:animation', level: 92 },
  { name: 'Three.js & WebGL', icon: 'material-symbols:3d-rotation', level: 85 },
]

const experiences = [
  {
    year: '2024',
    title: 'Senior Frontend Developer',
    company: 'Cosmic Digital',
    description: 'Leading development of immersive web experiences using cutting-edge technologies.'
  },
  {
    year: '2023',
    title: 'Creative Developer',
    company: 'Stellar Studios',
    description: 'Specialized in interactive animations and 3D web applications.'
  },
  {
    year: '2022',
    title: 'Frontend Developer',
    company: 'Nebula Tech',
    description: 'Built responsive web applications with focus on performance and user experience.'
  }
]

export default function AboutSection() {
  const glassBoxRef = useRef<HTMLDivElement>(null)
  const glowRef1 = useRef<HTMLDivElement>(null)
  const glowRef2 = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      // Initial reveal animation for the glass box
      gsap.fromTo(glassBoxRef.current,
        { 
          opacity: 0,
          y: 50,
          backdropFilter: 'blur(0px)',
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          backdropFilter: 'blur(12px)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: glassBoxRef.current,
            start: 'top 80%',
          }
        }
      )
      
      // Animate glow effects
      if (glowRef1.current && glowRef2.current) {
        gsap.to(glowRef1.current, {
          x: '100%',
          y: '100%',
          opacity: 0.3,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        
        gsap.to(glowRef2.current, {
          x: '-100%',
          y: '-100%',
          opacity: 0.2,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5
        })
      }
      
      // Animate skill bars
      gsap.fromTo('.skill-bar', 
        { width: 0 },
        {
          width: (i, el) => el.dataset.level || '0%',
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.skills-container',
            start: 'top 70%',
          }
        }
      )
      
      // Animate timeline items
      gsap.from('.timeline-item', {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 70%',
        }
      })
      
      // Subtle parallax effect on mouse move
      if (sectionRef.current && glassBoxRef.current) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e
          const { left, top, width, height } = sectionRef.current!.getBoundingClientRect()
          
          const x = (clientX - left) / width - 0.5
          const y = (clientY - top) / height - 0.5
          
          gsap.to(glassBoxRef.current, {
            rotateY: x * 3, // subtle rotation
            rotateX: -y * 3, // subtle rotation
            translateZ: 0,
            duration: 0.8,
            ease: 'power1.out'
          })
          
          // Move glow effects for extra depth
          gsap.to([glowRef1.current, glowRef2.current], {
            x: x * 30,
            y: y * 30,
            duration: 1.5,
            ease: 'power1.out'
          })
        }
        
        sectionRef.current.addEventListener('mousemove', handleMouseMove)
        
        return () => {
          sectionRef.current?.removeEventListener('mousemove', handleMouseMove)
        }
      }
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="py-20 relative overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              About Me
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              A passionate developer exploring the infinite possibilities of the digital cosmos
            </p>
          </div>
          
          {/* Single Glass Box Container */}
          <div 
            ref={glassBoxRef}
            className="relative backdrop-blur-md bg-white/5 rounded-2xl border border-white/20 overflow-hidden shadow-lg mb-16 transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Background glow effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-blue/20 via-plasma-pink/10 to-quantum-green/20 rounded-3xl blur-xl -z-10 opacity-50"></div>
            <div ref={glowRef1} className="absolute w-1/3 h-1/3 rounded-full bg-cosmic-blue/10 blur-2xl pointer-events-none -left-10 -top-10"></div>
            <div ref={glowRef2} className="absolute w-1/4 h-1/4 rounded-full bg-plasma-pink/10 blur-2xl pointer-events-none -right-10 -bottom-10"></div>
            
            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left Column - Story */}
                <div className="fade-in-left">
                  <h3 className="font-orbitron text-2xl font-bold mb-6 text-cosmic-blue">
                    My Journey Through the Digital Universe
                  </h3>
                  
                  <div className="space-y-4 text-white/80 leading-relaxed">
                    <p>
                      Since 2019, I've been navigating the vast expanse of web development, 
                      transforming caffeine into code and ideas into interactive experiences. 
                      My journey began with curiosity and has evolved into a passion for 
                      creating digital worlds that captivate and inspire.
                    </p>
                    
                    <p>
                      I specialize in crafting immersive web experiences that blur the line 
                      between reality and digital art. From complex animations to interactive 
                      3D environments, I believe every project is an opportunity to push the 
                      boundaries of what's possible on the web.
                    </p>
                    
                    <p>
                      When I'm not debugging the universe one line at a time, you'll find me 
                      exploring new technologies, contributing to open-source projects, or 
                      contemplating the infinite possibilities of creative coding.
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="mt-8 skills-container">
                    <h4 className="font-orbitron text-lg font-semibold mb-4 text-plasma-pink">
                      Core Abilities
                    </h4>
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon icon={skill.icon} className="w-5 h-5 text-cosmic-blue" />
                              <span className="text-white/90">{skill.name}</span>
                            </div>
                            <span className="text-quantum-green font-mono text-sm">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cosmic-blue to-plasma-pink h-2 rounded-full skill-bar"
                              data-level={`${skill.level}%`}
                              style={{ width: 0 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Experience Timeline */}
                <div className="fade-in-right">
                  <h3 className="font-orbitron text-2xl font-bold mb-8 text-center text-solar-orange">
                    Experience Timeline
                  </h3>
                  
                  <div className="relative timeline-container">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmic-blue via-plasma-pink to-quantum-green" />
                    
                    {/* Timeline Items */}
                    <div className="space-y-8">
                      {experiences.map((exp, index) => (
                        <div key={index} className="relative flex items-start space-x-6 timeline-item">
                          {/* Timeline Dot */}
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-cosmic-blue to-plasma-pink rounded-full flex items-center justify-center shadow-cosmic">
                            <span className="font-orbitron font-bold text-white">
                              {exp.year}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4">
                            <h4 className="font-orbitron text-lg font-bold text-white mb-1">
                              {exp.title}
                            </h4>
                            <p className="text-cosmic-blue font-medium mb-3">
                              {exp.company}
                            </p>
                            <p className="text-white/70 text-sm leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 border border-cosmic-blue/20 rounded-full float" />
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-plasma-pink/10 rounded-full blur-xl float" />
    </section>
  )
} 