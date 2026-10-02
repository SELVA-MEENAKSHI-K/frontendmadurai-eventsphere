# Madurai EventSphere

A web application for discovering events in Madurai. Users can browse event listings, filter events, view event details, and explore event locations on a map.

## Project Status

The React frontend and Express backend scaffold are in the repository. The backend health endpoint and automated tests are in place. Supabase integration and Vercel deployment are planned next steps.

## Features

- Browse and filter events
- View event details
- Explore event locations on a map
- Responsive React interface
- Express API with a health-check endpoint
- Unit and property-based tests

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet

### Backend

- Node.js
- Express
- CORS
- dotenv
- Vitest
- Supertest

### Planned

- Supabase for database, authentication, and storage
- Vercel for frontend and backend deployment

## Repository Structure

```text
frontendmadurai-eventsphere/
├── .kiro/
│   ├── hooks/
│   ├── specs/madurai-eventsphere/
│   └── steering/
├── src/                         # React application
│   └── utils/__tests__/          # Frontend utility and property-based tests
├── backend/
│   ├── api/index.js              # Vercel serverless entry point
│   ├── src/app.js                # Express application and health endpoint
│   ├── src/__tests__/            # Backend tests
│   ├── package.json
│   └── vercel.json
├── index.html
├── package.json
└── vite.config.js
```

## Requirements

- Node.js and npm
- Git

## Run the Frontend Locally

From the repository root:

```bash
npm install
npm run dev
```

Vite will print the local address in the terminal.

## Run the Backend Locally

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

The backend runs on port `3001` by default.

## API Health Check

With the backend running, open:

```text
http://localhost:3001/api/health
```

A successful response looks like:

```json
{
  "success": true,
  "message": "EventSphere API running"
}
```

## Run Tests

### Frontend tests

From the repository root:

```bash
npx vitest --run
```

On Windows PowerShell, use:

```powershell
npx.cmd vitest --run
```

### Backend tests

From the `backend/` folder:

```bash
npm test
```

The backend tests cover the health endpoint and an unknown route. Frontend utility tests include property-based tests using `fast-check`.

## Environment Variables

Example environment files are provided for local setup. Copy the relevant example file to a local environment file and fill in values only when the corresponding integration is configured.

Do not commit `.env` files or share secret keys publicly. Supabase setup is not complete yet.

## Deployment

The project is organized so the frontend and backend can be deployed as separate Vercel projects:

- Frontend: repository root
- Backend: `backend/`

Deployment is not complete yet. Add the deployed URLs here after both projects are working.

## Kiro Project Artifacts

The `.kiro/` directory contains the EventSphere specification, project steering guidance, and task-completion hook configuration.

## License

No license has been added to this repository yet.
