import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { resolveLanguage } from '@/app/core/config/languages';
import { LanguageService } from './language.service';

@Component({
  standalone: true,
  template: '',
})
class TestRouteComponent {}

describe('LanguageService', () => {
  const storageKey = 'portfolio-language';

  afterEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.resetTestingModule();
  });

  it('uses the default language and avoids browser storage on the server', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const service = TestBed.inject(LanguageService);

    expect(service.currentLanguage()).toBe('de');
    expect(getItem).not.toHaveBeenCalled();

    service.setLanguage('en');

    expect(service.currentLanguage()).toBe('en');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('loads and persists the selected language in the browser', () => {
    localStorage.setItem(storageKey, 'en');
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(LanguageService);

    expect(service.currentLanguage()).toBe('de');
    expect(service.getPreferredLanguage()).toBe('en');

    service.setLanguage('de');

    expect(service.currentLanguage()).toBe('de');
    expect(localStorage.getItem(storageKey)).toBe('de');
  });

  it('uses the URL language and switches the same route while preserving query parameters', async () => {
    localStorage.setItem(storageKey, 'en');
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideRouter([{ path: ':lang/projects', component: TestRouteComponent }]),
      ],
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/de/projects?skills=angular');
    const service = TestBed.inject(LanguageService);

    expect(service.currentLanguage()).toBe('de');

    const navigation = firstValueFrom(
      router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter(event => event.urlAfterRedirects.startsWith('/en/')),
      ),
    );
    service.setLanguage('en');

    expect(await navigation.then(event => event.urlAfterRedirects)).toBe(
      '/en/projects?skills=angular',
    );
    expect(service.currentLanguage()).toBe('en');
    expect(localStorage.getItem(storageKey)).toBe('en');
  });

  it('resolves browser language tags with a region', () => {
    expect(resolveLanguage('en-US')).toBe('en');
    expect(resolveLanguage('de-AT')).toBe('de');
  });
});
