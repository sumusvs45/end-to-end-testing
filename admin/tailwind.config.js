/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to scan all JS/JSX/TS/TSX files in your src folder
    "./public/index.html",        // Optional: If you're using an HTML file in the public folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
