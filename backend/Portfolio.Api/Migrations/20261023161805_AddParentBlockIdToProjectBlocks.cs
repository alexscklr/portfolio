using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddParentBlockIdToProjectBlocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ParentBlockId",
                table: "ProjectBlocks",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBlocks_ParentBlockId",
                table: "ProjectBlocks",
                column: "ParentBlockId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectBlocks_ProjectBlocks_ParentBlockId",
                table: "ProjectBlocks",
                column: "ParentBlockId",
                principalTable: "ProjectBlocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectBlocks_ProjectBlocks_ParentBlockId",
                table: "ProjectBlocks");

            migrationBuilder.DropIndex(
                name: "IX_ProjectBlocks_ParentBlockId",
                table: "ProjectBlocks");

            migrationBuilder.DropColumn(
                name: "ParentBlockId",
                table: "ProjectBlocks");
        }
    }
}
