/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon palette
        'neon': {
          'cyan': '#00f5ff',
          'cyan-dark': '#00d4ff',
          'cyan-light': '#33ffff',
          'green': '#39ff14',
          'green-dark': '#2dd60d',
          'purple': '#d946ef',
          'pink': '#ff006e',
        },
        
        // Threat levels
        'threat': {
          'critical': '#ff2d55',
          'high': '#ff5722',
          'medium': '#ffb800',
          'low': '#39ff14',
        },
        
        // Status colors
        'status': {
          'active': '#00f5ff',
          'success': '#39ff14',
          'warning': '#ffb800',
          'error': '#ff2d55',
          'processing': '#d946ef',
        },
        
        // Background palette
        'dark': {
          'primary': '#020617',
          'secondary': '#0f172a',
          'tertiary': '#1e293b',
          'accent': '#334155',
        },
        
        // Slate scale
        'slate-dark': '#0f172a',
      },
      
      backgroundColor: {
        'glass': 'rgba(15, 23, 42, 0.5)',
        'glass-dark': 'rgba(2, 6, 23, 0.7)',
      },
      
      borderColor: {
        'glass': 'rgba(51, 65, 85, 0.3)',
      },
      
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.3), inset 0 0 20px rgba(0, 245, 255, 0.05)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.3), inset 0 0 20px rgba(57, 255, 20, 0.05)',
        'glow-pink': '0 0 20px rgba(255, 45, 85, 0.3), inset 0 0 20px rgba(255, 45, 85, 0.05)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.3), inset 0 0 20px rgba(255, 184, 0, 0.05)',
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
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
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
          'background': 'linear-gradient(135deg, #00f5ff, #39ff14)',
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
