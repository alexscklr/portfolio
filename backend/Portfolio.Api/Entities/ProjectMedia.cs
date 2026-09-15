using Portfolio.Api.Common;

namespace Portfolio.Api.Entities;

public class ProjectMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;

    public Project Project { get; set; } = null!;
    public List<ProjectMediaTranslation> Translations { get; set; } = new List<ProjectMediaTranslation>();
}

public class ProjectMediaTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectMediaId { get; set; }
    public string LanguageCode { get; set; } = SupportedLanguages.Default;
    public string? AltText { get; set; }

    public ProjectMedia ProjectMedia { get; set; } = null!;
}