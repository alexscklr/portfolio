import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { routes } from '@/app/app.routes';
import { LanguageService } from '@/app/core/services/language.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectsComponent } from './projects.component';

const translationStub = {
  use: (): Observable<void> => of(undefined),
  translate: (key: string): string => key,
};

describe('ProjectsComponent', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  const settle = (): Promise<void> => TestBed.inject(ApplicationRef).whenStable();
  const root = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const cards = (): string[] =>
    Array.from(root().querySelectorAll('app-project-card h3')).map(
      h => h.textContent?.trim() ?? '',
    );

  const open = async (url: string): Promise<void> => {
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url, ProjectsComponent);
    TestBed.tick();
  };

  const respond = async (): Promise<void> => {
    http.expectOne(req => req.url.endsWith('/projects')).flush(getMockProjects('de'));
    await settle();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslationService, useValue: translationStub },
      ],
    });
    TestBed.inject(LanguageService).setLanguage('de');
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('portfolio-language');
  });

  it('shows all projects without a filter', async () => {
    await open('/de/projects');
    await respond();

    expect(cards()).toHaveLength(3);
  });

  it('only shows projects containing every selected skill from the URL', async () => {
    await open('/de/projects?skills=docker');
    await respond();

    expect(cards()).toEqual(['Realtime Pipeline Automation']);

    await harness.navigateByUrl('/de/projects?skills=docker,angular', ProjectsComponent);
    await settle();
    expect(cards()).toHaveLength(0);
    expect(root().textContent).toContain('projects.page.empty');
  });

  it('ignores unknown skill slugs in the URL', async () => {
    await open('/de/projects?skills=does-not-exist');
    await respond();

    expect(cards()).toHaveLength(3);
  });

  it('writes the selection to the URL when a skill is toggled', async () => {
    await open('/de/projects');
    await respond();

    const docker = Array.from(
      root().querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    ).find(button => button.textContent?.includes('Docker'));
    docker?.click();
    await settle();

    expect(TestBed.inject(Router).url).toBe('/de/projects?skills=docker');
    expect(cards()).toHaveLength(1);
  });

  it('shows an error state and retries the request', async () => {
    await open('/de/projects');
    http
      .expectOne(req => req.url.endsWith('/projects'))
      .flush('fail', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(root().querySelector('[role="alert"]')).not.toBeNull();

    root().querySelector<HTMLButtonElement>('[role="alert"] button')?.click();
    TestBed.tick();
    await respond();

    expect(root().querySelector('[role="alert"]')).toBeNull();
    expect(cards()).toHaveLength(3);
  });
});
