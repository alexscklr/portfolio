namespace Portfolio.Api.Entities;

public class SkillTag
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public string Name {get; set;} = string.Empty;
    public string Slug {get; set;} = string.Empty;
    public SkillTagCategory Category {get; set;}

    public List<Project> Projects {get; set;} = new();
}