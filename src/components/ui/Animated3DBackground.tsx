'use client'

import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Define icons for each section with their movement patterns
const sectionIcons = {
  hero: [
    {
      url: '/icons/bouncing-cube-animated-3d-icon-1317725137205.glb',
      startPosition: [-12, 8, 2],
      endPosition: [-30, -10, 2], // Exits down and left
      triggerStart: 0,
      triggerEnd: 0.25
    },
    {
      url: '/icons/floating-cubes-loading-animated-3d-icon-514489560289.glb',
      startPosition: [12, 8, 2],
      endPosition: [30, -10, 2], // Exits down and right
      triggerStart: 0,
      triggerEnd: 0.25
    }
  ],
  about: [
    {
      url: '/icons/rotating-cube-loading-animated-3d-icon-323338265846.glb',
      startPosition: [30, 0, 2],
      endPosition: [40, 15, 2], // Moves up and further right
      triggerStart: 0.2,
      triggerEnd: 0.45
    }
  ],
  discord: [
    {
      url: '/icons/rubik-cube-loading-animated-3d-icon-918042144125.glb',
      startPosition: [-30, 0, 2],
      endPosition: [-40, -15, 2], // Moves down and further left
      triggerStart: 0.4,
      triggerEnd: 0.65
    },
    // Golden cube with multiple waypoints for proper path
    {
      url: '/icons/rubik-cube-loading-animated-3d-icon-918042144125.glb',
      waypoints: [
        [-35, 25, 2],  // Start off-screen top-left
        [-12, 8, 2],   // Enter visible area upper-left
        [-12, 5, 2],   // Stay in upper-left during discord
        [-35, -10, 2]  // Exit to bottom-left off-screen
      ],
      triggerStart: 0.05,
      triggerEnd: 0.75
    }
  ],
  projects: [
    {
      url: '/icons/dropping-sphere-loading-animated-3d-icon-713943018271.glb',
      startPosition: [-12, -8, 2],
      endPosition: [-30, -20, 2], // Exits further down and left
      triggerStart: 0.6,
      triggerEnd: 0.8
    },
    {
      url: '/icons/spheres-abstract-shape-animated-3d-icon-1668763368472.glb',
      startPosition: [12, -8, 2],
      endPosition: [30, -20, 2], // Exits further down and right
      triggerStart: 0.6,
      triggerEnd: 0.8
    }
  ],
  skills: [
    {
      url: '/icons/twisted-circle-abstract-shape-animated-3d-icon-1057449839409.glb',
      startPosition: [0, -20, 2],
      endPosition: [-20, -30, 2], // Moves down and to the left
      triggerStart: 0.75,
      triggerEnd: 0.95
    }
  ],
  // New icons that appear during skills-to-contact transition
  skillsToContact: [
    {
      url: '/icons/waving-plane-abstract-animated-3d-icon-772525492989.glb',
      startPosition: [40, 25, 2], // Starts off-screen top-right
      endPosition: [15, 5, 2], // Moves into view from top-right
      triggerStart: 0.8,
      triggerEnd: 0.95
    },
    {
      url: '/icons/abstract-shape-animated-3d-icon-1573750599827.glb',
      startPosition: [-40, -25, 2], // Starts off-screen bottom-left
      endPosition: [-15, -5, 2], // Moves into view from bottom-left
      triggerStart: 0.8,
      triggerEnd: 0.95
    }
  ],
  contact: [
    {
      url: '/icons/spiral-abstract-shape-animated-3d-icon-713416610389.glb',
      startPosition: [-30, 5, 2],
      endPosition: [-40, 20, 2], // Exits up and further left
      triggerStart: 0.85,
      triggerEnd: 1.0
    },
    {
      url: '/icons/circle-abstract-shape-animated-3d-icon-89237357186.glb',
      startPosition: [30, -5, 2],
      endPosition: [40, -20, 2], // Exits down and further right
      triggerStart: 0.85,
      triggerEnd: 1.0
    }
  ]
}

interface ScrollIconProps {
  url: string
  startPosition?: [number, number, number]
  endPosition?: [number, number, number]
  waypoints?: [number, number, number][]
  triggerStart: number
  triggerEnd: number
  scrollProgress: number
  scale: number
  animationSpeed: number
}

