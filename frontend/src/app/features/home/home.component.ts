import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '@/app/core/services/project.service';
import { ProjectCardComponent } from '@/app/shared/components/project-card/project-card.component';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { RevealOnScrollDirective } from '@/app/shared/directives/reveal-on-scroll.directive';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { AvatarOrbitComponent } from './components/avatar-orbit/avatar-orbit.component';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { LanguageService } from '@/app/core/services/language.service';
import { SkillService } from '@/app/core/services/skill.service';
import { SkillMarqueeComponent } from './components/skill-marquee/skill-marquee.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent, ButtonDirective, RevealOnScrollDirective, AvatarOrbitComponent, LinkDirective, TranslatePipe, SkillMarqueeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);
  readonly projectService = inject(ProjectService);
  readonly skillsService = inject(SkillService);

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      this.projectService.loadFeaturedProjects();
      this.skillsService.loadSkills();
    });
  }
}