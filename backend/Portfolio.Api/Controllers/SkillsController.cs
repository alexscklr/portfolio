

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SkillsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillResponse>>> GetSkills()
    {
        var query = _context.Projects.AsNoTracking().SelectMany(project => project.Skills);
        var skillGroups = await query
            .GroupBy(skill => new
            {
                skill.Id,
                skill.Name,
                skill.Slug,
                skill.Category
            })
            .Select(group => new
            {
                group.Key.Id,
                group.Key.Name,
                group.Key.Slug,
                group.Key.Category,
                UsageCount = group.Count()
            })
            .OrderByDescending(skill => skill.UsageCount)
            .ThenBy(skill => skill.Name)
            .ToListAsync();

        var skills = skillGroups.Select(skill => new SkillResponse(
            skill.Id,
            skill.Name,
            skill.Slug,
            skill.Category,
            skill.UsageCount));

        return Ok(skills);
    }
}