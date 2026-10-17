# AGENTS.md – Wissensbasis für KI-Assistenten

Zentrale Projektbeschreibung und Arbeitsregeln für KI-Assistenten (Copilot, Continue.dev u. a.).
Alles hier stammt aus dem Repository-Stand (Code/Config). Mit `TODO:` markierte Stellen sind offen und vom Maintainer auszufüllen.

---

## 1. Projekt-Kontext & Ziele

### Zweck
Persönliche **Portfolio-Website** (Autor: Alexander) mit mehrsprachigem Inhalt (Deutsch/Englisch), bestehend aus:
- **Frontend:** Angular-SPA (`frontend/`) mit Startseite und Projektübersicht samt Skillfilter, Projektkarten und Medien-Slidern.
- **Backend:** ASP.NET Core 8 Web API (`backend/Portfolio.Api`) mit PostgreSQL und Azure Blob Storage (lokal: Azurite). Die Datenmodelle (Projekt-Blöcke, Medien, Links, Skill-Tags) bilden eine kleine **CMS-Architektur** (Migration `AddCmsArchitecture`).

TODO: Produktvision / Geschäftsziele in 1–2 Sätzen (z. B. Bewerbung, Freelance-Akquise).

### Zielgruppen & Kernfunktionen
- Zielgruppe: TODO (vermutlich Recruiter/Auftraggeber – bitte bestätigen).
- Kernfunktionen (im Code vorhanden):
  - Profil abrufen (`ProfileController`), Projekte (`ProjectsController`), Skills inkl. Nutzungshäufigkeit (`SkillsController`, `GET /api/skills`).
  - Sprachumschaltung `de`/`en` (Standard: `de`), Übersetzungen serverseitig (DB) und clientseitig (JSON-Dateien).
  - Frontend-Mock-Modus ohne Backend (`PORTFOLIO_DATA_SOURCE=frontend-mock`).
  - Development-Seeding von Profil, Skills und Demo-Projekten inkl. Avatar-Upload in den Storage.
  - Projektübersicht unter `/projects`: Skill-Facetten mit UND-Filter, Suche und URL-Parameter `?skills=...`; Projektkarten mit Medien-Slider, Zeitraum und optionalen externen Links.
  - Die API liefert Projektdetails über `GET /api/projects/{slug}`. Eine Frontend-Detailseite unter `/projects/:slug` ist noch nicht implementiert; unbekannte Frontend-Routen leiten auf die Startseite der jeweiligen Sprache um.

### Wichtige Qualitätsmerkmale
- **Mehrsprachigkeit:** Fallback auf Standardsprache `de`, wenn Übersetzung fehlt (`TranslationResolver`).
- **Performance/SEO:** Statisches Prerendering (SSG, kein SSR zur Laufzeit), Sprache in der URL (`/de`, `/en`), Lazy-loaded Routen, Zoneless Change Detection, `AsNoTracking()` bei Lesezugriffen im Backend.
- **Sicherheit/Konfiguration:** CORS-Whitelist (`Cors:AllowedOrigins`), Secrets nicht im Repo (`.env`, `.env.local`, `appsettings.Development.json` sind gitignored), Produktions-Build erzwingt `PORTFOLIO_API_URL` und `PORTFOLIO_SITE_URL`.
- Kein Offline-First / keine Authentifizierung implementiert (`UseAuthorization` ist registriert, aber ohne Policies). TODO: Anforderungen an Auth/Admin-Bereich.

---

## 2. Repository-Struktur & Architektur-Map

```
portfolio/
├── AGENTS.md
├── README.md                  # Setup & Befehle
├── package.json               # Root-Skripte (concurrently, dotnet, docker)
├── docker-compose.yml         # PostgreSQL 16 + Azurite (Blob Storage)
├── .env.example               # POSTGRES_* Variablen
├── .editorconfig / .prettierrc
├── .continue/                 # Continue.dev: prompts/ und rules/
├── .github/copilot-instructions.md
├── backend/
│   ├── PortfolioBackend.sln
│   └── Portfolio.Api/
│       ├── Controllers/       # HTTP-Endpunkte (dünn)
│       ├── Models/            # Response-DTOs (records)
│       ├── Mappings/          # Entity → Response Mapper (statisch)
│       ├── Entities/          # EF-Core-Entitäten & Enums
│       ├── Data/              # AppDbContext, DevelopmentDataSeeder
│       ├── Migrations/        # EF-Migrationen (generiert, nicht manuell editieren)
│       ├── Services/          # IStorageService + AzureBlobStorageService
│       ├── Common/            # SupportedLanguages, TranslationResolver, TranslationInputValidator
│       └── SeedAssets/        # Dateien fürs Dev-Seeding
└── frontend/
    ├── angular.json, tsconfig*.json, package.json
    ├── scripts/generate-environment.mjs   # erzeugt src/environments/environment.generated.ts
    ├── public/i18n/{de,en}/   # UI-Übersetzungen: common.json, home.json, projects.json
    ├── public/media/fixtures/ # Mock-Medien
    └── src/
        ├── environments/      # environment.ts, environment.model.ts, environment.generated.ts (generiert)
        └── app/
            ├── core/          # components (header, footer), config, mocks, models, services
            ├── features/      # Seitenspezifische Features: home/ und projects/
            └── shared/        # Wiederverwendbare Komponenten, Direktiven, Pipes
```

