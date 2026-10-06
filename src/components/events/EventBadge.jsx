import { CATEGORY_STYLES } from '../../utils/constants'

export default function EventBadge({ category }) {
  const style = CATEGORY_STYLES[category?.toLowerCase()] ?? {
    bg:   'bg-gray-100',
    text: 'text-gray-700',
    dot:  'bg-gray-400',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${style.bg} ${style.text} ring-1 ring-inset ring-black/5`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} aria-hidden="true" />
      {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Event'}
    </span>
  )
}
