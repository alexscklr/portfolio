---
name: Project Architecture
alwaysApply: true
---

# Projektarchitektur

Full-Stack-Portfolio (DE/EN): Angular-SPA konsumiert eine ASP.NET-Core-API.

## Frontend (`frontend/`)

- Angular 22, TypeScript ~6.0, Standalone-Komponenten, **zoneless** (`provideZonelessChangeDetection`), State über **Signals**, Tailwind CSS 4 + SCSS, Tests mit Vitest.
- `src/app/core/`: Header/Footer, Konfiguration (`languages.ts`), Mocks, Models, Services (`ProfileService`, `ProjectService`, `SkillService`, `LanguageService`, `TranslationService`).
- `src/app/features/<name>/`: seitenspezifische Komponenten und Logik (`home/`, `projects/`).
- `src/app/shared/`: wiederverwendbare Komponenten, Direktiven, Pipes (`translate`).
- Projektseite `/projects`: Skillfilter mit UND-Semantik, kompatiblen Skill-Facetten und Suche; Auswahl wird im Query-Parameter `skills` serialisiert. Die Detailroute `/projects/:slug` existiert im Frontend noch nicht.
- `ProjectService` lädt Daten mit `rxResource`, unterstützt API und `frontend-mock` und exponiert Projekte, Featured-Projekte, Lade-/Fehlerzustand und Reload. Eine `selectProject`-Ressource für Projektdetails ist vorhanden, aber noch nicht an eine Frontend-Detailroute angebunden.
- `ProjectCardComponent` nutzt `MediaSliderComponent`; Projekttext, Slider-Bedienung und externe Live-/Quellcode-Links sind getrennte Klickziele.
- Skill-Kategorien, Reihenfolge, Farben und UI-Labels: `core/config/skill-category.ts` plus Übersetzungen in `public/i18n/{de,en}/projects.json`.
- `public/i18n/{de,en}/`: UI-Übersetzungen (`common.json`, `home.json`, `projects.json`).
- Alias `@/*` → `src/*`.
- `scripts/generate-environment.mjs` erzeugt `src/environments/environment.generated.ts` aus `PORTFOLIO_DATA_SOURCE` (`api` | `frontend-mock`) und `PORTFOLIO_API_URL`. Nicht manuell bearbeiten.
- Services laden Daten per `HttpClient` von `${environment.apiUrl}/...` oder aus `core/mocks`.

## Backend (`backend/Portfolio.Api`)

- ASP.NET Core 8, Controller-basiert, Schichten: `Controllers/` → `AppDbContext` (EF Core + Npgsql) → PostgreSQL.
- `Controllers/`: `ProfileController`, `ProjectsController`, `SkillsController` (Route `api/[controller]`).
- `Entities/`: EF-Entitäten (Profile, Project, ProjectBlock, ProjectMedia, ProjectLink, SkillTag, SocialLink, Enums). `Models/`: Response-DTOs. `Mappings/`: Entity → DTO.
- `Common/`: `SupportedLanguages` (de, en; Standard `de`), `TranslationResolver` (Fallback auf Standardsprache), `TranslationInputValidator`.
- `Services/`: `IStorageService` / `AzureBlobStorageService`.
- `Data/`: `AppDbContext`, `DevelopmentDataSeeder`. `Migrations/` ist generiert.
- `ProjectsController`: List-, Slug-Detail-, Create- und Medienupload-Endpunkte. Das Create-Endpunktmodell ist derzeit noch die EF-Entität `Project`, kein Request-DTO.
- Development: beim Start automatisch Migrationen und Seeding; Swagger nur in Development; CORS-Policy `Frontend` über `Cors:AllowedOrigins` (Fallback `http://localhost:4200`).

## Infrastruktur (`docker-compose.yml`)

- **PostgreSQL 16** (Port 5432, Container `portfolio_db`): relationale Inhalte (Profil, Projekte, Blöcke, Skills, Übersetzungen).
- **Azurite** (Port 10000, Container `portfolio_blob_storage`): lokaler Azure-Blob-Storage-Emulator für Medien (z. B. Avatar), angesprochen über `IStorageService`.
- Zugangsdaten über `.env` (Vorlage `.env.example`), nicht committen.

## Ports und Befehle

- Frontend `http://localhost:4200`, API `http://localhost:5124/api`.
- `npm start` (alles gegen API), `npm run start:mock` (Frontend-Mocks), `npm run start:services`, `npm run db:migrate`, `npm run db:migration:add -- <Name>`.

## Wo gehört Logik hin?

- Datenabruf/Zustand im Frontend → Service in `core/services` mit Signals.
- Darstellung → Komponente in `features/` oder `shared/`.
- HTTP-Endpunkt → Controller; Datenform für Clients → DTO + Mapper; Dateispeicherung → `IStorageService`.
- Skillfilterlogik → reine Funktionen in `features/projects/project-filter.ts`; UI-Status der Auswahl bleibt in der URL.
