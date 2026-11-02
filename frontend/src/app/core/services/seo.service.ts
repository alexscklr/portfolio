import { DOCUMENT } from '@angular/common';
import { DestroyRef, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_LANGUAGE } from '@/app/core/config/languages';
import { environment } from '@/environments/environment';
import { LanguageService } from './language.service';
import { Project } from '@/app/core/models';
import { ProfileService } from './profile.service';

const SITE_NAME = 'Alexander Sickler';
const OG_LOCALES = { de: 'de_DE', en: 'en_US' } as const;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly profileService = inject(ProfileService);
  private readonly project = signal<Project | null>(null);
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
    effect(() => {
      this.project();
      untracked(() => this.update(this.router.url));
    });
  }

  /** Setzt die Projektdaten für Metadaten der Detailseite; `null` entfernt sie wieder. */
  setProject(project: Project | null): void {
    this.project.set(project);
  }

  private update(url: string): void {
    const tree = this.router.parseUrl(url);
    const segments =
      tree.root.children[PRIMARY_OUTLET]?.segments.map(segment => segment.path) ?? [];
    const language = this.languageService.currentLanguage();
    const pagePath = segments[0] === language ? segments.slice(1) : [];
    const isProjectsPage = pagePath[0] === 'projects';
    const project = isProjectsPage ? this.detailProject(pagePath[1]) : undefined;
    const title = project
      ? `${project.title} | ${SITE_NAME}`
      : isProjectsPage
        ? language === 'de'
          ? 'Projekte | Alexander Sickler'
          : 'Projects | Alexander Sickler'
        : language === 'de'
          ? 'Alexander Sickler | Portfolio'
          : 'Alexander Sickler | Portfolio';
    const description = project
      ? project.shortDescription || project.subtitle || project.title
      : isProjectsPage
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
    const imageUrl = project ? this.absoluteMediaUrl(project.previewMediaUrl) : undefined;

    this.ensureMeta('property', 'og:type', project ? 'article' : 'website');
    this.ensureMeta('property', 'og:site_name', SITE_NAME);
    this.ensureMeta('property', 'og:title', title);
    this.ensureMeta('property', 'og:description', description);
    this.ensureMeta('property', 'og:url', absoluteUrl(language));
    this.ensureMeta('property', 'og:locale', OG_LOCALES[language]);
    this.ensureMeta('property', 'og:locale:alternate', OG_LOCALES[alternateLanguage]);
    this.ensureMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    this.setOptionalMeta('property', 'og:image', imageUrl);
    this.setOptionalMeta('name', 'twitter:image', imageUrl);
    this.updateProjectStructuredData(project, title, description, absoluteUrl(language), imageUrl);
  }

  private detailProject(slug: string | undefined): Project | undefined {
    const project = this.project();
    return slug && project && project.slug === slug ? project : undefined;
  }

  private absoluteMediaUrl(url: string | undefined): string | undefined {
    if (!url) {
      return undefined;
    }

    return /^https?:\/\//.test(url)
      ? url
      : `${environment.siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private updateProjectStructuredData(
    project: Project | undefined,
    title: string,
    description: string,
    url: string,
    imageUrl: string | undefined,
  ): void {
    const selector = 'script[data-seo="project"]';
    let script = this.document.querySelector<HTMLScriptElement>(selector);

    if (!project) {
      script?.remove();
      return;
    }

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'project');
      this.document.head.appendChild(script);
    }

    const data = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      headline: title,
      description,
      url,
      inLanguage: this.languageService.currentLanguage(),
      author: { '@type': 'Person', name: this.profileService.profile()?.fullName ?? SITE_NAME },
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(project.startDate ? { dateCreated: project.startDate } : {}),
      ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
      ...(project.skills.length
        ? { keywords: project.skills.map(skill => skill.name).join(', ') }
        : {}),
    };

    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  private setOptionalMeta(
    attribute: 'name' | 'property',
    key: string,
    content: string | undefined,
  ): void {
    if (content) {
      this.ensureMeta(attribute, key, content);
      return;
    }

    this.document.querySelector(`meta[${attribute}="${key}"]`)?.remove();
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
      'script[type="application/ld+json"]:not([data-seo])',
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
