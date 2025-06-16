'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(TextPlugin)

    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline({ delay: 0.5 })

      // Animate title with typewriter effect
      if (titleRef.current) {
        tl.from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out"
        })
        .to(titleRef.current, {
          text: "R.ked",
          duration: 1.5,
          ease: "none"
        }, "-=0.5")
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.5")
      }

      // Animate CTA buttons
      if (ctaRef.current) {
        tl.from(ctaRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }, "-=0.3")
      }

      // Floating animation for decorative elements
      gsap.to('.float-slow', {
        y: -20,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      })

      gsap.to('.float-fast', {
        y: -15,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  const scrollToProjects = () => {
    const element = document.querySelector('#projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="float-slow absolute top-20 left-10 w-4 h-4 border border-cosmic-blue/30 rotate-45" />
        <div className="float-fast absolute top-40 right-20 w-6 h-6 border border-plasma-pink/40 rounded-full" />
        <div className="float-slow absolute bottom-40 left-20 w-3 h-3 bg-quantum-green/50 rotate-12" />
        <div className="float-fast absolute bottom-20 right-10 w-5 h-5 border border-solar-orange/30 rotate-45" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-nebula-purple/10 rounded-full blur-xl float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cosmic-blue/10 rounded-full blur-xl float-fast" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1
            ref={titleRef}
            className="font-orbitron text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-gradient"
            data-text="R.ked"
          >
            
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-8 font-light"
          >
            Creative Developer crafting{' '}
            <span className="holographic font-medium">immersive digital experiences</span>
            {' '}in the cosmic void
          </p>

          {/* Description */}
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transforming ideas into interactive realities through code, design, and a touch of cosmic magic.
            Welcome to my digital universe.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={scrollToProjects}
              className="btn-primary interactive flex items-center space-x-3 px-8 py-4 text-lg font-semibold"
            >
              <Icon icon="material-symbols:rocket-launch-outline" className="w-6 h-6" />
              <span>Explore Projects</span>
            </button>

            <button
              onClick={scrollToContact}
              className="btn-secondary interactive flex items-center space-x-3 px-8 py-4 text-lg font-semibold"
            >
              <Icon icon="material-symbols:mail-outline" className="w-6 h-6" />
              <span>Get In Touch</span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </section>
  )
} 