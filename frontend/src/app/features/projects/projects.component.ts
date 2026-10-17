import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@/app/core/services/project.service';
import { ProjectCardComponent } from '@/app/shared/components/project-card/project-card.component';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { SkillFilterComponent } from './components/skill-filter/skill-filter.component';
import { buildSkillFacets, filterProjectsBySkills, parseSkillSlugs } from './project-filter';

const SKILLS_QUERY_PARAM = 'skills';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent, SkillFilterComponent, ButtonDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  protected readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly skillQuery = signal('');

  protected readonly selectedSlugs = computed(() =>
    parseSkillSlugs(this.queryParams().get(SKILLS_QUERY_PARAM), this.projectService.projects()),
  );
  protected readonly filteredProjects = computed(() =>
    filterProjectsBySkills(this.projectService.projects(), this.selectedSlugs()),
  );
  protected readonly facetGroups = computed(() =>
    buildSkillFacets(this.projectService.projects(), this.selectedSlugs(), this.skillQuery()),
  );
  protected readonly isFiltering = computed(
    () => this.selectedSlugs().length > 0 || this.skillQuery().trim().length > 0,
  );

  protected toggleSkill(slug: string): void {
    const selected = this.selectedSlugs();
    const next = selected.includes(slug)
      ? selected.filter(item => item !== slug)
      : [...selected, slug];
    this.updateSelection(next);
  }

  protected resetFilters(): void {
    this.skillQuery.set('');
    this.updateSelection([]);
  }

  private updateSelection(slugs: string[]): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [SKILLS_QUERY_PARAM]: slugs.length > 0 ? slugs.join(',') : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
