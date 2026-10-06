using Portfolio.Api.Entities;

namespace Portfolio.Api.Models;

public record SkillTagResponse(
	Guid Id,
	string Name,
	string Slug,
	SkillTagCategory Category,
    string? IconKey
);

public sealed record SkillResponse(
	Guid Id,
	string Name,
	string Slug,
	SkillTagCategory Category,
	int UsageCount,
	string? IconKey
) : SkillTagResponse(Id, Name, Slug, Category, IconKey);