### Architekturmuster
- **Backend:** Schichtenarchitektur mit ASP.NET-Core-Controllern → `AppDbContext` (EF Core, direkt in Controllern genutzt) → PostgreSQL; Storage über Interface `IStorageService` (DI, Scoped). Mapping über statische Mapper-Klassen, DTOs getrennt von Entitäten.
- **Frontend:** Standalone-Komponenten (keine NgModules), Feature-Ordner + `core`/`shared`, State über **Signals** in Services und Komponenten, HTTP via `HttpClient`/`rxResource`. Daten kommen aus API oder Mock (`environment.dataSource`).
- **Projektfilter:** Die Skill-Auswahl steht als kommaseparierte Slugs im Query-Parameter `skills`. Projekte werden mit UND-Semantik gefiltert; verfügbare Facetten beschränken sich auf Skills, die gemeinsam mit der aktuellen Auswahl vorkommen. Die Suche filtert die Facettenliste, nicht die Projekte direkt.
- **Projektkarten:** Der Textbereich verlinkt auf `/projects/:slug`; Medien-Slider und externe Links sind getrennte Interaktionsziele. Pro Karte werden bis zu fünf Skills direkt und weitere als `+N` angezeigt.
- **Mehrsprachigkeit:** Backend nimmt Sprachcode entgegen und löst Übersetzungen mit Fallback auf; Frontend nutzt `LanguageService`, `TranslationService` und `TranslatePipe` (`{{ 'key' | translate }}`).

### Namenskonventionen (aus dem Bestand)
- **Frontend:** kebab-case Dateien/Ordner mit Typ-Suffix: `home.component.ts`, `project.service.ts`, `translate.pipe.ts`, `button.directive.ts`, `project.model.ts`, `project.mock.ts`. Komponenten: `XyzComponent`, Selektor-Präfix `app-`. Ein Ordner pro Komponente mit `.ts/.html/.scss`. Pfad-Alias `@/*` → `src/*` (z. B. `@/app/core/services/...`).
- **Backend:** PascalCase Dateien = Typname (`ProjectsController.cs`), Namespace `Portfolio.Api.<Ordner>`, Controller-Suffix `Controller`, Response-DTOs `…Response`, Mapper `…ResponseMapper`, Migrationen via EF-Tooling (Zeitstempel).
- API-Routen: `api/[controller]` (z. B. `/api/skills`).

---

## 3. Technischer Stack & Versionen

| Bereich | Technologie | Version (laut Config) |
|---|---|---|
| Backend-Sprache/Runtime | C# / .NET | `net8.0`, `Nullable` und `ImplicitUsings` aktiv |
| Web-Framework | ASP.NET Core (Controller-basiert) | 8 |
| ORM / DB | EF Core + Npgsql, PostgreSQL | 8.0.11 / Postgres 16 (Docker) |
| API-Doku | Swashbuckle (Swagger UI, nur Development) | 6.6.2 |
| Storage | Azure.Storage.Blobs; Azurite lokal (Port 10000) | 12.23.0 |
| Frontend | Angular (Standalone, Zoneless, `@angular/build`) | ^22.0.0 |
| Sprache | TypeScript | ~6.0.2 |
| Reaktivität | Signals, RxJS | rxjs ~7.8.0 |
| Styling | SCSS, Tailwind CSS, PostCSS, Autoprefixer | Tailwind ^4.3.3 |
| Icons | `iconify-icon`, `simple-icons` | ^3.0.3 / ^16.32.0 |
| Tooling | Node/npm, `concurrently`, Docker Compose | – |

