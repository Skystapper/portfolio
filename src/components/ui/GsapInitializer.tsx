'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function GsapInitializer() {
  useEffect(() => {
    // Register GSAP plugins globally
    gsap.registerPlugin(ScrollTrigger)
  }, [])
  
  return null
} 