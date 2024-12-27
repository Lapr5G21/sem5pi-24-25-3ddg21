using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoomType",
                table: "SurgeryRooms");

            migrationBuilder.AddColumn<string>(
                name: "RoomTypeCode",
                table: "SurgeryRooms",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRooms_RoomTypeCode",
                table: "SurgeryRooms",
                column: "RoomTypeCode");

            migrationBuilder.AddForeignKey(
                name: "FK_SurgeryRooms_RoomTypes_RoomTypeCode",
                table: "SurgeryRooms",
                column: "RoomTypeCode",
                principalTable: "RoomTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurgeryRooms_RoomTypes_RoomTypeCode",
                table: "SurgeryRooms");

            migrationBuilder.DropIndex(
                name: "IX_SurgeryRooms_RoomTypeCode",
                table: "SurgeryRooms");

            migrationBuilder.DropColumn(
                name: "RoomTypeCode",
                table: "SurgeryRooms");

            migrationBuilder.AddColumn<string>(
                name: "RoomType",
                table: "SurgeryRooms",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
