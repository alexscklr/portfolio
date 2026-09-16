using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMultilingualismByLang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShortDescription",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AltText",
                table: "ProjectMedias");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "ProjectLinks");

            migrationBuilder.DropColumn(
                name: "ContentOrConfig",
                table: "ProjectBlocks");

            migrationBuilder.DropColumn(
                name: "BioMarkdown",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "DisputeResolutionMarkdown",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "JobTitle",
                table: "Profiles");

            migrationBuilder.CreateTable(
                name: "ProfileTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    JobTitle = table.Column<string>(type: "text", nullable: false),
                    BioMarkdown = table.Column<string>(type: "text", nullable: false),
                    DisputeResolutionMarkdown = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileTranslations_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectBlockTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectBlockId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    ContentOrConfig = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectBlockTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectBlockTranslations_ProjectBlocks_ProjectBlockId",
                        column: x => x.ProjectBlockId,
                        principalTable: "ProjectBlocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectLinkTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectLinkId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectLinkTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectLinkTranslations_ProjectLinks_ProjectLinkId",
                        column: x => x.ProjectLinkId,
                        principalTable: "ProjectLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMediaTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectMediaId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    AltText = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMediaTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectMediaTranslations_ProjectMedias_ProjectMediaId",
                        column: x => x.ProjectMediaId,
                        principalTable: "ProjectMedias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ShortDescription = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectTranslations_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileTranslations_ProfileId_LanguageCode",
                table: "ProfileTranslations",
                columns: new[] { "ProfileId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBlockTranslations_ProjectBlockId_LanguageCode",
                table: "ProjectBlockTranslations",
                columns: new[] { "ProjectBlockId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLinkTranslations_ProjectLinkId_LanguageCode",
                table: "ProjectLinkTranslations",
                columns: new[] { "ProjectLinkId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMediaTranslations_ProjectMediaId_LanguageCode",
                table: "ProjectMediaTranslations",
                columns: new[] { "ProjectMediaId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTranslations_ProjectId_LanguageCode",
                table: "ProjectTranslations",
                columns: new[] { "ProjectId", "LanguageCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileTranslations");

            migrationBuilder.DropTable(
                name: "ProjectBlockTranslations");

            migrationBuilder.DropTable(
                name: "ProjectLinkTranslations");

            migrationBuilder.DropTable(
                name: "ProjectMediaTranslations");

            migrationBuilder.DropTable(
                name: "ProjectTranslations");

            migrationBuilder.AddColumn<string>(
                name: "ShortDescription",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AltText",
                table: "ProjectMedias",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "ProjectLinks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentOrConfig",
                table: "ProjectBlocks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BioMarkdown",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DisputeResolutionMarkdown",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobTitle",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
