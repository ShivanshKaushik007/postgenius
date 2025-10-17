// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0F0F0F',
        'primary': '#1B1B1B',
        'secondary': '#2B2B2B',
        'accent': {
          DEFAULT: '#7E22CE', // Vibrant Purple
          hover: '#9333EA',   // Lighter purple for hover
        },
        'light': '#F5F5F5',
        'muted': '#A3A3A3',
      },
      boxShadow: {
        'accent': '0 10px 30px -10px rgba(126, 34, 206, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config