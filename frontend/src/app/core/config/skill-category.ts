import { SkillTagCategory } from '@/app/core/models';

export interface SkillCategoryStyle {
  labelKey: string;
  chip: string;
  chipSelected: string;
}

export const SKILL_CATEGORY_ORDER: readonly SkillTagCategory[] = [
  SkillTagCategory.Language,
  SkillTagCategory.Framework,
  SkillTagCategory.ToolOrSoftware,
  SkillTagCategory.ConceptOrApi,
];

export const SKILL_CATEGORY_STYLES: Record<SkillTagCategory, SkillCategoryStyle> = {
  [SkillTagCategory.Language]: {
    labelKey: 'skills.category.language',
    chip: 'border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10',
    chipSelected:
      'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]',
  },
  [SkillTagCategory.Framework]: {
    labelKey: 'skills.category.framework',
    chip: 'border-[var(--color-accent-secondary)]/40 text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/10',
    chipSelected:
      'border-[var(--color-accent-secondary)] bg-[var(--color-accent-secondary)]/20 text-[var(--color-accent-secondary)]',
  },
  [SkillTagCategory.ToolOrSoftware]: {
    labelKey: 'skills.category.tool',
    chip: 'border-[var(--color-accent-tertiary)]/40 text-[var(--color-accent-tertiary)] hover:bg-[var(--color-accent-tertiary)]/10',
    chipSelected:
      'border-[var(--color-accent-tertiary)] bg-[var(--color-accent-tertiary)]/20 text-[var(--color-accent-tertiary)]',
  },
  [SkillTagCategory.ConceptOrApi]: {
    labelKey: 'skills.category.concept',
    chip: 'border-sky-300/40 text-sky-300 hover:bg-sky-300/10',
    chipSelected: 'border-sky-300 bg-sky-300/20 text-sky-300',
  },
};
