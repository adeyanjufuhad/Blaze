/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blaze: {
          bg: '#fffaf5',
          card: '#ffffff',
          dark: '#1a0a00',
          orange: '#ff4500',
          'orange-light': '#ff6b35',
          'orange-glow': 'rgba(255, 69, 0, 0.25)',
          'orange-hover': '#e03d00',
          'orange-tint': '#fff5f0',
          border: '#f0e6d9',
          muted: '#8a6a50',
          admin: '#f9f5f0',
          'admin-dark': '#1a0a00',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'blaze-card': '0 2px 20px rgba(255, 69, 0, 0.08)',
        'blaze-card-hover': '0 8px 30px rgba(255, 69, 0, 0.14)',
        'blaze-glow': '0 0 25px rgba(255, 69, 0, 0.35)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
