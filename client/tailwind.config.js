import flowbite from "flowbite-react/tailwind"

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        flowbite.content(),
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
                100: '#FFAEE4',
                200: '#FF7DD2',
                900: '#3D0023',
            },
            'tertiary-dark': {
                100: '#B60D6E',
                200: '#620438',
                900: '#FFF7FC',
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
        flowbite.plugin(),
    ],
    darkMode: 'media',
}