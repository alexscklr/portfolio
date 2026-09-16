import { Injectable, signal } from '@angular/core';
import {
  Language,
  resolveLanguage,
} from '../config/languages';

const STORAGE_KEY = 'portfolio-language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLanguage = signal<Language>(this.getInitialLanguage());

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  private getInitialLanguage(): Language {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);

    if (storedLanguage) {
      return resolveLanguage(storedLanguage);
    }

    return resolveLanguage(navigator.language);
  }
}
