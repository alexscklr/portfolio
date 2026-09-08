export interface ProjectMedia {
    id: string;
    projectId: string;
    fileName: string;
    contentType: string;
    fileUrl: string;
    altText?: string;
    createdAt: string;
}