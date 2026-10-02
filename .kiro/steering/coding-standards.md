# Madurai EventSphere — Coding Standards

**Project:** Madurai EventSphere  
**Applies to:** All code in this repository  
**Enforced by:** Kiro IDE steering (always included)

---

## Language & Runtime

- JavaScript (ES2022+) with ESM (`"type": "module"`)
- React 18 functional components only — no class components
- Node.js 18+ for any scripts

---

## File & Folder Conventions

- **Components:** PascalCase filenames → `EventCard.jsx`, `Navbar.jsx`
- **Utilities / services / hooks:** camelCase filenames → `dateUtils.js`, `eventService.js`, `useAuth.js`
- **Test files:** co-located in `__tests__/` next to the file under test, suffixed `.test.js`
- **One component per file.** Do not export multiple components from one file.

---

## Component Rules

Always use functional components with named exports:

```js
// Good
export default function EventCard({ event, isBookmarked, onBookmark }) { ... }

// Bad
export default (props) => { ... }
const EventCard = function(props) { ... }
```

Destructure props at the function signature level, not inside the body.

---

## Tailwind CSS

Use Tailwind utility classes exclusively — no inline `style` props, no separate CSS files per component (global `index.css` is the only exception).

```jsx
// Good
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

// Bad
<button style={{ backgroundColor: '#2563eb', color: 'white' }}>
```

Responsive classes follow the `sm:` → `md:` → `lg:` progression. Mobile styles first (no prefix), larger screens use prefixes.

---

## Date & Time Handling

Always use the utility functions from `src/utils/dateUtils.js`. Never format dates inline or use `.toLocaleDateString()` directly in components.

```js
// Good
import { formatDate, isDeadlinePassed } from '../utils/dateUtils'
<span>{formatDate(event.event_date)}</span>

// Bad
<span>{new Date(event.event_date).toLocaleDateString()}</span>
```

---

## Constants & Configuration

All shared constants (categories, domains, micro-locations, map config) live in `src/utils/constants.js`. Never hardcode category values, location names, or map coordinates in components.

```js
// Good
import { CATEGORIES, MADURAI_CENTER } from '../utils/constants'

// Bad
const categories = ['hackathon', 'symposium', ...]  // inline in component
```

---

## Filter Parameter Handling

Strip empty and null values before sending filter params to the API. Use the pattern established in `eventService.js`:

```js
const params = Object.fromEntries(
  Object.entries(filters).filter(([, v]) => v !== '' && v != null)
)
```

Never forward empty strings or null values as query parameters — the backend treats them as active filter conditions.

---

## API Calls

All API calls go through the `src/services/api.js` Axios instance. Never use `fetch()` or create a second Axios instance.

```js
// Good
import api from './api'
const response = await api.get('/api/events', { params })

// Bad
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`)
```

---

## Secrets & Environment Variables

- `.env` is gitignored — never commit it
- Use `.env.example` (no real values) as the template
- Access env vars only via `import.meta.env.VITE_*` in frontend code
- Never hardcode API URLs, Supabase keys, or any credentials in source files

---

## Accessibility

- All icon-only buttons must have `aria-label`
- All form inputs must have an associated `<label>` (either visible or via `aria-label`)
- All images must have descriptive `alt` text
- Interactive elements must be reachable by Tab key

---

## Property-Based Tests

New pure utility functions (no React, no network) should have property-based tests in `src/utils/__tests__/` or `src/services/__tests__/`. Each test must:

1. State the requirement ID it verifies (e.g., `// FR-02`)
2. Express a universal property ("for any input in this set, X holds")
3. Test with at least: nullish inputs, boundary values, and a varied corpus

```js
// Good — universal property with varied inputs
describe('P1 [FR-01] formatDate — nullish inputs always return TBA', () => {
  [null, undefined, '', 0, false].forEach(input => {
    it(`formatDate(${JSON.stringify(input)}) === 'TBA'`, () => {
      expect(formatDate(input)).toBe('TBA')
    })
  })
})

// Bad — single example test
it('formatDate works', () => {
  expect(formatDate('2026-11-15')).toBe('Nov 15, 2026')
})
```

Run tests with: `npm test`
