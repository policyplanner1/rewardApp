/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#852BAF',
          pink: '#FC3F78',
          'light-pink': '#FF7CA3',
          'light-purple': '#D887FD',
        }
      },
    },
  },
  plugins: [],
}