import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Project } from '@/app/core/models';
import { parseProjectBlocks } from '@/app/features/projects/utils/project-block-parser';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { LanguageService } from './language.service';
import { environment } from '@/environments/environment';

const FEATURED_PROJECT_LIMIT = 3;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  private readonly selectedSlug = signal<string | null>(null);

  private readonly projectsResource = rxResource({
    params: () => ({ lang: this.languageService.currentLanguage() }),
    stream: ({ params }): Observable<Project[]> =>
      environment.dataSource === 'frontend-mock'
        ? of(getMockProjects(params.lang))
        : this.http.get<Project[]>(this.apiUrl, { params: { lang: params.lang } }),
  });

  private readonly selectedProjectResource = rxResource({
    params: () => {
      const slug = this.selectedSlug();
      return slug ? { slug, lang: this.languageService.currentLanguage() } : undefined;
    },
    stream: ({ params }): Observable<Project | null> =>
      environment.dataSource === 'frontend-mock'
        ? of(getMockProjects(params.lang).find(project => project.slug === params.slug) ?? null)
        : this.http
            .get<Project>(`${this.apiUrl}/${params.slug}`, { params: { lang: params.lang } })
            .pipe(
              catchError((error: unknown) =>
                error instanceof HttpErrorResponse && error.status === 404
                  ? of(null)
                  : throwError(() => error),
              ),
            ),
  });

  readonly projects = computed(() =>
    this.projectsResource.hasValue() ? this.projectsResource.value() : [],
  );
  readonly featuredProjects = computed(() =>
    this.projects()
      .filter(project => project.isFeatured)
      .slice(0, FEATURED_PROJECT_LIMIT),
  );
  readonly isLoading = this.projectsResource.isLoading;
  readonly hasError = computed(() => this.projectsResource.error() !== undefined);

  readonly selectedProject = computed(() =>
    this.selectedProjectResource.hasValue() ? this.selectedProjectResource.value() : null,
  );
  readonly selectedProjectSlug = this.selectedSlug.asReadonly();
  readonly isSelectedProjectLoading = this.selectedProjectResource.isLoading;
  readonly selectedProjectBlocks = computed(() =>
    parseProjectBlocks(this.selectedProject()?.blocks ?? []),
  );
  readonly selectedProjectNotFound = computed(
    () =>
      this.selectedSlug() !== null &&
      this.selectedProjectResource.status() === 'resolved' &&
      this.selectedProject() === null,
  );
  readonly hasSelectedProjectError = computed(
    () => this.selectedProjectResource.status() === 'error',
  );

  reload(): void {
    this.projectsResource.reload();
  }

  selectProject(slug: string): void {
    this.selectedSlug.set(slug);
  }

  reloadSelectedProject(): void {
    this.selectedProjectResource.reload();
  }
}
