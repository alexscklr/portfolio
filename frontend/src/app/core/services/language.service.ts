import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  Language,
  resolveLanguage,
} from '../config/languages';

const STORAGE_KEY = 'portfolio-language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly router = inject(Router, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly writableCurrentLanguage = signal<Language>(this.getInitialLanguage());
  readonly currentLanguage = this.writableCurrentLanguage.asReadonly();

  constructor() {
    this.router?.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(event => this.updateLanguageFromUrl(event.urlAfterRedirects));
  }

  setLanguage(lang: Language): void {
    this.writableCurrentLanguage.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    if (!this.router) return;

    const urlTree = this.router.parseUrl(this.router.url);
    const segments =
      urlTree.root.children[PRIMARY_OUTLET]?.segments.map(segment => segment.path) ?? [];

    if (!isSupportedLanguage(segments[0])) return;

    segments[0] = lang;

    void this.router.navigateByUrl(
      this.router.createUrlTree(['/', ...segments], {
        queryParams: urlTree.queryParams,
        fragment: urlTree.fragment ?? undefined,
      }),
    );
  }

  getPreferredLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_LANGUAGE;
    }

    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    return storedLanguage ? resolveLanguage(storedLanguage) : resolveLanguage(navigator.language);
  }

  localizedUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/${this.currentLanguage()}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  private getInitialLanguage(): Language {
    const urlLanguage = this.getLanguageFromUrl(this.router?.url);
    if (urlLanguage) {
      return urlLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  private updateLanguageFromUrl(url: string): void {
    const language = this.getLanguageFromUrl(url);
    if (language) {
      this.writableCurrentLanguage.set(language);
    }
  }

  private getLanguageFromUrl(url: string | undefined): Language | undefined {
    const firstSegment = url?.split(/[?#]/, 1)[0].split('/').filter(Boolean)[0];
    return isSupportedLanguage(firstSegment) ? firstSegment : undefined;
  }
}
