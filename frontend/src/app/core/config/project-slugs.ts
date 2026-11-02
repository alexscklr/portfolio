import { Project } from '@/app/core/models';
import { getMockProjects } from '@/app/core/mocks/project.mock';
import { environment } from '@/environments/environment';
import { DEFAULT_LANGUAGE } from './languages';

/** Liefert die Projekt-Slugs zur Build-Zeit für das Prerendering der Detailseiten. */
export async function getProjectSlugs(): Promise<string[]> {
  if (environment.dataSource === 'frontend-mock') {
    return getMockProjects(DEFAULT_LANGUAGE).map(project => project.slug);
  }

  const response = await fetch(`${environment.apiUrl}/projects?lang=${DEFAULT_LANGUAGE}`);
  if (!response.ok) {
    throw new Error(`Project slugs could not be loaded (HTTP ${response.status}).`);
  }

  const projects = (await response.json()) as Pick<Project, 'slug'>[];
  return projects.map(project => project.slug);
}
