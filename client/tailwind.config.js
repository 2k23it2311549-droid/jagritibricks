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
                    red: '#E8523F',
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
                'float': 'float 6s ease-in-out infinite',
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient': 'gradient-shift 4s ease infinite',
                'text-glow': 'text-glow 3s ease-in-out infinite',
                'scaleIn': 'scaleIn 0.4s ease-out forwards',
                'slideUp': 'slideUp 0.6s ease-out forwards',
                'slideDown': 'slideDown 0.4s ease-out forwards',
                'slideInLeft': 'slideInLeft 0.5s ease-out forwards',
                'slideInRight': 'slideInRight 0.3s ease-out forwards',
                'particle': 'particle-float 8s ease-in-out infinite',
                'blink': 'blink 1s step-end infinite',
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
