using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Entities;
using Portfolio.Api.Services;

namespace Portfolio.Api.Data;

public static class DevelopmentDataSeeder
{
    public static async Task SeedAsync(AppDbContext context, IStorageService storage, CancellationToken cancellationToken = default)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        var skillsBySlug = await context.SkillTags
            .ToDictionaryAsync(skill => skill.Slug, cancellationToken);

        foreach (var seedSkill in CreateSkills())
        {
            if (skillsBySlug.TryGetValue(seedSkill.Slug, out var existingSkill))
            {
                existingSkill.Name = seedSkill.Name;
                existingSkill.Category = seedSkill.Category;
                existingSkill.IconKey = seedSkill.IconKey;
                continue;
            }

            context.SkillTags.Add(seedSkill);
            skillsBySlug.Add(seedSkill.Slug, seedSkill);
        }

        var seedProjects = CreateProjects(skillsBySlug).ToList();
        var seedProjectSlugs = seedProjects.Select(project => project.Slug).ToArray();

        await context.Projects
            .Where(project => seedProjectSlugs.Contains(project.Slug))
            .ExecuteDeleteAsync(cancellationToken);

        var previousAvatarUrl = await context.Profiles
            .Select(profile => profile.AvatarUrl)
            .FirstOrDefaultAsync(cancellationToken);
        await context.Profiles.ExecuteDeleteAsync(cancellationToken);

        var profile = CreateProfile();
        profile.AvatarUrl = await ReplaceSeedAvatarAsync(storage, previousAvatarUrl);
        context.Profiles.Add(profile);
        context.Projects.AddRange(seedProjects);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    private static async Task<string> ReplaceSeedAvatarAsync(IStorageService storage, string? previousUrl)
    {
        if (Uri.TryCreate(previousUrl, UriKind.Absolute, out _))
        {
            await storage.DeleteFileAsync(previousUrl!);
        }

        var path = Path.Combine(AppContext.BaseDirectory, "SeedAssets", "avatar-alexander.svg");
        await using var stream = File.OpenRead(path);
        return await storage.UploadFileAsync(stream, "avatar-alexander.svg", "image/svg+xml");
    }

    private static Profile CreateProfile()
    {
        return new Profile
        {
            FullName = "Alexander Mustermann",
            Location = "Deutschland",
            PublicEmail = "hello@example.com",
            StreetAddress = "Musterstraße 1",
            PostalCodeAndCity = "12345 Musterstadt",
            PhoneNumber = "+49 000 000000",
            DirectEmail = "hello@example.com",
            SocialLinks =
            [
                new()
                {
                    PlatformName = "GitHub",
                    Url = "https://github.com/",
                    IconKey = "github",
                    DisplayOrder = 1
                },
                new()
                {
                    PlatformName = "LinkedIn",
                    Url = "https://www.linkedin.com/",
                    IconKey = "linkedin",
                    DisplayOrder = 2
                },
                new(){
                    PlatformName = "E-Mail",
                    Url = "mailto:hello@example.com",
                    IconKey = "mdi:email",
                    DisplayOrder = 3
                }
            ],
            Translations =
            [
                new()
                {
                    LanguageCode = "de",
                    JobTitle = "Full-Stack Developer",
                    BioMarkdown = "Ich entwickle digitale Produkte mit einem Fokus auf klare Interfaces, robuste APIs und nachhaltige Architektur.",
                    DisputeResolutionMarkdown = string.Empty
                },
                new()
                {
                    LanguageCode = "en",
                    JobTitle = "Full-Stack Developer",
                    BioMarkdown = "I build digital products focused on clear interfaces, robust APIs, and sustainable architecture.",
                    DisputeResolutionMarkdown = string.Empty
                }
            ]
        };
    }

