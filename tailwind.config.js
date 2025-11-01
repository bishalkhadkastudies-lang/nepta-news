/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'nytimes': {
          'black': '#121212',
          'gray': '#666666',
          'light-gray': '#f7f7f7',
          'border': '#e2e2e2',
          'accent': '#004276',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
