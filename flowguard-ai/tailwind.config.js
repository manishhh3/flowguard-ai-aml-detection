/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette (professional)
        'neon': {
          'cyan': '#0ea5b7',
          'cyan-dark': '#0b7f8c',
          'cyan-light': '#67e8f9',
          'green': '#16a34a',
          'green-dark': '#15803d',
          'purple': '#7c3aed',
          'pink': '#be123c',
        },
        
        // Threat levels
        'threat': {
          'critical': '#dc2626',
          'high': '#f59e0b',
          'medium': '#fbbf24',
          'low': '#16a34a',
        },
        
        // Status colors
        'status': {
          'active': '#0ea5b7',
          'success': '#16a34a',
          'warning': '#f59e0b',
          'error': '#dc2626',
          'processing': '#7c3aed',
        },
        
        // Background palette
        'dark': {
          'primary': '#0b1220',
          'secondary': '#121a2b',
          'tertiary': '#1b263b',
          'accent': '#2a3a55',
        },
        
        // Slate scale
        'slate-dark': '#0f172a',
      },
      
      backgroundColor: {
        'glass': 'rgba(17, 25, 40, 0.62)',
        'glass-dark': 'rgba(9, 14, 26, 0.78)',
      },
      
      borderColor: {
        'glass': 'rgba(111, 134, 168, 0.28)',
      },
      
      boxShadow: {
        'glow-cyan': '0 0 18px rgba(14, 165, 183, 0.22), inset 0 0 18px rgba(14, 165, 183, 0.04)',
        'glow-green': '0 0 18px rgba(22, 163, 74, 0.22), inset 0 0 18px rgba(22, 163, 74, 0.04)',
        'glow-pink': '0 0 18px rgba(220, 38, 38, 0.2), inset 0 0 18px rgba(220, 38, 38, 0.04)',
        'glow-amber': '0 0 18px rgba(245, 158, 11, 0.2), inset 0 0 18px rgba(245, 158, 11, 0.04)',
        'floating': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'elevated': '0 30px 80px rgba(0, 0, 0, 0.6)',
      },
      
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'threat-flash': 'threatFlash 0.3s ease-in-out infinite',
        'alert-pulse': 'alertPulse 0.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-slow': 'bounceSlower 2s infinite',
      },
      
      keyframes: {
        pulseGlow: {
          '0%, 100%': { 'text-shadow': '0 0 10px rgba(0, 245, 255, 0.5)', 'opacity': '1' },
          '50%': { 'text-shadow': '0 0 20px rgba(0, 245, 255, 0.8)', 'opacity': '0.8' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        threatFlash: {
          '0%, 100%': { backgroundColor: 'rgba(255, 45, 85, 0.1)' },
          '50%': { backgroundColor: 'rgba(255, 45, 85, 0.3)' },
        },
        alertPulse: {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(255, 45, 85, 0.6), inset 0 0 20px rgba(255, 45, 85, 0.1)' 
          },
          '50%': { 
            'box-shadow': '0 0 60px rgba(255, 45, 85, 0.9), inset 0 0 40px rgba(255, 45, 85, 0.2)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          'from': { transform: 'translateX(-20px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        bounceSlower: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        'display': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],
      },
      
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'Consolas', 'monospace'],
        'sans': ['"Manrope"', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
      },
      
      opacity: {
        '2': '0.02',
        '5': '0.05',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          '@apply bg-glass backdrop-blur-md border border-glass rounded-lg': {},
        },
        '.glass-dark': {
          '@apply bg-glass-dark backdrop-blur-md border border-glass rounded-lg': {},
        },
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #67e8f9, #16a34a)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.card-hover': {
          '@apply transition-all duration-300 hover:scale-105 hover:shadow-floating': {},
        },
        '.btn-neon': {
          '@apply px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95': {},
        },
        '.label-glow': {
          '@apply text-neon-cyan text-xs font-bold tracking-widest uppercase': {},
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
}
