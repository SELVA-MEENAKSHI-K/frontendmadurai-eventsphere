/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EventSphere brand colors
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Category colors (used on badges and map markers)
        category: {
          hackathon:  '#EF4444',
          symposium:  '#3B82F6',
          bootcamp:   '#8B5CF6',
          meetup:     '#10B981',
          workshop:   '#F59E0B',
          community:  '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
