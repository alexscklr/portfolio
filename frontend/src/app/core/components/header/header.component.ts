import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { Language, SUPPORTED_LANGUAGES } from '@/app/core/config/languages';
import { LanguageService } from '@/app/core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonDirective, LinkDirective, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly languageService = inject(LanguageService);
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;
    this.languageService.setLanguage(language);
  }
}