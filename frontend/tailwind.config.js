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
        accent: '#34d399',
        'accent-dark': '#059669',
        'footer-muted': '#475569',
      },
      blur: {
        ambient: '120px',
      },
      letterSpacing: {
        micro: '0.08em',
        tag: '0.12em',
        label: '0.15em',
        'wide-label': '0.2em',
      },
      fontSize: {
        'micro-label': ['10px', { lineHeight: '1.2' }],
        'tag': ['11px', { lineHeight: '1.3' }],
        'tiny': ['9px', { lineHeight: '1.2' }],
        'display-num': ['2.8rem', { lineHeight: '1' }],
        'display-num-mobile': ['1.8rem', { lineHeight: '1' }],
      },
      spacing: {
        'ambient-globe': '900px',
        'ambient-globe-h': '700px',
        'ambient-mid': '800px',
        'ambient-mid-h': '600px',
        'ambient-sm': '700px',
        'ambient-sm-h': '500px',
        'content-md': '560px',
        'content-lg': '620px',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
