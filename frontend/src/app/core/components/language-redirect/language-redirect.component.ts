import { Component, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '@/app/core/services/language.service';

@Component({
  selector: 'app-language-redirect',
  standalone: true,
  template: '<p class="sr-only" role="status">Redirecting to your language…</p>',
})
export class LanguageRedirectComponent {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  constructor() {
    afterNextRender(() => {
      void this.router.navigateByUrl(`/${this.languageService.getPreferredLanguage()}`);
    });
  }
}
