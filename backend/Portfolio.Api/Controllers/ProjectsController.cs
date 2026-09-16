

using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Services;
using Portfolio.Api.Entities;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects([FromQuery] string? tagSlug, [FromQuery] bool? isFeatured)
    {
        var query = _context.Projects
            .Include(p => p.Skills)
            .Include(p => p.Links)
            .Include(p => p.Media)
            .AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(tagSlug))
        {
            query = query.Where(p => p.Skills.Any(s => s.Slug.ToLower() == tagSlug.ToLower()));
        }

        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        return await query.OrderBy(p => p.DisplayOrder).ThenByDescending(p => p.CreatedAt).ToListAsync();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Project>> GetProjectBySlug(string slug)
    {
        var project = await _context.Projects
            .Include(p => p.Skills)
            .Include(p => p.Links)
            .Include(p => p.Media)
            .Include(p => p.Blocks.OrderBy(b => b.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == slug.ToLower());

        if (project == null)
        {
            return NotFound($"Project with slug '{slug}' not found.");
        }

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject([FromBody] Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProjectBySlug), new { slug = project.Slug }, project);
    }

    [HttpPost("{id:guid}/upload-media")]
    public async Task<IActionResult> UploadMedia(Guid id, IFormFile file, [FromQuery] string? altText)
    {
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
            ContentType = file.ContentType,
            AltText = altText
        };

        _context.ProjectMedias.Add(media);
        await _context.SaveChangesAsync();

        return Ok(media);
    }
}