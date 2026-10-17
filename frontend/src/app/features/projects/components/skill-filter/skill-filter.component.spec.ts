import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SkillTagCategory } from '@/app/core/models';
import { SkillFacetGroup } from '../../project-filter';
import { SkillFilterComponent } from './skill-filter.component';

const group = (category: SkillTagCategory, slug: string): SkillFacetGroup => ({
  category,
  facets: [{ skill: { id: slug, name: slug, slug, category }, count: 2, selected: false }],
});

describe('SkillFilterComponent', () => {
  let fixture: ComponentFixture<SkillFilterComponent>;
  let element: HTMLElement;

  const render = async (groups: SkillFacetGroup[], isFiltering = false): Promise<void> => {
    fixture.componentRef.setInput('groups', groups);
    fixture.componentRef.setInput('resultCount', 2);
    fixture.componentRef.setInput('totalCount', 3);
    fixture.componentRef.setInput('isFiltering', isFiltering);
    await fixture.whenStable();
  };

  const collapsedRows = (): HTMLElement[] =>
    Array.from(element.querySelectorAll<HTMLElement>('[inert]'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkillFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(SkillFilterComponent);
    element = fixture.nativeElement as HTMLElement;
  });

  it('keeps every category row and collapses the empty ones', async () => {
    await render([
      group(SkillTagCategory.Language, 'csharp'),
      group(SkillTagCategory.Framework, 'angular'),
    ]);

    expect(collapsedRows()).toHaveLength(2);

    await render([
      group(SkillTagCategory.Language, 'csharp'),
      group(SkillTagCategory.Framework, 'angular'),
      group(SkillTagCategory.ToolOrSoftware, 'docker'),
      group(SkillTagCategory.ConceptOrApi, 'grpc'),
    ]);

    expect(collapsedRows()).toHaveLength(0);
  });

  it('keeps the last chips of a collapsed row while it animates out', async () => {
    await render([group(SkillTagCategory.Language, 'csharp')]);
    await render([]);

    const rows = element.querySelectorAll('[inert][aria-hidden="true"]');
    expect(rows).toHaveLength(4);
    expect(rows[0].textContent).toContain('csharp');
    expect(element.textContent).toContain('projects.filter.noSkills');
  });

  it('emits the toggled skill slug', async () => {
    await render([group(SkillTagCategory.Language, 'csharp')]);
    const toggled: string[] = [];
    fixture.componentInstance.skillToggled.subscribe(slug => toggled.push(slug));

    element.querySelector<HTMLButtonElement>('button[aria-pressed]')?.click();

    expect(toggled).toEqual(['csharp']);
  });

  it('emits query changes', async () => {
    await render([]);
    const queries: string[] = [];
    fixture.componentInstance.queryChanged.subscribe(value => queries.push(value));

    const input = element.querySelector<HTMLInputElement>('input[type="search"]');
    input!.value = 'ang';
    input!.dispatchEvent(new Event('input'));

    expect(queries).toEqual(['ang']);
  });

  it('offers a reset only while filtering', async () => {
    await render([], false);
    expect(element.querySelector('button[type="button"]:not([aria-pressed])')).toBeNull();

    await render([], true);
    const reset = element.querySelector<HTMLButtonElement>('button:not([aria-pressed])');
    let emitted = 0;
    fixture.componentInstance.resetRequested.subscribe(() => emitted++);
    reset?.click();

    expect(reset).not.toBeNull();
    expect(emitted).toBe(1);
  });
});
