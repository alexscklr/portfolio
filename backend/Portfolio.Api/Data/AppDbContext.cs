using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<ProfileTranslation> ProfileTranslations => Set<ProfileTranslation>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTranslation> ProjectTranslations => Set<ProjectTranslation>();
    public DbSet<ProjectBlock> ProjectBlocks => Set<ProjectBlock>();
    public DbSet<ProjectBlockTranslation> ProjectBlockTranslations => Set<ProjectBlockTranslation>();
    public DbSet<ProjectLink> ProjectLinks => Set<ProjectLink>();
    public DbSet<ProjectLinkTranslation> ProjectLinkTranslations => Set<ProjectLinkTranslation>();
    public DbSet<ProjectMedia> ProjectMedias => Set<ProjectMedia>();
    public DbSet<ProjectMediaTranslation> ProjectMediaTranslations => Set<ProjectMediaTranslation>();
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

        modelBuilder.Entity<ProfileTranslation>()
            .HasIndex(t => new { t.ProfileId, t.LanguageCode })
            .IsUnique();

        modelBuilder.Entity<ProjectTranslation>()
            .HasIndex(t => new { t.ProjectId, t.LanguageCode })
            .IsUnique();

        modelBuilder.Entity<ProjectBlockTranslation>()
            .HasIndex(t => new { t.ProjectBlockId, t.LanguageCode })
            .IsUnique();

        modelBuilder.Entity<ProjectLinkTranslation>()
            .HasIndex(t => new { t.ProjectLinkId, t.LanguageCode })
            .IsUnique();

        modelBuilder.Entity<ProjectMediaTranslation>()
            .HasIndex(t => new { t.ProjectMediaId, t.LanguageCode })
            .IsUnique();
    }
}