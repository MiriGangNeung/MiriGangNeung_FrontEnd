/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2F6FED', dark: '#1E54C4', tint: '#E8F0FE', soft: '#A9C7FF' },
        coral: { DEFAULT: '#F0573F', dark: '#D8412B', tint: '#FDEAE7' },
        ink: { DEFAULT: '#101828', muted: '#4B5468', soft: '#8A93A6' },
        line: { DEFAULT: '#E4E9F2', dashed: '#CFD8E8' },
        canvas: '#F4F7FC',
        fill: '#F1F4F9',
        slot: '#E8EDF5',
        ok: '#1F9E56',
        // Intro landing surface — cool pale-blue coastal field (scoped to the intro page)
        sand: { DEFAULT: '#EEF4FB', deep: '#E3EDF8' },
        sea: { DEFAULT: '#125773', deep: '#0C3E54' },
        // Intro blue ladder — deep navy -> mid blue -> grey (text + accents, no warm hue)
        navy: { DEFAULT: '#1A3A5C', deep: '#14304F' },
        azure: '#3B6FA0',
        label: '#4A7AB5',
        heading: '#1A2740',
        copy: '#737D8C',
        dive: { DEFAULT: '#1E5A96', dark: '#173F63' },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'system-ui', 'sans-serif'],
        serif: ['Gowun Batang', 'Nanum Myeongjo', 'Georgia', 'serif'],
      },
      keyframes: {
        'wave-lead': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'wave-trail': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'wave-lead': 'wave-lead 13s linear infinite',
        'wave-trail': 'wave-trail 19s linear infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.05)',
        lift: '0 12px 28px rgba(16,24,40,.13)',
        panel: '0 4px 20px rgba(16,24,40,.06)',
        cta: '0 6px 16px rgba(47,111,237,.3)',
        sunrise: '0 8px 20px rgba(30,90,150,.28)',
        bar: '0 -2px 24px rgba(16,24,40,.08)',
      },
    },
  },
  plugins: [],
};
