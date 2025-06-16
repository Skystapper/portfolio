'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Discord', href: '#discord' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

export default function WheelNavbar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const draggableRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastClickTime = useRef<number>(0)
  const isUserDragging = useRef<boolean>(false)
  const isWheelAnimating = useRef<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTime = useRef<number>(0)
  const currentActiveIndex = useRef<number>(0)
  
  // Calculate visible items (total visible items in the wheel)
  const visibleItems = 5
  const itemHeight = 40 // Height of each item in pixels
  const centerOffset = Math.floor(visibleItems / 2)
  
  // Function to play click sound with rate limiting
  const playClickSound = useCallback(() => {
    if (!audioRef.current) return
    
    const now = Date.now()
    // Prevent too many clicks in quick succession
    if (now - lastClickTime.current > 100) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      lastClickTime.current = now
    }
  }, [])

  // Function to update item styles based on position
  const updateItemStyles = useCallback(() => {
    if (!wheelRef.current || !containerRef.current) return
    
    const wheelY = gsap.getProperty(wheelRef.current, "y") as number
    const containerHeight = containerRef.current.clientHeight
    const centerY = containerHeight / 2
    
    itemRefs.current.forEach((item, i) => {
      if (!item) return
      
      // Calculate the actual position of this item relative to container center
      const itemCenterY = (i * itemHeight) + wheelY + (itemHeight / 2)
      const distanceFromCenter = Math.abs(itemCenterY - centerY)
      const maxDistance = itemHeight * 2.5 // Slightly larger for smoother transitions
      
      // Calculate opacity and scale based on distance from center
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
      
      // Use easing function for smoother transitions
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      
      const easedDistance = easeInOutCubic(normalizedDistance)
      const opacity = 1 - (easedDistance * 0.7)
      const scale = 1 - (easedDistance * 0.3) // Less scale change for smoother feel
      
      // Determine if this item is in the center (active) or close to it
      const isInCenter = distanceFromCenter < itemHeight / 3
      const isNearCenter = distanceFromCenter < itemHeight
      
      // Apply transformations directly with GSAP for smoother transitions
      gsap.to(item, {
        opacity: Math.max(0.3, opacity),
        scale: Math.max(0.7, scale),
        duration: 0.1, // Very short duration for responsive feel
        overwrite: true
      })
      
      // Update text styling
      const span = item.querySelector('span')
      if (span) {
        gsap.to(span, {
          fontWeight: isInCenter ? 600 : (isNearCenter ? 500 : 400),
          fontSize: isInCenter ? '16px' : (isNearCenter ? '15px' : '14px'),
          color: isInCenter ? '#ffffff' : (isNearCenter ? '#ffffffb0' : '#ffffff80'),
          duration: 0.1,
          overwrite: true
        })
      }
    })
  }, [itemHeight])

  // Function to move wheel to specific index
  const moveWheelToIndex = useCallback((index: number, animate: boolean = true) => {
    if (!wheelRef.current || isUserDragging.current) return
    
    const targetY = -index * itemHeight + (centerOffset * itemHeight)
    
    if (animate) {
      isWheelAnimating.current = true
      gsap.to(wheelRef.current, {
        y: targetY,
        duration: 0.25, // Reduced from 0.4s for faster animation
        ease: "power2.out",
        onUpdate: updateItemStyles,
        onComplete: () => {
          updateItemStyles()
          isWheelAnimating.current = false
        }
      })
    } else {
      gsap.set(wheelRef.current, { y: targetY })
      updateItemStyles()
    }
  }, [itemHeight, centerOffset, updateItemStyles])

  // Debounced scroll handler to prevent excessive updates
  const handleScrollDebounced = useCallback(() => {
    const now = Date.now()
    
    // Reduce frequency limit for more responsive feel
    if (now - lastScrollTime.current < 16) return // ~60fps instead of 50ms
    lastScrollTime.current = now
    
    setIsScrolled(window.scrollY > 50)
    
    // Don't update if user is dragging or wheel is animating
    if (isUserDragging.current || isWheelAnimating.current) return
    
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    
    // Much faster timeout for more responsive updates
    scrollTimeout.current = setTimeout(() => {
      if (isUserDragging.current || isWheelAnimating.current) return
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1))
      let newActiveIndex = currentActiveIndex.current
      
      // Enhanced scroll detection algorithm for faster response
      let closestDistance = Infinity
      const viewportCenter = window.innerHeight / 2
      const scrollThreshold = 50 // Reduced threshold for more sensitive detection
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - viewportCenter)
          
          // More aggressive section detection - trigger earlier
          if (rect.top < window.innerHeight - scrollThreshold && 
              rect.bottom > scrollThreshold && 
              distance < closestDistance) {
            closestDistance = distance
            newActiveIndex = i
          }
        }
      }
      
      // More responsive updates - smaller threshold for change detection
      if (newActiveIndex !== currentActiveIndex.current && closestDistance < window.innerHeight / 2) {
        currentActiveIndex.current = newActiveIndex
        setActiveIndex(newActiveIndex)
        moveWheelToIndex(newActiveIndex, true)
        playClickSound()
      }
    }, 30) // Reduced from 100ms to 30ms for much faster response
  }, [moveWheelToIndex, playClickSound])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Create audio element for click sound
    audioRef.current = new Audio('/click.mp3')
    audioRef.current.volume = 0.3
    
    gsap.registerPlugin(ScrollTrigger, Draggable)
    
    // Set initial active index
    currentActiveIndex.current = activeIndex
    
    window.addEventListener('scroll', handleScrollDebounced, { passive: true })
    
    // Initialize the wheel position
    if (wheelRef.current) {
      gsap.set(wheelRef.current, {
        y: centerOffset * itemHeight
      })
      
      // Initial styling update
      setTimeout(() => {
        updateItemStyles()
      }, 50)
      
      // Make the wheel draggable with mobile optimization
      draggableRef.current = Draggable.create(wheelRef.current, {
        type: "y",
        bounds: {
          minY: -((navItems.length - 1) * itemHeight) + (centerOffset * itemHeight),
          maxY: centerOffset * itemHeight
        },
        inertia: true,
        edgeResistance: 0.85,
        overshootTolerance: 0.5,
        throwResistance: 0.65,
        // Mobile touch optimizations
        allowNativeTouchScrolling: false,
        callbackScope: window,
        snap: {
          y: (y: number) => {
            const increment = itemHeight
            return Math.round(y / increment) * increment
          }
        },
        onDragStart: function() {
          isUserDragging.current = true
          isWheelAnimating.current = false
          // Clear any pending scroll timeouts
          if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current)
          }
          wheelRef.current?.classList.add('dragging')
        },
        onDrag: function() {
          updateItemStyles()
          
          // Preview the item that would be selected
          const y = this.y
          const index = Math.round((-y + (centerOffset * itemHeight)) / itemHeight)
          const clampedIndex = Math.max(0, Math.min(navItems.length - 1, index))
          
          // Update styles for the item that would be selected
          itemRefs.current.forEach((item, i) => {
            if (!item) return
            const span = item.querySelector('span')
            if (span) {
              if (i === clampedIndex) {
                span.style.color = '#ffffff'
              }
            }
          })
        },
        onThrowUpdate: function() {
          updateItemStyles()
        },
        onDragEnd: function() {
          // Remove dragging class
          wheelRef.current?.classList.remove('dragging')
          
          if (!wheelRef.current) return
          
          // Calculate which item is now in the center
          const y = this.endY
          const index = Math.round((-y + (centerOffset * itemHeight)) / itemHeight)
          const clampedIndex = Math.max(0, Math.min(navItems.length - 1, index))
          
          // Update the active index
          if (clampedIndex !== currentActiveIndex.current) {
            currentActiveIndex.current = clampedIndex
            setActiveIndex(clampedIndex)
            playClickSound()
            
            // Snap to exact position with animation
            isWheelAnimating.current = true
            gsap.to(wheelRef.current, {
              y: -clampedIndex * itemHeight + (centerOffset * itemHeight),
              duration: 0.2, // Faster snap animation
              ease: "power2.out",
              onUpdate: updateItemStyles,
              onComplete: () => {
                updateItemStyles()
                isWheelAnimating.current = false
              }
            })
            
            // Scroll to the corresponding section
            const targetSection = document.querySelector(navItems[clampedIndex].href)
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' })
            }
          }
          
          // Reduced delay for faster scroll trigger response
          setTimeout(() => {
            isUserDragging.current = false
          }, 250) // Reduced from 500ms to 250ms
          
          updateItemStyles()
        }
      })[0]
    }
    
    // Initial update of styles
    setTimeout(() => {
      updateItemStyles()
    }, 100)
    
    return () => {
      window.removeEventListener('scroll', handleScrollDebounced)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      if (draggableRef.current) {
        draggableRef.current.kill()
      }
    }
  }, [activeIndex, updateItemStyles, moveWheelToIndex, playClickSound, handleScrollDebounced])
  
  const selectItem = useCallback((index: number) => {
    if (index === currentActiveIndex.current || isUserDragging.current || isWheelAnimating.current) return
    
    // Provide immediate visual feedback
    const clickedItem = itemRefs.current[index]
    if (clickedItem) {
      // Quick pulse animation for feedback
      gsap.fromTo(clickedItem, 
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: "back.out(1.5)" }
      )
    }
    
    currentActiveIndex.current = index
    setActiveIndex(index)
    playClickSound()
    moveWheelToIndex(index, true)
    
    // Set user dragging to true briefly to prevent scroll triggers from interfering
    isUserDragging.current = true
    isWheelAnimating.current = true
    setTimeout(() => {
      isUserDragging.current = false
    }, 300) // Reduced from 600ms to 300ms for faster responsiveness
    
    // Scroll to the section
    const targetSection = document.querySelector(navItems[index].href)
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      })
    }
  }, [playClickSound, moveWheelToIndex])
  
  return (
    <div 
      className={`fixed top-1/2 right-4 z-50 transform -translate-y-1/2 transition-all duration-300`}
      style={{
        // Outer container with recessed/hollow effect
        background: 'radial-gradient(circle at center, rgba(15, 15, 15, 0.95) 30%, rgba(25, 25, 25, 0.9) 60%, rgba(40, 40, 40, 0.8) 100%)',
        borderRadius: '20px',
        padding: '8px',
        boxShadow: `
          inset 0 0 20px rgba(0, 0, 0, 0.8),
          inset 0 2px 4px rgba(0, 0, 0, 0.9),
          inset 0 -2px 4px rgba(0, 0, 0, 0.7),
          0 4px 20px rgba(0, 0, 0, 0.4),
          0 0 40px rgba(0, 0, 0, 0.2)
        `,
        border: '1px solid rgba(60, 60, 60, 0.6)',
      }}
    >
      {/* Inner recessed frame */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(145deg, rgba(10, 10, 10, 0.9), rgba(30, 30, 30, 0.8))',
          borderRadius: '16px',
          padding: '4px',
          boxShadow: `
            inset 0 2px 6px rgba(0, 0, 0, 0.9),
            inset 0 -1px 3px rgba(80, 80, 80, 0.3),
            0 1px 2px rgba(255, 255, 255, 0.05)
          `,
          border: '1px solid rgba(40, 40, 40, 0.8)',
        }}
      >
        {/* Actual wheel container */}
        <div 
          className={`${isScrolled ? 'backdrop-blur-md bg-black/30' : 'bg-black/20'} 
            rounded-2xl overflow-hidden transition-all duration-300 border border-white/10 shadow-lg`}
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            transform: 'perspective(1000px) rotateX(5deg)',
          }}
        >
          <div 
            ref={containerRef}
            className="relative w-40 h-[200px] overflow-hidden flex flex-col items-center justify-center"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center',
              backfaceVisibility: 'hidden',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
              background: 'linear-gradient(to bottom, rgba(40, 40, 40, 0.9), rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.9))',
              borderRadius: '12px'
            }}
          >
            {/* Left and right edge shadows to create 3D wheel effect */}
            <div className="absolute left-0 top-0 bottom-0 w-[10px] z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px'
              }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-[10px] z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px'
              }}
            />
            
            {/* Center indicator - visible selection area with enhanced 3D effect */}
            <div 
              className="absolute w-full h-[40px] z-10 pointer-events-none flex items-center justify-center"
              style={{ 
                top: '50%', 
                transform: 'translateY(-50%)',
                background: 'linear-gradient(to right, rgba(60,60,60,0.4), rgba(80,80,80,0.6), rgba(60,60,60,0.4))',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 -1px 3px rgba(0,0,0,0.5)'
              }}
            >
              {/* Enhanced side indicators */}
              <div className="w-1 h-[70%] rounded-full absolute left-2"
                style={{
                  background: 'linear-gradient(to right, rgba(120,120,120,0.7), rgba(180,180,180,0.5))'
                }}
              ></div>
              <div className="w-1 h-[70%] rounded-full absolute right-2"
                style={{
                  background: 'linear-gradient(to left, rgba(120,120,120,0.7), rgba(180,180,180,0.5))'
                }}
              ></div>
            </div>
            
            {/* Wheel container with enhanced 3D effect */}
            <div 
              ref={wheelRef} 
              className="absolute flex flex-col items-center cursor-grab active:cursor-grabbing"
              style={{ 
                left: '50%', 
                transform: 'translateX(-50%)',
                top: 0,
                touchAction: 'none',
                willChange: 'transform',
                transformStyle: 'preserve-3d',
              }}
            >
              {navItems.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => { itemRefs.current[index] = el }}
                  className="h-[40px] w-full flex items-center justify-center select-none"
                  onClick={() => selectItem(index)}
                  style={{ 
                    transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <span 
                    className="text-white px-6 py-2 whitespace-nowrap text-center"
                    style={{ 
                      transition: 'all 0.15s ease-out',
                      willChange: 'transform, opacity, color, font-size',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Enhanced gradient overlays with more pronounced 3D effect */}
            <div className="absolute top-0 left-0 right-0 h-[80px] pointer-events-none" 
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px'
              }}
            />
            
            {/* Enhanced divider lines with subtle glow */}
            <div className="absolute top-[80px] left-[5px] right-[5px] h-[1px] pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
                boxShadow: '0 0 3px rgba(255,255,255,0.2)'
              }}
            />
            <div className="absolute bottom-[80px] left-[5px] right-[5px] h-[1px] pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
                boxShadow: '0 0 3px rgba(255,255,255,0.2)'
              }}
            />
            
            {/* Subtle reflective highlight at the top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                opacity: 0.5
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 