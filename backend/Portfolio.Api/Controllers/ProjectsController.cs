

using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Services;
using Portfolio.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Common;
using Microsoft.AspNetCore.Authorization;
using Portfolio.Api.Mappings;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStorageService _storageService;

    public ProjectsController(AppDbContext context, IStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectListResponse>>> GetProjects([FromQuery] string? tagSlug, [FromQuery] bool? isFeatured, [FromQuery] string? lang)
    {
        if (!string.IsNullOrEmpty(lang) && !SupportedLanguages.IsValidLanguageCode(lang))
        {
            return BadRequest("Invalid language code.");
        }

        var languageCode = SupportedLanguages.Resolve(lang);

        var query = _context.Projects
            .AsNoTracking()
            .Include(p => p.Skills)
            .Include(p => p.Links)
                .ThenInclude(l => l.Translations)
            .Include(p => p.Media)
                .ThenInclude(m => m.Translations)
            .Include(p => p.Translations)
            .AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(tagSlug))
        {
            query = query.Where(p => p.Skills.Any(s => s.Slug.ToLower() == tagSlug.ToLower()));
        }

        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        var projects = await query
        .OrderBy(p => p.DisplayOrder)
        .ThenByDescending(p => p.CreatedAt)
        .ToListAsync();

        var result = projects.Select(p =>
        {
            return ProjectResponseMapper.ToListResponse(p, languageCode);
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectResponse>> GetProjectBySlug(string slug, [FromQuery] string? lang)
    {
        if (!string.IsNullOrEmpty(lang) && !SupportedLanguages.IsValidLanguageCode(lang))
        {
            return BadRequest("Invalid language code.");
        }

        var languageCode = SupportedLanguages.Resolve(lang);

        var project = await _context.Projects
            .Include(p => p.Skills)
            .Include(p => p.Links)
                .ThenInclude(l => l.Translations)
            .Include(p => p.Media)
                .ThenInclude(m => m.Translations)
            .Include(p => p.Blocks)
                .ThenInclude(b => b.Translations)
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == slug.ToLower());

        if (project == null)
        {
            return NotFound($"Project with slug '{slug}' not found.");
        }

        return Ok(ProjectResponseMapper.ToResponse(project, languageCode));
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject([FromBody] Project project)
    {
        if (!TranslationInputValidator.TryNormalize(
                project.Translations,
                translation => translation.LanguageCode,
                (translation, languageCode) => translation.LanguageCode = languageCode,
                out var translationError)
            || !TranslationInputValidator.TryNormalize(
                project.Links,
                link => link.Translations,
                translation => translation.LanguageCode,
                (translation, languageCode) => translation.LanguageCode = languageCode,
                out translationError)
            || !TranslationInputValidator.TryNormalize(
                project.Media,
                media => media.Translations,
                translation => translation.LanguageCode,
                (translation, languageCode) => translation.LanguageCode = languageCode,
                out translationError)
            || !TranslationInputValidator.TryNormalize(
                project.Blocks,
                block => block.Translations,
                translation => translation.LanguageCode,
                (translation, languageCode) => translation.LanguageCode = languageCode,
                out translationError))
        {
            return BadRequest(translationError);
        }

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProjectBySlug), new { slug = project.Slug }, project);
    }

    [HttpPost("{id:guid}/upload-media")]
    public async Task<IActionResult> UploadMedia(Guid id, IFormFile file, [FromQuery] string? altText, [FromQuery] string? lang)
    {
        if (!string.IsNullOrEmpty(lang) && !SupportedLanguages.IsValidLanguageCode(lang))
        {
            return BadRequest("Invalid language code.");
        }

        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound($"Project with ID '{id}' not found.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using var stream = file.OpenReadStream();
        var fileUrl = await _storageService.UploadFileAsync(stream, file.FileName, file.ContentType);

        var media = new ProjectMedia
        {
            ProjectId = project.Id,
            FileUrl = fileUrl,
            FileName = file.FileName,
            ContentType = file.ContentType
        };

        if (!string.IsNullOrWhiteSpace(altText))
        {
            media.Translations.Add(new ProjectMediaTranslation
            {
                LanguageCode = SupportedLanguages.Resolve(lang),
                AltText = altText
            });
        }

        _context.ProjectMedias.Add(media);
        await _context.SaveChangesAsync();

        return Ok(media);
    }
}