/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}"
  ],
  theme: {
    extend: {
      colors: {
        'capital-blue': '#00a7e1',
        'capital-yellow': '#ffea00',
        'capital-red': '#ef233c',
        'capital-purple': '#9d4edd',
        'capital-cyan': '#00b4d8',
        'capital-green': '#2ecc71',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 6s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 167, 225, 0.5)',
            borderColor: 'rgba(0, 167, 225, 0.5)' 
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(0, 167, 225, 0.8), 0 0 30px rgba(0, 167, 225, 0.6)',
            borderColor: 'rgba(0, 167, 225, 0.8)'
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 