/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lf: {
          bg:        '#fdfbf6',
          bg2:       '#fdfbf6',
          bg3:       '#fdfbf6',
          navy:      '#211b17',
          body:      '#4a4641',
          mid:       '#6e6864',
          muted:     '#aca59e',
          gold:      '#e8290d',
          'gold-lt': '#ff5840',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Noto Serif KR"', 'Georgia', 'serif'],
        sans:  ['"Noto Sans KR"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
