import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectLinkType, SkillTag } from '@/app/core/models';
import { SKILL_CATEGORY_STYLES } from '@/app/core/config/skill-category';
import { LanguageService } from '@/app/core/services/language.service';
import { ProjectService } from '@/app/core/services/project.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { ProjectBlocksComponent } from '../blocks/project-blocks.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LinkDirective, TranslatePipe, ProjectBlocksComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
  protected readonly projectService = inject(ProjectService);
  protected readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);

  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });

  protected readonly slug = computed(() => this.routeParams().get('slug'));
  protected readonly isCurrentSelection = computed(
    () => this.slug() === this.projectService.selectedProjectSlug(),
  );
  protected readonly project = computed(() =>
    this.isCurrentSelection() ? this.projectService.selectedProject() : null,
  );
  protected readonly isLoading = computed(
    () => !this.isCurrentSelection() || this.projectService.isSelectedProjectLoading(),
  );
  protected readonly isNotFound = computed(
    () => this.isCurrentSelection() && this.projectService.selectedProjectNotFound(),
  );
  protected readonly hasError = computed(
    () => this.isCurrentSelection() && this.projectService.hasSelectedProjectError(),
  );
  protected readonly period = computed(() => {
    const project = this.project();
    if (!project?.startDate) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat(this.languageService.currentLanguage(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const start = formatter.format(new Date(project.startDate));
    const end = project.endDate
      ? formatter.format(new Date(project.endDate))
      : this.translationService.translate('projects.card.ongoing');

    return start === end ? start : `${start} – ${end}`;
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      if (slug) {
        this.projectService.selectProject(slug);
      }
    });
  }

  protected skillClass(skill: SkillTag): string {
    return SKILL_CATEGORY_STYLES[skill.category].chipSelected;
  }

  protected isPrimaryLink(type: ProjectLinkType): boolean {
    return type === ProjectLinkType.LiveDemo;
  }
}
