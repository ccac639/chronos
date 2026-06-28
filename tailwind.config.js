/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Chronos: 古画质感 + 现代风格 ── */
        /* 传统矿物色系：石青、石绿、朱砂、藤黄、赭石、花青 */
        ink: {
          950: '#0d0f14',
          900: '#161b22',
          800: '#21262d',
          700: '#30363d',
          600: '#484f58',
          500: '#6e7681',
          400: '#8b949e',
          300: '#b1bac4',
          200: '#c9d1d9',
          100: '#e6edf3',
          50: '#f6f8fa',
        },
        /* 石青 Azurite — 主色调 */
        azurite: {
          700: '#1a5276',
          600: '#2471a3',
          500: '#2e86c1',
          400: '#5dade2',
          300: '#85c1e9',
          200: '#aed6f1',
          100: '#d6eaf8',
        },
        /* 石绿 Malachite — 辅助色 */
        malachite: {
          700: '#1e8449',
          600: '#239b56',
          500: '#27ae60',
          400: '#52d681',
          300: '#82e0aa',
          200: '#abebc6',
          100: '#d5f5e3',
        },
        /* 朱砂 Vermillion — 强调色 */
        vermillion: {
          700: '#a93226',
          600: '#cb4335',
          500: '#e74c3c',
          400: '#ec7063',
          300: '#f1948a',
          200: '#fadbd8',
          100: '#fdedec',
        },
        /* 藤黄 Gamboge — 暖色 */
        gamboge: {
          700: '#b7950b',
          600: '#d4ac0d',
          500: '#f1c40f',
          400: '#f4d03f',
          300: '#f9e154',
          200: '#f9e79f',
          100: '#fef9e7',
        },
        /* 赭石 Ochre — 中性暖色 */
        ochre: {
          700: '#784212',
          600: '#935116',
          500: '#a04000',
          400: '#ba4a00',
          300: '#ca6f1e',
          200: '#e59866',
          100: '#f0d9c0',
          50: '#faf3eb',
        },
        /* 花青 Indigo — 深色辅助 */
        indigo: {
          600: '#4a235a',
          500: '#6c3483',
          400: '#8e44ad',
          300: '#a569bd',
          200: '#c39bd3',
          100: '#e8daef',
        },
        /* 宣纸色 */
        xuan: {
          DEFAULT: '#f8f5ef',
          dark: '#efe9df',
          light: '#fcfbf8',
        },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'Source Han Serif SC', 'SimSun', 'STSong', 'serif'],
        sans: ['Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
        brush: ['Ma Shan Zheng', 'ZCOOL KuaiLe', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'ink-spread': 'inkSpread 1s ease-out forwards',
        'brush-stroke': 'brushStroke 0.7s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        inkSpread: {
          '0%': { opacity: '0', transform: 'scale(0.8)', filter: 'blur(8px)' },
          '60%': { opacity: '1', filter: 'blur(2px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        brushStroke: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      backgroundImage: {
        'mountain-gradient': 'linear-gradient(160deg, #d6eaf8 0%, #aed6f1 25%, #d5f5e3 50%, #fef9e7 75%, #f0d9c0 100%)',
        'ink-gradient': 'linear-gradient(135deg, #161b22 0%, #21262d 50%, #30363d 100%)',
        'xuan-gradient': 'linear-gradient(180deg, #f8f5ef 0%, #efe9df 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #d4ac0d, #f9e79f, #d4ac0d)',
      },
    },
  },
  plugins: [],
};
