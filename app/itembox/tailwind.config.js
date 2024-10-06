/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
      },
      animation: {
        'spin-fast': 'spin 8s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
}
