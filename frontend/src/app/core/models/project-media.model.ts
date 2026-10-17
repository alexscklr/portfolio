export interface ProjectMedia {
    id: string;
    fileUrl: string;
    fileName: string;
    contentType: string;
    posterUrl?: string;
    displayOrder: number;
    altText?: string;
}