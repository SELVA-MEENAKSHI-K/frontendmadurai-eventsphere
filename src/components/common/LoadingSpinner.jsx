export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 gap-4"
      role="status"
      aria-live="polite"
    >
      {/* Saffron-600 ring — spinner colour visible on both light and dark bg */}
      <div className="w-10 h-10 rounded-full border-4 border-brand-100 border-t-saffron-600 animate-spin dark:border-brand-800 dark:border-t-saffron-400" />
      <p className="text-sm text-brand-600 dark:text-brand-200">{message}</p>
    </div>
  )
}
