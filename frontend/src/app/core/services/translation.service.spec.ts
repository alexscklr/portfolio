import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let http: HttpTestingController;
  let service: TranslationService;

  const flushLanguage = (language: string, entries: Record<string, string>): void => {
    http.expectOne(`/i18n/${language}/common.json`).flush(entries);
    http.expectOne(`/i18n/${language}/home.json`).flush({});
    http.expectOne(`/i18n/${language}/projects.json`).flush({});
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TranslationService);
  });

  afterEach(() => http.verify({ ignoreCancelled: true }));

  it('returns the key until a language is loaded', () => {
    expect(service.translate('nav.home')).toBe('nav.home');
  });

  it('translates after the dictionary was loaded', () => {
    service.use('en').subscribe();
    flushLanguage('en', { 'nav.home': 'Home' });

    expect(service.translate('nav.home')).toBe('Home');
  });

  it('serves a language from cache on repeated use', () => {
    service.use('de').subscribe();
    flushLanguage('de', { 'nav.home': 'Start' });

    service.use('de').subscribe();
    http.expectNone('/i18n/de/common.json');

    expect(service.translate('nav.home')).toBe('Start');
  });

  it('falls back to an empty dictionary when loading fails', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let completed = false;
    service.use('en').subscribe({ complete: () => (completed = true) });
    http.expectOne('/i18n/en/common.json').error(new ProgressEvent('error'));

    expect(completed).toBe(true);
    expect(service.translate('nav.home')).toBe('nav.home');
    expect(error).toHaveBeenCalled();
  });
});
