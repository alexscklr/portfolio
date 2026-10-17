import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LanguageService } from '@/app/core/services/language.service';
import { LanguageRedirectComponent } from './language-redirect.component';

describe('LanguageRedirectComponent', () => {
  it('redirects to the preferred language after rendering', async () => {
    const navigateByUrl = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      imports: [LanguageRedirectComponent],
      providers: [
        { provide: Router, useValue: { navigateByUrl } },
        { provide: LanguageService, useValue: { getPreferredLanguage: () => 'en' } },
      ],
    });
    const fixture = TestBed.createComponent(LanguageRedirectComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalledWith('/en');
  });
});
