import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '@/app/core/services/project.service';
import { ProjectCardComponent } from '@/app/shared/components/project-card/project-card.component';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { RevealOnScrollDirective } from '@/app/shared/directives/reveal-on-scroll.directive';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { AvatarOrbitComponent } from './components/avatar-orbit/avatar-orbit.component';
import { InfiniteSliderDirective } from '@/app/shared/directives/infinite-slider.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { LanguageService } from '@/app/core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent, ButtonDirective, RevealOnScrollDirective, AvatarOrbitComponent, LinkDirective, InfiniteSliderDirective, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);
  readonly projectService = inject(ProjectService);

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      this.projectService.loadFeaturedProjects();
    });
  }
}