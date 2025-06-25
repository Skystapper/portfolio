import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

/**
 * Creates a text reveal animation for headings
 * Similar to animations on amanation.com and techredux.co
 */
export const headingReveal = (element: HTMLElement, delay = 0) => {
  const split = new SplitType(element, { types: ['chars'] });
  
  return gsap.from(split.chars, {
    opacity: 0,
    y: 100,
    rotateX: -90,
    stagger: 0.02,
    duration: 1,
    ease: 'power4.out',
    delay
  });
};

/**
 * Creates a horizontal text marquee effect
 * Similar to animations on dolsten.com
 */
export const createMarquee = (element: HTMLElement, speed = 20, reversed = false) => {
  const marqueeContent = element.querySelector('.marquee-content');
  if (!marqueeContent) return;
  
  const contentWidth = (marqueeContent as HTMLElement).offsetWidth;
  const direction = reversed ? 1 : -1;
  
  // Clone content for seamless loop
  const clone = marqueeContent.cloneNode(true);
  element.appendChild(clone);
  
  const anim = gsap.to([marqueeContent, clone], {
    x: direction * contentWidth,
    ease: 'none',
    repeat: -1,
    duration: contentWidth / speed,
    modifiers: {
      x: (x, target) => {
        // When original content moves out of view, reset to start
        if (direction === -1 && x <= -contentWidth) {
          x = 0;
        } else if (direction === 1 && x >= contentWidth) {
          x = 0;
        }
        return `${x}px`;
      }
    }
  });
  
  return anim;
};

/**
 * Creates a staggered fade-in animation for list items
 * Similar to animations on elegantseagulls.com
 */
export const staggeredFadeIn = (elements: HTMLElement[], stagger = 0.1, y = 40) => {
  return gsap.from(elements, {
    opacity: 0,
    y,
    stagger,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements[0].parentElement,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
};

/**
 * Creates a magnetic hover effect for buttons
 * Similar to animations on valentime.noomoagency.com
 */
export const createMagneticEffect = (element: HTMLElement, strength = 30) => {
  const bounds = element.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  
  const handleMouseMove = (e: MouseEvent) => {
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    
    gsap.to(element, {
      x: distX / strength,
      y: distY / strength,
      duration: 0.3,
      ease: 'power2.out'
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Creates a scroll-triggered 3D card tilt effect
 * Similar to animations on techredux.co
 */
export const createTiltEffect = (element: HTMLElement) => {
  let xTo = gsap.quickTo(element, 'rotationY', { duration: 0.6, ease: 'power3.out' });
  let yTo = gsap.quickTo(element, 'rotationX', { duration: 0.6, ease: 'power3.out' });
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
    const yPercent = (e.clientY - rect.top) / rect.height - 0.5;
    
    xTo(xPercent * -20); // Rotate Y axis
    yTo(yPercent * 20); // Rotate X axis
    
    gsap.to(element, {
      z: 50,
      duration: 0.4,
      ease: 'power2.out'
    });
  };
  
  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
    gsap.to(element, {
      z: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Creates a fullscreen overlay transition
 * Similar to animations on theastralfrontier.com
 */
export const createPageTransition = (trigger: HTMLElement, target: string) => {
  const overlay = document.createElement('div');
  overlay.classList.add('page-transition-overlay');
  document.body.appendChild(overlay);
  
  gsap.set(overlay, {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#000',
    scaleY: 0,
    transformOrigin: 'bottom'
  });
  
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Animate overlay in
    gsap.to(overlay, {
      scaleY: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = target;
      }
    });
  });
};

/**
 * Creates scroll-triggered parallax effect for images
 * Similar to animations on dolsten.com
 */
export const parallaxImages = (elements: HTMLElement[], speed = 0.5) => {
  elements.forEach(img => {
    gsap.fromTo(
      img,
      { y: -50 * speed },
      {
        y: 50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}; 