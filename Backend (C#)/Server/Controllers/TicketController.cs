using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Data;
using Server.DTO;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService ticketService;

        public TicketController(ITicketService ticketService)
        {
            this.ticketService = ticketService;
        }

        [HttpGet("operator/{operatorId}")]
        public async Task<List<DtoTicket>> GetAllTicketsControll(string operatorId)
        {
            return await ticketService.GetTicketsByOperatorAsync(operatorId);
        }

        [HttpPost("create/{operatorId}/{name}")]
        public async Task<ActionResult<DtoTicket>> AddTicketAsync(string name, string operatorId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(operatorId))
            {
                return BadRequest();
            }

            DtoTicket? newTicket = await ticketService.AddTicketAsync(name, operatorId);

            if (newTicket == null) return NotFound();

            return Ok(newTicket);
        }

        [HttpDelete("delete/{operatorId}/{ticketId}")]

        public async Task<ActionResult> DeleteTicketAsync(string ticketId, string operatorId)
        {
            if (string.IsNullOrWhiteSpace(ticketId) || string.IsNullOrWhiteSpace(operatorId))
            {
                return BadRequest();
            }

            bool deleteTicket = await ticketService.DeleteTicketAsync(ticketId, operatorId);

            if (!deleteTicket) return NotFound();

            return Ok();
        }

        [HttpPut("dragNdrop/{tickStartId}/{tickEndId}/{operatorId}")]

        public async Task<ActionResult> MoveTicketAsync(string tickStartId, string tickEndId, string operatorId)
        {
            if 
            (
                string.IsNullOrWhiteSpace(tickStartId)
                || string.IsNullOrWhiteSpace(tickEndId)
                || string.IsNullOrWhiteSpace(operatorId)
            ) return NotFound();

            bool activeMove = await ticketService.MoveTicketAsync(tickStartId, tickEndId, operatorId);

            if (!activeMove) return NotFound();

            return Ok();
        }

        [HttpPut("dragNdropReq/{requestId}/{ticketDropId}/{operatorId}")]

        public async Task<ActionResult> MoveRequestAsync(string requestId, string ticketDropId, string operatorId)
        {
            if
            (
                string.IsNullOrWhiteSpace(requestId)
                || string.IsNullOrWhiteSpace(ticketDropId)
                || string.IsNullOrWhiteSpace(operatorId)
            ) return NotFound();

            bool activeMove = await ticketService.MoveRequestAsync(requestId, ticketDropId, operatorId);

            if (!activeMove) return NotFound();

            return Ok();
        }
    }
}
