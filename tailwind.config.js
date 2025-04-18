/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
      colors: {
        'primary': '#fed856',  // Amarillo
        'dark': '#312b2b',     // Fondo oscuro
        'light': '#f8f1d8',    // Fondo claro
        'mid': '#473f3f',      // Tono medio
      },
    },
  },
  plugins: [],
};
