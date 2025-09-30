/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... other Tailwind CSS configuration options ...
  content: [
    './src/**/*.{html,js,jsx,tsx,ejs}', // Scan files in the `src` directory for CSS classes
    './node_modules/tailwindcss/**/*.css', // Scan Tailwind CSS base styles
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0D7DC0', // Nome personalizado para a cor
      },
    },
  },
  plugins: [],
};