/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.0) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1.5%)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        kenburns: 'kenburns 28s ease-in-out infinite alternate',
        spinSlow: 'spinSlow 7s linear infinite',
      },
    },
  },
  plugins: [],
}
