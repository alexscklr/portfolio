import { Project, SkillTag, SkillTagCategory } from '@/app/core/models';
import { SKILL_CATEGORY_ORDER } from '@/app/core/config/skill-category';

export interface SkillFacet {
  skill: SkillTag;
  count: number;
  selected: boolean;
}

export interface SkillFacetGroup {
  category: SkillTagCategory;
  facets: SkillFacet[];
}

/** Keeps only projects that contain every selected skill (AND). */
export function filterProjectsBySkills(
  projects: readonly Project[],
  selectedSlugs: readonly string[],
): Project[] {
  if (selectedSlugs.length === 0) {
    return [...projects];
  }

  return projects.filter(project => {
    const slugs = new Set(project.skills.map(skill => skill.slug));
    return selectedSlugs.every(slug => slugs.has(slug));
  });
}

/** Parses a comma separated slug list and drops duplicates and unknown skills. */
export function parseSkillSlugs(raw: string | null, projects: readonly Project[]): string[] {
  if (!raw) {
    return [];
  }

  const knownSlugs = new Set(projects.flatMap(project => project.skills.map(skill => skill.slug)));
  const slugs = raw
    .split(',')
    .map(slug => slug.trim())
    .filter(slug => knownSlugs.has(slug));

  return [...new Set(slugs)];
}

/**
 * Builds the selectable skills grouped by category. Only skills that occur together with the
 * current selection are offered; selected skills always stay visible.
 */
export function buildSkillFacets(
  projects: readonly Project[],
  selectedSlugs: readonly string[],
  query: string,
): SkillFacetGroup[] {
  const selected = new Set(selectedSlugs);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const counts = new Map<string, number>();
  const skillsBySlug = new Map<string, SkillTag>();

  for (const project of projects) {
    for (const skill of project.skills) {
      skillsBySlug.set(skill.slug, skill);
    }
  }

  for (const project of filterProjectsBySkills(projects, selectedSlugs)) {
    for (const skill of project.skills) {
      counts.set(skill.slug, (counts.get(skill.slug) ?? 0) + 1);
    }
  }

  const facets: SkillFacet[] = [...skillsBySlug.values()]
    .map(skill => ({
      skill,
      count: counts.get(skill.slug) ?? 0,
      selected: selected.has(skill.slug),
    }))
    .filter(
      facet =>
        facet.selected ||
        (facet.count > 0 && facet.skill.name.toLocaleLowerCase().includes(normalizedQuery)),
    );

  return SKILL_CATEGORY_ORDER.map(category => ({
    category,
    facets: facets
      .filter(facet => facet.skill.category === category)
      .sort(
        (a, b) =>
          Number(b.selected) - Number(a.selected) ||
          b.count - a.count ||
          a.skill.name.localeCompare(b.skill.name),
      ),
  })).filter(group => group.facets.length > 0);
}
