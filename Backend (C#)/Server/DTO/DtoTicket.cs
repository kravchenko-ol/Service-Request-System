using Server.DTO;
using Server.Models;

namespace Server.DTO
{
    public class DtoTicket
    {
        public DtoTicket
        (
            string id,
            string operatorId,
            string name,
            int position
        )
        {
            this.Id = id;
            this.OperatorId = operatorId;
            this.Name = name;
            this.Position = position;
        }
        public string Id { get; set; } = "";
        public string OperatorId { get; set; } = "";
        public DtoAccount? Operator { get; set; }
        public int Position { get; set; }
        public string Name { get; set; } = "";
        public List<DtoRequest> Requests { get; set; } = new();
    }
}

public class DtoTicketService : IDtoTicketService
{
    private readonly IDtoRequestServices dtoRequestServices;

    public DtoTicketService(IDtoRequestServices dtoRequestServices)
    {
        this.dtoRequestServices = dtoRequestServices;
    }
    public DtoTicket ToDto(Ticket ticket)
    {
        DtoTicket dtoTicket = new DtoTicket
            (
                id: ticket.Id,
                operatorId: ticket.OperatorId,
                name: ticket.Name,
                position: ticket.Position
            );
        List<DtoRequest> dtoRequests = ticket.Requests.Select(req => dtoRequestServices.ToDto(req)).ToList();
        dtoTicket.Requests = dtoRequests;

        return dtoTicket;
    }

}
