using Portfolio.Api.Common;
using Portfolio.Api.Entities;
using Portfolio.Api.Models;

namespace Portfolio.Api.Mappings;

public static class ProjectResponseMapper
{
    public static ProjectListResponse ToListResponse(Project project, string languageCode)
    {
        var translation = TranslationResolver.Resolve(project.Translations, languageCode, item => item.LanguageCode);

        return new ProjectListResponse(
            project.Id,
            project.Slug,
            translation?.Title,
            translation?.ShortDescription,
            project.PreviewMediaUrl,
            project.IsFeatured,
            project.DisplayOrder,
            project.CreatedAt,
            project.UpdatedAt,
            project.Skills,
            project.Links.Select(link => ToResponse(link, languageCode)),
            project.Media.Select(media => ToResponse(media, languageCode)));
    }

    public static ProjectResponse ToResponse(Project project, string languageCode)
    {
        var translation = TranslationResolver.Resolve(project.Translations, languageCode, item => item.LanguageCode);

        return new ProjectResponse(
            project.Id,
            project.Slug,
            translation?.Title,
            translation?.ShortDescription,
            project.PreviewMediaUrl,
            project.IsFeatured,
            project.DisplayOrder,
            project.CreatedAt,
            project.UpdatedAt,
            project.Skills,
            project.Links.Select(link => ToResponse(link, languageCode)),
            project.Media.Select(media => ToResponse(media, languageCode)),
            project.Blocks
                .OrderBy(block => block.DisplayOrder)
                .Select(block => ToResponse(block, languageCode)));
    }

    private static ProjectLinkResponse ToResponse(ProjectLink link, string languageCode)
    {
        var translation = TranslationResolver.Resolve(link.Translations, languageCode, item => item.LanguageCode);
        return new ProjectLinkResponse(link.Id, link.Type, link.Url, translation?.Title);
    }

    private static ProjectMediaResponse ToResponse(ProjectMedia media, string languageCode)
    {
        var translation = TranslationResolver.Resolve(media.Translations, languageCode, item => item.LanguageCode);

        return new ProjectMediaResponse(
            media.Id,
            media.FileUrl,
            media.FileName,
            media.ContentType,
            media.DisplayOrder,
            translation?.AltText);
    }

    private static ProjectBlockResponse ToResponse(ProjectBlock block, string languageCode)
    {
        var translation = TranslationResolver.Resolve(block.Translations, languageCode, item => item.LanguageCode);
        return new ProjectBlockResponse(block.Id, block.Type, block.DisplayOrder, translation?.ContentOrConfig);
    }
}
