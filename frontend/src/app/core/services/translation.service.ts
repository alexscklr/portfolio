import { HttpClient } from '@angular/common/http';
import { effect, Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LanguageService } from './language.service';
import { Language } from '../config/languages';

type TranslationDictionary = Record<string, string>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly translations = signal<TranslationDictionary>({});
  private readonly dictionaries = new Map<Language, TranslationDictionary>();

  constructor() {
    effect(() => this.loadLanguage(this.languageService.currentLanguage()));
  }

  translate(key: string): string {
    return this.translations()[key] ?? key;
  }

  private loadLanguage(language: Language): void {
    const cachedDictionary = this.dictionaries.get(language);
    if (cachedDictionary) {
      this.translations.set(cachedDictionary);
      return;
    }

    forkJoin({
      common: this.http.get<TranslationDictionary>(`/i18n/${language}/common.json`),
      home: this.http.get<TranslationDictionary>(`/i18n/${language}/home.json`),
      projects: this.http.get<TranslationDictionary>(`/i18n/${language}/projects.json`)
    }).subscribe({
      next: dictionaries => {
        const dictionary = {
          ...dictionaries.common,
          ...dictionaries.home,
          ...dictionaries.projects
        };
        this.dictionaries.set(language, dictionary);
        if (this.languageService.currentLanguage() === language) {
          this.translations.set(dictionary);
        }
      },
      error: error => console.error(`Could not load translations for ${language}.`, error)
    });
  }
}
