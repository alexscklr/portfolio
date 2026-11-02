import { TestBed } from '@angular/core/testing';
import { BlockType, ProjectContentBlock, ProjectMedia } from '@/app/core/models';
import { ProjectBlocksComponent } from './project-blocks.component';

describe('ProjectBlocksComponent', () => {
  const render = async (
    blocks: ProjectContentBlock[],
    media: ProjectMedia[] = [],
  ): Promise<HTMLElement> => {
    const fixture = TestBed.createComponent(ProjectBlocksComponent);
    fixture.componentRef.setInput('blocks', blocks);
    fixture.componentRef.setInput('media', media);
    fixture.componentRef.setInput('label', 'Project title');
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProjectBlocksComponent] });
  });

  it('renders nested sections and split containers recursively', async () => {
    const element = await render([
      {
        id: 'section',
        type: BlockType.Section,
        displayOrder: 1,
        title: 'Overview',
        children: [
          {
            id: 'split',
            type: BlockType.SplitContainer,
            displayOrder: 1,
            columns: '1fr 2fr',
            gap: '6',
            children: [
              {
                id: 'text',
                type: BlockType.MarkdownText,
                displayOrder: 1,
                content: '**Nested text**',
              },
            ],
          },
        ],
      },
    ]);

    expect(element.querySelector('section h2')?.textContent).toBe('Overview');
    expect(element.querySelector('.project-split-grid')?.getAttribute('style')).toContain(
      '--split-columns: 1fr 2fr',
    );
    expect(element.querySelector('.project-split-grid')?.getAttribute('style')).toContain(
      '--split-gap: 1.5rem',
    );
    expect(element.querySelector('.project-markdown strong')?.textContent).toBe('Nested text');
  });

  it('renders callouts, code, galleries, images, and videos', async () => {
    const media: ProjectMedia[] = [
      {
        id: 'gallery-image',
        fileName: 'gallery.png',
        fileUrl: '/gallery.png',
        contentType: 'image/png',
        displayOrder: 1,
      },
      {
        id: 'single-image',
        fileName: 'single.png',
        fileUrl: '/single.png',
        contentType: 'image/png',
        displayOrder: 2,
        altText: 'Single image',
      },
      {
        id: 'video',
        fileName: 'video.mp4',
        fileUrl: '/video.mp4',
        contentType: 'video/mp4',
        posterUrl: '/poster.png',
        displayOrder: 3,
      },
    ];
    const blocks: ProjectContentBlock[] = [
      {
        id: 'callout',
        type: BlockType.Callout,
        displayOrder: 1,
        variant: 'result',
        text: 'Completed',
      },
      {
        id: 'code',
        type: BlockType.CodeSnippet,
        displayOrder: 2,
        language: 'typescript',
        fileName: 'example.ts',
        code: 'const answer = 42;',
      },
      {
        id: 'gallery',
        type: BlockType.ImageGallery,
        displayOrder: 3,
        mediaIds: ['gallery-image'],
      },
      {
        id: 'image',
        type: BlockType.Image,
        displayOrder: 4,
        mediaId: 'single-image',
        caption: 'An image',
      },
      {
        id: 'video-block',
        type: BlockType.VideoPlayer,
        displayOrder: 5,
        mediaId: 'video',
      },
    ];

    const element = await render(blocks, media);

    expect(element.querySelector('.callout-result')?.textContent).toContain('Completed');
    expect(element.querySelector('pre code')?.textContent).toContain('const answer = 42;');
    expect(element.querySelector('figcaption')?.textContent).toContain('example.ts');
    expect(element.querySelector('app-media-slider img')?.getAttribute('src')).toBe('/gallery.png');
    expect(element.querySelector('figure img')?.getAttribute('alt')).toBe('Single image');
    expect(element.querySelector('figure video')?.getAttribute('src')).toBe('/video.mp4');
  });

  it('sanitizes HTML embedded in Markdown', async () => {
    const element = await render([
      {
        id: 'markdown',
        type: BlockType.MarkdownText,
        displayOrder: 1,
        content: '# Safe heading\n\n<script>alert(1)</script><img src="x" onerror="alert(1)">',
      },
    ]);

    expect(element.querySelector('h1')?.textContent).toBe('Safe heading');
    expect(element.querySelector('script')).toBeNull();
    expect(element.querySelector('img')?.hasAttribute('onerror')).toBe(false);
  });
});
