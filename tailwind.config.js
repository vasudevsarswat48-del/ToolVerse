/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#3b82f6",
        surface: {
          100: "#18181b",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  plugins: [],
};