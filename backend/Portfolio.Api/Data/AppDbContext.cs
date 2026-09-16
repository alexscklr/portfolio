using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectBlock> ProjectBlocks => Set<ProjectBlock>();
    public DbSet<ProjectLink> ProjectLinks => Set<ProjectLink>();
    public DbSet<ProjectMedia> ProjectMedias => Set<ProjectMedia>();
    public DbSet<SkillTag> SkillTags => Set<SkillTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<SkillTag>()
            .HasIndex(t => t.Slug)
            .IsUnique();

        modelBuilder.Entity<SkillTag>()
            .Property(s => s.Category)
            .HasConversion<string>();
        
        modelBuilder.Entity<ProjectLink>()
            .Property(l => l.Type)
            .HasConversion<string>();
        
        modelBuilder.Entity<ProjectBlock>()
            .Property(b => b.Type)
            .HasConversion<string>();
    }
}