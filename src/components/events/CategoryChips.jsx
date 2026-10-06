import { CATEGORIES, CATEGORY_STYLES } from '../../utils/constants'

const ICONS = {
  hackathon: '💻',
  symposium: '🎤',
  bootcamp:  '🚀',
  meetup:    '🤝',
  workshop:  '🛠️',
  community: '🌱',
}

/** One-tap category filter strip.
 *  Tapping the active chip clears it. "All" chip uses teal. */
export default function CategoryChips({ value, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-thin"
      role="group"
      aria-label="Quick category filter"
    >
      {/* All chip */}
      <Chip
        active={value === ''}
        onClick={() => onChange('')}
        activeClass="bg-teal-500 border-teal-500 text-white"
        inactiveClass="bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-teal-500 dark:hover:border-teal-400"
      >
        ✨ All
      </Chip>

      {CATEGORIES.map(c => {
        const styles = CATEGORY_STYLES[c.value]
        return (
          <Chip
            key={c.value}
            active={value === c.value}
            onClick={() => onChange(value === c.value ? '' : c.value)}
            activeClass={`${styles.bg} ${styles.text} border-transparent`}
            inactiveClass="bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-brand-400 dark:hover:border-brand-500"
          >
            {ICONS[c.value]} {c.label}
          </Chip>
        )
      })}
    </div>
  )
}

function Chip({ active, onClick, activeClass, inactiveClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 ${
        active ? activeClass : inactiveClass
      } ${active ? '' : 'hover:-translate-y-0.5'}`}
    >
      {children}
    </button>
  )
}
