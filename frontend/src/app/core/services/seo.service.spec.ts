import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { getMockProfile } from '@/app/core/mocks/profile.mock';
import { environment } from '@/environments/environment';
import { SeoService } from './seo.service';
import { ProfileService } from './profile.service';

@Component({ standalone: true, template: '' })
class TestRouteComponent {}

describe('SeoService', () => {
  const profile = signal(getMockProfile('de'));

  const attr = (selector: string, name: string): string | null | undefined =>
    document.head.querySelector(selector)?.getAttribute(name);

  const navigate = async (url: string): Promise<void> => {
    await TestBed.inject(Router).navigateByUrl(url);
    TestBed.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: ':lang', component: TestRouteComponent },
          { path: ':lang/projects', component: TestRouteComponent },
        ]),
        { provide: ProfileService, useValue: { profile } },
      ],
    });
    TestBed.inject(SeoService);
  });

  afterEach(() => {
    document.head
      .querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[property], script')
      .forEach(element => element.remove());
    document.documentElement.removeAttribute('lang');
    TestBed.resetTestingModule();
  });

  it('sets language, title and absolute canonical and hreflang links', async () => {
    await navigate('/en/projects');

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Projects | Alexander Sickler');
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${environment.siteUrl}/en/projects`);
    expect(attr('link[hreflang="de"]', 'href')).toBe(`${environment.siteUrl}/de/projects`);
    expect(attr('link[hreflang="x-default"]', 'href')).toBe(`${environment.siteUrl}/de/projects`);
  });

  it('sets Open Graph tags for the current language', async () => {
    await navigate('/de');

    expect(attr('meta[property="og:locale"]', 'content')).toBe('de_DE');
    expect(attr('meta[property="og:locale:alternate"]', 'content')).toBe('en_US');
    expect(attr('meta[property="og:url"]', 'content')).toBe(`${environment.siteUrl}/de`);
    expect(attr('meta[property="og:title"]', 'content')).toBe(document.title);
  });

  it('renders Person structured data and only keeps web links', async () => {
    await navigate('/de');

    const json = JSON.parse(
      document.head.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    ) as { '@type': string; name: string; sameAs: string[] };

    expect(json['@type']).toBe('Person');
    expect(json.name).toBe(profile().fullName);
    expect(json.sameAs.length).toBeGreaterThan(0);
    expect(json.sameAs.every(url => url.startsWith('http'))).toBe(true);
  });
});
