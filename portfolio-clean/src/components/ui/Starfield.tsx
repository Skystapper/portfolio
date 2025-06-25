'use client'

import { useEffect, useRef } from 'react'

export default function Starfield() {
  const starfieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const starfield = starfieldRef.current
    if (!starfield) return

    // Clear existing stars
    starfield.innerHTML = ''

    // Create stars
    const createStars = () => {
      const starCount = 200
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'star absolute bg-white rounded-full'
        
        // Random size
        const size = Math.random()
        if (size < 0.6) {
          star.classList.add('small')
        } else if (size < 0.9) {
          star.classList.add('medium')
        } else {
          star.classList.add('large')
        }
        
        // Random position
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's'
        
        starfield.appendChild(star)
      }
    }

    createStars()

    // Recreate stars on window resize
    const handleResize = () => {
      createStars()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={starfieldRef}
      className="starfield fixed inset-0 pointer-events-none z-[-1]"
    />
  )
} 