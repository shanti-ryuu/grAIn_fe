/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'grain-green': '#34C759',
        'grain-gold': '#FFD700',
        'grain-dark': '#000000',
        'ios-bg': '#F2F2F7',
        'ios-card': '#FFFFFF',
        'ios-text': '#000000',
        'ios-text-secondary': '#3C3C43',
        'ios-text-tertiary': '#8E8E93',
        'ios-sep': '#C6C6C8',
        'ios-blue': '#007AFF',
        'ios-red': '#FF3B30',
      },
      borderRadius: {
        'ios': '18px',
        'ios-lg': '20px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'ios-md': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        'ios-safe': '16px',
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'],
      },
      animation: {
        'ios-pulse': 'ios-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ios-bounce': 'ios-bounce 0.5s ease-in-out',
      },
      keyframes: {
        'ios-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ios-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [],
};