### Testing, Linting, Formatting
- **Frontend-Tests:** `ng test` (Builder `@angular/build:unit-test`) mit **Vitest** ^4 und **jsdom**; Specs als `*.spec.ts` neben dem Code. Abgedeckt sind App-Shell, ProjectService, Projektfilter, Projektseite, Skillfilter, Projektkarte und Medien-Slider.
- **Formatting:** Prettier ^3.8 (`.prettierrc`: single quotes, trailing commas `all`, printWidth 100, 2 Spaces, Semikolons, `arrowParens: avoid`) und `.editorconfig` (LF, UTF-8, 2 Spaces; `*.cs` 4 Spaces).
- **Linting:** kein ESLint, keine .NET-Analyzer-Konfiguration vorhanden. TODO: gewünschtes Linting ergänzen.
- **Backend-Tests:** Es existiert noch kein Testprojekt. TODO: Testframework und Strategie festlegen.
- TS-Compiler-Flags (`tsconfig.json`): `noImplicitOverride`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`, `isolatedModules`; Angular: `strictInjectionParameters`, `strictInputAccessModifiers`. **`"strict": true` ist nicht gesetzt.**

### Wichtige Befehle (aus Repo-Root)
| Befehl | Zweck |
|---|---|
| `npm start` | Docker-Services + Backend (`dotnet watch run`) + Frontend gegen die API |
| `npm run start:mock` | wie oben, Frontend nutzt Mock-Daten |
| `npm run start:services` / `stop:services` | nur Docker (Postgres, Azurite) |
| `npm run db:migrate` | `dotnet ef database update` |
| `npm run db:migration:add -- <Name>` | neue EF-Migration |
| `npm --prefix frontend test` | Frontend-Tests |
| `npm --prefix frontend run build` | Produktions-Build mit Prerendering (benötigt `PORTFOLIO_API_URL` und `PORTFOLIO_SITE_URL`; API muss zur Build-Zeit erreichbar sein) |

Ports: Frontend `http://localhost:4200`, API `http://localhost:5124/api`, Postgres `5432`, Azurite `10000`.

### Konfiguration
- Frontend-Env wird durch `scripts/generate-environment.mjs` aus `PORTFOLIO_DATA_SOURCE` (`api` | `frontend-mock`) `PORTFOLIO_API_URL` und `PORTFOLIO_SITE_URL` generiert (erzeugt außerdem `public/sitemap.xml` und `public/robots.txt`, beide gitignored) (Hooks `prestart`/`prebuild`/`pretest`). `environment.generated.ts` nicht manuell bearbeiten.
- Backend: Connection String `DefaultConnection`, `Cors:AllowedOrigins` (Development-Fallback `http://localhost:4200`). In Development laufen Migrationen und Seeding automatisch beim Start.
- Projekt-API: `GET /api/projects` liefert Listendaten; `GET /api/projects/{slug}` liefert Details. `POST /api/projects` nimmt derzeit noch eine `Project`-Entität entgegen; ein Create-DTO ist offener Verbesserungsbedarf.

---

## 4. Globale Coding-Richtlinien

### Allgemein
- Änderungen minimal und zielgerichtet; bestehende Muster und Ordnerstruktur beibehalten; keine Secrets committen.
- Nach Änderungen passend zum Scope validieren: Frontend `npm --prefix frontend test` und bei Bedarf `PORTFOLIO_API_URL=http://localhost:5124/api npm --prefix frontend run build`; Backend `dotnet build backend/PortfolioBackend.sln`.
- Neue Texte immer in **beiden** Sprachen (`public/i18n/de` und `en`) bzw. beiden Übersetzungen in der DB pflegen; Sprachcodes zentral über `SupportedLanguages` (Backend) / `core/config/languages.ts` (Frontend).

### Frontend (Angular/TypeScript)
- Nur **Standalone-Komponenten**, kein NgModule; Routen **lazy** via `loadComponent`.
- App wird **statisch prerendert** (SSG via `@angular/ssr`, `outputMode: static`, Hydration). Neue Seiten brauchen einen Eintrag in `app.routes.server.ts` (Prerender-Parameter für `de`/`en`) und in der Sitemap (`generate-environment.mjs`).
- **Sprache steckt in der URL** (`:lang`-Segment, Quelle der Wahrheit); `LanguageService` leitet sie aus der Route ab. Links immer mit `languageService.localizedUrl('/pfad')` bilden. Übersetzungen lädt ein Route-Resolver (`loadTranslations`) vor dem Rendern.
- **Browser-only-Code** (`window`, `document`-Observer, `localStorage`, `navigator`, `ResizeObserver`, `requestAnimationFrame`) nur in `afterNextRender` oder hinter `isPlatformBrowser`; kein Inhalt darf im Prerender versteckt sein. Beim Server-DOM `appendChild` statt `append` nutzen.
- SEO-Metadaten (Title, Description, Canonical, hreflang, Open Graph, JSON-LD) setzt `SeoService`.
- App ist **zoneless** (`provideZonelessChangeDetection`): Zustand über `signal`/`computed`/`effect`, keine Abhängigkeit von Zone.js.
- Dependency Injection mit `inject()` (kein Konstruktor-Injection-Stil), Services `@Injectable({ providedIn: 'root' })`, Zustand als `signal` (z. B. `skills`, `isLoading`) exponieren.
- Für signalbasierte HTTP-Ressourcen bestehende Muster wie `rxResource` verwenden; Lade- und Fehlerzustände explizit behandeln.
- Datenzugriff in Services kapseln; Services müssen beide Datenquellen respektieren (`environment.dataSource === 'frontend-mock'` → Mock aus `core/mocks`).
- Imports über Alias `@/…` statt tiefer relativer Pfade (lokale Nachbarn dürfen relativ sein).
- Wiederverwendbares UI nach `shared/` (Komponenten, Direktiven, Pipes), seitenspezifisches nach `features/<name>/`, app-weite Infrastruktur nach `core/`.
- Prettier-Stil einhalten (single quotes, trailing commas, 100 Zeichen). Hinweis: Teile des Bestands (z. B. `skill.service.ts`) nutzen doppelte Anführungszeichen und 4er-Einrückung – bei neuem Code den Prettier-Stil verwenden, bestehende Dateien nicht unnötig umformatieren.
- Typisierung: explizite Modelle in `core/models`, kein `any`; `noPropertyAccessFromIndexSignature` beachten.
- Styling: Tailwind-Utilities plus komponentenlokales SCSS.
- Projektübersichtsfilter: Auswahl im Query-Parameter `skills` belassen, UND-Semantik und Facetten-Verfügbarkeit konsistent halten. Animationen müssen `prefers-reduced-motion` sowie Tastatur- und Screenreader-Zugänglichkeit berücksichtigen.
- Async: `HttpClient`/RxJS-Observables an der HTTP-Grenze (`subscribe({ next, error })`), Ergebnisse in Signals ablegen.

