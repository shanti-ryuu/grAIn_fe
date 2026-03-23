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
        // Semantic brand colors
        'grain-green': '#34C759',    // Primary action
        'grain-gold': '#FFD700',     // Accent
        'grain-dark': '#000000',     // Text
        
        // iOS-inspired color palette
        'ios-bg': '#F2F2F7',
        'ios-card': '#FFFFFF',
        'ios-text': '#000000',
        'ios-text-secondary': '#3C3C43',
        'ios-text-tertiary': '#8E8E93',
        'ios-sep': '#C6C6C8',
        
        // Semantic colors (status indicators)
        'status-success': '#34C759',      // Green
        'status-warning': '#FF9500',      // Orange
        'status-danger': '#FF3B30',       // Red
        'status-info': '#30B0C0',         // Cyan
        
        'ios-blue': '#007AFF',
        'ios-red': '#FF3B30',
        
        // Shades for gradients
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
      },
      borderRadius: {
        'ios': '18px',
        'ios-lg': '20px',
        'xs-ios': '12px',
        'sm-ios': '14px',
        'md-ios': '16px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'ios-md': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'ios-xl': '0 20px 50px rgba(0, 0, 0, 0.18)',
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'ios-safe': '16px',
        // 8px grid system
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
        '16': '0.16',
      },
      animation: {
        'ios-pulse': 'ios-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ios-bounce': 'ios-bounce 0.5s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-in-up': 'slide-in-up 0.4s ease-out',
        'slide-in-down': 'slide-in-down 0.4s ease-out',
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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
