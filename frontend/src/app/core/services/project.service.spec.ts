import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { LanguageService } from './language.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;
  let languageService: LanguageService;

  const expectProjectsRequest = (lang: string): TestRequest =>
    http.expectOne(
      req =>
        req.method === 'GET' && req.url.endsWith('/projects') && req.params.get('lang') === lang,
    );

  const settle = (): Promise<void> => TestBed.inject(ApplicationRef).whenStable();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    languageService = TestBed.inject(LanguageService);
    languageService.setLanguage('de');
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('portfolio-language');
  });

  it('exposes loaded projects and only the featured ones as featured', async () => {
    const projects = getMockProjects('de');
    projects[1] = { ...projects[1], isFeatured: false };

    expectProjectsRequest('de').flush(projects);
    await settle();

    expect(service.projects().length).toBe(3);
    expect(service.featuredProjects().map(project => project.slug)).toEqual([
      projects[0].slug,
      projects[2].slug,
    ]);
    expect(service.hasError()).toBe(false);
  });

  it('falls back to an empty list and reports an error when the request fails', async () => {
    expectProjectsRequest('de').flush('fail', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(service.projects()).toEqual([]);
    expect(service.hasError()).toBe(true);
  });

  it('cancels the outdated request and loads the new language', async () => {
    const outdated = expectProjectsRequest('de');

    languageService.setLanguage('en');
    TestBed.tick();

    expect(outdated.cancelled).toBe(true);
    expectProjectsRequest('en').flush(getMockProjects('en'));
    await settle();

    expect(service.projects()[0].subtitle).toBe('Real-time visuals in the browser');
  });

  describe('selected project', () => {
    const detailRequest = (slug: string): TestRequest =>
      http.expectOne(req => req.method === 'GET' && req.url.endsWith(`/projects/${slug}`));

    beforeEach(() => {
      expectProjectsRequest('de').flush([]);
    });

    it('reports not found for a 404 without flagging a technical error', async () => {
      service.selectProject('missing');
      TestBed.tick();
      detailRequest('missing').flush('nope', { status: 404, statusText: 'Not Found' });
      await settle();

      expect(service.selectedProject()).toBeNull();
      expect(service.selectedProjectNotFound()).toBe(true);
      expect(service.hasSelectedProjectError()).toBe(false);
    });

    it('reports a technical error for other failures', async () => {
      service.selectProject('broken');
      TestBed.tick();
      detailRequest('broken').flush('fail', { status: 500, statusText: 'Server Error' });
      await settle();

      expect(service.selectedProjectNotFound()).toBe(false);
      expect(service.hasSelectedProjectError()).toBe(true);
    });

    it('exposes the parsed block tree of the selected project', async () => {
      const project = getMockProjects('de')[0];
      service.selectProject(project.slug);
      TestBed.tick();
      detailRequest(project.slug).flush(project);
      await settle();

      expect(service.selectedProjectNotFound()).toBe(false);
      expect(service.selectedProjectBlocks().length).toBeGreaterThan(0);
    });
  });
});
