import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { SKILL_CATEGORY_ORDER, SKILL_CATEGORY_STYLES } from '@/app/core/config/skill-category';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { SkillFacetGroup } from '../../project-filter';

interface SkillRow extends SkillFacetGroup {
  collapsed: boolean;
}

@Component({
  selector: 'app-skill-filter',
  standalone: true,
  imports: [TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skill-filter.component.html',
})
export class SkillFilterComponent {
  readonly groups = input.required<SkillFacetGroup[]>();
  readonly query = input('');
  readonly resultCount = input.required<number>();
  readonly totalCount = input.required<number>();
  readonly isFiltering = input.required<boolean>();

  readonly skillToggled = output<string>();
  readonly queryChanged = output<string>();
  readonly resetRequested = output<void>();

  protected readonly categoryStyles = SKILL_CATEGORY_STYLES;

  // Alle Kategorien bleiben im DOM, leere werden eingeklappt. So springt das Layout nicht,
  // und der letzte Inhalt bleibt während der Einklapp-Animation sichtbar.
  protected readonly rows = linkedSignal<SkillFacetGroup[], SkillRow[]>({
    source: this.groups,
    computation: (groups, previous) =>
      SKILL_CATEGORY_ORDER.map(category => {
        const group = groups.find(item => item.category === category);
        const facets =
          group?.facets ?? previous?.value.find(row => row.category === category)?.facets ?? [];
        return { category, facets, collapsed: !group };
      }),
  });

  protected readonly hasFacets = computed(() => this.groups().length > 0);

  protected onQueryInput(event: Event): void {
    this.queryChanged.emit((event.target as HTMLInputElement).value);
  }
}
