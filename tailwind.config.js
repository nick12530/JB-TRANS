/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy Blue
        navy: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0B3D91',
          600: '#1E5BB8',
          700: '#082A6B',
          800: '#1565C0',
          900: '#0D47A1',
        },
        // Secondary Mint White
        mint: {
          50: '#F9FBE7',
          100: '#F1F8E9',
          200: '#E8F5E9',
          300: '#C8E6C9',
          400: '#A5D6A7',
          500: '#81C784',
          600: '#66BB6A',
          700: '#4CAF50',
          800: '#388E3C',
          900: '#2E7D32',
        },
        // Accent Eco Green
        eco: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#00C853',
          600: '#4CAF50',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#0D4F1A',
        },
        // Highlight Signal Yellow
        signal: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF176',
          300: '#FFEB3B',
          400: '#FFD600',
          500: '#F57F17',
          600: '#E65100',
          700: '#BF360C',
          800: '#D84315',
          900: '#BF360C',
        },
        // Text Colors
        text: {
          primary: '#1C1C1C',
          secondary: '#424242',
          tertiary: '#757575',
          disabled: '#BDBDBD',
        },
        // Legacy colors for compatibility
        'bright-green': '#00C853',
        'miraa-green': '#00C853',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'navy': '0 4px 6px -1px rgba(11, 61, 145, 0.1), 0 2px 4px -1px rgba(11, 61, 145, 0.06)',
        'eco': '0 4px 6px -1px rgba(0, 200, 83, 0.1), 0 2px 4px -1px rgba(0, 200, 83, 0.06)',
        'signal': '0 4px 6px -1px rgba(255, 214, 0, 0.1), 0 2px 4px -1px rgba(255, 214, 0, 0.06)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}