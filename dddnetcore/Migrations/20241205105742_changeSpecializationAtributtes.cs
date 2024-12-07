using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class changeSpecializationAtributtes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Specializations_SpecializationName",
                table: "Specializations");

            migrationBuilder.AlterColumn<string>(
                name: "SpecializationName",
                table: "Specializations",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SpecializationCode",
                table: "Specializations",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SpecializationDescription",
                table: "Specializations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Specializations_SpecializationCode",
                table: "Specializations",
                column: "SpecializationCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Specializations_SpecializationCode",
                table: "Specializations");

            migrationBuilder.DropColumn(
                name: "SpecializationCode",
                table: "Specializations");

            migrationBuilder.DropColumn(
                name: "SpecializationDescription",
                table: "Specializations");

            migrationBuilder.AlterColumn<string>(
                name: "SpecializationName",
                table: "Specializations",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Specializations_SpecializationName",
                table: "Specializations",
                column: "SpecializationName",
                unique: true);
        }
    }
}
