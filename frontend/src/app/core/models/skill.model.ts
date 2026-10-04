import { SkillTagCategory } from "./skill-tag.model";

export interface Skill {
    id: string;
    name: string;
    slug: string;
    category: SkillTagCategory;
    usageCount: number;
    iconKey?: string;
}