### Backend (C#/ASP.NET Core)
- Controller: `[ApiController]`, `[Route("api/[controller]")]`, Rückgabe `ActionResult<T>`; DB-Zugriff **async** (`ToListAsync`, `async/await`) und lesend mit `AsNoTracking()`.
- Nie Entitäten ausliefern; stets DTO-Records in `Models/` und Mapping in `Mappings/`.
- Nullable Reference Types beachten; Konstruktor-Injection mit `private readonly`-Feldern.
- Übersetzbare Inhalte über `TranslationResolver` mit Fallback auf `SupportedLanguages.Default`; Eingaben für Übersetzungen mit `TranslationInputValidator` validieren.
- Dateizugriffe ausschließlich über `IStorageService`.
- Schemaänderungen nur über EF-Migrationen (`npm run db:migration:add -- <Name>`); bestehende Migrationen und `AppDbContextModelSnapshot.cs` nicht von Hand ändern.
- C#-Stil: 4 Leerzeichen, file-scoped Namespaces (wie im Bestand).

### Fehlerbehandlung
- **Frontend (Ist-Zustand):** Fehler im `error`-Callback abfangen, `console.error(...)` ausgeben, Signal auf sicheren Leerzustand setzen und `isLoading` zurücksetzen (siehe `SkillService`). Ladezustände immer in allen Pfaden beenden.
- **Backend (Ist-Zustand):** Standard-ASP.NET-Pipeline, Validierungsfehler als passende HTTP-Statuscodes über `ActionResult` (`Ok`, `NotFound`, `BadRequest`). Keine globale Fehler-Middleware vorhanden. TODO: einheitliches Fehlerformat (z. B. `ProblemDetails`) festlegen.
- Keine Fehler still verschlucken; keine internen Details an Clients leaken.

### Logging
- Frontend: `console.error` für Fehler (kein Logging-Framework). TODO: Konvention für Debug-Logs.
- Backend: `Microsoft.Extensions.Logging` (Konfiguration in `appsettings.json`: Default `Information`, `Microsoft.AspNetCore` `Warning`). Bei neuem Code `ILogger<T>` injizieren; keine sensiblen Daten loggen.

### Dokumentation
- Backend: XML-Doc-Kommentare (`/// <summary>`) an öffentlichen Schnittstellen, wie in `IStorageService`.
- Frontend: kein JSDoc-Zwang im Bestand; Kommentare nur, wo Logik nicht selbsterklärend ist.
- Bei Änderungen an Befehlen, Setup oder Konfiguration `README.md` (und diese Datei) aktualisieren.
- Commit-Nachrichten: TODO: Konvention (z. B. Conventional Commits); Vorlage existiert in `.continue/prompts/git-commit.prompt`.

---

## 5. Offene Punkte (vom Maintainer zu ergänzen)
- [ ] Produktvision, Zielgruppe, Business-Ziele (Abschnitt 1)
- [ ] Auth/Admin/CMS-Schreibzugriff geplant?
- [ ] Linting-Setup (ESLint, Roslyn-Analyzer) und TS `strict`
- [ ] Backend-Testframework und -Strategie
- [ ] Deployment-Ziel/CI (keine CI-/Deploy-Konfiguration im Repo gefunden)
- [ ] Fehler-/Logging-Standard und Commit-Konvention
