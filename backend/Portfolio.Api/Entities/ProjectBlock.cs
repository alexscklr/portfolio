namespace Portfolio.Api.Entities;

public class ProjectBlock
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public BlockType Type {get; set;}
    public string ContentOrConfig {get; set;} = string.Empty;
    public int DisplayOrder {get; set;}

    public Guid ProjectId {get; set;}
    public Project Project {get; set;} = null!;
}