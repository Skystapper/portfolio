'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      })
    }

    // Smooth follower animation
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1

      gsap.set(follower, {
        x: followerX,
        y: followerY
      })

      requestAnimationFrame(animateFollower)
    }

    // Hover effects
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      
      // Check if target is an Element and has the matches method
      if (target && typeof target.matches === 'function') {
        if (target.matches('a, button, .interactive')) {
          cursor.setAttribute('data-effect', 'hover')
          follower.setAttribute('data-effect', 'hover')
        }
        
        if (target.matches('.social-icon')) {
          const platform = target.getAttribute('data-platform')
          if (platform) {
            cursor.setAttribute('data-effect', 'social-hover')
            follower.setAttribute('data-effect', `social-${platform}`)
          }
        }
      }
    }

    const handleMouseLeave = () => {
      cursor.setAttribute('data-effect', 'default')
      follower.setAttribute('data-effect', 'default')
    }

    const handleMouseDown = () => {
      cursor.setAttribute('data-effect', 'click')
      follower.setAttribute('data-effect', 'click')
    }

    const handleMouseUp = () => {
      cursor.setAttribute('data-effect', 'default')
      follower.setAttribute('data-effect', 'default')
    }

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Start follower animation
    animateFollower()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor fixed pointer-events-none z-[9999] w-2 h-2 bg-white rounded-full mix-blend-difference"
        data-effect="default"
      />
      <div
        ref={followerRef}
        className="cursor-follow fixed pointer-events-none z-[9998] w-8 h-8 border border-white/30 rounded-full"
        data-effect="default"
      />
    </>
  )
} 