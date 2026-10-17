import { ProjectBlock } from "./project-block.model";
import { ProjectLink } from "./project-link.model";
import { ProjectMedia } from "./project-media.model";
import { SkillTag } from "./skill-tag.model";



export interface Project {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    shortDescription: string;
    previewMediaUrl?: string;
    startDate?: string;
    endDate?: string;
    isFeatured: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt?: string;

    skills: SkillTag[];
    blocks: ProjectBlock[];
    links: ProjectLink[];
    media: ProjectMedia[];
}