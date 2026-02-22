/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chrome: '#d9dde8',
        magenta: '#ff00ff',
        iosBlue: '#007aff',
        iosGreen: '#34c759',
        iosRed: '#ff3b30',
        iosOrange: '#ff9500',
        iosBg: '#f2f2f7',
      },
      fontFamily: {
        impact: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        ios: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        y2k: '0 0 0 3px #ff00ff, 0 18px 40px rgba(0, 0, 0, 0.18)',
      },
      backgroundImage: {
        chrome: 'linear-gradient(135deg, #fdfdff 0%, #d9dde8 20%, #f8f8ff 40%, #bfc8db 60%, #ffffff 80%, #d1d7e5 100%)',
      },
    },
  },
  plugins: [],
}