function ScrollIcon({ url, startPosition, endPosition, waypoints, triggerStart, triggerEnd, scrollProgress, scale, animationSpeed }: ScrollIconProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null)
  
  // Load the model with its animations
  const { scene, animations } = useGLTF(url)
  
  // Create a clone of the scene to avoid sharing issues
  const clonedScene = useMemo(() => {
    if (scene) {
      return scene.clone(true)
    }
    return null
  }, [scene])
  
  // Set up animation mixer when the scene is loaded
  useEffect(() => {
    if (clonedScene && animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(clonedScene)
      
      // Play all animations
      animations.forEach((clip: THREE.AnimationClip) => {
        if (newMixer) {
          const action = newMixer.clipAction(clip)
          action.play()
        }
      })
      
      setMixer(newMixer)
    }
    
    return () => {
      if (mixer) {
        mixer.stopAllAction()
        mixer.uncacheRoot(clonedScene!)
      }
    }
  }, [animations, clonedScene, url])
  
  // Calculate current position based on scroll progress
  const currentPosition = useMemo(() => {
    // Calculate how much this icon should be affected by current scroll position
    let iconProgress = 0
    
    if (scrollProgress >= triggerStart && scrollProgress <= triggerEnd) {
      // Icon is in its active range
      const range = triggerEnd - triggerStart
      const localProgress = (scrollProgress - triggerStart) / range
      iconProgress = Math.max(0, Math.min(1, localProgress))
    } else if (scrollProgress > triggerEnd) {
      // Scroll has passed this icon's range
      iconProgress = 1
    }
    
    // Handle waypoints if provided
    if (waypoints && waypoints.length > 1) {
      const segmentCount = waypoints.length - 1
      const segmentProgress = iconProgress * segmentCount
      const currentSegment = Math.floor(segmentProgress)
      const segmentLocalProgress = segmentProgress - currentSegment
      
      if (currentSegment >= segmentCount) {
        return waypoints[waypoints.length - 1]
      }
      
      const startPoint = waypoints[currentSegment]
      const endPoint = waypoints[currentSegment + 1]
      
      const x = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentLocalProgress
      const y = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentLocalProgress
      const z = startPoint[2] + (endPoint[2] - startPoint[2]) * segmentLocalProgress
      
      return [x, y, z] as [number, number, number]
    }
    
    // Fallback to simple interpolation between start and end positions
    if (startPosition && endPosition) {
      const x = startPosition[0] + (endPosition[0] - startPosition[0]) * iconProgress
      const y = startPosition[1] + (endPosition[1] - startPosition[1]) * iconProgress
      const z = startPosition[2] + (endPosition[2] - startPosition[2]) * iconProgress
      
      return [x, y, z] as [number, number, number]
    }
    
    return [0, 0, 0] as [number, number, number]
  }, [scrollProgress, startPosition, endPosition, waypoints, triggerStart, triggerEnd])
  
  // Update the mixer and position on each frame
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta * animationSpeed)
    }
    
    if (groupRef.current) {
      groupRef.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2])
      
      // Subtle rotation based on movement
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.rotation.x += delta * 0.1
    }
  })

  if (!clonedScene) {
    return null
  }

  return (
    <group 
      ref={groupRef}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

interface SimpleIconConfig {
  url: string
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  triggerStart: number
  triggerEnd: number
}

interface WaypointIconConfig {
  url: string
  waypoints: [number, number, number][]
  triggerStart: number
  triggerEnd: number
}

type IconConfig = SimpleIconConfig | WaypointIconConfig

interface SceneProps {
  scrollProgress: number
  animationSpeed: number
}

function Scene({ scrollProgress, animationSpeed }: SceneProps) {
  // Get all icons from all sections
  const allIcons: IconConfig[] = Object.values(sectionIcons).flat() as IconConfig[]
  
  return (
    <>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} />
      <pointLight position={[0, 0, 15]} intensity={1.0} color="#ffffff" />
      
      {/* Render all icons with scroll-based movement */}
      {allIcons.map((iconConfig, index) => (
        <Suspense key={index} fallback={null}>
          <ScrollIcon 
            url={iconConfig.url}
            startPosition={'startPosition' in iconConfig ? iconConfig.startPosition : undefined}
            endPosition={'endPosition' in iconConfig ? iconConfig.endPosition : undefined}
            waypoints={'waypoints' in iconConfig ? iconConfig.waypoints : undefined}
            triggerStart={iconConfig.triggerStart}
            triggerEnd={iconConfig.triggerEnd}
            scrollProgress={scrollProgress}
            scale={2.0} // Large icons as requested
            animationSpeed={animationSpeed}
          />
        </Suspense>
      ))}
    </>
  )
}

// Preload all models
Object.values(sectionIcons).flat().forEach(icon => {
  useGLTF.preload(icon.url)
})

export default function Animated3DBackground() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let lastScrollY = 0
    
    const handleScroll = () => {
      // Calculate scroll progress as a value between 0 and 1
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
      
      const maxScroll = documentHeight - windowHeight
      const progress = Math.min(scrollY / maxScroll, 1)
      setScrollProgress(progress)
      
      // Optional: slight animation speed variation based on scroll velocity
      const scrollDelta = Math.abs(scrollY - lastScrollY)
      const speed = Math.min(1 + (scrollDelta * 0.0005), 1.2)
      setAnimationSpeed(speed)
      
      lastScrollY = scrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return (
    <div className="absolute inset-x-0 h-full -z-10 opacity-80 pointer-events-none">
      <Canvas
        camera={{ 
          position: [0, 0, 25], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0)
        }}
        style={{ position: 'fixed', top: 0, height: '100vh', width: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} animationSpeed={animationSpeed} />
        </Suspense>
      </Canvas>
    </div>
  )
} 