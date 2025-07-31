/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff0000',
          dark: '#cc0000',
          light: '#ff3333',
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc1c1',
          300: '#ff9a9a',
          400: '#ff6666',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#800000',
          900: '#660000',
          950: '#330000',
        },
        secondary: {
          DEFAULT: '#000000',
          dark: '#000000',
          light: '#333333',
          50: '#f2f2f2',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0d0d0d',
          950: '#000000',
        },
        accent: {
          500: '#ffffff',
        },
        navy: {
          DEFAULT: '#1e3a8a',
          dark: '#1e40af',
          light: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pattern': "url('/pattern.svg')",
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'gradient-primary': 'linear-gradient(to right, #ff0000, #330000)',
        'gradient-red-black': 'linear-gradient(135deg, #ff0000, #990000, #000000)',
        'gradient-black-red': 'linear-gradient(135deg, #000000, #330000, #ff0000)',
        'gradient-red-vertical': 'linear-gradient(to bottom, #ff0000, #330000)',
        'gradient-red-radial': 'radial-gradient(circle, #ff3333, #cc0000, #660000)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.100'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.light'),
              },
            },
            h1: {
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h2: {
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h3: {
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '600',
            },
            h4: {
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '600',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
