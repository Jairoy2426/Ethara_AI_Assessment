/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        background: {
          outer: "#d9cfff",
          main: "#121214",
          card: "#1c1c1f",
        },
        brand: {
          DEFAULT: "#b088f9",
          glow: "rgba(176, 136, 249, 0.4)",
          light: "#d5bfff",
        }
      }
    }
  },
  plugins: []
};
