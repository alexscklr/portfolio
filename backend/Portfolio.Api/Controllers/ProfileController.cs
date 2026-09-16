

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Entities;

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
    public async Task<ActionResult<Profile>> GetProfile()
    {
        var profile = await _context.Profiles
            .Include(p => p.SocialLinks.OrderBy(s => s.DisplayOrder))
            .FirstOrDefaultAsync();
        
        if (profile == null)
        {
            return NotFound("No profile found.");
        }

        return Ok(profile);
    }

    [HttpGet("legal")]
    public async Task<ActionResult<object>> GetLegalNotice()
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync();

        if (profile == null)
        {
            return NotFound("No profile found.");
        }

        return Ok(new
        {
            profile.FullName,
            profile.StreetAdress,
            profile.PostalCodeAndCity,
            profile.PhoneNumber,
            profile.DirectEmail,
            profile.DisputeResolutionMarkdown
        });
    }

    [HttpPost]
    public async Task<ActionResult<Profile>> UpsertProfile([FromBody] Profile profileDto)
    {
        var existingProfile = await _context.Profiles.Include(p => p.SocialLinks).FirstOrDefaultAsync();

        if (existingProfile == null)
        {
            _context.Profiles.Add(profileDto);
        }
        else
        {
            existingProfile.FullName = profileDto.FullName;
            existingProfile.JobTitle = profileDto.JobTitle;
            existingProfile.BioMarkdown = profileDto.BioMarkdown;
            existingProfile.AvatarUrl = profileDto.AvatarUrl;
            existingProfile.Location = profileDto.Location;
            existingProfile.PublicEmail = profileDto.PublicEmail;

            existingProfile.StreetAdress = profileDto.StreetAdress;
            existingProfile.PostalCodeAndCity = profileDto.PostalCodeAndCity;
            existingProfile.PhoneNumber = profileDto.PhoneNumber;
            existingProfile.DirectEmail = profileDto.DirectEmail;
            existingProfile.DisputeResolutionMarkdown = profileDto.DisputeResolutionMarkdown;

            existingProfile.SocialLinks = profileDto.SocialLinks;
        }

        await _context.SaveChangesAsync();
        return Ok(profileDto);
    }
}