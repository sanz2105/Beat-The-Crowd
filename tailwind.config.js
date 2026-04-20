/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',      // Electric Blue
        success: '#22C55E',      // Low crowd - Green
        warning: '#F59E0B',      // Medium crowd - Amber
        danger: '#EF4444',       // High crowd - Red
        'bg-dark': '#0F172A',    // Dark Navy background
        'card-dark': '#1E293B',  // Card background
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
