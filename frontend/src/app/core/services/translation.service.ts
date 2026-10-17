import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { Language } from '../config/languages';

type TranslationDictionary = Record<string, string>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly translations = signal<TranslationDictionary>({});
  private readonly dictionaries = new Map<Language, TranslationDictionary>();

  translate(key: string): string {
    return this.translations()[key] ?? key;
  }

  /** Lädt das Wörterbuch und setzt es als aktiv; wird vom Routen-Resolver vor dem ersten Render genutzt. */
  use(language: Language): Observable<void> {
    return this.fetchDictionary(language).pipe(
      tap(dictionary => this.translations.set(dictionary)),
      map(() => undefined),
    );
  }

  private fetchDictionary(language: Language): Observable<TranslationDictionary> {
    const cachedDictionary = this.dictionaries.get(language);
    if (cachedDictionary) {
      return of(cachedDictionary);
    }

    return forkJoin({
      common: this.http.get<TranslationDictionary>(`/i18n/${language}/common.json`),
      home: this.http.get<TranslationDictionary>(`/i18n/${language}/home.json`),
      projects: this.http.get<TranslationDictionary>(`/i18n/${language}/projects.json`)
    }).pipe(
      map(dictionaries => ({
        ...dictionaries.common,
        ...dictionaries.home,
        ...dictionaries.projects
      })),
      tap(dictionary => this.dictionaries.set(language, dictionary)),
      catchError(error => {
        console.error(`Could not load translations for ${language}.`, error);
        return of<TranslationDictionary>({});
      }),
    );
  }
}
