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
  // Initialize with true to show mobile first, then adjust on client
  const [isMobile, setIsMobile] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const draggableRef = useRef<any>(null)
  const lensRef = useRef<HTMLDivElement>(null) // For desktop sliding lens
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastClickTime = useRef<number>(0)
  
  // Enhanced state management to prevent race conditions
  const isUserDragging = useRef<boolean>(false)
  const isWheelAnimating = useRef<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const dragEndTimeout = useRef<NodeJS.Timeout | null>(null)
  const animationTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTime = useRef<number>(0)
  const currentActiveIndex = useRef<number>(0)
  const lastManualInteraction = useRef<number>(0)
  const isMobileDevice = useRef<boolean>(false)
  const pendingIndexUpdate = useRef<number | null>(null)
  const isProcessingUpdate = useRef<boolean>(false)
  
  // Calculate dimensions based on device type
  const mobileItemSize = 90
  const desktopItemWidth = 120
  
  // Function to cancel all pending operations
  const cancelPendingOperations = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
      scrollTimeout.current = null
    }
    if (dragEndTimeout.current) {
      clearTimeout(dragEndTimeout.current)
      dragEndTimeout.current = null
    }
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
      animationTimeout.current = null
    }
  }, [])
  
  // Atomic function to update active index - prevents race conditions
  const updateActiveIndex = useCallback((newIndex: number, source: 'scroll' | 'drag' | 'click') => {
    if (isProcessingUpdate.current) {
      pendingIndexUpdate.current = newIndex
      return false
    }
    
    if (newIndex === currentActiveIndex.current) {
      return false
    }
    
    // For scroll updates, respect manual interaction cooldown
    if (source === 'scroll') {
      const timeSinceManualInteraction = Date.now() - lastManualInteraction.current
      const cooldownTime = isMobileDevice.current ? 500 : 300
      
      if (timeSinceManualInteraction < cooldownTime) {
        return false
      }
      
      // Don't allow scroll updates if user is actively interacting
      if (isUserDragging.current || isWheelAnimating.current) {
        return false
      }
    }
    
    isProcessingUpdate.current = true
    currentActiveIndex.current = newIndex
    setActiveIndex(newIndex)
    
    // Process any pending update after a short delay
    setTimeout(() => {
      isProcessingUpdate.current = false
      if (pendingIndexUpdate.current !== null && pendingIndexUpdate.current !== currentActiveIndex.current) {
        const pending = pendingIndexUpdate.current
        pendingIndexUpdate.current = null
        updateActiveIndex(pending, 'scroll')
      }
    }, 50)
    
    return true
  }, [])
  
  // Function to play click sound with rate limiting
  const playClickSound = useCallback(() => {
    if (!audioRef.current) return
    
    const now = Date.now()
    if (now - lastClickTime.current > 100) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      lastClickTime.current = now
    }
  }, [])

  // Function to update mobile wheel item styles (optimized)
  const updateMobileItemStyles = useCallback(() => {
    if (!wheelRef.current || !containerRef.current || !isMobile) return
    
    const wheelPosition = gsap.getProperty(wheelRef.current, "x") as number
    const containerSize = containerRef.current.clientWidth
    const center = containerSize / 2
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      itemRefs.current.forEach((item, i) => {
        if (!item) return
        
        const itemCenter = (i * mobileItemSize) + wheelPosition + (mobileItemSize / 2)
        const distanceFromCenter = Math.abs(itemCenter - center)
        const maxDistance = mobileItemSize * 2.5
        
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
        // Simplified easing for better performance
        const easedDistance = normalizedDistance * normalizedDistance * (3 - 2 * normalizedDistance)
        const opacity = Math.max(0.3, 1 - (easedDistance * 0.7))
        const scale = Math.max(0.7, 1 - (easedDistance * 0.3))
        
        const isInCenter = distanceFromCenter < mobileItemSize / 3
        const isNearCenter = distanceFromCenter < mobileItemSize
        
        // Use direct style updates for better performance instead of GSAP
        item.style.opacity = opacity.toString()
        item.style.transform = `scale(${scale})`
        
        const span = item.querySelector('span')
        if (span) {
          span.style.fontWeight = isInCenter ? '600' : (isNearCenter ? '500' : '400')
          span.style.fontSize = isInCenter ? '16px' : (isNearCenter ? '14px' : '12px')
          span.style.color = isInCenter ? '#ffffff' : (isNearCenter ? '#ffffffb0' : '#ffffff60')
          span.style.transform = isInCenter ? 'scale(1.1)' : (isNearCenter ? 'scale(1.05)' : 'scale(0.9)')
        }
      })
    })
  }, [isMobile])

  // Function to move mobile wheel to specific index
  const moveMobileWheelToIndex = useCallback((index: number, animate: boolean = true) => {
    if (!wheelRef.current || !isMobile) return
    
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
      animationTimeout.current = null
    }
    
    const targetPosition = containerRef.current 
      ? (containerRef.current.clientWidth / 2) - (index * mobileItemSize) - (mobileItemSize / 2) 
      : 0
    
    if (animate) {
      isWheelAnimating.current = true
      gsap.to(wheelRef.current, {
        x: targetPosition,
        duration: 0.25,
        ease: "power2.out",
        onUpdate: updateMobileItemStyles,
        onComplete: () => {
          updateMobileItemStyles()
          isWheelAnimating.current = false
          
          animationTimeout.current = setTimeout(() => {
            isWheelAnimating.current = false
          }, 100)
        }
      })
    } else {
      gsap.set(wheelRef.current, { x: targetPosition })
      updateMobileItemStyles()
    }
  }, [updateMobileItemStyles, isMobile])

  // Function to move desktop lens to specific index
  const moveDesktopLensToIndex = useCallback((index: number) => {
    if (!lensRef.current || isMobile) return
    
    const targetPosition = index * desktopItemWidth
    
    gsap.to(lensRef.current, {
      x: targetPosition,
      duration: 0.4,
      ease: "power2.out"
    })
    
    // Update desktop item styles
    itemRefs.current.forEach((item, i) => {
      if (!item) return
      const span = item.querySelector('span')
      if (span) {
        if (i === index) {
          gsap.to(span, {
            color: '#ffffff',
            scale: 1.1,
            fontWeight: 600,
            duration: 0.3
          })
        } else {
          gsap.to(span, {
            color: '#ffffff80',
            scale: 1,
            fontWeight: 400,
            duration: 0.3
          })
        }
      }
    })
  }, [isMobile])

  // Enhanced scroll handler (performance optimized)
  const handleScrollDebounced = useCallback(() => {
    const now = Date.now()
    
    // Increase debounce time for better performance
    if (now - lastScrollTime.current < 32) return
    lastScrollTime.current = now
    
    setIsScrolled(window.scrollY > 50)
    
    if (isUserDragging.current || isWheelAnimating.current || isProcessingUpdate.current) return
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
      scrollTimeout.current = null
    }
    
    scrollTimeout.current = setTimeout(() => {
      if (isUserDragging.current || isWheelAnimating.current || isProcessingUpdate.current) return
      
      const sections = navItems.map(item => item.href.substring(1))
      let newActiveIndex = currentActiveIndex.current
      
      let closestDistance = Infinity
      const viewportCenter = window.innerHeight / 2
      const scrollThreshold = 50
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - viewportCenter)
          
          const isInViewport = rect.top < window.innerHeight - scrollThreshold && 
                              rect.bottom > scrollThreshold
          
          const visibilityThreshold = 0.2
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
          const visibilityRatio = visibleHeight / rect.height
          
          if (isInViewport && 
              visibilityRatio > visibilityThreshold &&
              distance < closestDistance) {
            closestDistance = distance
            newActiveIndex = i
          }
        }
      }
      
      const changeThreshold = window.innerHeight * 0.8
      
      if (newActiveIndex !== currentActiveIndex.current && 
          closestDistance < changeThreshold) {
        
        if (updateActiveIndex(newActiveIndex, 'scroll')) {
          if (isMobile) {
            moveMobileWheelToIndex(newActiveIndex, true)
          } else {
            moveDesktopLensToIndex(newActiveIndex)
          }
          playClickSound()
        }
      }
      
      scrollTimeout.current = null
    }, 50)
  }, [moveMobileWheelToIndex, moveDesktopLensToIndex, playClickSound, updateActiveIndex, isMobile])

  // Check for mobile device and handle resizes (debounced)
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout | null = null
    
    const checkScreenSize = () => {
      const width = window.innerWidth
      const mobile = width <= 768
      
      // Only update if actually changed to prevent unnecessary re-renders
      if (mobile !== isMobile) {
        setIsMobile(mobile)
        isMobileDevice.current = mobile || 'ontouchstart' in window
      }
      setIsHydrated(true)
    }
    
    const debouncedResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(checkScreenSize, 150) // Debounce resize events
    }
    
    // Set initial mobile state immediately to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      checkScreenSize()
    }
    
    window.addEventListener('resize', debouncedResize)
    
    return () => {
      window.removeEventListener('resize', debouncedResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    audioRef.current = new Audio('/click.mp3')
    audioRef.current.volume = 0.3
    
    gsap.registerPlugin(ScrollTrigger, Draggable)
    
    currentActiveIndex.current = activeIndex
    
    window.addEventListener('scroll', handleScrollDebounced, { passive: true })
    
    // Initialize positions
    if (isMobile) {
      // Initialize mobile wheel position
      if (wheelRef.current) {
        const initialPosition = containerRef.current 
          ? (containerRef.current.clientWidth / 2) - (activeIndex * mobileItemSize) - (mobileItemSize / 2)
          : 0
        gsap.set(wheelRef.current, { x: initialPosition })
        
        setTimeout(() => {
          updateMobileItemStyles()
        }, 50)
        
        // Setup mobile draggable
        if (draggableRef.current) {
          draggableRef.current.kill()
        }
        
        draggableRef.current = Draggable.create(wheelRef.current, {
          type: "x",
          bounds: {
            minX: -((navItems.length - 1) * mobileItemSize),
            maxX: (3 - 1) * mobileItemSize
          },
          inertia: true,
          edgeResistance: 0.85,
          overshootTolerance: 0.5,
          throwResistance: 0.65,
          snap: {
            x: (value: number) => {
              const increment = mobileItemSize
              return Math.round(value / increment) * increment
            }
          },
          onDragStart: function() {
            cancelPendingOperations()
            isUserDragging.current = true
            isWheelAnimating.current = false
            lastManualInteraction.current = Date.now()
            wheelRef.current?.classList.add('dragging')
          },
                     onDrag: function() {
             // Throttle style updates for better performance
             if (this.isDragging && Date.now() - (this.lastStyleUpdate || 0) > 16) {
               updateMobileItemStyles()
               this.lastStyleUpdate = Date.now()
               
               const position = this.x
               const containerWidth = containerRef.current?.clientWidth || 280;
               const centerPoint = containerWidth / 2;
               const itemCenters = navItems.map((_, i) => position + (i * mobileItemSize) + (mobileItemSize / 2));
               
               let minDistance = Infinity;
               let closestIndex = 0;
               
               itemCenters.forEach((itemCenter, i) => {
                 const distance = Math.abs(itemCenter - centerPoint);
                 if (distance < minDistance) {
                   minDistance = distance;
                   closestIndex = i;
                 }
               });
               
               const clampedIndex = Math.max(0, Math.min(navItems.length - 1, closestIndex))
               
               itemRefs.current.forEach((item, i) => {
                 if (!item) return
                 const span = item.querySelector('span')
                 if (span) {
                   if (i === clampedIndex) {
                     span.style.color = '#ffffff'
                   }
                 }
               })
             }
           },
          onThrowUpdate: function() {
            updateMobileItemStyles()
          },
          onDragEnd: function() {
            wheelRef.current?.classList.remove('dragging')
            
            if (!wheelRef.current) return
            
            const position = this.endX
            const containerWidth = containerRef.current?.clientWidth || 280;
            const centerPoint = containerWidth / 2;
            const itemCenters = navItems.map((_, i) => position + (i * mobileItemSize) + (mobileItemSize / 2));
            
            let minDistance = Infinity;
            let closestIndex = 0;
            
            itemCenters.forEach((itemCenter, i) => {
              const distance = Math.abs(itemCenter - centerPoint);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
              }
            });
            
            const clampedIndex = Math.max(0, Math.min(navItems.length - 1, closestIndex))
            
            if (updateActiveIndex(clampedIndex, 'drag')) {
              playClickSound()
              lastManualInteraction.current = Date.now()
              
              isWheelAnimating.current = true
              const snapPosition = containerRef.current 
                ? (containerRef.current.clientWidth / 2) - (clampedIndex * mobileItemSize) - (mobileItemSize / 2) 
                : 0
                
              gsap.to(wheelRef.current, {
                x: snapPosition,
                duration: 0.2,
                ease: "power2.out",
                onUpdate: updateMobileItemStyles,
                onComplete: () => {
                  updateMobileItemStyles()
                  isWheelAnimating.current = false
                }
              })
              
              const targetSection = document.querySelector(navItems[clampedIndex].href)
              if (targetSection) {
                targetSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start' 
                })
              }
            }
            
            if (dragEndTimeout.current) {
              clearTimeout(dragEndTimeout.current)
            }
            
            dragEndTimeout.current = setTimeout(() => {
              isUserDragging.current = false
              isWheelAnimating.current = false
              dragEndTimeout.current = null
            }, 200)
            
            updateMobileItemStyles()
          }
        })[0]
      }
    } else {
      // Initialize desktop lens position
      setTimeout(() => {
        moveDesktopLensToIndex(activeIndex)
      }, 100)
    }
    
    return () => {
      window.removeEventListener('scroll', handleScrollDebounced)
      cancelPendingOperations()
      if (draggableRef.current) {
        draggableRef.current.kill()
      }
    }
  }, [activeIndex, updateMobileItemStyles, moveMobileWheelToIndex, moveDesktopLensToIndex, handleScrollDebounced, cancelPendingOperations, updateActiveIndex, isMobile])
  
  const selectItem = useCallback((index: number) => {
    cancelPendingOperations()
    
    if (index === currentActiveIndex.current) return
    
    const clickedItem = itemRefs.current[index]
    if (clickedItem) {
      gsap.fromTo(clickedItem, 
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: "back.out(1.5)" }
      )
    }
    
    currentActiveIndex.current = index
    setActiveIndex(index)
    playClickSound()
    
    lastManualInteraction.current = Date.now()
    
    if (isMobile) {
      if (wheelRef.current) {
        gsap.killTweensOf(wheelRef.current)
        moveMobileWheelToIndex(index, true)
      }
      
      isUserDragging.current = true
      isWheelAnimating.current = true
      
      if (dragEndTimeout.current) {
        clearTimeout(dragEndTimeout.current)
      }
      
      dragEndTimeout.current = setTimeout(() => {
        isUserDragging.current = false
        isWheelAnimating.current = false
        dragEndTimeout.current = null
      }, 500)
    } else {
      moveDesktopLensToIndex(index)
    }
    
    const targetSection = document.querySelector(navItems[index].href)
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      })
    }
  }, [playClickSound, moveMobileWheelToIndex, moveDesktopLensToIndex, cancelPendingOperations, isMobile])
  
  // Don't render until hydrated to prevent layout shift
  if (!isHydrated) {
    return null
  }

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ${
        isMobile 
          ? 'bottom-4 left-1/2 transform -translate-x-1/2' 
          : 'top-4 left-1/2 transform -translate-x-1/2'
      }`}
      style={{
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
      {/* Inner frame */}
      <div
        className="relative"
        style={{
          background: isMobile 
            ? 'linear-gradient(to right, rgba(10, 10, 10, 0.9), rgba(15, 15, 15, 0.8), rgba(10, 10, 10, 0.9))'
            : 'linear-gradient(to right, rgba(10, 10, 10, 0.9), rgba(15, 15, 15, 0.8), rgba(10, 10, 10, 0.9))',
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
                 {/* Container */}
         <div 
           className={`${isScrolled ? 'bg-black/40' : 'bg-black/20'} 
             rounded-2xl overflow-hidden transition-all duration-300 border border-white/10 shadow-lg`}
           style={{
             boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
           }}
         >
          {isMobile ? (
            // Mobile horizontal wheel - original design
            <div 
              ref={containerRef}
              className="relative w-[280px] h-[50px] overflow-hidden"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                borderRadius: '12px'
              }}
            >
              {/* Mobile wheel items container */}
              <div 
                ref={wheelRef} 
                className="absolute flex flex-row items-center h-full"
                style={{ 
                  left: 0,
                  top: 0,
                  touchAction: 'none',
                  willChange: 'transform',
                }}
              >
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el }}
                    className="flex items-center justify-center select-none w-[90px] h-[50px]"
                    onClick={() => selectItem(index)}
                    style={{ 
                      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <span 
                      className="text-white whitespace-nowrap text-center text-sm px-2"
                      style={{ 
                        transition: 'all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform, opacity, color, font-size, font-weight',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        transformOrigin: 'center'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile center indicator */}
              <div 
                className="absolute w-[90px] h-full left-1/2 transform -translate-x-1/2 z-10 pointer-events-none flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(to bottom, rgba(60,60,60,0.2), rgba(80,80,80,0.3), rgba(60,60,60,0.2))',
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '1px 0 2px rgba(0,0,0,0.3), -1px 0 2px rgba(0,0,0,0.3)'
                }}
              >
                <div className="w-[60%] h-[1px] rounded-full absolute top-2"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(120,120,120,0.4), rgba(180,180,180,0.3))'
                  }}
                ></div>
                <div className="w-[60%] h-[1px] rounded-full absolute bottom-2"
                  style={{
                    background: 'linear-gradient(to top, rgba(120,120,120,0.4), rgba(180,180,180,0.3))'
                  }}
                ></div>
              </div>
              
              {/* Mobile edge gradients */}
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: `
                    linear-gradient(to right, 
                      rgba(0,0,0,0.9) 0%, 
                      rgba(0,0,0,0.7) 8%, 
                      rgba(0,0,0,0.4) 15%, 
                      rgba(0,0,0,0.1) 22%, 
                      transparent 30%, 
                      transparent 70%, 
                      rgba(0,0,0,0.1) 78%, 
                      rgba(0,0,0,0.4) 85%, 
                      rgba(0,0,0,0.7) 92%, 
                      rgba(0,0,0,0.9) 100%
                    )
                  `,
                  borderRadius: '12px'
                }}
              />
            </div>
          ) : (
            // Desktop horizontal sliding navbar - new design
            <div 
              ref={containerRef}
              className="relative h-[60px] overflow-hidden"
              style={{
                width: `${navItems.length * desktopItemWidth}px`,
                background: 'rgba(20, 20, 20, 0.95)',
                borderRadius: '12px'
              }}
            >
              {/* Desktop sliding lens indicator */}
              <div 
                ref={lensRef}
                className="absolute top-0 z-10 pointer-events-none h-[60px]"
                style={{
                  width: `${desktopItemWidth}px`,
                  background: 'linear-gradient(to bottom, rgba(60,60,60,0.3), rgba(80,80,80,0.4), rgba(60,60,60,0.3))',
                  borderLeft: '1px solid rgba(255,255,255,0.15)',
                  borderRight: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: `
                    inset 0 0 15px rgba(255,255,255,0.1),
                    0 0 20px rgba(88, 101, 242, 0.3),
                    1px 0 3px rgba(0,0,0,0.4), 
                    -1px 0 3px rgba(0,0,0,0.4)
                  `,
                  borderRadius: '8px'
                }}
              >
                <div className="w-[60%] h-[1px] rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(120,120,120,0.6), transparent)'
                  }}
                />
                <div className="w-[60%] h-[1px] rounded-full absolute bottom-2 left-1/2 transform -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(120,120,120,0.6), transparent)'
                  }}
                />
              </div>
              
              {/* Desktop navigation items */}
              <div className="flex h-full">
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el }}
                    className="flex items-center justify-center select-none cursor-pointer h-[60px]"
                    onClick={() => selectItem(index)}
                    style={{ 
                      width: `${desktopItemWidth}px`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span 
                      className="text-white whitespace-nowrap text-center text-base px-2"
                      style={{ 
                        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        color: index === activeIndex ? '#ffffff' : '#ffffff80',
                        fontWeight: index === activeIndex ? 600 : 400
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Desktop edge gradients */}
              <div 
                className="absolute inset-y-0 left-0 w-8 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(to right, rgba(20,20,20,0.95) 0%, transparent 100%)',
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px'
                }}
              />
              <div 
                className="absolute inset-y-0 right-0 w-8 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(to left, rgba(20,20,20,0.95) 0%, transparent 100%)',
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 