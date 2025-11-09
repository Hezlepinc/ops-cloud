/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5e9",
          light: "#38bdf8",
          dark: "#0284c7"
        },
        success: "#22c55e",
        warning: "#eab308",
        danger: "#ef4444",
        neutral: "#64748b"
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};


