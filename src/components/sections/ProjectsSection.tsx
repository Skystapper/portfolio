'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// Utility function to handle basePath for assets
function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/portfolio' : ''
  return `${basePath}${path}`
}

const projects = [
  {
    id: 1,
    title: 'W.E.B.',
    description: 'A next-generation Windows application for discovering, filtering, and downloading millions of high-quality interactive wallpapers, music, and videos.',
    longDescription: `W.E.B. is my latest and most proud creation: a powerful application for Windows OS that lets you search through millions of community-made, high-quality interactive wallpapers and download them with ease. It features advanced filtering and sorting systems, making it effortless to find the perfect wallpaper. But that's not all—W.E.B. also enables you to download music and videos from the internet in high quality. Built with Tauri, it harnesses the power of both TypeScript and Rust. Tauri is a modern framework for building fast, secure desktop applications using web technologies and Rust.`,
    image: getAssetPath('/WEB.png'),
    technologies: ['Tauri', 'TypeScript', 'Rust', 'Animation Frameworks'],
    features: [
      'Advanced search, filtering, and sorting for millions of interactive wallpapers',
      'High-quality music and video downloads',
      'Signature music player that redefines ease and flexibility of listening',
      'Built with Tauri (TypeScript + Rust)',
      'Highly attractive and responsive UI/UX',
    ],
    github: 'https://github.com/rked/cosmic-portfolio',
    live: 'https://rked-portfolio.vercel.app',
    status: 'completed',
    featured: true
  },
  {
    id: 2,
    title: 'CodeCraft',
    description: 'A highly professional, ultra-modern tech website for industrial companies to present themselves as apex creators, with immersive UI/UX and a next-level admin/blog system.',
    longDescription: `CodeCraft is a highly professional yet ultra-modern tech website crafted for industrial companies who want to present themselves as apex creators. Every scroll, hover, and click is designed to immerse you in the experience, with seamless transitions that make the journey feel continuous and amazing—including light/dark theme transitions. Built with Next.js and powered by MongoDB, CodeCraft features a highly efficient admin panel with its own independent blog creation section. This blog system easily surpasses popular blog-specific platforms, supporting markdown formatting and direct image integration from Unsplash and Pexels with a single click. Draft, schedule, and publish your content—just how you like.`,
    images: [getAssetPath('/Tech.png'), getAssetPath('/TechLight.png'), getAssetPath('/TechBlog.png'), getAssetPath('/TechProjects.png')],
    technologies: ['Next.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'],
    features: [
      'Immersive UI/UX with seamless transitions and theme switching',
      'Highly efficient admin panel',
      'Independent blog creation section with markdown support',
      'Direct image integration from Unsplash and Pexels',
      'Draft, schedule, and publish blog posts with ease',
    ],
    github: 'https://github.com/rked/neural-viz',
    live: 'https://neural-viz.vercel.app',
    status: 'completed',
    featured: true
  },
  {
    id: 3,
    title: 'LegalEase',
    description: 'A legal website that breaks the mold with a unique color theme, professional authority, and a modern, effective admin panel.',
    longDescription: `LegalEase was my first project, aimed at achieving the highest level of professionalism and simplicity—without falling into the trap of the typical blue-themed legal websites that blend into the crowd. I challenged myself to use color theory in a reverse-psychology way, choosing a theme that would stand out and leave a lasting impression of authority. The site is as professional as possible, with subtle modern animations to keep the experience engaging. LegalEase features a highly effective admin panel for tracking visits, user views, and resolving queries directly. Built with Next.js and PostgreSQL as its database, LegalEase is designed to be both authoritative and memorable.`,
    images: [getAssetPath('/Legal.png'), getAssetPath('/LegalTrademark.png'), getAssetPath('/AboutLegal.png')],
    technologies: ['Next.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
    features: [
      'Unique, authority-inspiring color theme',
      'Professional yet modern UI with subtle animations',
      'Highly effective admin panel for user tracking and query resolution',
      'Built with Next.js and PostgreSQL',
      'Designed to stand out from typical legal websites',
    ],
    github: 'https://github.com/rked/legal-trademark',
    live: 'https://legal-trademark.vercel.app',
    status: 'completed',
    featured: true
  }
]

// Add array of images for the Tech Site (Neural Network Visualizer)
const techImages = [getAssetPath('/Tech.png'), getAssetPath('/TechLight.png'), getAssetPath('/TechBlog.png'), getAssetPath('/TechProjects.png')]

export default function ProjectsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentLegalImageIndex, setCurrentLegalImageIndex] = useState(0)
  const [currentTechImageIndex, setCurrentTechImageIndex] = useState(0)

  // Array of images for the Cosmic Portfolio project
  const portfolioImages = [getAssetPath('/WEB.png'), getAssetPath('/WEBmusic.png'), getAssetPath('/WEBsearch.png'), getAssetPath('/WEBwallpaper.png')]
  
  // Array of images for the Legal Trademark project
  const legalImages = [getAssetPath('/Legal.png'), getAssetPath('/LegalTrademark.png'), getAssetPath('/AboutLegal.png')]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Image cycling effects
  useEffect(() => {
    const portfolioInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % portfolioImages.length)
    }, 3000) // Change every 3 seconds

    const legalInterval = setInterval(() => {
      setCurrentLegalImageIndex(prev => (prev + 1) % legalImages.length)
    }, 3500) // Slightly different timing to create visual interest

    return () => {
      clearInterval(portfolioInterval)
      clearInterval(legalInterval)
    }
  }, [portfolioImages.length, legalImages.length])

  // Add cycling effect for techImages
  useEffect(() => {
    const techInterval = setInterval(() => {
      setCurrentTechImageIndex(prev => (prev + 1) % techImages.length)
    }, 3200)
    return () => clearInterval(techInterval)
  }, [techImages.length])

  const openModal = (src: string, title: string) => {
    setModalImage({ src, title })
    setIsModalOpen(true)
  }

  const nextImage = () => {
    if (modalImage?.src.includes('WEB')) {
      setCurrentImageIndex(prev => (prev + 1) % portfolioImages.length)
    } else if (modalImage?.src.includes('Tech')) {
      setCurrentTechImageIndex(prev => (prev + 1) % techImages.length)
    } else {
      setCurrentLegalImageIndex(prev => (prev + 1) % legalImages.length)
    }
  }

  const prevImage = () => {
    if (modalImage?.src.includes('WEB')) {
      setCurrentImageIndex(prev => (prev - 1 + portfolioImages.length) % portfolioImages.length)
    } else if (modalImage?.src.includes('Tech')) {
      setCurrentTechImageIndex(prev => (prev - 1 + techImages.length) % techImages.length)
    } else {
      setCurrentLegalImageIndex(prev => (prev - 1 + legalImages.length) % legalImages.length)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalImage(null)
  }

  // Handle ESC key to close modal and arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return
      
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowLeft') {
        prevImage()
      } else if (event.key === 'ArrowRight') {
        nextImage()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  return (
    <>
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Cosmic Creations
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Explore my digital universe of projects - each one a unique journey through code, design, and imagination
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-32">
              {projects.filter(project => project.featured).map((project, index) => (
              <div 
                key={project.id}
                className={`fade-in-up grid lg:grid-cols-2 gap-12 items-start
                          ${index % 2 === 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-2'}`}
              >
                    {/* Project Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="group relative rounded-2xl overflow-hidden glass border border-white/10 cursor-pointer" 
                    onClick={() => {
                      if (project.id === 1) {
                        openModal(portfolioImages[currentImageIndex], project.title);
                      } else if (project.id === 2) {
                        openModal(techImages[currentTechImageIndex], project.title);
                      } else if (project.id === 3) {
                        openModal(legalImages[currentLegalImageIndex], project.title);
                      }
                    }}
                  >
                    <div className="aspect-[3/2] relative">
                      {project.id === 1 || project.id === 2 || project.id === 3 ? (
                        <>
                          <img 
                            src={project.id === 1 ? portfolioImages[currentImageIndex] : project.id === 2 ? techImages[currentTechImageIndex] : legalImages[currentLegalImageIndex]} 
                            alt={project.title}
                            className={`w-full h-full transition-transform duration-300 hover:scale-105 ${project.id === 1 ? 'object-contain' : project.id === 2 ? 'object-cover object-top' : 'object-cover object-top'}`}
                            style={{ imageRendering: 'auto' }}
                          />
                          <div 
                            className="absolute inset-0 opacity-20" 
                            style={{ background: `radial-gradient(circle at center, ${index === 0 ? '#8b5cf6' : index === 1 ? '#ec4899' : '#0ea5e9'}, transparent 70%)` }}
                          />
                          {/* Hover Overlay */}
                          <div className="hidden md:block absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                          {/* Maximize Button - Desktop Only */}
                          <button 
                            className="hidden md:flex absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.id === 1) {
                                openModal(portfolioImages[currentImageIndex], project.title);
                              } else if (project.id === 2) {
                                openModal(techImages[currentTechImageIndex], project.title);
                              } else {
                                openModal(legalImages[currentLegalImageIndex], project.title);
                              }
                            }}
                            title="View full size"
                          >
                            <Icon icon="mdi:fullscreen" className="w-5 h-5 text-white" />
                          </button>
                          {/* Cosmic Image Indicators */}
                          <div className="absolute bottom-4 left-4 flex space-x-3">
                            {(project.id === 1 ? portfolioImages : project.id === 2 ? techImages : legalImages).map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (project.id === 1) {
                                    setCurrentImageIndex(idx);
                                  } else if (project.id === 2) {
                                    setCurrentTechImageIndex(idx);
                                  } else {
                                    setCurrentLegalImageIndex(idx);
                                  }
                                }}
                                className={`group relative w-8 h-8 rounded-full transition-all duration-500 ${
                                  idx === (project.id === 1 ? currentImageIndex : project.id === 2 ? currentTechImageIndex : currentLegalImageIndex)
                                    ? 'scale-110' 
                                    : 'scale-100 hover:scale-105'
                                }`}
                                title={project.id === 1 
                                  ? `View ${idx === 0 ? 'Portfolio' : idx === 1 ? 'Music Player' : idx === 2 ? 'Search' : 'Wallpapers'}`
                                  : project.id === 2
                                    ? `View Tech Screenshot ${idx + 1}`
                                    : `View Legal Screenshot ${idx + 1}`
                                }
                              >
                                {/* Outer ring */}
                                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                                  idx === (project.id === 1 ? currentImageIndex : project.id === 2 ? currentTechImageIndex : currentLegalImageIndex)
                                    ? 'border-cosmic-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                                    : 'border-white/30 hover:border-white/60'
                                }`} />
                                
                                {/* Inner cosmic element */}
                                <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
                                  idx === (project.id === 1 ? currentImageIndex : project.id === 2 ? currentTechImageIndex : currentLegalImageIndex)
                                    ? 'bg-gradient-to-r from-cosmic-blue to-plasma-pink shadow-[inset_0_0_10px_rgba(139,92,246,0.3)]' 
                                    : 'bg-white/20 group-hover:bg-white/40'
                                }`}>
                                  {/* Center dot */}
                                  <div className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                                    idx === (project.id === 1 ? currentImageIndex : project.id === 2 ? currentTechImageIndex : currentLegalImageIndex)
                                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                                      : 'bg-white/60'
                                  }`} />
                      </div>
                      
                                {/* Pulse effect for active */}
                                {idx === (project.id === 1 ? currentImageIndex : project.id === 2 ? currentTechImageIndex : currentLegalImageIndex) && (
                                  <div className="absolute inset-0 rounded-full border-2 border-cosmic-blue animate-ping opacity-30" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div 
                            className="absolute inset-0 opacity-30" 
                            style={{ background: `radial-gradient(circle at center, ${index === 0 ? '#8b5cf6' : index === 1 ? '#ec4899' : '#0ea5e9'}, transparent 70%)` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/50 text-6xl">
                              {project.id === 2 && '🧠'}
                      </div>
                    </div>
                        </>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${project.status === 'completed' ? 'bg-quantum-green/20 text-quantum-green' : 
                            project.status === 'in-progress' ? 'bg-solar-orange/20 text-solar-orange' : 
                            'bg-cosmic-blue/20 text-cosmic-blue'}`}>
                          {project.status === 'completed' ? 'Completed' : 
                           project.status === 'in-progress' ? 'In Progress' : 'Planned'}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <h3 className="font-orbitron text-3xl font-bold mb-3 text-white">{project.title}</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">{project.longDescription}</p>
          </div>

                  {/* Features */}
          <div>
                    <h4 className="font-orbitron text-lg font-semibold mb-3 text-cosmic-blue">Key Features:</h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-white/70">
                          <span className="w-2 h-2 rounded-full mr-3 bg-plasma-pink"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    </div>
                      
                      {/* Technologies */}
                  <div>
                    <h4 className="font-orbitron text-lg font-semibold mb-3 text-cosmic-blue">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/80 border border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                      </div>

                      {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                      className="interactive flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-cosmic-blue to-plasma-pink text-white rounded-full font-semibold hover:shadow-cosmic transition-all duration-300 text-center"
                        >
                      View Live Demo
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                      className="interactive flex-1 md:flex-none px-8 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-center"
                        >
                      View Code
                        </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-quantum-green/20 rounded-full float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-solar-orange/10 rounded-full blur-xl float" />
      <div className="absolute top-1/2 right-10 w-6 h-6 bg-plasma-pink/50 rotate-45 float" />
    </section>

    {/* Image Modal - Rendered via Portal */}
    {mounted && isModalOpen && modalImage && createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        
        {/* Modal Content */}
        <div className="relative max-w-7xl max-h-[90vh] w-full">
          <div className="relative rounded-2xl overflow-hidden glass border border-white/20 bg-black/40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-orbitron text-xl font-bold text-white">{modalImage?.title}</h3>
              <button
                onClick={closeModal}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Close"
              >
                <Icon icon="mdi:close" className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Image with Navigation */}
            <div className="relative bg-black/20 group/modal">
              <img
                src={modalImage?.src.includes('WEB') ? portfolioImages[currentImageIndex] : modalImage?.src.includes('Tech') ? techImages[currentTechImageIndex] : legalImages[currentLegalImageIndex]}
                alt={modalImage?.title}
                className="w-full max-h-[70vh] object-contain object-top"
              />
              
              {/* Left Navigation Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover/modal:opacity-100"
                title="Previous image (Left arrow)"
              >
                <Icon icon="mdi:chevron-left" className="w-8 h-8 text-white" />
              </button>
              
              {/* Right Navigation Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover/modal:opacity-100"
                title="Next image (Right arrow)"
              >
                <Icon icon="mdi:chevron-right" className="w-8 h-8 text-white" />
              </button>
              
            </div>
            
            {/* Modal Image Indicators - Outside image area */}
            <div className="flex justify-center py-4 border-b border-white/10">
              <div className="flex space-x-3">
                {(modalImage?.src.includes('WEB') ? portfolioImages : modalImage?.src.includes('Tech') ? techImages : legalImages).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => modalImage?.src.includes('WEB') ? setCurrentImageIndex(index) : modalImage?.src.includes('Tech') ? setCurrentTechImageIndex(index) : setCurrentLegalImageIndex(index)}
                    className={`group relative w-8 h-8 rounded-full transition-all duration-500 ${
                      index === (modalImage?.src.includes('WEB') ? currentImageIndex : modalImage?.src.includes('Tech') ? currentTechImageIndex : currentLegalImageIndex)
                        ? 'scale-110' 
                        : 'scale-100 hover:scale-105'
                    }`}
                    title={modalImage?.src.includes('WEB')
                      ? `View ${index === 0 ? 'Portfolio' : index === 1 ? 'Music Player' : index === 2 ? 'Search' : 'Wallpapers'}`
                      : modalImage?.src.includes('Tech')
                        ? `View Tech Screenshot ${index + 1}`
                        : `View Legal Screenshot ${index + 1}`
                    }
                  >
                    {/* Outer ring */}
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                      index === (modalImage?.src.includes('WEB') ? currentImageIndex : modalImage?.src.includes('Tech') ? currentTechImageIndex : currentLegalImageIndex)
                        ? 'border-cosmic-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                        : 'border-white/30 hover:border-white/60'
                    }`} />
                    
                    {/* Inner cosmic element */}
                    <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
                      index === (modalImage?.src.includes('WEB') ? currentImageIndex : modalImage?.src.includes('Tech') ? currentTechImageIndex : currentLegalImageIndex)
                        ? 'bg-gradient-to-r from-cosmic-blue to-plasma-pink shadow-[inset_0_0_10px_rgba(139,92,246,0.3)]' 
                        : 'bg-white/20 group-hover:bg-white/40'
                    }`}>
                      {/* Center dot */}
                      <div className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                        index === (modalImage?.src.includes('WEB') ? currentImageIndex : modalImage?.src.includes('Tech') ? currentTechImageIndex : currentLegalImageIndex)
                          ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                          : 'bg-white/60'
                      }`} />
                    </div>
                    
                    {/* Pulse effect for active */}
                    {index === (modalImage?.src.includes('WEB') ? currentImageIndex : modalImage?.src.includes('Tech') ? currentTechImageIndex : currentLegalImageIndex) && (
                      <div className="absolute inset-0 rounded-full border-2 border-cosmic-blue animate-ping opacity-30" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 text-center">
              <p className="text-white/70 text-sm">
                Use ←→ arrows or click buttons to navigate • ESC or click outside to close
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  )
} 