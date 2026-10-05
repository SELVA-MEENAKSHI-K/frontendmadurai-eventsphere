<div align="center">

# Madurai EventSphere

### Discover events. Find your community. Build something in Madurai.

A local event discovery platform for students, founders, and organizers—bringing
hackathons, workshops, bootcamps, meetups, and community events into one place.

[Open the app](https://frontendmadurai-eventsphere.vercel.app/) ·
[View the source](https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere)

</div>

---

## Table of Contents

- [Why EventSphere?](#why-eventsphere)
- [What You Can Do](#what-you-can-do)
- [How It Works](#how-it-works)
- [Kiro University Lessons](#kiro-university-lessons)
- [Technology](#technology)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Accessibility](#accessibility)
- [Project Direction](#project-direction)

## Why EventSphere?

Event information is often scattered across social media, college groups, and
organizer pages. Students may miss useful opportunities, while organizers need
a straightforward way to share events with the local community.

Madurai EventSphere brings event discovery and organizer workflows together. It
helps people find relevant events, understand the details, save opportunities,
and keep track of their participation.

## What You Can Do

### Discover events

- Browse and search event listings.
- Filter events by category, domain, area, and date.
- Open an event to see its description, venue, eligibility, deadline, and
  registration information.
- Explore events in a calendar.
- View event locations on a map when location coordinates are available.

### Keep track of events

- Sign in or create an account.
- Bookmark events for later.
- View saved events on a protected bookmarks page.
- View and update profile information.
- Review event registrations.

### Publish and manage events

- Open the organizer dashboard.
- Create an event with its details and location.
- Edit an existing event.
- Manage event publishing through organizer tools.

### Explore with demo data

Sample Madurai events and demo flows help people explore the application when
live backend services are unavailable or not configured. Demo data is intended
for demonstration and does not guarantee that changes are saved to the
production API.

## How It Works

```mermaid
flowchart LR
    Visitor[Visitor] --> Browse[Browse and filter events]
    Browse --> Details[View event details]
    Details --> SignIn[Sign in or use demo mode]
    SignIn --> Save[Bookmark an event]
    SignIn --> Register[View registration flow]

    Organizer[Organizer] --> Dashboard[Organizer dashboard]
    Dashboard --> Create[Create an event]
    Dashboard --> Edit[Edit an event]
    Create --> Publish[Manage event publishing]
    Edit --> Publish

Kiro University Lessons
The lessons below are mapped to the EventSphere features and development
workflows they relate to.
Lesson	Lesson name	How it connects to EventSphere
T3-01	User Profiles and Signup Trigger	Supabase authentication identifies users, while profile data stores information used by the application. The handle_new_user database trigger is intended to create a profile record when a user signs up, connecting account creation with the app's user-profile workflow.
T3-02	Login and Registration	Login and registration pages collect credentials and connect to the authentication context. After login, the app can return a user to the protected page they originally tried to open.
T3-03	Authenticated API Requests	The shared Supabase client reads the current session. The API client uses the session token on protected requests so the backend can identify the signed-in user.
T3-04	Event Bookmarks	The bookmark service communicates with the bookmark API, while the useBookmarks hook provides bookmark data and actions to pages and event cards. Signed-in users can save events, remove saved events, and view their bookmarks.
T4-01	Organizer Event Creation	The event form gathers event information and validates the input. The location picker supports adding coordinates, and the organizer route restricts event creation to users with the organizer role.
T4-03	Organizer Event Editing	Organizers can load an existing event into the editing flow and submit updated details through the event service. Ownership checks are used to limit editing to the event's organizer.
T4-05	Backend Deployment	The Express API provides the server side for event, bookmark, and organizer workflows. The deployed frontend needs the production API URL and Supabase settings to use live backend features.
Bonus	Package a Kiro Power	The eventsphere-helper Power packages project-specific development guidance so it can be installed and reused while working on EventSphere.


Technology
Area	Tools
Frontend	React 18, Vite, Tailwind CSS
Routing	React Router
Authentication and data	Supabase
Backend	Node.js, Express
Maps	Leaflet, React Leaflet
Notifications	react-hot-toast
Page metadata	react-helmet-async


Project Structure
frontendmadurai-eventsphere/
├── backend/                  # Express API
├── powers/
│   └── eventsphere-helper/   # Kiro Power package
├── src/
│   ├── components/           # Shared UI and event components
│   ├── context/              # Shared authentication state
│   ├── data/                 # Sample event data
│   ├── hooks/                # Reusable React hooks
│   ├── pages/                # Application pages and routes
│   ├── services/             # API communication
│   └── utils/                # Shared utilities
├── vercel.json               # Client-side route fallback
└── README.md
Run Locally
Frontend
Run these commands from the repository root:
npm install
npm run dev
Backend
cd backend
npm install
npm run dev
The frontend and backend may need to be configured separately for local
development. Add the required environment variables before using live Supabase
authentication or API features.
Configuration
Keep credentials and private keys in local environment files or the deployment
provider's environment settings. Never commit secret keys to the repository.
Live application features depend on valid Supabase configuration, a reachable
backend API, and matching frontend API settings. Without those services,
sample data may be available for exploration, but backend changes may not
persist.
Deployment
The frontend is deployed through Vercel and connected to the GitHub repository.
The root vercel.json provides a fallback for client-side routes, allowing
paths such as /login, /register, and /calendar to load directly.
Live authentication and API workflows also require a deployed backend and
correct production environment variables.
Accessibility
EventSphere aims to support responsive layouts, labeled controls, keyboard
navigation, and clear loading, error, and empty states. Color contrast and
assistive-technology behavior should be checked in the running application
before claiming full WCAG conformance.
Project Direction
Madurai EventSphere is built around a simple goal: make local opportunities
easier to discover and share. By connecting attendees with organizers, the
platform can help more people take part in learning, networking, and innovation
events across Madurai.
```
