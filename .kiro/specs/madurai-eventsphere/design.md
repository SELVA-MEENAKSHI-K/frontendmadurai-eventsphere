# Madurai EventSphere — Design Specification

**Project:** Madurai EventSphere  
**Challenge:** Kiro University Challenge 2026  
**Version:** 1.0  
**Date:** September 2026  
**Status:** Draft — Awaiting Approval

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│                                                             │
│   React 18 + Vite + Tailwind CSS                           │
│   ├── Pages (Route-level components)                        │
│   ├── Components (Reusable UI)                              │
│   ├── Hooks (Custom React hooks)                            │
│   ├── Services (API call layer)                             │
│   └── Context (Auth + Filters global state)                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP / REST (JSON)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND — Vercel Serverless Functions          │
│              Node.js + Express (api/ directory)             │
│                                                             │
│   /api/events          GET, POST                            │
│   /api/events/:id      GET, PUT, DELETE                     │
│   /api/bookmarks       GET, POST, DELETE                    │
│   /api/organizer       GET (own events)                     │
│   /api/health          GET (uptime check)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ Supabase JS Client
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                             │
│   ├── PostgreSQL — event, profile, bookmark data            │
│   ├── Auth — email/password, JWT, Row Level Security        │
│   └── Storage — event poster images (bucket: event-posters) │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│   └── OpenStreetMap tile server (via Leaflet, free)         │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | React 18 + Vite | Fast HMR, modern ecosystem, beginner resources abundant |
| Styling | Tailwind CSS | Utility-first, mobile-first, no CSS file clutter |
| Backend | Express on Vercel Serverless | Simple REST, zero server management |
| Database + Auth | Supabase | PostgreSQL + Auth + Storage + RLS in one dashboard-friendly service |
| Maps | Leaflet + OpenStreetMap | Free, no API key, lightweight, works well at city level |
| State management | React Context + useState | Sufficient for MVP; no Redux overhead |
| Routing | React Router v6 | Industry standard, nested routes, lazy loading |

---

## 2. Project Folder Structure

```
madurai-eventsphere/
│
├── frontend/                          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── events/
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── EventGrid.jsx
│   │   │   │   ├── EventFilters.jsx
│   │   │   │   └── EventBadge.jsx
│   │   │   ├── map/
│   │   │   │   ├── EventMap.jsx
│   │   │   │   └── MapMarkerPopup.jsx
│   │   │   └── forms/
│   │   │       ├── EventForm.jsx
│   │   │       └── LocationPicker.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventDetailPage.jsx
│   │   │   ├── BookmarksPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── OrganizerDashboard.jsx
│   │   │   ├── EventCreatePage.jsx
│   │   │   ├── EventEditPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── FilterContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── eventService.js
│   │   │   └── bookmarkService.js
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── dateUtils.js
│   │       └── mapUtils.js
│   └── package.json
│
└── .kiro/
    ├── specs/
    │   └── madurai-eventsphere/
    │       ├── requirements.md
    │       ├── design.md
    │       └── tasks.md
    ├── steering/
    │   └── coding-standards.md
    └── hooks/
        └── kironomics.json
```

---

## 3. Database Schema

All tables live in Supabase (PostgreSQL). Row Level Security (RLS) is enabled on every table.

### 3.1 `profiles` table

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'organizer')),
  college     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 `events` table

```sql
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL CHECK (category IN (
                     'symposium','hackathon','bootcamp',
                     'meetup','workshop','community'
                   )),
  domain           TEXT[] DEFAULT '{}',
  venue_name       TEXT NOT NULL,
  address          TEXT,
  micro_location   TEXT NOT NULL,
  latitude         DECIMAL(10, 8),
  longitude        DECIMAL(11, 8),
  event_date       TIMESTAMPTZ NOT NULL,
  deadline         TIMESTAMPTZ,
  eligibility      TEXT,
  registration_url TEXT,
  poster_url       TEXT,
  is_published     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_events_category     ON events(category);
CREATE INDEX idx_events_event_date   ON events(event_date);
CREATE INDEX idx_events_micro_loc    ON events(micro_location);
CREATE INDEX idx_events_is_published ON events(is_published);
```

### 3.3 `bookmarks` table

```sql
CREATE TABLE bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

### 3.4 `event_stats` table

```sql
CREATE TABLE event_stats (
  event_id        UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  bookmark_count  INT DEFAULT 0,
  view_count      INT DEFAULT 0
);
```

---

## 4. API Design

Base URL (development): `http://localhost:3001/api`

All responses follow this envelope:
```json
{ "success": true, "data": { ... }, "error": null }
```

### 4.1 Events API

| Method | Path | Description |
|---|---|---|
| GET | `/api/events` | All published events; supports `category`, `domain`, `micro_location`, `date_from`, `date_to`, `search` query params |
| GET | `/api/events/:id` | Full event details |
| POST | `/api/events` | Create event (organizer, auth required) |
| PUT | `/api/events/:id` | Update event (must own) |
| DELETE | `/api/events/:id` | Delete event (must own) |

### 4.2 Bookmarks API

| Method | Path | Description |
|---|---|---|
| GET | `/api/bookmarks` | All bookmarks for current user |
| POST | `/api/bookmarks` | Add bookmark `{ event_id }` |
| DELETE | `/api/bookmarks/:event_id` | Remove bookmark |

### 4.3 Organizer API

| Method | Path | Description |
|---|---|---|
| GET | `/api/organizer/events` | All events (draft + published) for organizer |
| PUT | `/api/organizer/events/:id/publish` | Toggle `is_published` |

---

## 5. Frontend Component Design

### 5.1 Routing

```
App.jsx
├── /                    → HomePage (event grid + map)
├── /events/:id          → EventDetailPage
├── /bookmarks           → BookmarksPage [protected]
├── /login               → LoginPage
├── /register            → RegisterPage
├── /organizer/dashboard → OrganizerDashboard [organizer only]
├── /organizer/events/new         → EventCreatePage [organizer only]
├── /organizer/events/:id/edit    → EventEditPage [organizer only]
└── *                    → NotFoundPage
```

### 5.2 Global State

**FilterContext:** `{ filters, setFilter, clearFilters }`  
**AuthContext:** `{ user, loading, login, register, logout }`

---

## 6. Map Design

- Library: Leaflet 1.9.x via `react-leaflet`
- Tile provider: OpenStreetMap
- Default center: `[9.9252, 78.1198]` (Madurai city center)
- Default zoom: `12`

**Marker colors by category (design.md §7):**

| Category | Hex Color |
|---|---|
| Hackathon | `#EF4444` |
| Symposium | `#3B82F6` |
| Bootcamp | `#8B5CF6` |
| Meetup | `#10B981` |
| Workshop | `#F59E0B` |
| Community | `#EC4899` |

---

## 7. Security Considerations

| Risk | Mitigation |
|---|---|
| Unauthorized event modification | Supabase RLS + backend ownership check |
| JWT token exposure | Stored in React context (memory), not localStorage |
| SQL injection | Supabase parameterized queries |
| XSS via event descriptions | Sanitize HTML with DOMPurify |
| Exposed service role key | Backend only, never sent to client |
| Image upload abuse | File type + size validation before upload |
