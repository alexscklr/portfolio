namespace Portfolio.Api.Entities;

public class Profile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string BioMarkdown { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public string PublicEmail { get; set; } = string.Empty;

    public string StreetAdress { get; set; } = string.Empty;
    public string PostalCodeAndCity { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string DirectEmail { get; set; } = string.Empty;
    public string? DisputeResolutionMarkdown { get; set; }

    public List<SocialLink> SocialLinks { get; set; } = new();
}