import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '@/app/core/models';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);

  projects = signal<Project[]>([]);
  featuredProjects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  isLoading = signal<boolean>(false);
  private requestSequence = 0;

  loadProjects(): void {
    const lang = this.languageService.currentLanguage();
    this.isLoading.set(true);
    this.http.get<Project[]>('/api/projects', {
      params: { lang: lang }
    }).subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.projects.set(getMockProjects(lang));
        this.isLoading.set(false);
      }
    });
  }

  loadFeaturedProjects(maxItems: number = 3): void {
    const lang = this.languageService.currentLanguage();
    const requestId = ++this.requestSequence;
    this.isLoading.set(true);
    this.http.get<Project[]>('/api/projects', {
      params: { lang: lang, isFeatured: 'true' }
    }).subscribe({
      next: (data) => {
        if (requestId !== this.requestSequence) return;
        this.featuredProjects.set(data.length > maxItems ? data.slice(0, maxItems) : data);
        this.isLoading.set(false);
      },
      error: () => {
        if (requestId !== this.requestSequence) return;
        const featured = getMockProjects(lang).filter(p => p.isFeatured);
        this.featuredProjects.set(featured);
        this.isLoading.set(false);
      }
    });
  }

  loadProjectBySlug(slug: string): void {
    const lang = this.languageService.currentLanguage();
    this.isLoading.set(true);
    this.http.get<Project>(`/api/projects/${slug}`, {
      params: { lang: lang }
    }).subscribe({
      next: (data) => {
        this.selectedProject.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        const project = getMockProjects(lang).find(p => p.slug === slug) ?? null;
        this.selectedProject.set(project);
        this.isLoading.set(false);
      }
    });
  }
}