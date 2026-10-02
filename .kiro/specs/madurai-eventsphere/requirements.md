# Madurai EventSphere — Requirements Specification

**Project:** Madurai EventSphere  
**Challenge:** Kiro University Challenge 2026  
**Version:** 1.0  
**Date:** September 2026  
**Status:** Draft — Awaiting Approval

---

## 1. Project Overview

Madurai EventSphere is a centralized, location-aware event discovery platform for college students, innovators, and early-stage entrepreneurs in Madurai district. It aggregates symposiums, hackathons, startup bootcamps, tech meetups, workshops, and community events into a single discoverable interface with an interactive map, category filters, and an organizer submission portal.

---

## 2. User Personas

### P1 — Student Explorer
- College student (UG/PG) in Madurai
- Wants to discover hackathons, workshops, and symposiums near their college
- Filters events by domain and deadline
- Bookmarks events to revisit later

### P2 — Startup Founder / Innovator
- Early-stage entrepreneur or recent graduate
- Seeks bootcamps, pitch events, and investor meetups in the Madurai ecosystem
- Needs eligibility info and registration links quickly

### P3 — Event Organizer
- College placement officer, tech club lead, or startup community manager
- Wants to publish event details and reach the right student audience
- Needs a simple form to create and manage their events

---

## 3. Scope — MVP Features

The following features are in scope for the MVP (Minimum Viable Product):

| # | Feature | Priority |
|---|---------|----------|
| F1 | Event Discovery Dashboard | Must Have |
| F2 | Category & Domain Filters | Must Have |
| F3 | Interactive Location Map | Must Have |
| F4 | Event Detail Page | Must Have |
| F5 | Organizer Event Submission | Must Have |
| F6 | User Authentication | Must Have |
| F7 | Bookmark Events | Should Have |
| F8 | Organizer Event Management | Should Have |
| F9 | Keyword Search | Should Have |
| F10 | Mobile-First Responsive Design | Must Have |

The following are explicitly **out of scope** for MVP:
- Payment / ticket booking
- Push notifications
- Social sharing
- Admin moderation dashboard
- Analytics dashboard

---

## 4. Functional Requirements

### FR-01: Event Discovery Dashboard

**User Story:**  
As a student, I want to see all upcoming events in Madurai on a clean dashboard so I can quickly find events relevant to me.

**Acceptance Criteria:**
- [ ] The dashboard displays event cards in a responsive grid layout
- [ ] Each event card shows: title, category badge, date, venue name, micro-location, and domain tags
- [ ] Events are sorted by event date (soonest first) by default
- [ ] Only published events are visible to unauthenticated users
- [ ] The dashboard loads within 3 seconds on a standard 4G connection
- [ ] An empty state message is shown when no events match the current filters

---

### FR-02: Category & Domain Filters

**User Story:**  
As a student, I want to filter events by category, domain, date range, and micro-location so I only see events relevant to my interests.

**Acceptance Criteria:**
- [ ] Users can filter by event category: Symposium, Hackathon, Bootcamp, Meetup, Workshop, Community
- [ ] Users can filter by domain: AI/ML, Web Dev, Hardware/IoT, Business, Design, Data Science, Cybersecurity, Other
- [ ] Users can filter by micro-location (Madurai area): Anna Nagar, KK Nagar, Tallakulam, Madurai South, Pasumalai, Othakadai, Usilampatti, Other
- [ ] Users can filter by date range using a date picker (from / to)
- [ ] Multiple filters can be applied simultaneously
- [ ] Filters can be cleared with a single "Clear Filters" button
- [ ] Filter state is reflected in the event count shown ("Showing 12 events")
- [ ] Filtering does not require a page reload

---

### FR-03: Interactive Location Map

**User Story:**  
As a student, I want to see events on a map of Madurai so I can find events near my college or area.

**Acceptance Criteria:**
- [ ] A Leaflet map centered on Madurai city (lat: 9.9252, lng: 78.1198) is displayed
- [ ] Each published event with valid coordinates is shown as a map pin/marker
- [ ] Clicking a map marker opens a popup showing: event title, date, category badge, and a "View Details" link
- [ ] The map supports zoom in/out and drag/pan
- [ ] Map markers are color-coded by event category
- [ ] The map updates when category or location filters are applied
- [ ] The map is responsive and usable on mobile screens

---

### FR-04: Event Detail Page

**User Story:**  
As a student, I want to view the full details of an event so I can decide whether to register.

**Acceptance Criteria:**
- [ ] Each event has a dedicated detail page at `/events/:id`
- [ ] The detail page shows: title, full description, category, domain tags, organizer name, venue name, full address, date and time, registration deadline, eligibility criteria, registration URL, and event poster image
- [ ] A prominent "Register Now" button links to the external registration URL (opens in a new tab)
- [ ] If a registration deadline has passed, the "Register Now" button is disabled and shows "Registration Closed"
- [ ] A "Bookmark" button is visible; clicking it saves the event (requires login)
- [ ] A back navigation link returns the user to the discovery dashboard
- [ ] The page includes Open Graph meta tags for social sharing

