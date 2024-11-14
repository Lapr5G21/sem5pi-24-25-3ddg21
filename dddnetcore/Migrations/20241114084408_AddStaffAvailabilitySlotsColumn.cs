using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffAvailabilitySlotsColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Slots",
                table: "Staffs",
                newName: "StaffAvailabilitySlots");

            migrationBuilder.AlterColumn<string>(
                name: "StaffAvailabilitySlots",
                table: "Staffs",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StaffAvailabilitySlots",
                table: "Staffs",
                newName: "Slots");

            migrationBuilder.UpdateData(
                table: "Staffs",
                keyColumn: "Slots",
                keyValue: null,
                column: "Slots",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Slots",
                table: "Staffs",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
