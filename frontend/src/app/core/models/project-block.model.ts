export enum BlockType {
    MarkdownText = 'MarkdownText',
    ImageGallery = 'ImageGallery',
    PdfViewer = 'PdfViewer',
    VideoPlayer = 'VideoPlayer',
    CustomWidget = 'CustomWidget'
}

export interface ProjectBlock {
    id: string;
    type: BlockType;
    displayOrder: number;
    contentOrConfig: string;
}