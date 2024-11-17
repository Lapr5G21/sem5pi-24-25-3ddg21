using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddAvailabilitySlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AvailabilitySlot_Staffs_StaffId",
                table: "AvailabilitySlot");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AvailabilitySlot",
                table: "AvailabilitySlot");

            migrationBuilder.RenameTable(
                name: "AvailabilitySlot",
                newName: "AvailabilitySlots");

            migrationBuilder.RenameIndex(
                name: "IX_AvailabilitySlot_StaffId",
                table: "AvailabilitySlots",
                newName: "IX_AvailabilitySlots_StaffId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Start",
                table: "AvailabilitySlots",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.UpdateData(
                table: "AvailabilitySlots",
                keyColumn: "StaffId",
                keyValue: null,
                column: "StaffId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "StaffId",
                table: "AvailabilitySlots",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "End",
                table: "AvailabilitySlots",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AvailabilitySlots",
                table: "AvailabilitySlots",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AvailabilitySlots_Staffs_StaffId",
                table: "AvailabilitySlots",
                column: "StaffId",
                principalTable: "Staffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AvailabilitySlots_Staffs_StaffId",
                table: "AvailabilitySlots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AvailabilitySlots",
                table: "AvailabilitySlots");

            migrationBuilder.RenameTable(
                name: "AvailabilitySlots",
                newName: "AvailabilitySlot");

            migrationBuilder.RenameIndex(
                name: "IX_AvailabilitySlots_StaffId",
                table: "AvailabilitySlot",
                newName: "IX_AvailabilitySlot_StaffId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Start",
                table: "AvailabilitySlot",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AlterColumn<string>(
                name: "StaffId",
                table: "AvailabilitySlot",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "End",
                table: "AvailabilitySlot",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AvailabilitySlot",
                table: "AvailabilitySlot",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AvailabilitySlot_Staffs_StaffId",
                table: "AvailabilitySlot",
                column: "StaffId",
                principalTable: "Staffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
