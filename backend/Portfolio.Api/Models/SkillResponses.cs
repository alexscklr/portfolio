using Portfolio.Api.Entities;

namespace Portfolio.Api.Models;

public sealed record SkillResponse(
	Guid Id,
	string Name,
	string Slug,
	SkillTagCategory Category,
	int UsageCount);