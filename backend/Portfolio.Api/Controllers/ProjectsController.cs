using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Entities;
using Portfolio.Api.Services;

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
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        return await _context.Projects
            .Include(p => p.Media)
            .Include(p => p.Tags)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject([FromBody] Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, project);
    }

    [HttpPost("{id:guid}/upload-media")]
    public async Task<IActionResult> UploadMedia(Guid id, IFormFile file, [FromQuery] string? altText)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound("Project not found.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using var stream = file.OpenReadStream();
        var fileUrl = await _storageService.UploadFileAsync(stream, file.FileName, file.ContentType);

        var projectMedia = new ProjectMedia
        {
            ProjectId = id,
            FileUrl = fileUrl,
            FileName = file.FileName,
            ContentType = file.ContentType,
            AltText = altText
        };

        _context.ProjectMedia.Add(projectMedia);
        await _context.SaveChangesAsync();

        return Ok(projectMedia);
    }
}