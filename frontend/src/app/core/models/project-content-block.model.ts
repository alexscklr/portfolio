import { BlockType } from './project-block.model';

export type CalloutVariant = 'info' | 'result' | 'warning';

interface ContentBlockBase<T extends BlockType> {
  id: string;
  type: T;
  displayOrder: number;
}

export interface MarkdownTextBlock extends ContentBlockBase<BlockType.MarkdownText> {
  content: string;
}

export interface CalloutBlock extends ContentBlockBase<BlockType.Callout> {
  variant: CalloutVariant;
  text: string;
}

export interface CodeSnippetBlock extends ContentBlockBase<BlockType.CodeSnippet> {
  language: string;
  fileName?: string;
  code: string;
}

export interface ImageGalleryBlock extends ContentBlockBase<BlockType.ImageGallery> {
  mediaIds: string[];
}

export interface ImageBlock extends ContentBlockBase<BlockType.Image> {
  mediaId: string;
  caption?: string;
}

export interface VideoPlayerBlock extends ContentBlockBase<BlockType.VideoPlayer> {
  mediaId: string;
}

export interface SectionBlock extends ContentBlockBase<BlockType.Section> {
  title?: string;
  cssClass?: string;
  children: ProjectContentBlock[];
}

export interface SplitContainerBlock extends ContentBlockBase<BlockType.SplitContainer> {
  columns?: string;
  gap?: string;
  children: ProjectContentBlock[];
}

export type LeafContentBlock =
  | MarkdownTextBlock
  | CalloutBlock
  | CodeSnippetBlock
  | ImageGalleryBlock
  | ImageBlock
  | VideoPlayerBlock;

export type ContainerContentBlock = SectionBlock | SplitContainerBlock;

export type ProjectContentBlock = LeafContentBlock | ContainerContentBlock;
