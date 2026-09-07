namespace Portfolio.Api.Entities;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    
    public string? PreviewMediaUrl { get; set; }
    public bool IsFeatured { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public List<ProjectBlock> Blocks { get; set; } = new();
    public List<ProjectLink> Links { get; set; } = new();
    public List<ProjectMedia> Media { get; set; } = new();
    public List<SkillTag> Skills { get; set; } = new();
}