import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { routes } from './app.routes';
import { TranslationService } from '@/app/core/services/translation.service';

describe('routes', () => {
  const use = vi.fn((): Observable<void> => of(undefined));

  beforeEach(() => {
    use.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: TranslationService, useValue: { use, translate: (key: string) => key } },
      ],
    });
  });

  const urlAfterNavigation = async (url: string): Promise<string> => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl(url);
    return router.url;
  };

  it('keeps supported language URLs and loads translations before rendering', async () => {
    expect(await urlAfterNavigation('/en/projects')).toBe('/en/projects');
    expect(use).toHaveBeenCalledWith('en');
  });

  it('redirects an unsupported language to the default language', async () => {
    expect(await urlAfterNavigation('/fr/projects')).toBe('/de/projects');
    expect(use).toHaveBeenCalledWith('de');
  });

  it('redirects unknown pages inside a language to its home page', async () => {
    expect(await urlAfterNavigation('/en/unknown')).toBe('/en');
  });

  it('does not load translations on the root', async () => {
    expect(await urlAfterNavigation('/')).toBe('/');
    expect(use).not.toHaveBeenCalled();
  });
});
