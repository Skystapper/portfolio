'use client'

import { Icon } from '@iconify/react'

const projects = [
  {
    id: 1,
    title: 'Cosmic Portfolio',
    description: 'An immersive space-themed portfolio showcasing advanced GSAP animations and interactive 3D elements.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'GSAP', 'Three.js', 'Tailwind CSS'],
    github: 'https://github.com/rked/cosmic-portfolio',
    live: 'https://rked-portfolio.vercel.app',
    featured: true
  },
  {
    id: 2,
    title: 'Neural Network Visualizer',
    description: 'Interactive visualization of neural networks with real-time training data and cosmic particle effects.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'D3.js', 'WebGL', 'Python'],
    github: 'https://github.com/rked/neural-viz',
    live: 'https://neural-viz.vercel.app',
    featured: true
  },
  {
    id: 3,
    title: 'Quantum Chat',
    description: 'Real-time chat application with quantum-inspired encryption and stellar UI animations.',
    image: '/api/placeholder/400/250',
    technologies: ['Socket.io', 'Node.js', 'MongoDB', 'GSAP'],
    github: 'https://github.com/rked/quantum-chat',
    live: 'https://quantum-chat.herokuapp.com',
    featured: false
  },
  {
    id: 4,
    title: 'Stellar Music Player',
    description: 'Music player with 3D visualizations and space-themed interface design.',
    image: '/api/placeholder/400/250',
    technologies: ['Vue.js', 'Web Audio API', 'Three.js', 'SCSS'],
    github: 'https://github.com/rked/stellar-player',
    live: 'https://stellar-player.netlify.app',
    featured: false
  },
  {
    id: 5,
    title: 'Cosmic E-commerce',
    description: 'Full-stack e-commerce platform with immersive product showcases and smooth animations.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/rked/cosmic-store',
    live: 'https://cosmic-store.vercel.app',
    featured: false
  },
  {
    id: 6,
    title: 'Nebula Dashboard',
    description: 'Analytics dashboard with real-time data visualization and interactive cosmic charts.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'Chart.js', 'Express', 'Redis'],
    github: 'https://github.com/rked/nebula-dashboard',
    live: 'https://nebula-dashboard.vercel.app',
    featured: false
  }
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Cosmic Creations
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Explore my digital universe of projects - each one a unique journey through code, design, and imagination
            </p>
          </div>

          {/* Featured Projects */}
          <div className="mb-16">
            <h3 className="font-orbitron text-2xl font-bold mb-8 text-center text-cosmic-blue">
              Featured Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.filter(project => project.featured).map((project, index) => (
                <div key={project.id} className="fade-in-up group">
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-cosmic transition-all duration-500 transform hover:-translate-y-2">
                    {/* Project Image */}
                    <div className="relative h-64 bg-gradient-to-br from-cosmic-blue/20 to-plasma-pink/20 overflow-hidden">
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon icon="material-symbols:image-outline" className="w-16 h-16 text-white/30" />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      {/* Action Buttons */}
                      <div className="absolute bottom-4 left-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive flex-1 bg-cosmic-blue/90 hover:bg-cosmic-blue text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
                        >
                          <Icon icon="material-symbols:open-in-new" className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
                        >
                          <Icon icon="mdi:github" className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h4 className="font-orbitron text-xl font-bold text-white mb-3">
                        {project.title}
                      </h4>
                      <p className="text-white/70 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Projects Grid */}
          <div>
            <h3 className="font-orbitron text-2xl font-bold mb-8 text-center text-plasma-pink">
              More Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(project => !project.featured).map((project, index) => (
                <div key={project.id} className="fade-in-up group">
                  <div className="glass rounded-xl overflow-hidden hover:shadow-stellar transition-all duration-300 transform hover:-translate-y-1">
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-quantum-green/20 to-solar-orange/20 overflow-hidden">
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon icon="material-symbols:image-outline" className="w-12 h-12 text-white/30" />
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-5">
                      <h4 className="font-orbitron text-lg font-bold text-white mb-2">
                        {project.title}
                      </h4>
                      <p className="text-white/70 text-sm mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive flex-1 bg-cosmic-blue/20 hover:bg-cosmic-blue/40 text-cosmic-blue hover:text-white px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-all duration-300"
                        >
                          <Icon icon="material-symbols:open-in-new" className="w-3 h-3" />
                          <span>Demo</span>
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-all duration-300"
                        >
                          <Icon icon="mdi:github" className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-quantum-green/20 rounded-full float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-solar-orange/10 rounded-full blur-xl float" />
      <div className="absolute top-1/2 right-10 w-6 h-6 bg-plasma-pink/50 rotate-45 float" />
    </section>
  )
} 