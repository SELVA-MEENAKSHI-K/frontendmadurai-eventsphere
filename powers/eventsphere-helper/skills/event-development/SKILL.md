---
name: event-development
description: Project-specific guidance for building Madurai EventSphere frontend and backend features.
---

# EventSphere Event Development Skill
## Overview
This skill teaches Kiro how to build features for the **Madurai EventSphere** project — a mobile-first React 18 + Vite + Tailwind CSS frontend with a Node.js + Express backend, backed by Supabase (PostgreSQL + Auth + Storage).
Use this skill when: adding a new React component, writing a backend route, querying Supabase, or handling events/bookmarks.
---
## Project Structure
```
frontendmadurai-eventsphere/
  src/
    components/
      common/        Navbar, Footer, LoadingSpinner, EmptyState
      events/        EventCard, EventGrid, EventFilters, EventBadge
      forms/         EventForm, LocationPicker
      map/           EventMap, MapMarkerPopup
    context/         AuthContext.jsx, FilterContext.jsx
    hooks/           useEvents.js, useBookmarks.js, useAuth.js
    pages/           HomePage, EventDetailPage, BookmarksPage, ...
    services/        api.js (Axios), eventService.js, bookmarkService.js
    utils/           constants.js, dateUtils.js, mapUtils.js
  backend/
    src/
      app.js              Express entry — middleware, routes, error handler
      lib/
        supabaseClient.js Server-only Supabase admin client (service role)
      routes/
        events.js         GET /api/events
      middleware/         auth.js, validate.js (planned)
```
---
## Frontend Rules
### Components
- **Always** use named functional exports: `export default function EventCard({ event, isBookmarked, onBookmark }) {}`
- **Never** use class components or anonymous arrow exports
- Destructure props at the function signature — not inside the body
- **One component per file.** PascalCase filename: `EventCard.jsx`
- camelCase for utils/services/hooks: `dateUtils.js`, `useAuth.js`
### Tailwind CSS
- Utility classes only — no `style={}` props, no per-component CSS files
- Mobile-first: base → `sm:` → `md:` → `lg:`
- Brand colors: `primary-500` (#3b82f6), `primary-600`, `primary-700`
- Category colors (badges + map markers):
| Category  | bg class        | text class        | dot class      |
|-----------|-----------------|-------------------|----------------|
| hackathon | bg-red-100      | text-red-700      | bg-red-500     |
| symposium | bg-blue-100     | text-blue-700     | bg-blue-500    |
| bootcamp  | bg-purple-100   | text-purple-700   | bg-purple-500  |
| meetup    | bg-green-100    | text-green-700    | bg-green-500   |
| workshop  | bg-amber-100    | text-amber-700    | bg-amber-500   |
| community | bg-pink-100     | text-pink-700     | bg-pink-500    |
Always import badge colors from `CATEGORY_STYLES` in `src/utils/constants.js` — never hardcode them.
### Constants — always import, never hardcode
```js
import { CATEGORIES, DOMAINS, MICRO_LOCATIONS, CATEGORY_STYLES, MADURAI_CENTER, MADURAI_ZOOM, SEARCH_DEBOUNCE_MS } from '../utils/constants'
```
### Date formatting — always use dateUtils
```js
import { formatDate, formatDateTime, isDeadlinePassed, isDeadlineSoon, deadlineCountdown } from '../utils/dateUtils'
// Good
<span>{formatDate(event.event_date)}</span>
// Bad — never do this
<span>{new Date(event.event_date).toLocaleDateString()}</span>
```
### API calls — single Axios instance only
```js
import api from '../services/api'
// Never use fetch() or create a second axios.create()
const response = await api.get('/api/events', { params })
```
### Filter params — strip nulls before sending
```js
const params = Object.fromEntries(
  Object.entries(filters).filter(([, v]) => v !== '' && v != null)
)
```
### Accessibility — required on every component
- All icon-only buttons: `aria-label="Bookmark event"`
- All images: descriptive `alt` text
- All form inputs: associated `<label>` element
### Leaflet map
- Default center: `MADURAI_CENTER` = `[9.9252, 78.1198]`, zoom: `MADURAI_ZOOM` = `12`
- Custom SVG markers: use `createCategoryMarker(category)` from `src/utils/mapUtils.js`
- Import Leaflet CSS in `main.jsx` before any map component
---
## Backend Rules
### Response envelope — always use this shape
```json
{ "success": true, "data": [...], "count": 3 }
{ "success": false, "error": "message" }
```
### Supabase client — server-only
```js
// Always import from here — never create a second client
import supabase from '../lib/supabaseClient.js'
```
`supabaseClient.js` uses the SERVICE ROLE key and bypasses RLS. Never import it from frontend code.
### Error handling — always use next(err)
```js
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('events').select('*')
    if (error) throw error
    res.json({ success: true, data, count: data.length })
  } catch (err) {
    next(err)   // flows to global error handler in app.js
  }
})
```
### Mounting routes — always before the global error handler in app.js
```js
app.use('/api/events', eventsRouter)
// ── Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => { ... })
```
---
## Supabase Schema (public)
| Table        | Key columns                                                                 | RLS |
|--------------|-----------------------------------------------------------------------------|-----|
| profiles     | id (FK auth.users), full_name, role (student/organizer), college            | ✅  |
| events       | id, organizer_id (FK profiles), title, category, domain[], micro_location,  | ✅  |
|              | event_date, deadline, is_published, latitude, longitude, poster_url         |     |
| bookmarks    | id, user_id (FK profiles), event_id (FK events), UNIQUE(user_id, event_id)  | ✅  |
| event_stats  | event_id (FK events), bookmark_count, view_count — trigger-managed          | ✅  |
**Category CHECK constraint:** `symposium`, `hackathon`, `bootcamp`, `meetup`, `workshop`, `community`
**Key RLS rules:**
- Anyone reads published events (`is_published = true`)
- Only `role = 'organizer'` profiles can INSERT events
- Users read/write only their own bookmarks
- `event_stats` — no client access; service role only
---
## API Endpoints
| Method | Path                    | Auth     | Description                        |
|--------|-------------------------|----------|------------------------------------|
| GET    | /api/health             | None     | Uptime check                       |
| GET    | /api/events             | None     | Published events, filterable       |
| GET    | /api/events/:id         | None     | Single event full detail           |
| POST   | /api/events             | Organizer| Create event                       |
| PUT    | /api/events/:id         | Organizer| Update own event                   |
| DELETE | /api/events/:id         | Organizer| Delete own event                   |
| GET    | /api/bookmarks          | Any user | User's bookmarks                   |
| POST   | /api/bookmarks          | Any user | Add bookmark                       |
| DELETE | /api/bookmarks/:event_id| Any user | Remove bookmark                    |
Filter params for GET /api/events: `category`, `domain`, `micro_location`, `date_from`, `date_to`, `search`
---
## Environment Variables
**Frontend** (never expose service role key here):
- `VITE_API_BASE_URL` — backend URL (e.g. `http://localhost:3001`)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — publishable/anon key only
**Backend** (server-only, never send to client):
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key, bypasses RLS
- `PORT` — defaults to 3001
Never log, print, or suggest printing env var values.

