# Portfolio

Personal portfolio with an Angular frontend (`frontend/`) and an ASP.NET Core 8 API (`backend/Portfolio.Api`) backed by PostgreSQL and Azure Blob Storage.

## Prerequisites

- Node.js and npm
- .NET 8 SDK
- Docker (PostgreSQL and the Azurite storage emulator)

Install dependencies once with `npm install` in the repository root and in `frontend/`.

## Development

Run everything from the repository root:

| Command | What it does |
|---|---|
| `npm start` | Starts Docker services, the backend and the frontend against the API |
| `npm run start:mock` | Same, but the frontend uses its built-in mock data |
| `npm run start:services` / `npm run stop:services` | Starts / stops only the Docker services |
| `npm run db:migrate` | Applies EF Core migrations |

The frontend runs on `http://localhost:4200`, the API on `http://localhost:5124/api`.

### Development seed

At each Development startup the backend applies migrations and seeds the profile, skills and demo projects. Seed-owned projects and the profile are replaced from [`DevelopmentDataSeeder.cs`](backend/Portfolio.Api/Data/DevelopmentDataSeeder.cs), so edit the seeder and restart the backend to see changes. Other projects are untouched. The seeder never runs outside Development, and it deletes all existing profiles, so use a dedicated development database.

## Build and prerendering (SSG)

`npm --prefix frontend run build` prerenders the site statically (no Node server at runtime). Output goes to `frontend/dist/frontend/browser`:

- `de/`, `en/` and `{de,en}/projects/` as ready-made HTML (content, titles, canonical/hreflang, Open Graph, JSON-LD), plus `sitemap.xml` and `robots.txt`.
- `/` is a client-side redirect to the preferred language (stored choice, then browser language, otherwise `de`).

The prerender fetches profile, projects and skills from the API at **build time**, so the backend must be reachable at `PORTFOLIO_API_URL` (or build with `PORTFOLIO_DATA_SOURCE=frontend-mock` outside production). The data is embedded via transfer state, so the browser does not request it again on load. For a local check, serve the output with any static server, for example `python3 -m http.server -d frontend/dist/frontend/browser`.

Language is part of the URL (`/de`, `/en`). New pages need a prerender entry in [`app.routes.server.ts`](frontend/src/app/app.routes.server.ts) (and a `sitemap.xml` entry in `generate-environment.mjs`).

## Configuration

### Frontend

[`frontend/scripts/generate-environment.mjs`](frontend/scripts/generate-environment.mjs) writes the git-ignored `frontend/src/environments/environment.generated.ts` before `start`, `build`, `watch` and `test`, so no URL is committed to the repository. Use `npm start` / `npm run build` (not `ng serve` / `ng build` directly), otherwise that file is missing.

| Variable | Description |
|---|---|
| `PORTFOLIO_API_URL` | Backend URL including `/api`. Defaults to `http://localhost:5124/api` in Development. **Required** for `npm run build`; there is no assumed production URL. |
| `PORTFOLIO_SITE_URL` | Öffentliche Basis-URL der Seite (z. B. `https://portfolio.example.com`) für Canonical-, hreflang-, Open-Graph-Links, `sitemap.xml` und `robots.txt`. Defaults to `http://localhost:4200` in Development. **Required** for `npm run build`. |
| `PORTFOLIO_DATA_SOURCE` | `api` (default) or `frontend-mock`, Development only. Production builds always use the API. |

### Backend

| Setting | Description |
|---|---|
| `Cors__AllowedOrigins__0` | Exact origin of the frontend, for example `https://portfolio.example.com`. Needed when frontend and backend use different origins. Development allows `http://localhost:4200` by default. |
