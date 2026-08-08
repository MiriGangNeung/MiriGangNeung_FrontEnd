/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2F6FED', dark: '#1E54C4', tint: '#E8F0FE', soft: '#A9C7FF' },
        coral: { DEFAULT: '#F0573F', tint: '#FDEAE7' },
        ink: { DEFAULT: '#101828', muted: '#4B5468', soft: '#8A93A6' },
        line: { DEFAULT: '#E4E9F2', dashed: '#CFD8E8' },
        canvas: '#F4F7FC',
        fill: '#F1F4F9',
        slot: '#E8EDF5',
        ok: '#1F9E56',
      },
      fontFamily: { sans: ['Noto Sans KR', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.05)',
        lift: '0 12px 28px rgba(16,24,40,.13)',
        panel: '0 4px 20px rgba(16,24,40,.06)',
        cta: '0 6px 16px rgba(47,111,237,.3)',
        bar: '0 -2px 24px rgba(16,24,40,.08)',
      },
    },
  },
  plugins: [],
};
