/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 100% 50%)',
        accent: 'hsl(180 70% 50%)',
        bg: 'hsl(220 20% 98%)',
        surface: 'hsl(255 100% 100%)',
        'shmoo-green': '#4ade80',
        'warning-red': '#ef4444',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 1px 2px 0 hsla(0, 0%, 0%, 0.05)',
      },
    },
  },
  plugins: [],
}
