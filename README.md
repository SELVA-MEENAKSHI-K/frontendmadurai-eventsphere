Bro, கீழே முழு README content இருக்கு. இதை repo root-ல உள்ள `README.md`-க்கு paste பண்ணலாம். Kiro lessons-ல நமக்குத் தெரிந்த task IDs மட்டும் சேர்த்திருக்கேன்; இன்னும் confirm ஆகாதவற்றை complete-னு claim பண்ணலை.

```markdown
# Madurai EventSphere

Madurai EventSphere helps students and organizers discover and manage events around Madurai. Find hackathons, workshops, bootcamps, meetups, and other opportunities in one place.

**Live app:** https://frontendmadurai-eventsphere.vercel.app/  
**GitHub:** https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere

## Features

- **Event discovery:** Browse events, search by keyword, and filter by category, domain, area, and date.
- **Event details:** View event information, venue, eligibility, registration deadline, and registration link.
- **Calendar:** Browse events by month and open an event from its calendar entry.
- **Map and location:** Explore event locations on a map when coordinates are available.
- **Bookmarks:** Save events and view them on a protected bookmarks page.
- **Authentication:** Login and registration pages with Supabase authentication, plus a demo login option.
- **Demo events:** Sample Madurai events keep the app explorable when the events API is unavailable. Demo events clearly indicate when registration is unavailable.
- **Organizer tools:** Organizer dashboard, event creation and editing pages, and publish controls.
- **Profile:** View and update profile information.
- **Registrations and QR check-in:** Demo registration tokens, a registrations page, and QR/manual check-in flow.
- **Responsive navigation:** Mobile-friendly menu and navigation controls across pages.

Some features use demo data or demo behavior. Availability of live data and authenticated API operations depends on the backend and Supabase configuration.

## Kiro University Challenge Work

Each lesson is listed on **one table row**. Status reflects the work recorded in this repository history; verify it against the Kiro University dashboard before submitting.

| Lesson | Work recorded | Status |
|---|---|---|
| T3-01 | Supabase user-profile setup and `handle_new_user` trigger work | SQL trigger application needs dashboard verification |
| T3-02 | Login and registration pages and routes | Implemented |
| T3-03 | Shared Supabase client and API authentication token handling | Implemented |
| T3-04 | Bookmark API service, hook, protected page, and event-card integration | Implemented |
| T4-01 | Organizer event creation form, location picker, and protected organizer route | Implemented |
| T4-03 | Organizer event editing flow and route | Implemented |
| T4-05 | Backend deployment and production configuration | Pending verification |
| Bonus | `eventsphere-helper` Kiro Power package | Packaged; installation and scorecard credit need verification |

## Demo Mode

Demo mode is intended to make the interface usable for demonstrations when the live backend is not configured or reachable.

- Sample events are provided as fallback data.
- Demo accounts can explore supported flows without a real account.
- Demo registrations and QR check-in use demo data.
- Demo events may not have live registration or persistence.

Do not treat demo interactions as proof that a production API operation succeeded.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Supabase authentication
- Leaflet and React Leaflet
- `react-hot-toast`
- `react-helmet-async`
- Node.js and Express backend

## Project Structure

```text
frontendmadurai-eventsphere/
├── backend/                 # Express API
├── powers/
│   └── eventsphere-helper/  # Kiro Power package
├── src/
│   ├── components/          # Shared UI and event components
│   ├── context/             # Authentication context
│   ├── data/                # Demo event data
│   ├── hooks/               # Reusable React hooks
│   ├── pages/               # Application routes and pages
│   ├── services/            # API service modules
│   └── utils/               # Shared utilities
├── vercel.json              # SPA route fallback
└── README.md
```

## Run Locally

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Set the required environment variables in local environment files before using live Supabase or API features. Never commit secret keys.

## Deployment

The frontend is deployed on Vercel and connected to the GitHub repository. The root `vercel.json` rewrite lets client-side routes such as `/register`, `/login`, and `/calendar` load directly.

Live backend features require a deployed backend, correct Vercel environment variables, and valid Supabase configuration.

## Accessibility and UX

The app includes responsive layouts, labeled form controls, keyboard-friendly navigation, and loading, error, and empty states. Color contrast and responsive behavior should be checked against the rendered UI before claiming full WCAG compliance.

## Current Verification Notes

- Confirm the latest Vercel production deployment before sharing the live link.
- Verify backend environment variables and the production API connection.
- Apply or verify the Supabase `handle_new_user` trigger.
- Check lesson completion and bonus credit in the Kiro University dashboard.
- Run the project’s build and test commands before submitting a release.

## License

Add the license chosen for this project before redistributing it.
```
