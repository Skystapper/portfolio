'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const navItems = [
  { name: 'Home', href: '#hero', icon: 'material-symbols:home-outline' },
  { name: 'About', href: '#about', icon: 'material-symbols:person-outline' },
  { name: 'Discord', href: '#discord', icon: 'logos:discord-icon' },
  { name: 'Projects', href: '#projects', icon: 'material-symbols:code-outline' },
  { name: 'Skills', href: '#skills', icon: 'material-symbols:psychology-outline' },
  { name: 'Contact', href: '#contact', icon: 'material-symbols:mail-outline' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1))
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-cosmic' : ''
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-orbitron text-2xl font-bold text-gradient">
            R.ked
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`interactive flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === item.href.substring(1)
                    ? 'text-cosmic-blue neon-glow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden interactive p-2 rounded-lg glass">
            <Icon icon="material-symbols:menu" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
} 