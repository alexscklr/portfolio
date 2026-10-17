import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_LANGUAGE } from '@/app/core/config/languages';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  constructor() {
    this.update(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => this.update(event.urlAfterRedirects));
  }

  private update(url: string): void {
    const tree = this.router.parseUrl(url);
    const segments =
      tree.root.children[PRIMARY_OUTLET]?.segments.map(segment => segment.path) ?? [];
    const language = this.languageService.currentLanguage();
    const pagePath = segments[0] === language ? segments.slice(1) : [];
    const isProjectsPage = pagePath[0] === 'projects';
    const title = isProjectsPage
      ? language === 'de'
        ? 'Projekte | Alexander Sickler'
        : 'Projects | Alexander Sickler'
      : language === 'de'
        ? 'Alexander Sickler | Portfolio'
        : 'Alexander Sickler | Portfolio';
    const description = isProjectsPage
      ? language === 'de'
        ? 'Ausgewählte Projekte von Alexander Sickler.'
        : 'Selected projects by Alexander Sickler.'
      : language === 'de'
        ? 'Portfolio von Alexander Sickler, Entwickler digitaler Produkte.'
        : 'Portfolio of Alexander Sickler, developer of digital products.';
    const localizedPath = pagePath.length > 0 ? `/${pagePath.join('/')}` : '';

    this.document.documentElement.lang = language;
    this.document.title = title;
    this.ensureLink('canonical', undefined, `/${language}${localizedPath}`);
    this.ensureLink('alternate', 'de', `/de${localizedPath}`);
    this.ensureLink('alternate', 'en', `/en${localizedPath}`);
    this.ensureLink('alternate', 'x-default', `/${DEFAULT_LANGUAGE}${localizedPath}`);
    this.document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }

  private ensureLink(rel: string, hrefLang: string | undefined, href: string): void {
    const selector = hrefLang ? `link[rel="${rel}"][hreflang="${hrefLang}"]` : `link[rel="${rel}"]`;
    let link = this.document.querySelector<HTMLLinkElement>(selector);

    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hrefLang) link.hreflang = hrefLang;
      this.document.head.appendChild(link);
    }

    link.href = href;
  }
}
