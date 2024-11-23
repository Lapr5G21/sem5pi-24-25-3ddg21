using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class FixAppointments1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_SurgeryRooms_RoomNumber",
                table: "Appointments");

            migrationBuilder.AlterColumn<string>(
                name: "RoomNumber",
                table: "Appointments",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_SurgeryRooms_RoomNumber",
                table: "Appointments",
                column: "RoomNumber",
                principalTable: "SurgeryRooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_SurgeryRooms_RoomNumber",
                table: "Appointments");

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "RoomNumber",
                keyValue: null,
                column: "RoomNumber",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "RoomNumber",
                table: "Appointments",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_SurgeryRooms_RoomNumber",
                table: "Appointments",
                column: "RoomNumber",
                principalTable: "SurgeryRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
