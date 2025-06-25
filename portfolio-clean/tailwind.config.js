/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'orbitron': ['var(--font-orbitron)', 'monospace'],
        'space-mono': ['var(--font-space-mono)', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        // Space Theme Colors
        'void-black': '#000000',
        'deep-space': '#0a0a0f',
        'nebula-purple': '#6b46c1',
        'cosmic-blue': '#3b82f6',
        'stellar-white': '#ffffff',
        'plasma-pink': '#ec4899',
        'quantum-green': '#10b981',
        'solar-orange': '#f59e0b',
        // Legacy colors
        primary: '#0070f3',
        dark: '#111111',
        light: '#ffffff',
        accent: '#7928ca',
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s infinite alternate',
        'nebula-drift': 'nebula-drift 20s infinite linear',
        'holographic-shift': 'holographic-shift 3s ease-in-out infinite',
        'glitch-1': 'glitch-1 0.5s infinite',
        'glitch-2': 'glitch-2 0.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)',
            transform: 'scale(1.05)'
          },
        },
        twinkle: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        'nebula-drift': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'holographic-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glitch-1': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glitch-2': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(2px, -2px)' },
          '40%': { transform: 'translate(2px, 2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(-2px, 2px)' },
        },
      },
      boxShadow: {
        'cosmic': '0 10px 40px rgba(107, 70, 193, 0.3)',
        'stellar': '0 0 30px rgba(255, 255, 255, 0.1)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-purple': '0 0 15px 5px rgba(168, 85, 247, 0.4)',
        'glow-pink': '0 0 15px 5px rgba(236, 72, 153, 0.4)',
        'glow-blue': '0 0 15px 5px rgba(59, 130, 246, 0.4)',
        'glow-indigo': '0 0 15px 5px rgba(99, 102, 241, 0.4)',
        'glow-fuchsia': '0 0 15px 5px rgba(192, 38, 211, 0.4)',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      backdropBlur: {
        xs: '2px',
        'cosmic': '10px',
      },
      gradientColorStops: {
        'black-fade': 'rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'nebula-gradient': 'linear-gradient(135deg, #6b46c1 0%, #3b82f6 50%, #ec4899 100%)',
        'cosmic-gradient': 'radial-gradient(circle at center, #6b46c1 0%, #000000 70%)',
        'stellar-gradient': 'linear-gradient(45deg, #ffffff 0%, #3b82f6 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      zIndex: {
        '9998': '9998',
        '9999': '9999',
      }
    },
  },
  plugins: [],
}; 