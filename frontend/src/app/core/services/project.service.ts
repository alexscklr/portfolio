import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '@/app/core/models';
import { mockProjects } from '@/app/core/mocks/project.mock';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);

  projects = signal<Project[]>([]);
  featuredProjects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  isLoading = signal<boolean>(false);

  loadProjects(): void {
    this.isLoading.set(true);
    this.http.get<Project[]>('/api/projects').subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.projects.set(mockProjects);
        this.isLoading.set(false);
      }
    });
  }

  loadFeaturedProjects(): void {
    this.isLoading.set(true);
    this.http.get<Project[]>('/api/projects/featured').subscribe({
      next: (data) => {
        this.featuredProjects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        const featured = mockProjects.filter(p => p.isFeatured);
        this.featuredProjects.set(featured);
        this.isLoading.set(false);
      }
    });
  }

  loadProjectBySlug(slug: string): void {
    this.isLoading.set(true);
    this.http.get<Project>(`/api/projects/${slug}`).subscribe({
      next: (data) => {
        this.selectedProject.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        const project = mockProjects.find(p => p.slug === slug) ?? null;
        this.selectedProject.set(project);
        this.isLoading.set(false);
      }
    });
  }
}