/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        koraDark: '#0f172a',
        koraCard: '#1e293b',
        koraGreen: '#10b981',
      },
    },
  },
  plugins: [],
}
