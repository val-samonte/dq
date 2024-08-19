/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fall-1': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fall-2': {
          '0%': { transform: 'translateY(-200%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fall-3': {
          '0%': { transform: 'translateY(-300%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fall-4': {
          '0%': { transform: 'translateY(-400%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'fade-out': 'fade-out 0.2s ease-out forwards',
        'fall-1': 'fall-1 0.3s ease-in forwards',
        'fall-2': 'fall-2 0.3s ease-in forwards',
        'fall-3': 'fall-3 0.3s ease-in forwards',
        'fall-4': 'fall-4 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
}
