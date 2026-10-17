---
name: Frontend Angular
globs: "frontend/src/**/*.{ts,html,scss}"
alwaysApply: false
---

# Frontend (Angular, zoneless, Signals)

- Nur Standalone-Komponenten, Routen lazy per `loadComponent`, DI mit `inject()`, Services `providedIn: 'root'`.
- Zustand mit `signal`/`computed`/`effect`; abgeleitete Werte per `computed`. RxJS nur an der HTTP-/Router-Grenze (`rxResource`, `toSignal`); keine neuen langlebigen `subscribe`-Ketten, keine `BehaviorSubject`.
- Beim Refactoring `isLoading` und sichere Leerzustände in allen Pfaden erhalten.
- Services müssen `environment.dataSource` (`api` | `frontend-mock`) berücksichtigen.
- Striktes Typing: kein `any`; Modelle aus `core/models`; `noPropertyAccessFromIndexSignature` beachten.
- Neue UI-Texte in `public/i18n/de` **und** `en`, Anzeige per `translate`-Pipe.
- Stil: Prettier (2 Leerzeichen, Single Quotes, trailing commas, 100 Zeichen); nur angefasste Zeilen umformatieren. `console.error` bleibt Standard.
- Animationen mit `prefers-reduced-motion` und Fokus-/Screenreader-Zustände bewahren.
- Projektfilter: Query-Parameter `skills`, UND-Semantik, Facetten nur für gemeinsam vorkommende Skills.
- Sprache liegt in `LanguageService` (Signal, persistiert in `localStorage`).
