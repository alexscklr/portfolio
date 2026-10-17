---
name: Frontend Testing
globs: "frontend/**/*.spec.ts"
alwaysApply: false
---

# Frontend-Tests (Vitest + jsdom)

- Ausführen: `npm --prefix frontend test`. Specs liegen als `*.spec.ts` neben dem Code.
- `TestBed.configureTestingModule`, Standalone-Komponenten über `imports`; Routing mit `RouterTestingHarness`.
- HTTP: `provideHttpClient()` + `provideHttpClientTesting()`; offene Übersetzungs-Requests beantworten oder verifizieren.
- Routen mit `:lang`: `provideRouter(routes)` verwenden und `TranslationService` stubben (`use` liefert `of(undefined)`); Plattform per `{ provide: PLATFORM_ID, useValue: 'server' }` simulieren.
- Zoneless: mit `await fixture.whenStable()` warten, Signals direkt setzen/lesen.
- Mock-Daten aus `core/mocks` nutzen; `environment.dataSource` beachten.
- Kein `any`; Testnamen beschreiben das Verhalten; deterministisch, keine Netzwerkzugriffe.
- jsdom implementiert `HTMLMediaElement.play()`/`pause()` nicht; Warnungen sind erwartbar.
- Zu neuem Code passende Tests mitliefern.
