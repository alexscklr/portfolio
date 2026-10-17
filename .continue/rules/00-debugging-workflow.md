---
name: Debugging Workflow
alwaysApply: true
---

# Vorgehen bei Bugs

1. Symptom und erwartetes Verhalten in einem Satz wiederholen.
2. Den Datenfluss vom Zustand bis zur Anzeige nachverfolgen (Quelle → Signal/Service → Template → DOM) und die Stelle benennen, an der Zustand und Anzeige auseinanderlaufen. Dabei Zeitpunkte beachten: Was ist beim ersten Rendern schon vorhanden, was erst später?
3. Prüfen, ob der Code den Wert schon setzt. Ein vorhandener Ansatz, der trotzdem nicht wirkt, ist ein Hinweis auf Reihenfolge oder Lifecycle, nicht auf fehlenden Code. Denselben Ansatz nicht erneut als Fix vorschlagen.
4. Ursache in ein bis zwei Sätzen erklären, bevor Code geändert wird.
5. Die kleinste Änderung vorschlagen, die die Ursache beseitigt, und nur diese Zeilen zeigen.
6. Wenn Informationen fehlen (z. B. eine Datei), nachfragen oder die Datei lesen, statt zu raten.

## Systematische Template-Analyse

Zuerst die HTML-Grundlagen prüfen, bevor komplexe Signal-, Event- oder Lifecycle-Ursachen gesucht werden:

- Sind alle nötigen Attribute der beteiligten Elemente gesetzt? Fehlende Attribute in Formularelementen sind ein klassisches Problem.
- Wird ein Wert nicht korrekt angezeigt: zuerst fragen, welche Attribute an den Kindelementen fehlen und wie das Element nativ seinen Wert bestimmt.
- Danach Event-Bindings und den Datenfluss prüfen.
- Die einfachste direkte Lösung zuerst versuchen, bevor zusätzliche Signal- oder Service-Logik entsteht.
