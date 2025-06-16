'use client'

import { Icon } from '@iconify/react'

const skillCategories = [
  {
    title: 'Frontend Mastery',
    icon: 'material-symbols:code',
    color: 'cosmic-blue',
    skills: [
      { name: 'React/Next.js', level: 95, icon: 'logos:react' },
      { name: 'TypeScript', level: 90, icon: 'logos:typescript-icon' },
      { name: 'Vue.js', level: 85, icon: 'logos:vue' },
      { name: 'Tailwind CSS', level: 92, icon: 'logos:tailwindcss-icon' },
      { name: 'SASS/SCSS', level: 88, icon: 'logos:sass' },
    ]
  },
  {
    title: 'Animation & 3D',
    icon: 'material-symbols:animation',
    color: 'plasma-pink',
    skills: [
      { name: 'GSAP', level: 95, icon: 'simple-icons:greensock' },
      { name: 'Three.js', level: 85, icon: 'logos:threejs' },
      { name: 'Framer Motion', level: 88, icon: 'logos:framer' },
      { name: 'WebGL', level: 80, icon: 'material-symbols:3d-rotation' },
      { name: 'CSS Animations', level: 92, icon: 'material-symbols:animation' },
    ]
  },
  {
    title: 'Backend & Tools',
    icon: 'material-symbols:storage',
    color: 'quantum-green',
    skills: [
      { name: 'Node.js', level: 85, icon: 'logos:nodejs-icon' },
      { name: 'Python', level: 80, icon: 'logos:python' },
      { name: 'PostgreSQL', level: 82, icon: 'logos:postgresql' },
      { name: 'MongoDB', level: 78, icon: 'logos:mongodb-icon' },
      { name: 'Git', level: 90, icon: 'logos:git-icon' },
    ]
  },
  {
    title: 'Design & UX',
    icon: 'material-symbols:palette-outline',
    color: 'solar-orange',
    skills: [
      { name: 'Figma', level: 88, icon: 'logos:figma' },
      { name: 'Adobe Creative Suite', level: 85, icon: 'logos:adobe' },
      { name: 'UI/UX Design', level: 87, icon: 'material-symbols:design-services-outline' },
      { name: 'Prototyping', level: 83, icon: 'material-symbols:gesture' },
      { name: 'User Research', level: 80, icon: 'material-symbols:psychology-outline' },
    ]
  }
]

const achievements = [
  {
    number: '50+',
    label: 'Projects Completed',
    icon: 'material-symbols:rocket-launch-outline'
  },
  {
    number: '3+',
    label: 'Years Experience',
    icon: 'material-symbols:schedule'
  },
  {
    number: '100%',
    label: 'Client Satisfaction',
    icon: 'material-symbols:star-outline'
  },
  {
    number: '24/7',
    label: 'Cosmic Availability',
    icon: 'material-symbols:public'
  }
]

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Cosmic Arsenal
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The tools and technologies I wield to craft digital experiences across the universe
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <div key={index} className="fade-in-up">
                <div className="glass p-8 rounded-2xl h-full">
                  {/* Category Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-12 h-12 bg-${category.color}/20 rounded-xl flex items-center justify-center`}>
                      <Icon icon={category.icon} className={`w-6 h-6 text-${category.color}`} />
                    </div>
                    <h3 className="font-orbitron text-xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Icon icon={skill.icon} className="w-5 h-5 text-white/70" />
                            <span className="text-white/90 font-medium">{skill.name}</span>
                          </div>
                          <span className="text-quantum-green font-mono text-sm font-bold">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r from-${category.color} to-${category.color}/60 h-2 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                            style={{ 
                              width: `${skill.level}%`,
                              boxShadow: `0 0 10px var(--${category.color})`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="fade-in-up">
            <h3 className="font-orbitron text-2xl font-bold mb-8 text-center text-cosmic-blue">
              Cosmic Achievements
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group">
                  <div className="glass p-6 rounded-xl hover:shadow-cosmic transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-cosmic-blue to-plasma-pink rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon icon={achievement.icon} className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="font-orbitron text-2xl font-bold text-gradient mb-2">
                      {achievement.number}
                    </div>
                    
                    <p className="text-white/70 text-sm font-medium">
                      {achievement.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 fade-in-up">
            <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="font-orbitron text-2xl font-bold mb-4 text-plasma-pink">
                Ready to Launch Your Project?
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Let's combine these cosmic skills to bring your vision to life. 
                Whether it's a simple website or a complex web application, 
                I'm ready to embark on this digital journey with you.
              </p>
              
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-primary interactive px-8 py-3 font-semibold"
              >
                Start Your Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-solar-orange/20 rounded-full float" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-quantum-green/10 rounded-full blur-xl float" />
      <div className="absolute top-1/3 right-5 w-4 h-4 bg-cosmic-blue/50 rotate-45 float" />
      <div className="absolute bottom-1/3 left-5 w-6 h-6 border border-plasma-pink/30 rotate-12 float" />
    </section>
  )
} 