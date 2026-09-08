export enum SkillTagCategory {
    Language = 'Language',
    Framework = 'Framework',
    ToolOrSoftware = 'ToolOrSoftware',
    ConceptOrApi = 'ConceptOrApi'
}

export interface SkillTag {
    id: string;
    name: string;
    slug: string;
    category: SkillTagCategory;
    iconKey?: string;
}