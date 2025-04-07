/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
      shake: "shake 0.4s ease-in-out infinite",
      },
      keyframes: {
        shake: {
        "0%, 100%": { transform: "translateX(0)" },
        "25%": { transform: "translateX(-4px)" },
        "75%": { transform: "translateX(4px)" },
      },
    },},
  },
  plugins: [],
};

