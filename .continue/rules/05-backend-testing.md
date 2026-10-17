---
name: Backend Testing
globs: "backend/**/*Tests*.cs"
alwaysApply: false
---

# Backend-Tests

Es existiert noch kein Testprojekt; Framework (z. B. xUnit) ist offen. Bei der Einrichtung ein eigenes Projekt in `PortfolioBackend.sln` anlegen.

- Struktur spiegeln (`Controllers/SkillsControllerTests.cs`), Namen `Methode_Szenario_Ergebnis`, Arrange/Act/Assert.
- Priorität: reine Logik (`SupportedLanguages`, `TranslationResolver`, `TranslationInputValidator`, Mapper), danach Controller.
- DB über EF Core InMemory/SQLite oder Testcontainers (PostgreSQL); `IStorageService` per Fake, kein Azurite.
- Controller-Tests prüfen Statuscodes (`OkObjectResult`, `NotFoundResult`, `BadRequestObjectResult`).
- Ausführen: `dotnet test backend/PortfolioBackend.sln`.
