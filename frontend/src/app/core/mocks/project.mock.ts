import { BlockType, Project, ProjectLinkType, SkillTagCategory } from '@/app/core/models';
import { DEFAULT_LANGUAGE, Language } from '@/app/core/config/languages';

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Generative Cinema Engine',
    slug: 'generative-cinema-engine',
    startDate: '2026-03-01',
    shortDescription: 'Echtzeit-Renderpipeline und interaktives WebGL/Shader-Interface integriert in Angular 18 & .NET 8.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 1,
    createdAt: '2026-05-15T10:00:00Z',
    skills: [
      { id: 'sk-1', name: 'C#', slug: 'csharp', category: SkillTagCategory.Language, iconKey: 'logos:c-sharp' },
      { id: 'sk-2', name: '.NET 8', slug: 'dotnet-8', category: SkillTagCategory.Framework, iconKey: 'logos:dotnet' },
      { id: 'sk-3', name: 'Angular 18+', slug: 'angular', category: SkillTagCategory.Framework, iconKey: 'logos:angular-icon' },
      { id: 'sk-4', name: 'HLSL / WebGL', slug: 'hlsl-webgl', category: SkillTagCategory.ConceptOrApi, iconKey: 'simple-icons:webgl' },
      { id: 'sk-5', name: 'Tailwind CSS v4', slug: 'tailwind-css', category: SkillTagCategory.Framework, iconKey: 'logos:tailwindcss-icon' }
    ],
    blocks: [
      {
        id: 'block-1-1',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Ein hochperformantes Framework zur Echtzeit-Generierung von visuellen Effekten im Browser. Die Pipeline nutzt .NET 8 für das Asset-Management und Angular Signals für latenzfreie State-Updates.'
      }
    ],
    links: [
      { id: 'link-1-1', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/generative-cinema', title: 'GitHub' },
      { id: 'link-1-2', type: ProjectLinkType.LiveDemo, url: 'https://demo.cinema.dev', title: 'Live Demo' }
    ],
    media: [
      {
        id: 'media-1-1',
        fileName: 'demo-video.mp4',
        contentType: 'video/mp4',
        fileUrl: '/media/fixtures/demo-video.mp4',
        posterUrl: '/media/fixtures/placeholder.svg',
        altText: 'Kurze Demo-Animation fuer die Generative Cinema Engine',
        displayOrder: 1
      },
      { id: 'media-1-2', fileName: 'placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/placeholder.svg', displayOrder: 2 },
      { id: 'media-1-3', fileName: 'japan-route-placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/japan-route-placeholder.svg', displayOrder: 3 }
    ]
  },
  {
    id: 'proj-2',
    title: 'Realtime Pipeline Automation',
    slug: 'realtime-pipeline-automation',
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    shortDescription: 'Automatisierter Asset-Import & Build-Job Dispatcher für 3D-Pipelines via gRPC und SignalR.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 2,
    createdAt: '2026-02-10T14:30:00Z',
    skills: [
      { id: 'sk-2', name: '.NET 8', slug: 'dotnet-8', category: SkillTagCategory.Framework, iconKey: 'logos:dotnet' },
      { id: 'sk-6', name: 'gRPC', slug: 'grpc', category: SkillTagCategory.ConceptOrApi, iconKey: 'logos:grpc' },
      { id: 'sk-7', name: 'Docker', slug: 'docker', category: SkillTagCategory.ToolOrSoftware, iconKey: 'logos:docker-icon' },
      { id: 'sk-8', name: 'Python / Maya API', slug: 'python-maya-api', category: SkillTagCategory.Language, iconKey: 'logos:python' }
    ],
    blocks: [
      {
        id: 'block-2-1',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Verbindet 3D-Software (Maya, Blender) direkt mit Web-Interfaces. Nutzt gRPC für ultraschnelle Datenübertragung und WebSockets für Echtzeit-Statusupdates.'
      }
    ],
    links: [
      { id: 'link-2-1', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/pipeline-auto', title: 'GitHub' }
    ],
    media: [
      { id: 'media-2-1', fileName: 'placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/placeholder.svg', displayOrder: 1 },
      { id: 'media-2-2', fileName: 'japan-route-placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/japan-route-placeholder.svg', displayOrder: 2 }
    ]
  },
  {
    id: 'proj-3',
    title: 'Anamorphic UI Kit & Component Library',
    slug: 'anamorphic-ui-kit',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    shortDescription: 'Performance-fokussierte UI-Komponentenbibliothek im Cinematique-Style mit Tailwind CSS v4.',
    previewMediaUrl: '/media/fixtures/placeholder.svg',
    isFeatured: true,
    displayOrder: 3,
    createdAt: '2026-08-01T09:00:00Z',
    skills: [
      { id: 'sk-3', name: 'Angular 18+', slug: 'angular', category: SkillTagCategory.Framework, iconKey: 'logos:angular-icon' },
      { id: 'sk-5', name: 'Tailwind CSS v4', slug: 'tailwind-css', category: SkillTagCategory.Framework, iconKey: 'logos:tailwindcss-icon' },
      { id: 'sk-9', name: 'TypeScript', slug: 'typescript', category: SkillTagCategory.Language, iconKey: 'logos:typescript-icon' }
    ],
    blocks: [
      {
        id: 'block-3-1',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        contentOrConfig: 'Eine maßgeschneiderte Design-System-Bibliothek für Recruiter-Dashboards und Medienangebote. Optimiert für Barrierefreiheit und 60fps Animationen.'
      }
    ],
    links: [
      { id: 'link-3-1', type: ProjectLinkType.GitHub, url: 'https://github.com/alex/anamorphic-ui', title: 'GitHub' },
      { id: 'link-3-2', type: ProjectLinkType.LiveDemo, url: 'https://ui.cinema.dev', title: 'Live Demo' }
    ],
    media: [
      { id: 'media-3-1', fileName: 'placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/placeholder.svg', displayOrder: 1 },
      { id: 'media-3-2', fileName: 'japan-route-placeholder.svg', contentType: 'image/svg+xml', fileUrl: '/media/fixtures/japan-route-placeholder.svg', displayOrder: 2 }
    ]
  }
];

