import { CATEGORY_STYLES } from '../../utils/constants'

export default function EventBadge({ category }) {
  const style = CATEGORY_STYLES[category?.toLowerCase()] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Event'}
    </span>
  )
}
