import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Project, ProjectLinkType, SkillTagCategory } from '@/app/core/models';
import { ProjectCardComponent } from './project-card.component';

const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'p1',
  title: 'Demo',
  slug: 'demo',
  subtitle: 'Untertitel',
  shortDescription: 'Beschreibung',
  isFeatured: false,
  displayOrder: 1,
  createdAt: '2026-01-01T00:00:00Z',
  skills: [],
  blocks: [],
  links: [],
  media: [],
  ...overrides,
});

const skills = (count: number): Project['skills'] =>
  Array.from({ length: count }, (_, i) => ({
    id: `s${i}`,
    name: `Skill ${i}`,
    slug: `skill-${i}`,
    category: SkillTagCategory.Language,
  }));

describe('ProjectCardComponent', () => {
  let fixture: ComponentFixture<ProjectCardComponent>;
  let element: HTMLElement;

  const render = async (project: Project): Promise<void> => {
    fixture.componentRef.setInput('project', project);
    await fixture.whenStable();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(ProjectCardComponent);
    element = fixture.nativeElement as HTMLElement;
  });

  it('links the text block to the detail page without nesting other links inside', async () => {
    await render(
      createProject({
        links: [{ id: 'l', type: ProjectLinkType.GitHub, url: 'https://g', title: 'G' }],
      }),
    );

    const detailLink = element.querySelector<HTMLAnchorElement>('a[href="/de/projects/demo"]');
    expect(detailLink?.textContent).toContain('Demo');
    expect(detailLink?.textContent).toContain('Untertitel');
    expect(detailLink?.querySelector('a')).toBeNull();
    expect(element.querySelector('a[href="https://g"]')?.getAttribute('rel')).toContain('noopener');
  });

  it('renders only the external links that exist', async () => {
    await render(createProject());
    expect(element.querySelector('footer')).toBeNull();

    await render(
      createProject({
        links: [{ id: 'l', type: ProjectLinkType.LiveDemo, url: 'https://live', title: 'L' }],
      }),
    );
    const external = element.querySelectorAll('footer a');
    expect(external).toHaveLength(1);
    expect(external[0].getAttribute('href')).toBe('https://live');
  });

  it('caps visible skills and shows the remaining count', async () => {
    await render(createProject({ skills: skills(8) }));

    expect(element.querySelectorAll('ul li')).toHaveLength(6);
    expect(element.querySelector('ul li:last-child')?.textContent?.trim()).toBe('+3');
  });

  it('shows the project period', async () => {
    await render(createProject({ startDate: '2026-03-01', endDate: '2026-05-01' }));

    const text = element.querySelector('footer')?.textContent ?? '';
    expect(text).toMatch(/2026/);
    expect(text).toContain('–');
  });
});
