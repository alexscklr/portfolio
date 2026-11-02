import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { routes } from '@/app/app.routes';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { BlockType } from '@/app/core/models';
import { LanguageService } from '@/app/core/services/language.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectDetailComponent } from './project-detail.component';

const translationStub = {
  use: (): Observable<void> => of(undefined),
  translate: (key: string): string => key,
};

describe('ProjectDetailComponent', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  const settle = (): Promise<void> => TestBed.inject(ApplicationRef).whenStable();
  const root = (): HTMLElement => harness.routeNativeElement as HTMLElement;

  const open = async (slug: string): Promise<void> => {
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/de/projects/${slug}`, ProjectDetailComponent);
    TestBed.tick();
    http.expectOne(req => req.method === 'GET' && req.url.endsWith('/projects')).flush([]);
  };

  const detailRequest = (slug: string) =>
    http.expectOne(
      req =>
        req.method === 'GET' &&
        req.url.endsWith(`/projects/${slug}`) &&
        req.params.get('lang') === 'de',
    );

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

  it('loads project metadata from the route slug', async () => {
    const project = getMockProjects('de')[0];
    await open(project.slug);

    detailRequest(project.slug).flush(project);
    await settle();

    expect(root().querySelector('h1')?.textContent?.trim()).toBe(project.title);
    if (project.subtitle) {
      expect(root().textContent).toContain(project.subtitle);
    }
    expect(root().textContent).toContain('C#');
    expect(
      root().querySelector('a[href="https://github.com/alex/generative-cinema"]'),
    ).not.toBeNull();
    const markdown = project.blocks.find(block => block.type === BlockType.MarkdownText);
    expect(root().querySelector('app-project-blocks .project-markdown')?.textContent).toContain(
      markdown?.contentOrConfig,
    );
    expect(root().querySelector('app-project-blocks app-media-slider')).not.toBeNull();
    expect(root().querySelector('app-project-blocks video[controls]')).not.toBeNull();
    expect(root().querySelector('app-project-blocks figure code')?.textContent).toContain(
      'renderProject',
    );
    expect(TestBed.inject(Router).url).toBe(`/de/projects/${project.slug}`);
  });

  it('shows a not-found state for an unknown project', async () => {
    await open('missing');

    detailRequest('missing').flush('not found', { status: 404, statusText: 'Not Found' });
    await settle();

    expect(root().textContent).toContain('projects.detail.notFoundTitle');
    expect(root().querySelector('[role="alert"]')).toBeNull();
  });

  it('shows a technical error and retries the selected project', async () => {
    const project = getMockProjects('de')[0];
    await open(project.slug);

    detailRequest(project.slug).flush('failure', { status: 500, statusText: 'Server Error' });
    await settle();
    expect(root().querySelector('[role="alert"]')).not.toBeNull();

    root().querySelector<HTMLButtonElement>('[role="alert"] button')?.click();
    TestBed.tick();
    detailRequest(project.slug).flush(project);
    await settle();

    expect(root().querySelector('[role="alert"]')).toBeNull();
    expect(root().querySelector('h1')?.textContent?.trim()).toBe(project.title);
  });
});
