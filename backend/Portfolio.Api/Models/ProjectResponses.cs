using Portfolio.Api.Entities;

namespace Portfolio.Api.Models;

public sealed record ProjectListResponse(
    Guid Id,
    string Slug,
    string? Title,
    string? ShortDescription,
    string? PreviewMediaUrl,
    bool IsFeatured,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<SkillTagResponse> Skills,
    IEnumerable<ProjectLinkResponse> Links,
    IEnumerable<ProjectMediaResponse> Media);

public sealed record ProjectResponse(
    Guid Id,
    string Slug,
    string? Title,
    string? ShortDescription,
    string? PreviewMediaUrl,
    bool IsFeatured,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<SkillTagResponse> Skills,
    IEnumerable<ProjectLinkResponse> Links,
    IEnumerable<ProjectMediaResponse> Media,
    IEnumerable<ProjectBlockResponse> Blocks);

public sealed record ProjectLinkResponse(
    Guid Id,
    ProjectLinkType Type,
    string Url,
    string? Title);

public sealed record ProjectMediaResponse(
    Guid Id,
    string FileUrl,
    string FileName,
    string ContentType,
    int DisplayOrder,
    string? AltText);

public sealed record ProjectBlockResponse(
    Guid Id,
    ProjectBlockType Type,
    int DisplayOrder,
    string? ContentOrConfig);
