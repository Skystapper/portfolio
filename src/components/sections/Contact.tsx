'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconScene } from '../common/IconScene';

// Simple SVG icons
const EmailIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const SOCIAL_ICONS = [
  { 
    path: '/icons/Animated_Editable_Social_Media_Vol_1_Free/social-media-content-monitoring-1678897344015.glb', 
    name: 'Twitter' 
  },
  { 
    path: '/icons/Animated_Editable_Social_Media_Vol_2_Free/social-media-core-services-inbox-1682357450407.glb', 
    name: 'LinkedIn' 
  },
  { 
    path: '/icons/Animated_Editable_Social_Media_Vol_1_Free/social-media-analytic-1678735410433.glb', 
    name: 'GitHub' 
  },
  { 
    path: '/icons/Animated_Editable_Social_Media_Vol_2_Free/social-media-core-service-video-1679423759975.glb', 
    name: 'Email' 
  }
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.contact-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form staggered animation
      gsap.fromTo(
        '.form-element',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Contact info animation
      gsap.fromTo(
        '.contact-info-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Floating particles
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        const randomDelay = Math.random() * 2;
        
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
        });
        
        gsap.to(particle, {
          x: `+=${randomX}`,
          y: `+=${randomY}`,
          duration: 10 + Math.random() * 20,
          delay: randomDelay,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      
      // Show success animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setFormData({ name: '', email: '', message: '' });
            gsap.to('.success-message', {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'back.out(1.7)',
            });
          },
        });
      }
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="min-h-screen py-24 relative overflow-hidden"
    >
      {/* Animated particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className={`particle absolute w-${i % 4 + 2} h-${i % 4 + 2} rounded-full bg-white/10 pointer-events-none`}
        ></div>
      ))}
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="contact-title text-4xl md:text-5xl font-bold mb-16 text-center">
          Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">Touch</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <div>
            <form 
              ref={formRef} 
              className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl"
              onSubmit={handleSubmit}
            >
              <div className="mb-6 form-element">
                <label htmlFor="name" className="block mb-2 text-white/80">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              
              <div className="mb-6 form-element">
                <label htmlFor="email" className="block mb-2 text-white/80">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              
              <div className="mb-6 form-element">
                <label htmlFor="message" className="block mb-2 text-white/80">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="form-element w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-300"
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            
            {/* Success message */}
            <div className="success-message hidden opacity-0 transform translate-y-10 text-center mt-8 p-6 bg-green-500/20 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you soon!</p>
              <button 
                onClick={() => {
                  gsap.to('.success-message', {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                      document.querySelector('.success-message')?.classList.add('hidden');
                      gsap.to(formRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                      });
                      setFormStatus('idle');
                    },
                  });
                }}
                className="mt-4 px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-300"
              >
                Send Another Message
              </button>
            </div>
          </div>
          
          {/* Contact info */}
          <div className="contact-info space-y-8">
            <div className="contact-info-item flex items-start gap-4">
              <div className="w-16 h-16">
                <EmailIcon />
              </div>
              <div className="pt-3">
                <h3 className="text-xl font-medium mb-1">Email</h3>
                <p className="text-white/80">contact@example.com</p>
              </div>
            </div>
            
            <div className="contact-info-item flex items-start gap-4">
              <div className="w-16 h-16">
                <PhoneIcon />
              </div>
              <div className="pt-3">
                <h3 className="text-xl font-medium mb-1">Phone</h3>
                <p className="text-white/80">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-info-item flex items-start gap-4">
              <div className="w-16 h-16">
                <LocationIcon />
              </div>
              <div className="pt-3">
                <h3 className="text-xl font-medium mb-1">Location</h3>
                <p className="text-white/80">New York, NY</p>
              </div>
            </div>
            
            <div className="contact-info-item mt-12">
              <h3 className="text-xl font-medium mb-6">Connect with me</h3>
              <div className="flex flex-wrap gap-6 mt-4">
                {SOCIAL_ICONS.map((icon, index) => (
                  <a key={index} className="group relative block h-24 w-24" href="#">
                    <IconScene
                      iconPath={icon.path}
                      className="transition-transform duration-300 group-hover:scale-110"
                      scale={0.8}
                      floatIntensity={0.2}
                    />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                      {icon.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-24 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} Creative Portfolio. All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
} 