    private static IEnumerable<SkillTag> CreateSkills()
    {
        return
        [
            new() { Name = "C#", Slug = "csharp", Category = SkillTagCategory.Language, IconKey = "logos:c-sharp" },
            new() { Name = ".NET 8", Slug = "dotnet-8", Category = SkillTagCategory.Framework, IconKey = "logos:dotnet" },
            new() { Name = "Angular 18+", Slug = "angular", Category = SkillTagCategory.Framework, IconKey = "logos:angular-icon" },
            new() { Name = "HLSL / WebGL", Slug = "hlsl-webgl", Category = SkillTagCategory.ConceptOrApi, IconKey = "simple-icons:webgl" },
            new() { Name = "Tailwind CSS v4", Slug = "tailwind-css", Category = SkillTagCategory.Framework, IconKey = "logos:tailwindcss-icon" },
            new() { Name = "gRPC", Slug = "grpc", Category = SkillTagCategory.ConceptOrApi, IconKey = "logos:grpc" },
            new() { Name = "Docker", Slug = "docker", Category = SkillTagCategory.ToolOrSoftware, IconKey = "logos:docker-icon" },
            new() { Name = "Python / Maya API", Slug = "python-maya-api", Category = SkillTagCategory.Language, IconKey = "logos:python" },
            new() { Name = "TypeScript", Slug = "typescript", Category = SkillTagCategory.Language, IconKey = "logos:typescript-icon" }
        ];
    }

    private static IEnumerable<Project> CreateProjects(IReadOnlyDictionary<string, SkillTag> skills)
    {
        yield return CreateProject(
            1,
            "generative-cinema-engine",
            "Generative Cinema Engine",
            "Generative Cinema Engine",
            "Echtzeit-Renderpipeline und interaktives WebGL/Shader-Interface integriert in Angular 18 & .NET 8.",
            "A Real-time rendering pipeline and interactive WebGL/shader interface built with Angular 18 and .NET 8.",
            "Ein hochperformantes Framework zur Echtzeit-Generierung von visuellen Effekten im Browser. Die Pipeline nutzt .NET 8 für das Asset-Management und Angular Signals für latenzfreie State-Updates.",
            "A high-performance framework for generating visual effects in the browser in real time. The pipeline uses .NET 8 for asset management and Angular Signals for latency-free state updates.",
            new DateTime(2026, 5, 15, 10, 0, 0, DateTimeKind.Utc),
            [skills["csharp"], skills["dotnet-8"], skills["angular"], skills["hlsl-webgl"], skills["tailwind-css"]],
            [
                (ProjectLinkType.GitHub, "https://github.com/alex/generative-cinema", "GitHub", "GitHub"),
                (ProjectLinkType.LiveDemo, "https://demo.cinema.dev", "Live Demo", "Live demo")
            ],
            "/media/fixtures/demo-video.mp4",
            "Kurze Demo-Animation für die Generative Cinema Engine",
            "Short demo animation for the Generative Cinema Engine",
            "Echtzeit-Visuals im Browser",
            "Real-time visuals in the browser",
            new DateOnly(2026, 3, 1));

        yield return CreateProject(
            2,
            "realtime-pipeline-automation",
            "Realtime Pipeline Automation",
            "Realtime Pipeline Automation",
            "Automatisierter Asset-Import & Build-Job Dispatcher für 3D-Pipelines via gRPC und SignalR.",
            "Automated asset import and build-job dispatcher for 3D pipelines using gRPC and SignalR.",
            "Verbindet 3D-Software (Maya, Blender) direkt mit Web-Interfaces. Nutzt gRPC für ultraschnelle Datenübertragung und WebSockets für Echtzeit-Statusupdates.",
            "Connects 3D software such as Maya and Blender directly to web interfaces. Uses gRPC for high-speed data transfer and WebSockets for real-time status updates.",
            new DateTime(2026, 2, 10, 14, 30, 0, DateTimeKind.Utc),
            [skills["dotnet-8"], skills["grpc"], skills["docker"], skills["python-maya-api"]],
            [(ProjectLinkType.GitHub, "https://github.com/alex/pipeline-auto", "GitHub", "GitHub")],
            germanSubtitle: "Maya trifft Web",
            englishSubtitle: "Maya meets the web",
            startDate: new DateOnly(2025, 11, 1),
            endDate: new DateOnly(2026, 2, 28));

        yield return CreateProject(
            3,
            "anamorphic-ui-kit",
            "Anamorphic UI Kit & Component Library",
            "Anamorphic UI Kit & Component Library",
            "Performance-fokussierte UI-Komponentenbibliothek im Cinematique-Style mit Tailwind CSS v4.",
            "Performance-focused UI component library with a cinematic style, built with Tailwind CSS v4.",
            "Eine maßgeschneiderte Design-System-Bibliothek für Recruiter-Dashboards und Medienangebote. Optimiert für Barrierefreiheit und 60fps Animationen.",
            "A custom design-system library for recruiter dashboards and media platforms. Optimized for accessibility and 60fps animations.",
            new DateTime(2026, 8, 1, 9, 0, 0, DateTimeKind.Utc),
            [skills["angular"], skills["tailwind-css"], skills["typescript"]],
            [
                (ProjectLinkType.GitHub, "https://github.com/alex/anamorphic-ui", "GitHub", "GitHub"),
                (ProjectLinkType.LiveDemo, "https://ui.cinema.dev", "Live Demo", "Live demo")
            ],
            germanSubtitle: "Cinematisches Design-System",
            englishSubtitle: "Cinematic design system",
            startDate: new DateOnly(2026, 6, 1),
            endDate: new DateOnly(2026, 8, 31));
    }

