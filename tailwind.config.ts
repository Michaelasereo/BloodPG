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
        background: '#f2f2f2',
        'grey-light': '#f2f2f2',
        'grey-medium': '#d9d9d9',
        'grey-dark': '#757575',
        'grey-border': '#d1d1d1',
        'grey-text': '#7e7e7e',
        'grey-bg': '#ededed',
        'grey-table': '#e7e7e7',
        'grey-table-border': '#eaeaea',
        'black-primary': '#000000',
        'black-secondary': '#212121',
        'black-text': '#1d1d1d',
        'neutral-400': '#9ca3af',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs-custom': '8.271px',
        'sm-custom': '10px',
        'base-custom': '12px',
        'md-custom': '14px',
        'lg-custom': '16px',
        'xl-custom': '17px',
        '2xl-custom': '20px',
        '3xl-custom': '24px',
        '4xl-custom': '23.226px',
        'huge': '92.577px',
      },
      letterSpacing: {
        'tight-custom': '-1.3935px',
        'tight-2': '-0.4963px',
        'tight-3': '-0.24px',
        'tight-4': '-0.14px',
        'tight-5': '-0.12px',
        'tight-6': '-0.64px',
        'tight-7': '-0.75px',
        'normal-custom': '0.11px',
        'normal-2': '0.12px',
        'normal-3': '0.14px',
        'normal-4': '0.16px',
        'normal-5': '0.2px',
        'wide-custom': '0.44px',
      },
      spacing: {
        '0.5-custom': '1.791px',
        '1-custom': '3.068px',
        '2-custom': '10.227px',
      },
      borderRadius: {
        'custom-1': '3.068px',
        'custom-2': '17px',
        'custom-3': '21px',
        'custom-4': '28px',
      },
    },
  },
  plugins: [],
}
export default config

