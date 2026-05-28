/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2A4F82',
          dark: '#162B47',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        surface: '#FFFFFF',
        bg: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
