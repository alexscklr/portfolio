namespace Portfolio.Api.Entities;

public class ProjectLink
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public Guid ProjectId {get; set;} 
    public ProjectLinkType Type {get; set;}
    public string Url {get; set;} = string.Empty;
    public string Label {get; set;} = string.Empty;

    public Project Project {get; set;} = null!;
}