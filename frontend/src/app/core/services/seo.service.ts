import { DOCUMENT } from '@angular/common';
import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_LANGUAGE } from '@/app/core/config/languages';
import { environment } from '@/environments/environment';
import { LanguageService } from './language.service';
import { ProfileService } from './profile.service';

const SITE_NAME = 'Alexander Sickler';
const OG_LOCALES = { de: 'de_DE', en: 'en_US' } as const;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  constructor() {
    this.update(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => this.update(event.urlAfterRedirects));
    effect(() => this.updateStructuredData(this.languageService.currentLanguage()));
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
    const absoluteUrl = (lang: string): string => `${environment.siteUrl}/${lang}${localizedPath}`;
    const alternateLanguage = language === 'de' ? 'en' : 'de';

    this.ensureLink('canonical', undefined, absoluteUrl(language));
    this.ensureLink('alternate', 'de', absoluteUrl('de'));
    this.ensureLink('alternate', 'en', absoluteUrl('en'));
    this.ensureLink('alternate', 'x-default', absoluteUrl(DEFAULT_LANGUAGE));
    this.ensureMeta('name', 'description', description);
    this.ensureMeta('property', 'og:type', 'website');
    this.ensureMeta('property', 'og:site_name', SITE_NAME);
    this.ensureMeta('property', 'og:title', title);
    this.ensureMeta('property', 'og:description', description);
    this.ensureMeta('property', 'og:url', absoluteUrl(language));
    this.ensureMeta('property', 'og:locale', OG_LOCALES[language]);
    this.ensureMeta('property', 'og:locale:alternate', OG_LOCALES[alternateLanguage]);
    this.ensureMeta('name', 'twitter:card', 'summary');
  }

  private updateStructuredData(language: string): void {
    const profile = this.profileService.profile();
    const socialUrls = (profile?.socialLinks ?? [])
      .map(link => link.url)
      .filter(url => url.startsWith('https://') || url.startsWith('http://'));
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile?.fullName ?? SITE_NAME,
      url: `${environment.siteUrl}/${language}`,
      ...(profile?.jobTitle ? { jobTitle: profile.jobTitle } : {}),
      ...(socialUrls.length ? { sameAs: socialUrls } : {}),
    };

    let script = this.document.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"]',
    );
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(person).replace(/</g, '\\u003c');
  }

  private ensureMeta(attribute: 'name' | 'property', key: string, content: string): void {
    let meta = this.document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

    if (!meta) {
      meta = this.document.createElement('meta');
      meta.setAttribute(attribute, key);
      this.document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
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