type LocalizedProjectContent = Pick<Project, 'title' | 'subtitle' | 'shortDescription'> & {
  blockContent: string;
  mediaAltText?: string;
};

const localizedProjectContent: Record<Language, Record<string, LocalizedProjectContent>> = {
  de: {
    'generative-cinema-engine': {
      title: 'Generative Cinema Engine',
      subtitle: 'Echtzeit-Visuals im Browser',
      shortDescription: 'Echtzeit-Renderpipeline und interaktives WebGL/Shader-Interface integriert in Angular 18 & .NET 8.',
      blockContent: 'Ein hochperformantes Framework zur Echtzeit-Generierung von visuellen Effekten im Browser. Die Pipeline nutzt .NET 8 für das Asset-Management und Angular Signals für latenzfreie State-Updates.',
      mediaAltText: 'Kurze Demo-Animation für die Generative Cinema Engine'
    },
    'realtime-pipeline-automation': {
      title: 'Realtime Pipeline Automation',
      subtitle: 'Maya trifft Web',
      shortDescription: 'Automatisierter Asset-Import & Build-Job Dispatcher für 3D-Pipelines via gRPC und SignalR.',
      blockContent: 'Verbindet 3D-Software (Maya, Blender) direkt mit Web-Interfaces. Nutzt gRPC für ultraschnelle Datenübertragung und WebSockets für Echtzeit-Statusupdates.'
    },
    'anamorphic-ui-kit': {
      title: 'Anamorphic UI Kit & Component Library',
      subtitle: 'Cinematisches Design-System',
      shortDescription: 'Performance-fokussierte UI-Komponentenbibliothek im Cinematique-Style mit Tailwind CSS v4.',
      blockContent: 'Eine maßgeschneiderte Design-System-Bibliothek für Recruiter-Dashboards und Medienangebote. Optimiert für Barrierefreiheit und 60fps Animationen.'
    }
  },
  en: {
    'generative-cinema-engine': {
      title: 'Generative Cinema Engine',
      subtitle: 'Real-time visuals in the browser',
      shortDescription: 'Real-time rendering pipeline and interactive WebGL/shader interface built with Angular 18 and .NET 8.',
      blockContent: 'A high-performance framework for generating visual effects in the browser in real time. The pipeline uses .NET 8 for asset management and Angular Signals for latency-free state updates.',
      mediaAltText: 'Short demo animation for the Generative Cinema Engine'
    },
    'realtime-pipeline-automation': {
      title: 'Realtime Pipeline Automation',
      subtitle: 'Maya meets the web',
      shortDescription: 'Automated asset import and build-job dispatcher for 3D pipelines using gRPC and SignalR.',
      blockContent: 'Connects 3D software such as Maya and Blender directly to web interfaces. Uses gRPC for high-speed data transfer and WebSockets for real-time status updates.'
    },
    'anamorphic-ui-kit': {
      title: 'Anamorphic UI Kit & Component Library',
      subtitle: 'Cinematic design system',
      shortDescription: 'Performance-focused UI component library with a cinematic style, built with Tailwind CSS v4.',
      blockContent: 'A custom design-system library for recruiter dashboards and media platforms. Optimized for accessibility and 60fps animations.'
    }
  }
};

export function getMockProjects(language: Language = DEFAULT_LANGUAGE): Project[] {
  return mockProjects.map(project => {
    const localized = localizedProjectContent[language][project.slug];

    if (!localized) return structuredClone(project);

    return {
      ...structuredClone(project),
      title: localized.title,
      subtitle: localized.subtitle,
      shortDescription: localized.shortDescription,
      blocks: project.blocks.map((block, index) => index === 0
        ? { ...block, contentOrConfig: localized.blockContent }
        : { ...block }),
      media: project.media.map((media, index) => index === 0 && localized.mediaAltText
        ? { ...media, altText: localized.mediaAltText }
        : { ...media })
    };
  });
}
