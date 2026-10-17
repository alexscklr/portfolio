import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DEFAULT_LANGUAGE, Language, resolveLanguage } from '../config/languages';

const STORAGE_KEY = 'portfolio-language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly writableCurrentLanguage = signal<Language>(this.getInitialLanguage());
  readonly currentLanguage = this.writableCurrentLanguage.asReadonly();

  setLanguage(lang: Language): void {
    this.writableCurrentLanguage.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  private getInitialLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_LANGUAGE;
    }

    const storedLanguage = localStorage.getItem(STORAGE_KEY);

    if (storedLanguage) {
      return resolveLanguage(storedLanguage);
    }

    return resolveLanguage(navigator.language);
  }
}
