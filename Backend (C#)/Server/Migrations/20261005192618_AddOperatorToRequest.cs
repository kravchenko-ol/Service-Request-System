using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddOperatorToRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OperatorId",
                table: "Requests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Requests_OperatorId",
                table: "Requests",
                column: "OperatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests",
                column: "OperatorId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Accounts_OperatorId",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Requests_OperatorId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "OperatorId",
                table: "Requests");
        }
    }
}
