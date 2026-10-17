---
name: Project Architecture
alwaysApply: true
---

# Projektarchitektur

Portfolio (DE/EN): Angular-22-SPA in `frontend/`, ASP.NET-Core-8-API in `backend/Portfolio.Api` (EF Core, PostgreSQL, Azure Blob Storage/Azurite).

- Frontend: `src/app/core` (Services, Models, Mocks, Config, Header/Footer), `features/<name>` (Seiten), `shared` (Komponenten, Direktiven, Pipes). Alias `@/*` → `src/*`.
- Backend: `Controllers` → `AppDbContext`; DTOs in `Models/`, Mapper in `Mappings/`, Dateien nur über `IStorageService`.
- UI-Texte: `frontend/public/i18n/{de,en}/*.json`; Backend-Übersetzungen über `TranslationResolver` (Fallback `de`).
- Nicht manuell bearbeiten: `environment.generated.ts`, `Migrations/`, `AppDbContextModelSnapshot.cs`.
- Keine Secrets committen. Kommentare nur, wo die Logik nicht selbsterklärend ist.
- Änderungen minimal halten, bestehende Muster beibehalten, zuerst die Ursache analysieren statt Workarounds zu bauen.

## Wo gehört Logik hin?

- Datenabruf/Zustand → Service in `core/services` mit Signals.
- Darstellung → Komponente in `features/` oder `shared/`.
- HTTP-Endpunkt → Controller; Clientdatenform → DTO + Mapper.
- Skillfilterlogik → reine Funktionen in `features/projects/project-filter.ts`; Auswahl bleibt in der URL (`skills`).

## Befehle

`npm start`, `npm run start:mock`, `npm --prefix frontend test`, `dotnet build backend/PortfolioBackend.sln`.
