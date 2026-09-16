using Portfolio.Api.Common;
using Portfolio.Api.Entities;
using Portfolio.Api.Models;

namespace Portfolio.Api.Mappings;

public static class ProfileResponseMapper
{
    public static ProfileResponse ToResponse(Profile profile, string languageCode)
    {
        var translation = TranslationResolver.Resolve(profile.Translations, languageCode, item => item.LanguageCode);

        return new ProfileResponse(
            profile.Id,
            profile.FullName,
            translation?.JobTitle,
            translation?.BioMarkdown,
            profile.AvatarUrl,
            profile.Location,
            profile.PublicEmail,
            profile.SocialLinks
                .OrderBy(link => link.DisplayOrder)
                .Select(link => new SocialLinkResponse(
                    link.Id,
                    link.PlatformName,
                    link.Url,
                    link.IconKey,
                    link.DisplayOrder)));
    }

    public static LegalNoticeResponse ToLegalNotice(Profile profile, string languageCode)
    {
        var translation = TranslationResolver.Resolve(profile.Translations, languageCode, item => item.LanguageCode);

        return new LegalNoticeResponse(
            profile.FullName,
            profile.StreetAddress,
            profile.PostalCodeAndCity,
            profile.PhoneNumber,
            profile.DirectEmail,
            translation?.DisputeResolutionMarkdown);
    }
}
