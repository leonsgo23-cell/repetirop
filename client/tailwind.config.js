/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'xp-pop': 'xpPop 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        xpPop: {
          '0%': { transform: 'scale(0) translateY(0)', opacity: 1 },
          '50%': { transform: 'scale(1.3) translateY(-20px)', opacity: 1 },
          '100%': { transform: 'scale(1) translateY(-40px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
