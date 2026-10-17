import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

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

    expect(service.currentLanguage()).toBe('en');

    service.setLanguage('de');

    expect(service.currentLanguage()).toBe('de');
    expect(localStorage.getItem(storageKey)).toBe('de');
  });
});
