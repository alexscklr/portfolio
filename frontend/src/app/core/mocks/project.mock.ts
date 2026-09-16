import { BlockType, Project, ProjectLinkType, SkillTagCategory } from '@/app/core/models';

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Generative Cinema Engine',
    slug: 'generative-cinema-engine',
    shortDescription: 'Echtzeit-Renderpipeline und interaktives WebGL/Shader-Interface integriert in Angular 18 & .NET 8.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 1,
    createdAt: '2026-05-15T10:00:00Z',
    skills: [
      { id: 'sk-1', name: 'C#', slug: 'csharp', category: SkillTagCategory.Language },
      { id: 'sk-2', name: '.NET 8', slug: 'dotnet-8', category: SkillTagCategory.Framework },
      { id: 'sk-3', name: 'Angular 18+', slug: 'angular', category: SkillTagCategory.Framework },
      { id: 'sk-4', name: 'HLSL / WebGL', slug: 'hlsl-webgl', category: SkillTagCategory.ConceptOrApi },
      { id: 'sk-5', name: 'Tailwind CSS v4', slug: 'tailwind-css', category: SkillTagCategory.Framework }
    ],
    blocks: [
      {
        id: 'block-1-1',
        projectId: 'proj-1',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Ein hochperformantes Framework zur Echtzeit-Generierung von visuellen Effekten im Browser. Die Pipeline nutzt .NET 8 für das Asset-Management und Angular Signals für latenzfreie State-Updates.'
      }
    ],
    links: [
      { id: 'link-1-1', projectId: 'proj-1', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/generative-cinema', label: 'GitHub' },
      { id: 'link-1-2', projectId: 'proj-1', type: ProjectLinkType.LiveDemo, url: 'https://demo.cinema.dev', label: 'Live Demo' }
    ],
    media: [
      {
        id: 'media-1-1',
        projectId: 'proj-1',
        fileName: 'demo-video.mp4',
        contentType: 'video/mp4',
        fileUrl: '/media/fixtures/demo-video.mp4',
        altText: 'Kurze Demo-Animation fuer die Generative Cinema Engine',
        createdAt: '2026-05-15T10:00:00Z'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Realtime Pipeline Automation',
    slug: 'realtime-pipeline-automation',
    shortDescription: 'Automatisierter Asset-Import & Build-Job Dispatcher für 3D-Pipelines via gRPC und SignalR.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 2,
    createdAt: '2026-02-10T14:30:00Z',
    skills: [
      { id: 'sk-2', name: '.NET 8', slug: 'dotnet-8', category: SkillTagCategory.Framework },
      { id: 'sk-6', name: 'gRPC', slug: 'grpc', category: SkillTagCategory.ConceptOrApi },
      { id: 'sk-7', name: 'Docker', slug: 'docker', category: SkillTagCategory.ToolOrSoftware },
      { id: 'sk-8', name: 'Python / Maya API', slug: 'python-maya-api', category: SkillTagCategory.Language }
    ],
    blocks: [
      {
        id: 'block-2-1',
        projectId: 'proj-2',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Verbindet 3D-Software (Maya, Blender) direkt mit Web-Interfaces. Nutzt gRPC für ultraschnelle Datenübertragung und WebSockets für Echtzeit-Statusupdates.'
      }
    ],
    links: [
      { id: 'link-2-1', projectId: 'proj-2', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/pipeline-auto', label: 'GitHub' }
    ],
    media: []
  },
  {
    id: 'proj-3',
    title: 'Anamorphic UI Kit & Component Library',
    slug: 'anamorphic-ui-kit',
    shortDescription: 'Performance-fokussierte UI-Komponentenbibliothek im Cinematique-Style mit Tailwind CSS v4.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 3,
    createdAt: '2026-08-01T09:00:00Z',
    skills: [
      { id: 'sk-3', name: 'Angular 18+', slug: 'angular', category: SkillTagCategory.Framework },
      { id: 'sk-5', name: 'Tailwind CSS v4', slug: 'tailwind-css', category: SkillTagCategory.Framework },
      { id: 'sk-9', name: 'TypeScript', slug: 'typescript', category: SkillTagCategory.Language }
    ],
    blocks: [
      {
        id: 'block-3-1',
        projectId: 'proj-3',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Eine maßgeschneiderte Design-System-Bibliothek für Recruiter-Dashboards und Medienangebote. Optimiert für Barrierefreiheit und 60fps Animationen.'
      }
    ],
    links: [
      { id: 'link-3-1', projectId: 'proj-3', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/anamorphic-ui', label: 'GitHub' },
      { id: 'link-3-2', projectId: 'proj-3', type: ProjectLinkType.LiveDemo, url: 'https://ui.cinema.dev', label: 'Live Demo' }
    ],
    media: []
  }
];
