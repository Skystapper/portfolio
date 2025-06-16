'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface GlassMorphismProps {
  children: React.ReactNode
  className?: string
}

export default function GlassMorphism({ children, className = '' }: GlassMorphismProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const glow1Ref = useRef<HTMLDivElement>(null)
  const glow2Ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger)
    
    if (!containerRef.current) return
    
    // Create the scroll-based animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        toggleActions: 'play none none reverse',
      }
    })
    
    // Backlift effect on scroll
    tl.fromTo(glassRef.current, 
      { 
        y: 20, 
        opacity: 0.7,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
      },
      { 
        y: 0, 
        opacity: 1,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(12px)',
        duration: 1
      }
    )
    
    // Border highlight animation
    tl.fromTo(borderRef.current,
      {
        opacity: 0.3,
        boxShadow: '0 0 0 rgba(123, 0, 255, 0)'
      },
      {
        opacity: 1,
        boxShadow: '0 0 15px rgba(123, 0, 255, 0.5)',
        duration: 1
      },
      '<'
    )
    
    // Moving highlight effect
    tl.fromTo(highlightRef.current,
      {
        opacity: 0,
        top: '100%',
        left: '0%'
      },
      {
        opacity: 0.4,
        top: '0%',
        left: '100%',
        duration: 2,
        ease: 'power1.inOut'
      },
      '<'
    )
    
    // Animated glow effects
    if (glow1Ref.current && glow2Ref.current) {
      // First glow
      gsap.to(glow1Ref.current, {
        x: '100%',
        y: '100%',
        opacity: 0.3,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      
      // Second glow (opposite direction)
      gsap.to(glow2Ref.current, {
        x: '-100%',
        y: '-100%',
        opacity: 0.2,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      })
    }
    
    // Mouse move effect for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !glassRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      // Calculate movement percentage (-5 to 5 pixels)
      const moveX = ((mouseX / rect.width) - 0.5) * 10
      const moveY = ((mouseY / rect.height) - 0.5) * 10
      
      // Apply subtle movement to create parallax effect
      gsap.to(glassRef.current, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power1.out'
      })
      
      // Move border in opposite direction for depth effect
      gsap.to(borderRef.current, {
        x: -moveX * 0.5,
        y: -moveY * 0.5,
        duration: 0.5,
        ease: 'power1.out'
      })
    }
    
    // Add mouse move listener
    containerRef.current.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      // Clean up all event listeners and animations
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main glass container */}
      <div 
        ref={glassRef}
        className="relative backdrop-blur-md bg-white/5 rounded-2xl overflow-hidden z-10 transition-all duration-300"
      >
        {/* Border effect with glow */}
        <div 
          ref={borderRef}
          className="absolute inset-0 rounded-2xl border border-white/20 z-0"
          style={{
            background: 'linear-gradient(225deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)',
          }}
        ></div>
        
        {/* Moving highlight effect */}
        <div 
          ref={highlightRef}
          className="absolute w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none z-0"
        ></div>
        
        {/* Animated glow effects */}
        <div 
          ref={glow1Ref}
          className="absolute w-1/3 h-1/3 rounded-full bg-cosmic-blue/10 blur-2xl pointer-events-none z-0 -left-10 -top-10"
        ></div>
        
        <div 
          ref={glow2Ref}
          className="absolute w-1/4 h-1/4 rounded-full bg-plasma-pink/10 blur-2xl pointer-events-none z-0 -right-10 -bottom-10"
        ></div>
        
        {/* Content */}
        <div className="relative z-20 p-8">
          {children}
        </div>
      </div>
      
      {/* Backlift shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-blue/20 via-plasma-pink/10 to-quantum-green/20 rounded-3xl blur-xl -z-10 opacity-50 transform translate-y-4"></div>
    </div>
  )
} 