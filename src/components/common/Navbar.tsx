'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create timeline for menu animations
    tl.current = gsap.timeline({ paused: true });

    if (menuRef.current) {
      // Setup menu animations
      tl.current
        .to('.menu-overlay', {
          duration: 0.8,
          clipPath: 'circle(150% at top right)',
          ease: 'power3.inOut',
        })
        .fromTo(
          '.menu-item',
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .fromTo(
          '.social-item',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power1.out',
          },
          '-=0.6'
        );
    }

    // Animate logo and nav on initial load
    gsap.fromTo(
      '.nav-container',
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)', delay: 0.2 }
    );
  }, []);

  // Toggle menu animation
  const toggleMenu = () => {
    if (isMenuOpen) {
      tl.current?.reverse();
    } else {
      tl.current?.play();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'Home', link: '#hero' },
    { name: 'About', link: '#about' },
    { name: 'Skills', link: '#skills' },
    { name: 'Projects', link: '#projects' },
    { name: 'Contact', link: '#contact' },
  ];

  const socialIcons = [
    { name: 'GitHub', link: 'https://github.com' },
    { name: 'LinkedIn', link: 'https://linkedin.com' },
    { name: 'Twitter', link: 'https://twitter.com' },
  ];

  return (
    <header className="fixed w-full z-50 px-6 py-4">
      <nav className="nav-container flex justify-between items-center">
        <div className="logo text-2xl font-bold tracking-tighter interactive">
          <Link href="#hero">Portfolio</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.link} 
              className="text-white/80 hover:text-white transition-colors duration-300 interactive"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="menu-toggle flex md:hidden flex-col gap-1.5 z-50 interactive"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div 
            className={`w-8 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></div>
          <div 
            className={`w-8 h-0.5 bg-white transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          ></div>
          <div 
            className={`w-8 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        ref={menuRef} 
        className="menu-overlay fixed inset-0 bg-black/95 z-40"
        style={{ clipPath: 'circle(0% at top right)' }}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <div className="flex flex-col items-center gap-8 mb-12">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.link} 
                className="menu-item text-2xl font-medium text-white/90 hover:text-white interactive"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex gap-6 mt-8">
            {socialIcons.map((social, index) => (
              <a 
                key={index} 
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-item text-white/70 hover:text-white transition-colors duration-300 interactive"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
} 