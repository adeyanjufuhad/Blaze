/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        oriente: {
          bg: '#faf9f6',
          card: '#ffffff',
          primary: '#111111',
          secondary: '#666666',
          accent: '#2d5a27',
          'accent-hover': '#23471f',
          border: '#e8e4dd',
          badge: '#111111',
          tint: '#f5f2ed',
          catering: '#f0ece4',
        },
        blaze: {
          bg: '#faf9f6',
          card: '#ffffff',
          dark: '#111111',
          orange: '#2d5a27',
          'orange-light': '#3a7332',
          'orange-glow': 'rgba(45, 90, 39, 0.15)',
          'orange-hover': '#23471f',
          'orange-tint': '#f5f2ed',
          border: '#e8e4dd',
          muted: '#666666',
          admin: '#faf9f6',
          'admin-dark': '#111111',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
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
        'oriente-subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'oriente-card': '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'marquee-fast': 'marquee 45s linear infinite',
        marquee: 'marquee 65s linear infinite',
        'marquee-slow': 'marquee 85s linear infinite',
        'marquee-reverse': 'marquee-reverse 65s linear infinite',
        'marquee-reverse-slow': 'marquee-reverse 85s linear infinite',
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
