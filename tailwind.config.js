/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ['Mali', 'sans-serif'],
    },
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '50%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        slideIn: 'slideIn 7s ease-in-out',
        slideOut: 'slideOut 9s ease-in-out',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave"],
  },
};

