import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { Language, SUPPORTED_LANGUAGES } from '@/app/core/config/languages';
import { LanguageService } from '@/app/core/services/language.service';
import { AsyncPipe } from '@angular/common';
import { SeoService } from '@/app/core/services/seo.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonDirective, LinkDirective, TranslatePipe, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly languageService = inject(LanguageService);
  readonly supportedLanguages = SUPPORTED_LANGUAGES;
  private readonly seoService = inject(SeoService);

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;
    this.languageService.setLanguage(language);
  }
}