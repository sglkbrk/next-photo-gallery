import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      xxl: '1920px',
      xxxl: '2560px'
    },
    letterSpacing: {
      '1': '0em',
      '2': '0.025em',
      '3': '0.05em',
      '4': '0.1em',
      '5': '0.2em',
      '6': '0.4em',
      '7': '0.6em',
      '8': '0.8em'
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      fontFamily: {
        effra: ['Effra', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
export default config;
