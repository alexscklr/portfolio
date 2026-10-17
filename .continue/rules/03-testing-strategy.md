---
name: Testing Strategy
---

# Teststrategie

## Frontend: Vitest

- Runner: `ng test` (Builder `@angular/build:unit-test`) mit **Vitest** und **jsdom**. Aufruf: `npm --prefix frontend test` (generiert vorher die Environment-Datei).
- Specs liegen als `*.spec.ts` neben dem getesteten Code. Tests verwenden `TestBed.configureTestingModule`, `describe`/`it`/`expect` und bei Routing `RouterTestingHarness`.
- Standalone-Komponenten über `imports` testen; Services über `TestBed` oder `provideHttpClient()` + `provideHttpClientTesting()`.
- App ist zoneless: auf Stabilität mit `await fixture.whenStable()` warten, Signals direkt setzen/lesen.
- Mock-Daten aus `core/mocks` für Tests nutzen; `environment.dataSource` beachten. Für HTTP-Ressourcen `provideHttpClient()` und `provideHttpClientTesting()` verwenden; offene Übersetzungs-Requests ebenfalls beantworten oder verifizieren.
- Kein `any` in Tests; Testnamen beschreiben das Verhalten.
- Aktueller Stand: Specs decken App-Shell, Projektservice, reine Filterfunktionen, Projektseite, Skillfilter, Projektkarte und Medien-Slider ab. Projektfiltertests sollten unter anderem URL-Parsing, UND-Verhalten, kompatible Facetten und Leerzustände absichern.
- Bei Medienkomponenten in jsdom können `HTMLMediaElement.play()`/`pause()`-Warnungen auftreten, da jsdom diese APIs nicht implementiert; Browserverhalten bei relevanten Änderungen zusätzlich prüfen.

## Backend: noch nicht eingerichtet

- Es existiert kein Testprojekt. Testframework und Strategie sind noch festzulegen, bevor ein Backend-Testprojekt eingerichtet wird.
- Bei der Einrichtung ein eigenes Projekt im Solution-Verbund vorsehen und Tests möglichst ohne echte externe Dienste betreiben.
- Dateien und Klassen spiegeln die Struktur (`Controllers/SkillsControllerTests.cs`); Testnamen `Methode_Szenario_Ergebnis`; Arrange/Act/Assert.
- Priorität: reine Logik zuerst (`SupportedLanguages`, `TranslationResolver`, `TranslationInputValidator`, Mapper), danach Controller.
- Datenbankzugriff über EF Core InMemory oder SQLite-In-Memory bzw. Testcontainers (PostgreSQL); `IStorageService` per Fake/Mock ersetzen, kein echter Azurite-Zugriff in Unit-Tests.
- Controller-Tests prüfen Statuscodes (`OkObjectResult`, `NotFoundResult`, `BadRequestObjectResult`).
- Ausführen: nach Einrichtung `dotnet test backend/PortfolioBackend.sln`.
- C# 12, file-scoped namespaces, 4 Leerzeichen.

## Allgemein

- Beim Generieren von Code passende Tests mitliefern, sobald die Infrastruktur dafür existiert.
- Tests deterministisch halten: keine Netzwerkzugriffe, keine echten Secrets.
