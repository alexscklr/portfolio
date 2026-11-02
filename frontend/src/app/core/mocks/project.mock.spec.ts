import { BlockType } from '@/app/core/models';
import { parseProjectBlocks } from '@/app/features/projects/utils/project-block-parser';
import { getMockProjects } from './project.mock';

describe('getMockProjects', () => {
  it('provides block hierarchies with valid media references for every project', () => {
    for (const project of getMockProjects('de')) {
      const blocks = parseProjectBlocks(project.blocks);
      const section = blocks.find(block => block.type === BlockType.Section);

      expect(section?.type).toBe(BlockType.Section);
      if (section?.type !== BlockType.Section) {
        throw new Error('Expected each mock project to contain a Section block');
      }

      const split = section.children.find(block => block.type === BlockType.SplitContainer);
      expect(split?.type).toBe(BlockType.SplitContainer);
      if (split?.type !== BlockType.SplitContainer) {
        throw new Error('Expected each Section to contain a SplitContainer');
      }

      const gallery = split.children.find(block => block.type === BlockType.ImageGallery);
      expect(gallery?.type).toBe(BlockType.ImageGallery);
      if (gallery?.type === BlockType.ImageGallery) {
        expect(gallery.mediaIds.every(id => project.media.some(media => media.id === id))).toBe(
          true,
        );
      }

      const image = blocks.find(block => block.type === BlockType.Image);
      expect(image?.type).toBe(BlockType.Image);
      if (image?.type === BlockType.Image) {
        expect(project.media.some(media => media.id === image.mediaId)).toBe(true);
      }

      const video = blocks.find(block => block.type === BlockType.VideoPlayer);
      if (video?.type === BlockType.VideoPlayer) {
        expect(project.media.some(media => media.id === video.mediaId)).toBe(true);
      }

      expect(blocks.some(block => block.type === BlockType.Callout)).toBe(true);
      expect(blocks.some(block => block.type === BlockType.CodeSnippet)).toBe(true);
    }
  });

  it('localizes translated block payloads for English', () => {
    for (const project of getMockProjects('en')) {
      const blocks = parseProjectBlocks(project.blocks);
      const section = blocks.find(block => block.type === BlockType.Section);
      const callout = blocks.find(block => block.type === BlockType.Callout);
      const image = blocks.find(block => block.type === BlockType.Image);

      expect(section?.type === BlockType.Section && section.title).toBe('Overview');
      expect(callout?.type === BlockType.Callout && callout.text).toBe('Result: faster workflows.');
      expect(image?.type === BlockType.Image && image.caption).toBe('Project view');
      expect(blocks.some(block => block.type === BlockType.VideoPlayer)).toBe(
        project.slug === 'generative-cinema-engine',
      );
    }
  });
});
