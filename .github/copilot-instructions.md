# Copilot-Anweisungen

Portfolio-Projekt: Angular 22 (zoneless, Signals) Frontend in `frontend/`, ASP.NET Core 8 API in `backend/Portfolio.Api`. Ausführliche Hintergründe: [AGENTS.md](../AGENTS.md).

## Aktueller Stand der Projektseite

- Die Projektübersicht ist unter `/projects` implementiert; eine Frontend-Detailroute `/projects/:slug` ist noch offen. Der Textbereich einer Projektkarte verlinkt bereits auf diesen Pfad, der Routing-Fallback leitet unbekannte Routen derzeit nach `/` um.
- Skillfilter: Auswahl im Query-Parameter `skills`, UND-Semantik, Suche auf Skillnamen und Facetten, die mit der aktiven Auswahl in Projekten vorkommen. Filterlogik liegt als reine Funktionen in `features/projects/project-filter.ts`.
- Die Filterleiste hält leere Kategorien während der Ein-/Ausblendtransition im DOM und markiert sie mit `inert` und `aria-hidden`. Animationen müssen `prefers-reduced-motion` respektieren.
- Projektkarten verwenden `MediaSliderComponent`; Detailtext-Link, Slider-Steuerung sowie externe Demo-/Quellcode-Links bleiben getrennte Interaktionsziele. Sichtbare Skillchips sind auf fünf begrenzt, weitere erscheinen als `+N`.
- `ProjectService` lädt Projekte mit `rxResource` und unterstützt sowohl `api` als auch `frontend-mock`. Beim Ändern dieses Services Lade-/Fehlerzustände und beide Datenquellen erhalten.
- Skillkategorie-Anzeigenamen, Reihenfolge und Farben sind UI-Konfiguration und Übersetzung, nicht die Backend-Enum-Bezeichner. Aktuelle Labels: „Programmiersprachen“, „Frameworks & Libraries“, „Tools & Software“, „Konzepte & APIs“ (entsprechend englisch übersetzt).

## Formatierung (immer einhalten)

- Neuer und geänderter Code folgt **Prettier** (`.prettierrc`) und `.editorconfig`, auch wenn der Alt-Code abweicht (z. B. `frontend/src/app/core/services/skill.service.ts` nutzt doppelte Anführungszeichen und 4 Leerzeichen).
- TypeScript/HTML/SCSS/JSON: **2 Leerzeichen**, **Single Quotes**, Semikolons, trailing commas (`all`), `printWidth` 100, `arrowParens: avoid`, LF.
- C#: **4 Leerzeichen**.
- Bestehende Dateien nicht ohne Auftrag komplett umformatieren; nur angefasste Zeilen im Zielstil schreiben.

## TypeScript / Angular

- Striktes Typing: **kein `any`**, `unknown` plus Typeguard oder explizite Modelle aus `core/models`. Beachte `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.
- Nur **Standalone-Komponenten** (keine NgModules); Routen lazy per `loadComponent`.
- App ist **zoneless**: Zustand mit `signal`, `computed`, `effect`; keine Zone.js-Annahmen.
- Signal-Design: Schreibbare Signals privat halten und nur lesend (`asReadonly()`) oder via `computed` exponieren, wo es sinnvoll ist; abgeleiteten Zustand mit `computed` statt manueller Synchronisation.
- DI mit `inject()`, Services `providedIn: 'root'`.
- Imports über Alias `@/…`.
- Services müssen `environment.dataSource` (`api` | `frontend-mock`) berücksichtigen.
- Vorhandene signalbasierte Ressourcenmuster (`rxResource`) nutzen; RxJS-Subscriptions nicht unnötig in Services oder Komponenten einführen.
- Neue UI-Texte in `public/i18n/de` **und** `public/i18n/en` anlegen; Anzeige via `translate`-Pipe.
- Projektseitige UI-Texte liegen in `public/i18n/{de,en}/projects.json`.
- Fehler an der HTTP-Grenze behandeln, `isLoading` in allen Pfaden zurücksetzen, Signal auf sicheren Leerzustand setzen.

## C# / ASP.NET Core 8

- Modernes C# 12: **file-scoped namespaces** (`namespace Portfolio.Api.Controllers;`), primary constructors, Collection Expressions (`[ ... ]`), `record` für DTOs, `var` wo der Typ offensichtlich ist.
- `Nullable` ist aktiv: keine unnötigen `!`; Nullability sauber modellieren.
- Controller: `[ApiController]`, `[Route("api/[controller]")]`, `ActionResult<T>`, vollständig `async` mit `await`; Leseabfragen mit `AsNoTracking()`.
- Passende HTTP-Statuscodes (`Ok`, `NotFound`, `BadRequest`, `CreatedAtAction`, `NoContent`), da keine globale Fehler-Middleware existiert.
- Keine Entitäten ausliefern: DTOs in `Models/`, Mapping in `Mappings/`.
- Übersetzungen via `TranslationResolver`/`SupportedLanguages` (Fallback `de`).
- Dateien nur über `IStorageService`.
- Schema nur per EF-Migration ändern; `Migrations/` und `AppDbContextModelSnapshot.cs` nie manuell bearbeiten.
- Logging mit `ILogger<T>`, keine sensiblen Daten loggen.

## Allgemein

- Minimale, gezielte Änderungen; vorhandene Muster und Ordnerstruktur beibehalten.
- Keine Secrets committen (`.env`, `appsettings.Development.json` sind gitignored).
- `environment.generated.ts` ist generiert und wird nicht manuell bearbeitet.
- Kommentare nur, wo die Logik nicht selbsterklärend ist.
