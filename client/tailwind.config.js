/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#E63946',
                    dark: '#1A1A1A',
                    'dark-alt': '#2D2D2D',
                    cream: '#FFF8F0',
                },
                accent: {
                    green: '#25D366',
                    orange: '#FF6B35',
                    blue: '#457B9D',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'Segoe UI', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            animation: {
                marquee: 'marquee 30s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
    plugins: [],
}
