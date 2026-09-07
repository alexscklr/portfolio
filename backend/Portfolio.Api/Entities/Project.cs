namespace Portfolio.Api.Entities;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string DescriptionMarkdown { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public bool isPublished { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public List<ProjectMedia> Media { get; set; } = new List<ProjectMedia>();
    public List<Tag> Tags { get; set; } = new List<Tag>();
}