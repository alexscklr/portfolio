using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Entities;
using Portfolio.Api.Common;
using Microsoft.AspNetCore.Authorization;
using Portfolio.Api.Mappings;
using Portfolio.Api.Models;
namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponse>> GetProfile([FromQuery] string? lang)
    {
        if (!string.IsNullOrEmpty(lang) && !SupportedLanguages.IsValidLanguageCode(lang))
        {
            return BadRequest("Invalid language code.");
        }

        var profile = await _context.Profiles
            .Include(p => p.SocialLinks.OrderBy(s => s.DisplayOrder))
            .Include(p => p.Translations)
            .FirstOrDefaultAsync();
        
        if (profile == null)
        {
            return NotFound("No profile found.");
        }

        return Ok(ProfileResponseMapper.ToResponse(profile, SupportedLanguages.Resolve(lang)));
    }

    [HttpGet("legal")]
    public async Task<ActionResult<LegalNoticeResponse>> GetLegalNotice([FromQuery] string? lang)
    {
        if (!string.IsNullOrEmpty(lang) && !SupportedLanguages.IsValidLanguageCode(lang))
        {
            return BadRequest("Invalid language code.");
        }
        var profile = await _context.Profiles.Include(p => p.Translations).FirstOrDefaultAsync();

        if (profile == null)
        {
            return NotFound("No profile found.");
        }

        return Ok(ProfileResponseMapper.ToLegalNotice(profile, SupportedLanguages.Resolve(lang)));
    }

    [HttpPost]
    public async Task<ActionResult<Profile>> UpsertProfile([FromBody] Profile profileDto)
    {
        if (!TranslationInputValidator.TryNormalize(
                profileDto.Translations,
                translation => translation.LanguageCode,
                (translation, languageCode) => translation.LanguageCode = languageCode,
                out var translationError))
        {
            return BadRequest(translationError);
        }

        var existingProfile = await _context.Profiles.Include(p => p.SocialLinks).Include(p => p.Translations).FirstOrDefaultAsync();

        if (existingProfile == null)
        {
            _context.Profiles.Add(profileDto);
        }
        else
        {
            UpdateProfile(existingProfile, profileDto);
        }

        await _context.SaveChangesAsync();
        return Ok(profileDto);
    }

    private void UpdateProfile(Profile existingProfile, Profile profileDto)
    {
        existingProfile.FullName = profileDto.FullName;
        existingProfile.AvatarUrl = profileDto.AvatarUrl;
        existingProfile.Location = profileDto.Location;
        existingProfile.PublicEmail = profileDto.PublicEmail;
        existingProfile.StreetAddress = profileDto.StreetAddress;
        existingProfile.PostalCodeAndCity = profileDto.PostalCodeAndCity;
        existingProfile.PhoneNumber = profileDto.PhoneNumber;
        existingProfile.DirectEmail = profileDto.DirectEmail;
        existingProfile.SocialLinks = profileDto.SocialLinks;

        foreach (var translation in profileDto.Translations)
        {
            var existingTranslation = existingProfile.Translations.FirstOrDefault(t =>
                string.Equals(t.LanguageCode, translation.LanguageCode, StringComparison.OrdinalIgnoreCase));
            if (existingTranslation == null)
            {
                existingProfile.Translations.Add(translation);
            }
            else
            {
                UpdateTranslation(existingTranslation, translation);
            }
        }
    }

    private void UpdateTranslation(ProfileTranslation existingTranslation, ProfileTranslation translation)
    {
        existingTranslation.JobTitle = translation.JobTitle;
        existingTranslation.BioMarkdown = translation.BioMarkdown;
        existingTranslation.DisputeResolutionMarkdown = translation.DisputeResolutionMarkdown;
    }
}