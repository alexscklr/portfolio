using Portfolio.Api.Common;

namespace Portfolio.Api.Entities;

public class ProjectLink
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public Guid ProjectId {get; set;} 
    public ProjectLinkType Type {get; set;}
    public string Url {get; set;} = string.Empty;

    public List<ProjectLinkTranslation> Translations { get; set; } = new();

    public Project Project {get; set;} = null!;
}

public class ProjectLinkTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectLinkId { get; set; }
    public string LanguageCode { get; set; } = SupportedLanguages.Default;
    public string Title { get; set; } = string.Empty;

    public ProjectLink ProjectLink { get; set; } = null!;
}