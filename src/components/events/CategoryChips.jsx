import { CATEGORIES, CATEGORY_STYLES } from '../../utils/constants'

const ICONS = {
  hackathon: '💻', symposium: '🎤', bootcamp: '🚀',
  meetup: '🤝', workshop: '🛠️', community: '🌱',
}

/** One-tap category filter. Tapping the active chip clears it. */
export default function CategoryChips({ value, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-thin"
      role="group"
      aria-label="Quick category filter"
    >
      <Chip active={value === ''} onClick={() => onChange('')}>✨ All</Chip>
      {CATEGORIES.map(c => (
        <Chip
          key={c.value}
          active={value === c.value}
          dot={CATEGORY_STYLES[c.value]?.dot}
          onClick={() => onChange(value === c.value ? '' : c.value)}
        >
          {ICONS[c.value]} {c.label}
        </Chip>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:-translate-y-0.5'
      }`}
    >
      {children}
    </button>
  )
}
