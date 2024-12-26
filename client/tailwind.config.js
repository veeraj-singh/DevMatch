/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'slide-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'fade-slide-up': {
          '0%': { 
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        'slide': 'slide 40s linear infinite',
        'slide-reverse': 'slide-reverse 40s linear infinite',
        'fade-in': 'fade-in 1s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-slide-up': 'fade-slide-up 0.3s ease-out'
      }
    },
  },
  plugins: [],
}