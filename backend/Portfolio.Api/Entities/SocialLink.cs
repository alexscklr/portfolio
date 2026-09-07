namespace Portfolio.Api.Entities;

public class SocialLink
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public Guid ProfileId {get; set;}
    public string PlatformName {get; set;} = string.Empty;
    public string Url {get; set;} = string.Empty;
    public string IconKey {get; set;} = string.Empty;
    public int DisplayOrder {get; set;}

    public Profile Profile {get; set;} = null!;
}