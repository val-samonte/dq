import { transform } from 'typescript'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        back: 'cubic-bezier(.52,-0.51,.16,1.66)',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Overrides the default sans-serif font
        serif: ['Inknut Antiqua', 'serif'], // Overrides the default serif font
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(1.2)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.2)' },
        },
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '5%': { opacity: '1', transform: 'translateX(0)' },
          '90%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(0)' },
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
        'fall-5': {
          '0%': { transform: 'translateY(-500%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'damage-number': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '10%': { transform: 'translateY(-50%)', opacity: '1' },
          '20%': { transform: 'translateY(0)', opacity: '1' },
          '90%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '0' },
        },
        'slide-gradient': {
          '0%': {
            transform: 'translateX(100%)',
            width: '0%',
            opacity: 1,
          },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateX(-100%)', width: '100%', opacity: 0 },
        },
        'slide-fade-in-left': {
          '0%': {
            transform: 'translateX(-20%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: 1,
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.1s ease-out forwards',
        'fade-out': 'fade-out 0.1s ease-out forwards',
        'fade-in-out': 'fade-in-out 3s ease-out forwards',
        'fall-1': 'fall-1 0.2s ease-in forwards',
        'fall-2': 'fall-2 0.2s ease-in forwards',
        'fall-3': 'fall-3 0.2s ease-in forwards',
        'fall-4': 'fall-4 0.2s ease-in forwards',
        'fall-5': 'fall-5 0.2s ease-in forwards',
        'damage-number': 'damage-number 1.5s ease-out forwards',
        'slide-gradient': 'slide-gradient 500ms ease-out forwards',
        'slide-fade-in-left': 'slide-fade-in-left 300ms ease-out forwards',
      },
    },
  },
  plugins: [],
}