---

### FR-05: Organizer Event Submission

**User Story:**  
As an organizer, I want to submit my event through a simple form so it appears on the platform for students to discover.

**Acceptance Criteria:**
- [ ] Organizers must be logged in to submit an event
- [ ] The event submission form captures: title, description, category, domain (multi-select), venue name, address, micro-location, latitude, longitude, event date and time, registration deadline, eligibility, registration URL, and poster image upload
- [ ] All required fields are validated before submission
- [ ] The latitude and longitude fields are auto-populated when the organizer clicks a location on an embedded map picker
- [ ] A submitted event is saved with `is_published = false` by default (draft state)
- [ ] The organizer sees a success message after submission: "Event submitted! It will be reviewed and published shortly."
- [ ] For MVP simplicity, a toggle on the organizer dashboard allows the organizer to self-publish

---

### FR-06: User Authentication

**User Story:**  
As a user, I want to register and log in so I can bookmark events and (if an organizer) submit events.

**Acceptance Criteria:**
- [ ] Users can register with: full name, email, password, role (Student or Organizer), and college name (optional)
- [ ] Users can log in with email and password
- [ ] Passwords must be at least 8 characters
- [ ] Authentication is handled by Supabase Auth
- [ ] A logged-in user sees their name in the navbar with a logout option
- [ ] Unauthenticated users can browse and view events but cannot bookmark or submit
- [ ] Protected routes redirect unauthenticated users to the login page

---

### FR-07: Bookmark Events

**User Story:**  
As a student, I want to bookmark events I'm interested in so I can find them easily later.

**Acceptance Criteria:**
- [ ] Authenticated users can bookmark any event from the event card or detail page
- [ ] Bookmarking the same event twice has no effect (idempotent)
- [ ] A "Bookmarks" page at `/bookmarks` shows all bookmarked events for the logged-in user
- [ ] Users can remove a bookmark from both the bookmarks page and the event detail page
- [ ] Bookmark state (filled/outline icon) is visually reflected on event cards

---

### FR-08: Organizer Event Management

**User Story:**  
As an organizer, I want to manage the events I have submitted so I can edit details or remove outdated events.

**Acceptance Criteria:**
- [ ] Organizers can access a dashboard at `/organizer/dashboard`
- [ ] The dashboard lists all events the organizer has created
- [ ] Each event shows its publish status (Draft / Published)
- [ ] Organizers can edit any of their events
- [ ] Organizers can delete any of their events (with a confirmation prompt)
- [ ] Organizers can toggle publish status of their events

---

### FR-09: Keyword Search

**User Story:**  
As a student, I want to search for events by keyword so I can quickly find a specific event.

**Acceptance Criteria:**
- [ ] A search bar is visible on the discovery dashboard
- [ ] Typing in the search bar filters events by matching against title and description
- [ ] Search is debounced (triggers after 300ms of no typing)
- [ ] Search works in combination with other active filters

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Mobile responsiveness | Fully functional on screens ≥ 320px wide |
| NFR-02 | Performance | Initial page load < 3s on 4G; filter response < 500ms |
| NFR-03 | Accessibility | WCAG 2.1 AA on core pages (dashboard, event detail, forms) |
| NFR-04 | Security | JWT via Supabase Auth; Row Level Security on all tables; no secrets in frontend code |
| NFR-05 | Browser support | Latest Chrome, Firefox, Safari, Edge |
| NFR-06 | SEO | Open Graph tags on event detail pages; semantic HTML throughout |
| NFR-07 | Deployment | Zero-downtime deploy via Vercel; environment variables managed in Vercel dashboard |

---

## 6. Constraints

- The platform is scoped to **Madurai district** only for MVP
- All events displayed are community-submitted; the platform does not verify event authenticity at MVP stage
- Map tiles are served by OpenStreetMap (free, no API key required)
- Supabase free tier limits apply (500MB DB, 1GB storage, 50,000 monthly active users)
- The backend is deployed as **Vercel Serverless Functions** — no persistent server state

---

## 7. Glossary

| Term | Definition |
|---|---|
| Event | A time-bound activity (symposium, hackathon, etc.) created by an organizer |
| Organizer | A registered user with role = 'organizer' who can submit and manage events |
| Student | A registered user with role = 'student' who can discover and bookmark events |
| Micro-location | A named area within Madurai district (e.g., Anna Nagar, KK Nagar) |
| Domain | The technical or professional domain of an event (e.g., AI/ML, Web Dev) |
| Bookmark | A saved reference from a user to an event they are interested in |
| Published | An event with `is_published = true` that is visible to all users |
| Draft | An event with `is_published = false` that is only visible to its organizer |
