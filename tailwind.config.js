/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPink: "#D9A39B",
        customBlue: "#8FA8D4",
        customNavyBlue: "#232946",
        customWhite: "#FFFFFE",
        customHoverBlue: "#6A8EBE",
        customeHoverBlue: "#6A8EBE", 
        customHoverNavy: "#1A1E34",
        customHoverPink: "#B06A6A",
        primary: '#1a1a2e',
        secondary: '#16213e',
      },
    },
  },
  plugins: [],
}
