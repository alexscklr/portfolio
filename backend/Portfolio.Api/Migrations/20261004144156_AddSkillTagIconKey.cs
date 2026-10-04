using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSkillTagIconKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StreetAdress",
                table: "Profiles",
                newName: "StreetAddress");

            migrationBuilder.AddColumn<string>(
                name: "IconKey",
                table: "SkillTags",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconKey",
                table: "SkillTags");

            migrationBuilder.RenameColumn(
                name: "StreetAddress",
                table: "Profiles",
                newName: "StreetAdress");
        }
    }
}
