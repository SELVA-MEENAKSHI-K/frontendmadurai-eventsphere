# Madurai EventSphere

**Discover local events. Connect with the people building Madurai’s future.**

Madurai EventSphere is an event discovery platform for students, founders, and organizers in Madurai. It brings hackathons, workshops, bootcamps, meetups, and other opportunities into one place.

- **Live application:** https://frontendmadurai-eventsphere.vercel.app/
- **GitHub repository:** https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere

## The Problem

Event information is often scattered across social media, college groups, and individual organizer pages. Students can miss useful opportunities, while organizers have no single place to publish events for the local community.

EventSphere provides a shared platform to discover events, review their details, save interesting opportunities, and support organizer workflows.

## Features

### For attendees

- Browse and search events.
- Filter events by category, domain, area, and date.
- View event details, venue, eligibility, deadlines, and registration information.
- Explore events in a calendar and on a map when location data is available.
- Bookmark events and access a personal bookmarks page.
- Manage a profile and view registrations.
- Use demo login and sample events to explore the interface.

### For organizers

- Access an organizer dashboard.
- Create and edit event listings.
- Add event details and location information.
- Manage event publishing through organizer tools.

### Demo experience

The application includes sample Madurai events and demo flows so the interface can be explored without relying on a fully configured production backend.

Demo data and demo actions are not equivalent to live API persistence. Registration, bookmarks, and organizer actions may require a correctly configured backend and Supabase project.

## Kiro University Challenge

The project was developed alongside Kiro University Challenge work. The table below maps the lesson tasks recorded for this repository to the related EventSphere work. Completion and bonus credit should be checked against the Kiro University dashboard.

| Lesson | Project work | Status |
|---|---|---|
| T3-01 | Supabase user-profile setup and `handle_new_user` trigger work | Trigger application needs dashboard verification |
| T3-02 | Login and registration pages and routes | Implemented in the application |
| T3-03 | Shared Supabase client and API authentication token handling | Implemented in the application |
| T3-04 | Bookmark service, hook, protected bookmarks page, and event-card integration | Implemented in the application |
| T4-01 | Organizer event form, location picker, and protected organizer route | Implemented in the application |
| T4-03 | Organizer event editing page and route | Implemented in the application |
| T4-05 | Backend deployment and production configuration | Deployment and production settings need verification |
| Bonus | `eventsphere-helper` Kiro Power package | Packaged; installation and scorecard credit need verification |

## Technology

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Supabase authentication
- Leaflet and React Leaflet
- `react-hot-toast`
- `react-helmet-async`

### Backend

- Node.js
- Express
- Supabase

## Repository Structure

```text
frontendmadurai-eventsphere/
├── backend/                  # Express API
├── powers/
│   └── eventsphere-helper/   # Kiro Power package
├── src/
│   ├── components/           # Shared interface and event components
│   ├── context/              # Authentication context
│   ├── data/                 # Sample event data
│   ├── hooks/                # Reusable React hooks
│   ├── pages/                # Application pages and routes
│   ├── services/             # API service modules
│   └── utils/                # Shared utilities
├── vercel.json               # Client-side route fallback
└── README.md
