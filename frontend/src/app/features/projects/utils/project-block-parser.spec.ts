import { BlockType, ProjectBlock } from '@/app/core/models';
import { parseProjectBlocks } from './project-block-parser';

const block = (
  id: string,
  type: BlockType,
  displayOrder: number,
  contentOrConfig: string,
  parentBlockId?: string,
): ProjectBlock => ({ id, type, displayOrder, contentOrConfig, parentBlockId });

describe('parseProjectBlocks', () => {
  it('builds a sorted tree from a flat list', () => {
    const tree = parseProjectBlocks([
      block('text', BlockType.MarkdownText, 2, 'Hallo', 'split'),
      block('gallery', BlockType.ImageGallery, 1, '{"mediaIds":["m1",2]}', 'split'),
      block('split', BlockType.SplitContainer, 1, '{"columns":"1fr 2fr"}', 'section'),
      block('section', BlockType.Section, 2, '{"title":"Intro"}'),
      block('intro', BlockType.MarkdownText, 1, 'Start'),
    ]);

    expect(tree.map(item => item.id)).toEqual(['intro', 'section']);
    const section = tree[1];
    expect(section.type).toBe(BlockType.Section);
    if (section.type !== BlockType.Section) return;
    const split = section.children[0];
    if (split.type !== BlockType.SplitContainer) throw new Error('expected split');
    expect(split.columns).toBe('1fr 2fr');
    expect(split.children.map(item => item.id)).toEqual(['gallery', 'text']);
    expect(split.children[0]).toMatchObject({ mediaIds: ['m1'] });
  });

  it('treats blocks with an unknown parent as roots', () => {
    const tree = parseProjectBlocks([block('a', BlockType.MarkdownText, 1, 'x', 'missing')]);
    expect(tree.map(item => item.id)).toEqual(['a']);
  });

  it('drops cycles without hanging', () => {
    const tree = parseProjectBlocks([
      block('a', BlockType.Section, 1, '{}', 'b'),
      block('b', BlockType.Section, 1, '{}', 'a'),
      block('self', BlockType.Section, 1, '{}', 'self'),
      block('ok', BlockType.MarkdownText, 1, 'ok'),
    ]);
    expect(tree.map(item => item.id)).toEqual(['ok']);
  });

  it('skips broken, incomplete and unsupported blocks including their children', () => {
    const tree = parseProjectBlocks([
      block('bad', BlockType.Section, 1, '{kaputt'),
      block('child', BlockType.MarkdownText, 1, 'x', 'bad'),
      block('video', BlockType.VideoPlayer, 2, '{}'),
      block('pdf', BlockType.PdfViewer, 3, '{}'),
      block('callout', BlockType.Callout, 4, '{"variant":"x","text":"Hi"}'),
    ]);
    expect(tree).toEqual([
      { id: 'callout', displayOrder: 4, type: BlockType.Callout, variant: 'info', text: 'Hi' },
    ]);
  });
});
