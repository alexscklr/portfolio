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
    projectId: string;
    type: ProjectLinkType;
    url: string;
    label: string;
}