/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // Class-based dark mode — toggled via <html class="dark">
  darkMode: 'class',

  theme: {
    extend: {
      // ── Madurai brand palette ──────────────────────────────────────────────
      colors: {
        // Deep maroon — primary brand, hero bg, headings on light surfaces
        brand: {
          50:  '#FDF6EC',   // warm cream — page background (light mode)
          100: '#FAE8CC',
          200: '#F5C88A',
          300: '#EDA849',
          400: '#E8890F',
          500: '#C9860C',   // gold accent (icon fill, decorative)
          600: '#7B1828',   // deep maroon — primary brand colour
          700: '#5C0F1B',
          800: '#3E0812',
          900: '#26050B',
          950: '#120A08',   // near-black maroon — dark mode page bg
        },

        // Saffron — CTAs and interactive affordances
        // #E8630A (saffron-400) on cream = ~3.15:1 (large text ≥24px only)
        // #E8630A on white   = ~3.38:1 (large text ≥24px only)
        // #B84D00 (saffron-600) bg + white text = 5.12:1 ✅ all sizes
        // #B84D00 as text on cream = 4.77:1 ✅ all sizes
        saffron: {
          300: '#F5A85A',   // decorative tint
          400: '#E8630A',   // icons, borders, illustrations; large text (≥24px) on cream/maroon only
          500: '#CB5C09',   // hover state for buttons
          600: '#B84D00',   // CTA button bg → white: 5.12:1 ✅; text on cream: 4.77:1 ✅
          700: '#8C3A00',   // pressed / active
        },

        // Teal — success states, check-in, secondary actions
        // #0D7E76 bg + white text = 4.93:1 ✅
        // #0A615A as text on cream = 6.82:1 ✅
        // #0D7E76 as text on maroon = 1.9:1 ❌ — never combine
        teal: {
          100: '#CCEFED',
          200: '#99DFD9',
          400: '#0FB8AD',
          500: '#0D7E76',   // chip/badge bg (white text: 4.93:1 ✅)
          600: '#0A615A',   // link/text on cream (6.82:1 ✅)
          700: '#084E48',
        },

        // Gold — deadline urgency, decorative highlights
        // #F5C842 on maroon = 6.60:1 ✅ all sizes
        gold: {
          300: '#F5C842',   // text on maroon: 6.60:1 ✅; decorative large text
          400: '#DBA50C',   // icon fill on light bg
          500: '#C9860C',   // decorative/icon only — insufficient contrast as normal text
        },

        // Semantic aliases (keeps existing code that uses 'primary.*' working)
        primary: {
          50:  '#FDF6EC',
          100: '#FAE8CC',
          500: '#B84D00',   // remapped to accessible saffron-600
          600: '#7B1828',   // remapped to brand maroon
          700: '#5C0F1B',
        },

        // Category badge colours — unchanged (existing CATEGORY_STYLES in constants.js)
        category: {
          hackathon:  '#EF4444',
          symposium:  '#3B82F6',
          bootcamp:   '#8B5CF6',
          meetup:     '#10B981',
          workshop:   '#F59E0B',
          community:  '#EC4899',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },

      // ── Shadows ────────────────────────────────────────────────────────────
      boxShadow: {
        card:   '0 1px 3px rgba(26,15,10,0.07), 0 4px 12px rgba(26,15,10,0.05)',
        hover:  '0 4px 16px rgba(26,15,10,0.12)',
        glow:   '0 0 0 3px rgba(184,77,0,0.30)',   // saffron-600 focus ring
        'glow-teal': '0 0 0 3px rgba(13,126,118,0.30)',
      },

      // ── Background patterns ─────────────────────────────────────────────────
      backgroundImage: {
        // Subtle repeated dot grid — kolam / rangoli inspired
        'kolam-dots': 'radial-gradient(circle, rgba(123,24,40,0.07) 1px, transparent 1px)',
        // Diagonal subtle lines for dark surfaces
        'kolam-lines': 'repeating-linear-gradient(45deg, rgba(253,246,236,0.04) 0px, rgba(253,246,236,0.04) 1px, transparent 1px, transparent 8px)',
      },
      backgroundSize: {
        'kolam': '20px 20px',
      },

      // ── Border radius ──────────────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.75rem',
      },

      // ── Animation ──────────────────────────────────────────────────────────
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // Used only when prefers-reduced-motion: no-preference
        'fade-slide-up': 'fadeSlideUp 0.3s ease-out both',
        'fade-in':       'fadeIn 0.2s ease-out both',
      },
    },
  },

  plugins: [],
}
