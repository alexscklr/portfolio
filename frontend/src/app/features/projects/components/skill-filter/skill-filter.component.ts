import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from '@angular/core';
import { SKILL_CATEGORY_STYLES } from '@/app/core/config/skill-category';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { SkillFacetGroup } from '../../project-filter';

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

  protected onQueryInput(event: Event): void {
    this.queryChanged.emit((event.target as HTMLInputElement).value);
  }
}
