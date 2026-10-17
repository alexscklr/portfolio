import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('@/app/features/projects/projects.component').then(m => m.ProjectsComponent),
  },
  {
    path: '**',
    redirectTo: ''
  }
];