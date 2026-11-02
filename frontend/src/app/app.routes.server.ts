import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGUAGES } from '@/app/core/config/languages';
import { getProjectSlugs } from '@/app/core/config/project-slugs';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: ':lang/projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const slugs = await getProjectSlugs();
      return SUPPORTED_LANGUAGES.flatMap(lang => slugs.map(slug => ({ lang, slug })));
    },
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
