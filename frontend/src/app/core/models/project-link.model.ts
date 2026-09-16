export enum ProjectLinkType {
    GitHub = 'GitHub',
    LiveDemo = 'LiveDemo',
    PdfDocumentation = 'PdfDocumentation',
    GameDownload = 'GameDownload',
    ExternalVideo = 'ExternalVideo',
    Paper = 'Paper',
}

export interface ProjectLink {
    id: string;
    type: ProjectLinkType;
    url: string;
    title: string;
}