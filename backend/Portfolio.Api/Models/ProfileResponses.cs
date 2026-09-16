namespace Portfolio.Api.Models;

public sealed record ProfileResponse(
    Guid Id,
    string FullName,
    string? JobTitle,
    string? BioMarkdown,
    string? AvatarUrl,
    string Location,
    string PublicEmail,
    IEnumerable<SocialLinkResponse> SocialLinks);

public sealed record SocialLinkResponse(
    Guid Id,
    string PlatformName,
    string Url,
    string IconKey,
    int DisplayOrder);

public sealed record LegalNoticeResponse(
    string FullName,
    string StreetAddress,
    string PostalCodeAndCity,
    string PhoneNumber,
    string DirectEmail,
    string? DisputeResolutionMarkdown);