    private static Project CreateProject(
        int displayOrder,
        string slug,
        string germanTitle,
        string englishTitle,
        string germanDescription,
        string englishDescription,
        string germanBlock,
        string englishBlock,
        DateTime createdAt,
        IEnumerable<SkillTag> skills,
        (ProjectLinkType Type, string Url, string GermanTitle, string EnglishTitle)[] links,
        string? mediaUrl = null,
        string? germanAltText = null,
        string? englishAltText = null,
        string? germanSubtitle = null,
        string? englishSubtitle = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null)
    {
        var project = new Project
        {
            Slug = slug,
            PreviewMediaUrl = "/media/fixtures/placeholder.svg",
            IsFeatured = true,
            DisplayOrder = displayOrder,
            StartDate = startDate,
            EndDate = endDate,
            CreatedAt = createdAt,
            Skills = skills.ToList(),
            Translations =
            [
                new() { LanguageCode = "de", Title = germanTitle, Subtitle = germanSubtitle, ShortDescription = germanDescription },
                new() { LanguageCode = "en", Title = englishTitle, Subtitle = englishSubtitle, ShortDescription = englishDescription }
            ],
            Blocks =
            [
                new()
                {
                    Type = ProjectBlockType.MarkdownText,
                    DisplayOrder = 1,
                    Translations =
                    [
                        new() { LanguageCode = "de", ContentOrConfig = germanBlock },
                        new() { LanguageCode = "en", ContentOrConfig = englishBlock }
                    ]
                }
            ],
            Links = links.Select(link => new ProjectLink
            {
                Type = link.Type,
                Url = link.Url,
                Translations =
                [
                    new() { LanguageCode = "de", Title = link.GermanTitle },
                    new() { LanguageCode = "en", Title = link.EnglishTitle }
                ]
            }).ToList()
        };

        string[] galleryImages = ["/media/fixtures/placeholder.svg", "/media/fixtures/japan-route-placeholder.svg"];
        var order = mediaUrl is null ? 1 : 2;
        var galleryMediaIds = new List<Guid>();
        foreach (var imageUrl in galleryImages)
        {
            var galleryMedia = new ProjectMedia
            {
                FileUrl = imageUrl,
                FileName = Path.GetFileName(imageUrl),
                ContentType = "image/svg+xml",
                DisplayOrder = order++,
                Translations =
                [
                    new() { LanguageCode = "de", AltText = $"Vorschaubild zu {germanTitle}" },
                    new() { LanguageCode = "en", AltText = $"Preview image for {englishTitle}" }
                ]
            };
            project.Media.Add(galleryMedia);
            galleryMediaIds.Add(galleryMedia.Id);
        }

        ProjectMedia? videoMedia = null;
        if (mediaUrl is not null)
        {
            videoMedia = new ProjectMedia
            {
                FileUrl = mediaUrl,
                FileName = Path.GetFileName(mediaUrl),
                ContentType = "video/mp4",
                PosterUrl = "/media/fixtures/placeholder.svg",
                DisplayOrder = 1,
                Translations =
                [
                    new() { LanguageCode = "de", AltText = germanAltText },
                    new() { LanguageCode = "en", AltText = englishAltText }
                ]
            };
            project.Media.Add(videoMedia);
        }

        AddLayoutBlocks(project, germanTitle, englishTitle, galleryMediaIds, videoMedia?.Id);

        return project;
    }

