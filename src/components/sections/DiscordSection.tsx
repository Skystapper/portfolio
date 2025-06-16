'use client'

import DiscordProfileCard from '@/components/common/DiscordProfileCard'

export default function DiscordSection() {
  return (
    <section id="discord" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-16 fade-in-up">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Connect in the Digital Realm
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Step into my Discord universe - where creativity meets community in the cosmic void
            </p>
          </div>

          {/* Discord Card Container */}
          <div className="fade-in-up flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cosmic-blue/20 via-plasma-pink/20 to-quantum-green/20 rounded-3xl blur-xl scale-110" />
              
              {/* Card */}
              <div className="relative z-10">
                <DiscordProfileCard />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 fade-in-up">
            <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="font-orbitron text-2xl font-bold mb-4 text-cosmic-blue">
                Interactive Profile Experience
              </h3>
              <p className="text-white/80 leading-relaxed mb-6">
                This isn't just a static profile - it's a living, breathing digital experience. 
                Click around, explore the animations, and discover the hidden interactions that 
                bring this cosmic profile to life.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-cosmic-blue text-xl">🎨</span>
                  </div>
                  <h4 className="font-semibold text-white">Dynamic Animations</h4>
                  <p className="text-white/60 text-sm">GSAP-powered interactions</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-plasma-pink/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-plasma-pink text-xl">🚀</span>
                  </div>
                  <h4 className="font-semibold text-white">Profile Effects</h4>
                  <p className="text-white/60 text-sm">Randomized visual effects</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-quantum-green/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-quantum-green text-xl">✨</span>
                  </div>
                  <h4 className="font-semibold text-white">Social Integration</h4>
                  <p className="text-white/60 text-sm">Direct contact options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 border border-plasma-pink/20 rounded-full float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-cosmic-blue/10 rounded-full blur-2xl float" />
      <div className="absolute top-1/2 left-5 w-4 h-4 bg-quantum-green/50 rotate-45 float" />
    </section>
  )
} 