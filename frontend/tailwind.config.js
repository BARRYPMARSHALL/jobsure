/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0c0c12',
        'surface-deep': '#030303',
        muted: '#64748b',
        'muted-light': '#94a3b8',
        accent: '#10b981',
        'accent-dark': '#059669',
      },
    },
  },
  plugins: [],
}