    private static void AddLayoutBlocks(
        Project project,
        string germanTitle,
        string englishTitle,
        IReadOnlyList<Guid> galleryMediaIds,
        Guid? videoMediaId)
    {
        var section = CreateBlock(
            ProjectBlockType.Section,
            2,
            null,
            JsonSerializer.Serialize(new { title = "Überblick", cssClass = "py-8" }),
            JsonSerializer.Serialize(new { title = "Overview", cssClass = "py-8" }));
        var split = CreateBlock(
            ProjectBlockType.SplitContainer,
            1,
            section.Id,
            JsonSerializer.Serialize(new { columns = "1fr 2fr", gap = "6" }));
        var text = CreateBlock(
            ProjectBlockType.MarkdownText,
            1,
            split.Id,
            $"**{germanTitle}** entstand als Portfolio-Projekt.\n\n- Fokus auf Performance\n- Saubere Architektur\n- Barrierefreie Umsetzung",
            $"**{englishTitle}** was built as a portfolio project.\n\n- Focus on performance\n- Clean architecture\n- Accessible implementation");
        var gallery = CreateBlock(
            ProjectBlockType.ImageGallery,
            2,
            split.Id,
            JsonSerializer.Serialize(new { mediaIds = galleryMediaIds }));

        var blocks = new List<ProjectBlock> { section, split, text, gallery };

        if (videoMediaId is { } mediaId)
        {
            blocks.Add(CreateBlock(
                ProjectBlockType.VideoPlayer,
                3,
                null,
                JsonSerializer.Serialize(new { mediaId })));
        }

        blocks.Add(CreateBlock(
            ProjectBlockType.Callout,
            4,
            null,
            JsonSerializer.Serialize(new { variant = "result", text = "Ergebnis: spürbar schnellere Ladezeiten bei sauberer Architektur." }),
            JsonSerializer.Serialize(new { variant = "result", text = "Result: noticeably faster load times with a clean architecture." })));

        if (galleryMediaIds.Count > 1)
        {
            blocks.Add(CreateBlock(
                ProjectBlockType.Image,
                5,
                null,
                JsonSerializer.Serialize(new { mediaId = galleryMediaIds[1], caption = "Beispielansicht aus dem Projekt" }),
                JsonSerializer.Serialize(new { mediaId = galleryMediaIds[1], caption = "Example view from the project" })));
        }

        blocks.Add(CreateBlock(
            ProjectBlockType.CodeSnippet,
            6,
            null,
            JsonSerializer.Serialize(new
            {
                language = "typescript",
                fileName = "example.ts",
                code = "export const greet = (name: string): string => `Hello, ${name}!`;"
            })));

        foreach (var block in blocks)
        {
            project.Blocks.Add(block);
        }
    }

    private static ProjectBlock CreateBlock(
        ProjectBlockType type,
        int displayOrder,
        Guid? parentBlockId,
        string germanContent,
        string? englishContent = null)
    {
        return new ProjectBlock
        {
            Type = type,
            DisplayOrder = displayOrder,
            ParentBlockId = parentBlockId,
            Translations =
            [
                new() { LanguageCode = "de", ContentOrConfig = germanContent },
                new() { LanguageCode = "en", ContentOrConfig = englishContent ?? germanContent }
            ]
        };
    }
}