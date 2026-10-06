import { CATEGORIES, DOMAINS, MICRO_LOCATIONS } from '../../utils/constants'

const selectCls =
  'w-full text-sm border border-brand-200 dark:border-brand-700 rounded-xl px-3 py-2 bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors'

const labelCls = 'block text-xs font-semibold text-brand-600/60 dark:text-brand-300 mb-1 uppercase tracking-wide'

export default function EventFilters({ filters, onChange, onClear, resultCount }) {
  function handleChange(e) { onChange(e.target.name, e.target.value) }
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-4">

      {/* Search + result count row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          {/* Search icon — brand-600/40 on white bg is decorative ✅ */}
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-600/40 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search events by name or description…"
            aria-label="Search events"
            className="w-full pl-9 pr-4 py-2 text-sm border border-brand-200 dark:border-brand-700 rounded-xl bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 placeholder:text-brand-600/40 dark:placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-brand-600/60 dark:text-brand-300 whitespace-nowrap">
            Showing{' '}
            <span className="font-bold text-brand-600 dark:text-brand-100">{resultCount}</span>
            {' '}event{resultCount !== 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm font-semibold text-saffron-600 dark:text-saffron-400 hover:text-saffron-500 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 rounded"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label htmlFor="filter-category" className={labelCls}>Category</label>
          <select id="filter-category" name="category" value={filters.category} onChange={handleChange} className={selectCls}>
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-domain" className={labelCls}>Domain</label>
          <select id="filter-domain" name="domain" value={filters.domain} onChange={handleChange} className={selectCls}>
            <option value="">All domains</option>
            {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-location" className={labelCls}>Area</label>
          <select id="filter-location" name="micro_location" value={filters.micro_location} onChange={handleChange} className={selectCls}>
            <option value="">All areas</option>
            {MICRO_LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-date-from" className={labelCls}>From</label>
          <input type="date" id="filter-date-from" name="date_from" value={filters.date_from} onChange={handleChange} className={selectCls} />
        </div>

        <div>
          <label htmlFor="filter-date-to" className={labelCls}>To</label>
          <input type="date" id="filter-date-to" name="date_to" value={filters.date_to} onChange={handleChange} className={selectCls} />
        </div>
      </div>
    </div>
  )
}
