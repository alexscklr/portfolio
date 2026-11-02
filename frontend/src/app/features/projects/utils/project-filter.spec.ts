import { Project, SkillTag, SkillTagCategory } from '@/app/core/models';
import { buildSkillFacets, filterProjectsBySkills, parseSkillSlugs } from './project-filter';

const skill = (slug: string, category: SkillTagCategory, name = slug): SkillTag => ({
  id: slug,
  name,
  slug,
  category,
});

const angular = skill('angular', SkillTagCategory.Framework, 'Angular');
const dotnet = skill('dotnet', SkillTagCategory.Framework, '.NET');
const csharp = skill('csharp', SkillTagCategory.Language, 'C#');
const docker = skill('docker', SkillTagCategory.ToolOrSoftware, 'Docker');

const project = (id: string, skills: SkillTag[]): Project => ({
  id,
  title: id,
  slug: id,
  shortDescription: '',
  isFeatured: false,
  displayOrder: 0,
  createdAt: '2026-01-01T00:00:00Z',
  skills,
  blocks: [],
  links: [],
  media: [],
});

const projects = [
  project('a', [angular, csharp, dotnet]),
  project('b', [dotnet, csharp, docker]),
  project('c', [angular]),
];

describe('project filter', () => {
  describe('filterProjectsBySkills', () => {
    it('returns all projects without a selection', () => {
      expect(filterProjectsBySkills(projects, []).length).toBe(3);
    });

    it('requires every selected skill (AND)', () => {
      expect(filterProjectsBySkills(projects, ['angular']).map(p => p.id)).toEqual(['a', 'c']);
      expect(filterProjectsBySkills(projects, ['angular', 'dotnet']).map(p => p.id)).toEqual(['a']);
      expect(filterProjectsBySkills(projects, ['angular', 'docker'])).toEqual([]);
    });
  });

  describe('parseSkillSlugs', () => {
    it('returns an empty list for missing input', () => {
      expect(parseSkillSlugs(null, projects)).toEqual([]);
      expect(parseSkillSlugs('', projects)).toEqual([]);
    });

    it('drops unknown slugs and duplicates', () => {
      expect(parseSkillSlugs('angular, nope,angular,dotnet', projects)).toEqual([
        'angular',
        'dotnet',
      ]);
    });

    it('ignores everything while no projects are loaded', () => {
      expect(parseSkillSlugs('angular', [])).toEqual([]);
    });
  });

  describe('buildSkillFacets', () => {
    const slugs = (groups: ReturnType<typeof buildSkillFacets>) =>
      groups.flatMap(group => group.facets.map(facet => facet.skill.slug));

    it('groups skills by category in a fixed order with usage counts', () => {
      const groups = buildSkillFacets(projects, [], '');

      expect(groups.map(group => group.category)).toEqual([
        SkillTagCategory.Language,
        SkillTagCategory.Framework,
        SkillTagCategory.ToolOrSoftware,
      ]);
      const frameworks = groups[1].facets.map(facet => [facet.skill.slug, facet.count]);
      expect(frameworks).toEqual([
        ['dotnet', 2],
        ['angular', 2],
      ]);
    });

    it('only offers skills that occur together with the selection', () => {
      const groups = buildSkillFacets(projects, ['angular'], '');

      expect(slugs(groups).sort()).toEqual(['angular', 'csharp', 'dotnet']);
      expect(
        groups.flatMap(group => group.facets).find(facet => facet.skill.slug === 'csharp')?.count,
      ).toBe(1);
    });

    it('keeps selected skills visible and first, even if the search does not match', () => {
      const groups = buildSkillFacets(projects, ['angular'], 'zzz');

      expect(slugs(groups)).toEqual(['angular']);
      expect(groups[0].facets[0].selected).toBe(true);
    });

    it('filters by name case-insensitively', () => {
      expect(slugs(buildSkillFacets(projects, [], ' DOC '))).toEqual(['docker']);
    });
  });
});
