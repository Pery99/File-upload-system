/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./app/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
        },
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      scale: {
        102: "1.02",
      },
      borderWidth: {
        3: "3px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        'bounce-slow': 'bounce 3s linear infinite',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      backgroundSize: {
        '300%': '300%',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'primary-glow': '0 0 15px 2px var(--primary)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities, theme }) {
      const utilities = {
        '.bg-primary-opacity': {
          backgroundColor: 'rgb(var(--primary) / 0.5)',
        },
        '.ring-primary-opacity': {
          '--tw-ring-color': 'rgb(var(--primary) / 0.5)',
        },
      };
      addUtilities(utilities);
    },
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'shadow-primary',
    {
      pattern: /^(bg|text|border|shadow)-primary(-dark)?\/[0-9]+$/,
    },
  ],
};
