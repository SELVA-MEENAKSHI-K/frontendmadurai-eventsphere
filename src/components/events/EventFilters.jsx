import { CATEGORIES, DOMAINS, MICRO_LOCATIONS } from '../../utils/constants'

export default function EventFilters({ filters, onChange, onClear, resultCount }) {
  function handleChange(e) { onChange(e.target.name, e.target.value) }
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
          </span>
          <input type="search" name="search" value={filters.search} onChange={handleChange} placeholder="Search events by name or description..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" aria-label="Search events" />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-gray-500 whitespace-nowrap">Showing <span className="font-semibold text-gray-800">{resultCount}</span> event{resultCount !== 1 ? 's' : ''}</span>
          {hasActiveFilters && <button onClick={onClear} className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap transition-colors">Clear filters</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label htmlFor="filter-category" className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select id="filter-category" name="category" value={filters.category} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-domain" className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
          <select id="filter-domain" name="domain" value={filters.domain} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">All domains</option>
            {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-location" className="block text-xs font-medium text-gray-500 mb-1">Area</label>
          <select id="filter-location" name="micro_location" value={filters.micro_location} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">All areas</option>
            {MICRO_LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-date-from" className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" id="filter-date-from" name="date_from" value={filters.date_from} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
        <div>
          <label htmlFor="filter-date-to" className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" id="filter-date-to" name="date_to" value={filters.date_to} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
      </div>
    </div>
  )
}
