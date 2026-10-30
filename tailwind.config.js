/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#09264A',
          950: '#061B35',
          900: '#09264A',
          800: '#0D3159',
          700: '#164B82',
          600: '#1D5C9C',
        },
        sky: {
          50: '#F8FAFD',
          100: '#EAF4FF',
          200: '#D8E9F9',
        },
        orange: {
          DEFAULT: '#FF861F',
          iver: '#FF861F',
          600: '#EC6F08',
          50: '#FFF4E9',
        },
        ink: '#142D4E',
        muted: '#64748B',
        line: '#E4EBF3',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'Segoe UI', 'sans-serif'],
        display: ['Manrope Variable', 'Manrope', 'Inter Variable', 'sans-serif'],
        fa: ['Vazirmatn Variable', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 40px -18px rgba(9, 38, 74, 0.22)',
        lift: '0 24px 60px -28px rgba(9, 38, 74, 0.35)',
        nav: '0 8px 30px -20px rgba(9, 38, 74, 0.28)',
      },
      borderRadius: {
        xl2: '1.125rem',
      },
      maxWidth: {
        shell: '1240px',
      },
    },
  },
  plugins: [],
};
