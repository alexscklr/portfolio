import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Language } from '@/app/core/config/languages';
import { LanguageService } from '@/app/core/services/language.service';
import { SeoService } from '@/app/core/services/seo.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  const setLanguage = vi.fn<(language: Language) => void>();
  const currentLanguage = signal<Language>('en');

  beforeEach(() => {
    setLanguage.mockClear();
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: {} },
        { provide: TranslationService, useValue: { translate: (key: string) => key } },
        {
          provide: LanguageService,
          useValue: {
            currentLanguage,
            setLanguage,
            localizedUrl: (path: string) => `/${currentLanguage()}${path === '/' ? '' : path}`,
          },
        },
      ],
    });
  });

  it('links to pages with the current language prefix', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const hrefs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a')).map(
      link => link.getAttribute('href'),
    );

    expect(hrefs).toContain('/en');
    expect(hrefs).toContain('/en/projects');
  });

  it('preselects the current language and switches it on change', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const select = (fixture.nativeElement as HTMLElement).querySelector('select');

    expect(select?.value).toBe('en');

    if (select) {
      select.value = 'de';
      select.dispatchEvent(new Event('change'));
    }

    expect(setLanguage).toHaveBeenCalledWith('de');
  });
});
