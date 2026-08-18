/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'fiverr-green': '#1dbf73',
        'forest-stage': '#003912',
        carbon: '#222325',
        graphite: '#62646a',
        paper: '#ffffff',
        mist: '#dadbdd',
        fog: '#c5c6c9',
        slate: '#404145',
        smoke: '#74767e',
      },
      fontFamily: {
        display: ['"DM Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.06em',
        heading: '-0.03em',
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.13) 0px 3px 10px 0px',
      },
    },
  },
  plugins: [],
};
