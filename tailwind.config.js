/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'bg': '#fdfdf5',
      'bg-dark': '#1a1c18',
      'primary': {
        100: '#2a6c00',
        200: '#1e5200',
      },
      'primary-dark': {
        100: '#eeffde',
        200: '#1e5200',
      },
      'secondary': {
        100: '#f2f6e9',
        150: '#e7f6d8',
        200: '#d9e7cb',
        300: '#bdcbaf',
        900: '#131f0d',
      },
      'secondary-dark': {
        100: '#20261c',
        200: '#3e4a35',
        300: '#8d9286',
        900: '#d9e7cb',
      },
      'tertiary': {
        100: '#bbebeb',
        200: '#a0cfcf',
        900: '#002020',
      },
      'tertiary-dark': {
        100: '#1e4e4e',
        200: '#003737',
        900: '#bbebeb',
      },
      'notification': {
        100: '#ffdad6',
        200: '#410002',
        300: '#93000a',
        400: '#ffdad6',
        500: '#e0e4d6',
        600: '#43483e',
        700: '#43483e',
        800: '#c3c8bb',
      },
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'media',
}
