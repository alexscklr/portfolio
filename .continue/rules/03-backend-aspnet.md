---
name: Backend ASP.NET Core
globs: "backend/**/*.cs"
alwaysApply: false
---

# Backend (ASP.NET Core 8, C# 12)

- Controller: `[ApiController]`, `[Route("api/[controller]")]`, `ActionResult<T>`, durchgängig `async`; Leseabfragen mit `AsNoTracking()`.
- Statuscodes (keine globale Fehler-Middleware): `Ok`; `NotFound` bei fehlender Ressource (nie `null` mit 200); `BadRequest` bei ungültiger Eingabe (z. B. Sprachcode, `TranslationInputValidator`); `CreatedAtAction`/`NoContent` bei Anlegen/Ändern/Löschen. Mit `[ProducesResponseType]` dokumentieren.
- Keine Entitäten ausliefern; DTO-`record`s in `Models/`, Mapping in `Mappings/`.
- Nullable sauber modellieren, keine unnötigen `!`.
- Dateien nur über `IStorageService`.
- Schema nur per EF-Migration (`npm run db:migration:add -- <Name>`).
- Logging mit `ILogger<T>`, keine sensiblen Daten, keine internen Fehlerdetails an Clients.
- Stil: file-scoped Namespaces, 4 Leerzeichen, Collection Expressions, `var` wenn der Typ offensichtlich ist.
