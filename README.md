# Madurai EventSphere

Madurai EventSphere is an event discovery platform for students, founders, and organizers in Madurai. It helps people find hackathons, symposiums, workshops, bootcamps, meetups, and community events through searchable listings, filters, event details, and a map.

## Links

- **Live app:** https://frontendmadurai-eventsphere.vercel.app/
- **GitHub repository:** https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere
- **Kiro Power:** https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere/tree/master/powers/eventsphere-helper

## Features

### Discover events

- Search events by title or description.
- Filter by category, domain, Madurai area, and date range.
- Use quick category filters and sort by upcoming date or closing deadline.
- Browse events in a card grid or on an interactive Leaflet map.
- View sample Madurai events when the event API is unavailable.

### Event details

- View event date, registration deadline, venue, area, eligibility, description, and organizer information.
- See deadline urgency and countdown information.
- Open event locations in OpenStreetMap.
- Share event links using the device share menu or copy-link fallback.
- Add events to Google Calendar or download an `.ics` calendar file.
- Bookmark events.

### Accounts and profile

- Sign up and sign in with Supabase Auth.
- Use the demo student login to explore the app without a real account.
- Edit profile name and college details.
- Protected pages require a signed-in user.

### Bookmarks and demo registration

- Save and remove bookmarks.
- Demo-user bookmarks persist in the browser's local storage.
- Register for sample events in demo mode and receive a QR code.
- View demo registrations and their check-in status.
- Organizers can scan a QR code when the browser supports it or enter a token manually.
- Demo registration and check-in data is stored in the current browser; it is not a production registration system.

### Organizer tools

- View organizer events grouped by all, published, and draft status.
- See event statistics and publish or unpublish events.
- Create and edit events with validated fields.
- Select event coordinates using the location picker.
- Delete events from the organizer dashboard.

### Calendar

- Browse events in a month grid.
- Move between months or return to today.
- Select a date to see its events and open an event detail page.

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Event discovery home | Public |
| `/calendar` | Event calendar | Public |
| `/events/:id` | Event details | Public |
| `/login` | Sign in | Public |
| `/register` | Create account | Public |
| `/profile` | User profile | Signed-in users |
| `/bookmarks` | Saved events | Signed-in users |
| `/my-registrations` | Demo registrations and QR codes | Signed-in users |
| `/organizer/dashboard` | Manage organizer events | Organizer |
| `/organizer/events/new` | Create an event | Organizer |
| `/organizer/events/:id/edit` | Edit an event | Organizer |
| `/organizer/checkin` | Scan or manually enter demo check-in tokens | Organizer |

Unknown routes show a 404 page. Back and Home navigation controls are available throughout the app.

## Technology

### Frontend

- React 18 and Vite
- Tailwind CSS
- React Router
- Supabase JavaScript client and Supabase Auth
- Axios
- Leaflet and React Leaflet
- `react-hot-toast`
- `react-helmet-async`

### Backend

- Node.js and Express
- Supabase JavaScript client
- Vercel serverless function entry point
- Vitest and Supertest

### Tests and utilities

- Vitest
- fast-check property-based tests
- Shared utilities for dates, event filters, calendar links, map markers, sorting, and event validation

## Kiro University project work

The repository includes Kiro project configuration and examples for the challenge lessons:

1. **Spec-driven development:** `.kiro/specs/madurai-eventsphere/requirements.md`, `design.md`, and `tasks.md`
2. **Steering documents:** `.kiro/steering/coding-standards.md`
3. **Hooks:** `.kiro/hooks/eventsphere-task-review.json` and `.kiro/hooks/kironomics.json`
4. **Property-based testing:** `src/utils/__tests__/pbt.generative.test.js` and related tests under `src/utils/__tests__/` and `src/services/__tests__/`
5. **Kiro Power:** `powers/eventsphere-helper/POWER.md`, `plugin.json`, and `skills/event-development/SKILL.md`
6. **Model Context Protocol:** `.kiro/settings/mcp.json`
7. **Custom agents:** `.kiro/agents/frontend-dev.json` and `.kiro/agents/backend-dev.json`

## Project structure

```text
.
├── .kiro/
│   ├── agents/                 # Frontend and backend custom agents
│   ├── hooks/                  # Task review and workflow hooks
│   ├── settings/               # MCP server configuration
│   ├── specs/madurai-eventsphere/
│   └── steering/
├── backend/
│   ├── api/                    # Vercel serverless entry point
│   └── src/                    # Express app, routes, middleware, tests
├── powers/eventsphere-helper/
│   ├── POWER.md
│   ├── plugin.json
│   └── skills/event-development/SKILL.md
└── src/
    ├── components/
    ├── context/
    ├── data/                   # Sample events for demo/fallback
    ├── hooks/
    ├── pages/
    ├── services/
    └── utils/
```

## Run locally

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

Vite will print the local frontend URL, usually `http://localhost:5173`.

### Backend

In a second terminal:

```bash
cd backend
npm install
npm run dev
```

The local API runs at `http://localhost:3001`. Check its health at:

```text
http://localhost:3001/api/health
```

## Environment variables

Create a `.env` file in the frontend project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_API_BASE_URL=http://localhost:3001
```

Create `backend/.env` for local backend development:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-secret-key
PORT=3001
```

Set production environment variables in the corresponding Vercel project settings.

**Security:** Never commit `.env` files. Never expose the Supabase service-role key in frontend code, Vite variables, screenshots, or public repositories. Use only the publishable/anon key in the browser.

## Tests and build

From the repository root:

```bash
npm test
npm run build
```

For backend tests:

```bash
cd backend
npm test
```

## Demo notes

- The app can display six sample events if the live event API is unavailable.
- Demo sign-in, demo bookmarks, registrations, QR tokens, and check-in state are browser-local.
- Real-user bookmarks and organizer actions use the backend API and require a correctly configured backend and Supabase project.
- Demo QR check-in is for demonstration; persistent production registration and check-in require server-side storage and API support.

## License

No license has been specified yet.
