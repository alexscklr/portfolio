import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGUAGES } from '@/app/core/config/languages';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: ':lang/**',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      ...SUPPORTED_LANGUAGES.map(lang => ({ lang, '**': '' })),
      ...SUPPORTED_LANGUAGES.map(lang => ({ lang, '**': 'projects' })),
    ],
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
