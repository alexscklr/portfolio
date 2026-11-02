export enum BlockType {
    MarkdownText = 'MarkdownText',
    Callout = 'Callout',
    ImageGallery = 'ImageGallery',
    PdfViewer = 'PdfViewer',
    VideoPlayer = 'VideoPlayer',
    CustomWidget = 'CustomWidget',
    Section = 'Section',
    SplitContainer = 'SplitContainer',
    Image = 'Image',
    CodeSnippet = 'CodeSnippet'
}

export interface ProjectBlock {
    id: string;
    type: BlockType;
    displayOrder: number;
    contentOrConfig: string;
    parentBlockId?: string;
}