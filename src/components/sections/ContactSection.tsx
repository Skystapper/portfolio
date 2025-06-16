'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

const contactMethods = [
  {
    icon: 'material-symbols:mail-outline',
    title: 'Email',
    value: 'skystapper@gmail.com',
    href: 'mailto:skystapper@gmail.com',
    color: 'cosmic-blue'
  },
  {
    icon: 'logos:discord-icon',
    title: 'Discord',
    value: 'R.ked#1207',
    href: 'https://discord.com/users/908657241505280021',
    color: 'plasma-pink'
  },
  {
    icon: 'logos:telegram',
    title: 'Telegram',
    value: '@rked_dev',
    href: 'https://t.me/rked_dev',
    color: 'quantum-green'
  },
  {
    icon: 'skill-icons:twitter',
    title: 'Twitter',
    value: '@rked_dev',
    href: 'https://twitter.com/rked_dev',
    color: 'solar-orange'
  }
]

const socialLinks = [
  { icon: 'mdi:github', href: 'https://github.com/rked', label: 'GitHub' },
  { icon: 'mdi:linkedin', href: 'https://linkedin.com/in/rked', label: 'LinkedIn' },
  { icon: 'mdi:codepen', href: 'https://codepen.io/rked', label: 'CodePen' },
  { icon: 'simple-icons:dribbble', href: 'https://dribbble.com/rked', label: 'Dribbble' },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Initiate Contact
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Ready to embark on a cosmic journey together? Let's connect across the digital universe
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="fade-in-left">
              <div className="glass p-8 rounded-2xl">
                <h3 className="font-orbitron text-2xl font-bold mb-6 text-cosmic-blue">
                  Send a Cosmic Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-white/80 font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="interactive w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-blue focus:outline-none transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-white/80 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="interactive w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-blue focus:outline-none transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-white/80 font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="interactive w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-blue focus:outline-none transition-all duration-300"
                      placeholder="Project inquiry, collaboration, or just saying hi"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-white/80 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="interactive w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-blue focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Tell me about your project, ideas, or anything you'd like to discuss..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="interactive w-full btn-primary py-4 font-semibold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner w-5 h-5" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="material-symbols:send" className="w-5 h-5" />
                        <span>Launch Message</span>
                      </>
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-quantum-green/20 border border-quantum-green/30 rounded-lg text-quantum-green text-center">
                      Message transmitted successfully! I'll respond within 24 hours.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
                      Transmission failed. Please try again or use alternative contact methods.
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="fade-in-right space-y-8">
              {/* Contact Methods */}
              <div className="glass p-8 rounded-2xl">
                <h3 className="font-orbitron text-2xl font-bold mb-6 text-plasma-pink">
                  Direct Channels
                </h3>
                
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 bg-${method.color}/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon icon={method.icon} className={`w-6 h-6 text-${method.color}`} />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white">{method.title}</h4>
                        <p className="text-white/70 text-sm">{method.value}</p>
                      </div>
                      
                      <Icon icon="material-symbols:open-in-new" className="w-4 h-4 text-white/40 ml-auto group-hover:text-white/70 transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="glass p-8 rounded-2xl">
                <h3 className="font-orbitron text-2xl font-bold mb-6 text-solar-orange">
                  Social Universe
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    >
                      <Icon icon={social.icon} className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
                      <span className="text-white/80 group-hover:text-white transition-colors duration-300 font-medium">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="glass p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-quantum-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 bg-quantum-green rounded-full animate-pulse" />
                </div>
                
                <h3 className="font-orbitron text-xl font-bold text-quantum-green mb-2">
                  Currently Available
                </h3>
                
                <p className="text-white/70 text-sm">
                  Ready for new projects and collaborations.<br />
                  Response time: Usually within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-24 h-24 border border-cosmic-blue/20 rounded-full float" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-plasma-pink/10 rounded-full blur-xl float" />
      <div className="absolute top-1/2 left-10 w-6 h-6 bg-solar-orange/50 rotate-45 float" />
      <div className="absolute bottom-1/3 right-10 w-4 h-4 border border-quantum-green/30 rotate-12 float" />
    </section>
  )
} 