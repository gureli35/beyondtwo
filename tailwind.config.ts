import { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e7',
          500: '#2D7D46', // Ana yeşil
          600: '#266639',
          700: '#1f522e',
          800: '#1b4327',
          900: '#173820',
        },
        secondary: {
          50: '#eff8ff',
          100: '#dbeafe',
          500: '#1A5276', // Derin mavi
          600: '#164560',
          700: '#12394e',
          800: '#0f2f40',
          900: '#0d2635',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#F39C12', // Turuncu
          600: '#e67e22',
          700: '#d35400',
          800: '#a04000',
          900: '#7d3300',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
} satisfies Config;
