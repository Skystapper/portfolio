'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Icon } from '@iconify/react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bubbleTextRef = useRef<HTMLSpanElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);
  const [currentEffect, setCurrentEffect] = useState<string>('default');
  const [activeMagnetic, setActiveMagnetic] = useState<HTMLElement | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const elementRectRef = useRef<DOMRect | null>(null);
  const cursorMove = useRef<any>(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(TextPlugin);
    
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const bubble = bubbleRef.current;
    const bubbleText = bubbleTextRef.current;
    const magnetic = magneticRef.current;
    
    if (!cursor || !follower || !bubble || !bubbleText || !magnetic) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Linear interpolation for smooth movement
    const lerp = (current: number, target: number, factor: number) => 
      current * (1 - factor) + target * factor;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Optimized animation loop with reduced frequency for Canvas compatibility
    let animationId: number;
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps instead of max framerate

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= throttleDelay) {
      if (!activeElementRef.current) {
          // Default cursor movement with GPU acceleration
          cursorX = lerp(cursorX, mouseX, 0.15);
          cursorY = lerp(cursorY, mouseY, 0.15);
      } else {
        // Magnetic movement when over icon
        const rect = elementRectRef.current!;
        const centerX = rect.left + rect.width/2;
        const centerY = rect.top + rect.height/2;
        
          cursorX = lerp(cursorX, centerX, 0.25);
          cursorY = lerp(cursorY, centerY, 0.25);
        }

        // Smooth interpolation for follower
        followerX = lerp(followerX, mouseX, 0.08);
        followerY = lerp(followerY, mouseY, 0.08);

        // Use GPU-accelerated transforms and avoid interfering with Canvas
      if (!activeMagnetic) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        magnetic.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(0)`;
      }
      
      bubble.style.transform = `translate3d(${followerX}px, ${followerY - 60}px, 0) translate(-50%, -50%)`;
        
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    animationId = requestAnimationFrame(animate);

    // Simplified hover detection with passive listeners
    const handleHover = (e: MouseEvent) => {
      // Skip if over Canvas elements to avoid interference
      if ((e.target as HTMLElement).tagName === 'CANVAS') return;
      
      const target = e.target as HTMLElement;
      
      // Email provider buttons
      if (target.closest('.emailProviderButton')) {
        activateEmailEffect(target);
      } 
      // Banner area
      else if (target.closest('.banner__68edb')) {
        activateBannerEffect();
      }
      // Avatar element
      else if (target.closest('.avatar_d28e10')) {
        activateAvatarEffect();
      }
      // Discord card general area
      else if (target.closest('.discordProfileWrapper')) {
        activateDiscordDefaultEffect();
      }
      // Default state
      else {
        resetEffects();
      }
    };

    const activateEmailEffect = (target: HTMLElement) => {
      const buttonText = target.textContent?.trim() || "";
      let emailExample = "yourname@example.com";
      let providerColor = "#5865F2";
      
      // Set email example and color based on provider
      if (buttonText.toLowerCase().includes("gmail")) {
        emailExample = "yourname@gmail.com";
        providerColor = "#DB4437";
      } else if (buttonText.toLowerCase().includes("outlook")) {
        emailExample = "yourname@outlook.com";
        providerColor = "#0078D4";
      }
      
      setCurrentEffect('email');
      setActiveMagnetic(null);
      
      // Simple clean cursor
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: providerColor,
        opacity: 0.7,
        duration: 0.3
      });
      
      // Ring with provider color
      gsap.to(follower, { 
        scale: 1.5,
        borderColor: providerColor,
        borderWidth: '1px',
        backgroundColor: 'transparent',
        duration: 0.3
      });
      
      // Hide magnetic cursor
      gsap.to(magnetic, {
        scale: 0,
        duration: 0.3
      });
      
      // Show speech bubble with animated text
      gsap.to(bubble, {
        opacity: 1,
        scale: 1,
        backgroundColor: providerColor,
        duration: 0.3
      });
      
      // Animate text typing effect
      const animateText = gsap.timeline();
      animateText.to(bubbleText, {
        duration: 0.1,
        text: "",
        ease: "none"
      }).to(bubbleText, {
        duration: 0.8,
        text: emailExample,
        ease: "none"
      });
    };

    const activateBannerEffect = () => {
      setCurrentEffect('banner');
      setActiveMagnetic(null);
      
      // Hide bubble
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2
      });
      
      // Hide magnetic cursor
      gsap.to(magnetic, {
        scale: 0,
        duration: 0.3
      });
      
      // Simple dot cursor
      gsap.to(cursor, { 
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        scale: 1.5, 
        opacity: 1,
        backgroundColor: 'rgba(88, 101, 242, 0.5)',
        border: 'none',
        duration: 0.3
      });
      
      // Larger ring
      gsap.to(follower, { 
        scale: 2,
        opacity: 1,
        borderColor: '#5865F2',
        duration: 0.3
      });
    };

    const activateAvatarEffect = () => {
      setCurrentEffect('avatar');
      setActiveMagnetic(null);
      
      // Hide bubble
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2
      });
      
      // Hide magnetic cursor
      gsap.to(magnetic, {
        scale: 0,
        duration: 0.3
      });
      
      // Hollow cursor
      gsap.to(cursor, { 
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        scale: 1.2,
        opacity: 1,
        backgroundColor: 'transparent',
        border: '2px solid white',
        duration: 0.3
      });
      
      // Subtle ring
      gsap.to(follower, {
        scale: 2,
        opacity: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        duration: 0.3
      });
    };

    const activateDiscordDefaultEffect = () => {
      setCurrentEffect('discord');
      setActiveMagnetic(null);
      
      // Hide bubble
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2
      });
      
      // Hide magnetic cursor
      gsap.to(magnetic, {
        scale: 0,
        duration: 0.3
      });
      
      // Simple discord-colored cursor
      gsap.to(cursor, {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        scale: 1,
        opacity: 1,
        backgroundColor: 'rgba(88, 101, 242, 0.5)',
        border: 'none',
        duration: 0.3
      });
      
      // Simple ring
      gsap.to(follower, {
        scale: 1.5,
        opacity: 1,
        borderColor: '#5865F2',
        duration: 0.3
      });
    };

    const resetEffects = () => {
      setCurrentEffect('default');
      setActiveMagnetic(null);
      activeElementRef.current = null;
      elementRectRef.current = null;
      
      // Hide bubble
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2
      });
      
      // Hide magnetic cursor
      gsap.to(magnetic, {
        scale: 0,
        duration: 0.3
      });
      
      // Default cursor
      gsap.to(cursor, {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        scale: 1,
        opacity: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: 'none',
        duration: 0.3
      });
      
      // Default ring
      gsap.to(follower, {
        scale: 1,
        opacity: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: '1px',
        duration: 0.3
      });
    };

    document.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseleave', (e) => {
      if (e.target === activeMagnetic) {
        resetEffects();
      }
    }, true);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleHover);
      gsap.killTweensOf(cursor);
      gsap.killTweensOf(follower);
      gsap.killTweensOf(bubble);
      gsap.killTweensOf(bubbleText);
      gsap.killTweensOf(magnetic);
    };
  }, [activeMagnetic]);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" data-effect={currentEffect}></div>
      <div ref={followerRef} className="cursor-follow" data-effect={currentEffect}></div>
      <div ref={magneticRef} className="cursor-magnetic" data-active={!!activeMagnetic}></div>
      <div ref={bubbleRef} className="cursor-bubble" data-visible={currentEffect === 'email'}>
        <span ref={bubbleTextRef}></span>
      </div>
    </>
  );
} 