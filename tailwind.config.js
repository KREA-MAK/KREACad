/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index_react.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563eb',
        'dark-bg': '#111827',
        'light-bg': '#f9fafb',
      },
    },
  },
  plugins: [],
}
