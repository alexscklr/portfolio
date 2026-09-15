using Portfolio.Api.Common;

namespace Portfolio.Api.Entities;

public class ProjectBlock
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public ProjectBlockType Type {get; set;}
    public int DisplayOrder {get; set;}

    public Guid ProjectId {get; set;}
    public Project Project {get; set;} = null!;
    public List<ProjectBlockTranslation> Translations { get; set; } = new();
}

public class ProjectBlockTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectBlockId { get; set; }
    public string LanguageCode { get; set; } = SupportedLanguages.Default;
    public string ContentOrConfig { get; set; } = string.Empty;

    public ProjectBlock ProjectBlock { get; set; } = null!;
}