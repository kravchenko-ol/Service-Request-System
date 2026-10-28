using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests");

            migrationBuilder.AlterColumn<string>(
                name: "OperatorId",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TicketId",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    OperatorId = table.Column<string>(type: "TEXT", nullable: false),
                    Position = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_Accounts_OperatorId",
                        column: x => x.OperatorId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_TicketId",
                table: "Requests",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_OperatorId",
                table: "Tickets",
                column: "OperatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests",
                column: "OperatorId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Tickets_TicketId",
                table: "Requests",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Tickets_TicketId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Requests_TicketId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "Requests");

            migrationBuilder.AlterColumn<string>(
                name: "OperatorId",
                table: "Requests",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests",
                column: "OperatorId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }
    }
}
