using Microsoft.EntityFrameworkCore.Migrations;

namespace BackEnd.Migrations
{
    public partial class V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ArchiveID",
                table: "GameInfo",
                newName: "GameArchiveID");

            migrationBuilder.AlterColumn<string>(
                name: "PGN",
                table: "GameInfo",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GameArchiveID",
                table: "GameInfo",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "Archive",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Archive", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameInfo_GameArchiveID",
                table: "GameInfo",
                column: "GameArchiveID");

            migrationBuilder.AddForeignKey(
                name: "FK_GameInfo_Archive_GameArchiveID",
                table: "GameInfo",
                column: "GameArchiveID",
                principalTable: "Archive",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameInfo_Archive_GameArchiveID",
                table: "GameInfo");

            migrationBuilder.DropTable(
                name: "Archive");

            migrationBuilder.DropIndex(
                name: "IX_GameInfo_GameArchiveID",
                table: "GameInfo");

            migrationBuilder.RenameColumn(
                name: "GameArchiveID",
                table: "GameInfo",
                newName: "ArchiveID");

            migrationBuilder.AlterColumn<string>(
                name: "PGN",
                table: "GameInfo",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ArchiveID",
                table: "GameInfo",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
