/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',     // Vibrant yellow
        sage: '#B2AC88',        // Sage green
        terracotta: '#E2725B',  // Terracotta
      },
    },
  },
  plugins: [],
};
