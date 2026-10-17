import { inject } from '@angular/core';
import { CanMatchFn, ResolveFn, Router, Routes, UrlSegment } from '@angular/router';
import { TranslationService } from '@/app/core/services/translation.service';
import { LanguageRedirectComponent } from '@/app/core/components/language-redirect/language-redirect.component';
import { DEFAULT_LANGUAGE, isSupportedLanguage } from '@/app/core/config/languages';

export const requireSupportedLanguage: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const language = segments[0]?.path;
  if (isSupportedLanguage(language)) return true;

  const router = inject(Router);
  const remainingSegments = segments.slice(1).map(segment => segment.path);
  return router.createUrlTree([DEFAULT_LANGUAGE, ...remainingSegments]);
};

export const loadTranslations: ResolveFn<void> = route => {
  const language = route.paramMap.get('lang');
  return isSupportedLanguage(language) ? inject(TranslationService).use(language) : undefined;
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LanguageRedirectComponent,
  },
  {
    path: ':lang',
    canMatch: [requireSupportedLanguage],
    resolve: { translations: loadTranslations },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@/app/features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('@/app/features/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: DEFAULT_LANGUAGE,
  },
];
