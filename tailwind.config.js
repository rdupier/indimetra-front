/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#2A2929",
        textBase: "#FFF8F8",
        subtext: 'A9A59B',
        hoverBg: "#E3E1DE",
        hoverText: "#2A2929",
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem', {
          lineHeight: '1.5rem',
          letterSpacing: '0.002rem',
          fontWeight: '500',
        }],
        bodyS: ['0.875rem', {
          lineHeight: '1.25rem',
          letterSpacing: '0.00175rem',
          fontWeight: '500',
        }],
        bodyXS: ['0.75rem', {
          lineHeight: '1rem',
          letterSpacing: '0.00375rem',
          fontWeight: '500',
        }],
        actionBase: ['1rem', {
          lineHeight: '1.5rem',
          letterSpacing: '0.002rem',
          fontWeight: '600',
        }],
        actionS: ['0.875rem', {
          lineHeight: '1.25rem',
          letterSpacing: '0.00175rem',
          fontWeight: '600',
        }],
        actionXS: ['0.75rem', {
          lineHeight: '1rem',
          letterSpacing: '0.00375rem',
          fontWeight: '600',
        }],
        h2: ['1.75rem', {
          lineHeight: '1.5rem',
          fontWeight: '600',
          fontFamily: 'Manrope',
        }],
        h3: ['1.625rem', {
          lineHeight: '3.0625rem',
          fontWeight: '600',
        }],
        h4: ['1.375rem', {
          lineHeight: '2.5625rem',
          fontWeight: '600',
        }],
        h5: ['1.25rem', {
          lineHeight: '2.125rem',
          fontWeight: '600',
        }],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [],
  },
};
