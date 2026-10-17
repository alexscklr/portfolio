---
name: Refactoring Goals
---

# Refactoring-Ziele

Refactorings schrittweise und in kleinen, nachvollziehbaren Schritten durchführen; Verhalten erhalten.

## Backend: HTTP-Statuscodes

Es gibt keine globale Fehler-Middleware. Controller müssen daher selbst saubere Statuscodes liefern:

- `200 Ok`: erfolgreiche Abfrage; `404 NotFound`: Ressource existiert nicht (nicht `null` oder leere Antwort mit 200).
- `400 BadRequest`: ungültige Eingabe (z. B. ungültiger Sprachcode, Validierungsfehler aus `TranslationInputValidator`).
- `201 CreatedAtAction` / `204 NoContent` bei Anlegen bzw. Ändern/Löschen, sofern solche Endpunkte entstehen.
- Rückgabetyp `ActionResult<T>`, Statuscodes mit `[ProducesResponseType]` dokumentieren.
- Keine internen Fehlerdetails an Clients; Ausnahmen mit `ILogger<T>` loggen.
- Optionales späteres Ziel: einheitliches `ProblemDetails`-Format bzw. zentrale Fehlerbehandlung.
- Weitere Ziele: Entitäten nie direkt ausliefern, Leseabfragen mit `AsNoTracking()`, durchgängig `async`, file-scoped namespaces.

## Frontend: Signals statt RxJS

- Zustand in Services und Komponenten mit `signal`, `computed`, `effect` halten; abgeleitete Werte per `computed`.
- RxJS nur an der HTTP-/Router-Grenze nutzen. Signalbasierte Ressourcen können mit dem vorhandenen `rxResource`-Muster umgesetzt werden; Router-Observables bei Bedarf mit `toSignal` anbinden. Keine neuen langlebigen `subscribe`-Ketten und keine `BehaviorSubject`-Zustände.
- Beim Refactoring von Alt-Code `subscribe({ next, error })` schrittweise in Signal-basierte Lösungen überführen, ohne Lade- und Fehlerzustände (`isLoading`, Leerzustand) zu verlieren.
- Beide Datenquellen (`api`, `frontend-mock`) müssen weiter funktionieren.
- Kein `any`; explizite Typen aus `core/models`.
- Projektfilterverhalten erhalten: Query-Parameter `skills`, UND-Semantik und Facetten nur für Skills, die mit der Auswahl gemeinsam vorkommen. Die Skill-Suche filtert nur Facetten.
- Bei UI-Änderungen Animationen mit `prefers-reduced-motion` und zugängliche Fokus-/Screenreader-Zustände bewahren.

## Stil

- Angefasste Dateien nach Prettier (2 Leerzeichen, Single Quotes) formatieren, aber keine unbeteiligten Zeilen umformatieren (z. B. `skill.service.ts` nur im geänderten Bereich).
- `console.error` im Frontend ist aktueller Standard; nicht ohne Auftrag ersetzen.
