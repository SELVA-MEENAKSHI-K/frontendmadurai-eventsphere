
# Madurai EventSphere

A mobile-friendly event discovery platform for the Kiro University Challenge 2026. Users can explore events, view event details, and use Supabase-backed features as they are implemented.

## Project Links

- **Frontend website:** https://frontendmadurai-eventsphere-6n22g9dx3.vercel.app
- **GitHub repository:** https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere
- **Supabase project dashboard:** https://supabase.com/dashboard/project/mmmpbjkvdhrxrjgxvtyb
- **Supabase project URL:** https://mmmpbjkvdhrxrjgxvtyb.supabase.co
- **Backend API:** Not deployed yet
- **Local backend health check:** http://localhost:3001/api/health

## Project Structure

```text
frontendmadurai-eventsphere/
├── src/                    # React frontend source code
├── public/                 # Static frontend assets
├── index.html
├── package.json            # Frontend dependencies and scripts
├── vite.config.js
└── backend/
    ├── src/
    │   ├── app.js           # Express application
    │   └── __tests__/       # Backend tests
    ├── api/
    │   └── index.js         # Vercel serverless entry point
    ├── package.json
    └── vercel.json
```

## Technology

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Supabase JavaScript client

### Backend

- Node.js
- Express
- Supabase JavaScript client
- Vitest

## Run the Frontend Locally

From the repository root:

```bash
npm install
npm run dev
```

Vite prints a local address in the terminal, usually:

```text
http://localhost:5173
```

## Run the Backend Locally

Open a second terminal:

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:3001
```

Check that it is running:

```text
http://localhost:3001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "EventSphere API running"
}
```

## Environment Variables

Create a `.env` file in the frontend project root for local development:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_API_BASE_URL=http://localhost:3001
```

For the backend, create `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-secret-key
PORT=3001
```

Set the corresponding production variables in the Vercel project settings. Frontend variables must be available to the Production environment before deploying.

**Security:** Never commit `.env` files or expose the Supabase secret/service-role key in frontend code, Vite variables, screenshots, or public repositories. Use only the publishable key (or legacy anon key) in the browser.

## Deployment

The frontend is deployed on Vercel:

- https://frontendmadurai-eventsphere-6n22g9dx3.vercel.app

To deploy the frontend from the repository root using Vercel CLI:

```bash
npx vercel --prod
```

The backend is configured for Vercel under `backend/`, but it does not have a confirmed working production URL yet.

## Tests

Run backend tests:

```bash
cd backend
npm test
```

## Current Status

- Frontend project is deployed to Vercel.
- Supabase project has been created and frontend environment variables have been added to Vercel.
- Backend scaffold and health endpoint are available locally.
- Backend production deployment and database schema setup are still pending.

## License

No license has been specified yet.
