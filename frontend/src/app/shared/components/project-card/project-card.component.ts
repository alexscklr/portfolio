import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectLinkType, SkillTag } from '@/app/core/models';
import { SKILL_CATEGORY_STYLES } from '@/app/core/config/skill-category';
import { LanguageService } from '@/app/core/services/language.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { MediaSliderComponent } from '@/app/shared/components/media-slider/media-slider.component';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';

const MAX_VISIBLE_SKILLS = 5;

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, LinkDirective, MediaSliderComponent, TranslatePipe],
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);

  readonly project = input.required<Project>();

  protected readonly visibleSkills = computed(() =>
    this.project().skills.slice(0, MAX_VISIBLE_SKILLS),
  );
  protected readonly hiddenSkillCount = computed(() =>
    Math.max(0, this.project().skills.length - MAX_VISIBLE_SKILLS),
  );
  protected readonly liveUrl = computed(() => this.findLinkUrl(ProjectLinkType.LiveDemo));
  protected readonly sourceUrl = computed(() => this.findLinkUrl(ProjectLinkType.GitHub));

  protected readonly period = computed(() => {
    const { startDate, endDate } = this.project();
    if (!startDate) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat(this.languageService.currentLanguage(), {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const start = formatter.format(new Date(startDate));
    // Das Übersetzungssignal macht den Ausdruck bei Sprachwechsel reaktiv.
    const end = endDate
      ? formatter.format(new Date(endDate))
      : this.translationService.translate('projects.card.ongoing');
    return start === end ? start : `${start} – ${end}`;
  });

  protected chipClass(skill: SkillTag): string {
    return SKILL_CATEGORY_STYLES[skill.category].chipSelected;
  }

  private findLinkUrl(type: ProjectLinkType): string | null {
    return this.project().links.find(link => link.type === type)?.url ?? null;
  }
}
