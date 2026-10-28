using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTO;
using Server.Models;
using System.Xml.Linq;

namespace Server.Models
{
    public class Ticket
    {
        public Ticket
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
        public Account? Operator { get; set; }
        public int Position { get; set; }
        public string Name { get; set; } = "";
        public List<Request> Requests { get; set; } = new();
    }
}

public class TicketService : ITicketService
{
    private readonly AppDbContext db;
    private readonly IDtoTicketService dtoTicketService;

    public TicketService(AppDbContext db, IDtoTicketService dtoTicketService)
    {
        this.db = db;
        this.dtoTicketService = dtoTicketService;
    }

    public async Task<List<DtoTicket>> GetTicketsByOperatorAsync(string operatorId)
    {
        List<Ticket> tickets = await db.Tickets.Where(ticket => ticket.OperatorId == operatorId)
            .Include(ticket => ticket.Requests)
                .ThenInclude(request => request.Author)
            .OrderBy(ticket => ticket.Position)
            .ToListAsync();

        List<DtoTicket> dtoTickets = tickets.Select(ticket => dtoTicketService.ToDto(ticket)).ToList();

        return dtoTickets;
    }

    public async Task<DtoTicket?> AddTicketAsync(string name, string operatorId)
    {
        if (string.IsNullOrWhiteSpace(name)) return null;

        Account? oper = await db.Accounts
            .Include(acc => acc.Tickets)
            .FirstOrDefaultAsync(acc => acc.Id == operatorId);

        if (oper == null) return null;

        int newPosition = oper.Tickets.Count == 0 ? 0 : oper.Tickets.Max(ticket => ticket.Position) + 1;

        int numId = 1;

        while (await db.Tickets.AnyAsync(tick => tick.Id == $"ticket-{operatorId}-{numId}")) numId++;

        string id = $"ticket-{operatorId}-{numId}";

        Ticket newTicket = new Ticket
            (
                id: id,
                operatorId: operatorId,
                name: name,
                position: newPosition
            );

        await db.Tickets.AddAsync(newTicket);
        await db.SaveChangesAsync();

        return dtoTicketService.ToDto(newTicket);
    }

    public async Task<bool> MoveRequestAsync(string requestId, string ticketDropId, string operatorId)
    {
        if (
            string.IsNullOrWhiteSpace(requestId)
            || string.IsNullOrWhiteSpace(ticketDropId)
            || string.IsNullOrWhiteSpace(operatorId)
            ) return false;

        Account? oper = await db.Accounts
            .Include(acc => acc.Tickets)
            .FirstOrDefaultAsync(acc => acc.Id == operatorId);
        if (oper == null) return false;

        Ticket? ticketDrop = oper.Tickets.FirstOrDefault(ticket => ticket.Id == ticketDropId);
        Request? request = await db.Requests.FirstOrDefaultAsync(req => req.Id == requestId);
        if (
            request == null 
            || ticketDrop == null
            || request.OperatorId != operatorId
            ) return false;

        request.TicketId = ticketDropId;

        await db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MoveTicketAsync(string tickStartId, string tickEndId, string operatorId)
    {
        if (
            string.IsNullOrWhiteSpace(tickStartId) 
            || string.IsNullOrWhiteSpace(tickEndId) 
            || string.IsNullOrWhiteSpace(operatorId)
            ) return false;

        Account? oper = await db.Accounts
            .Include(acc => acc.Tickets)
            .FirstOrDefaultAsync(acc => acc.Id == operatorId);
        if (oper == null) return false;

        Ticket? ticketStart = oper.Tickets.FirstOrDefault(ticket => ticket.Id == tickStartId);
        Ticket? ticketEnd = oper.Tickets.FirstOrDefault(ticket => ticket.Id == tickEndId);

        if (ticketStart == null || ticketEnd == null) return false;

        int startPosition = ticketStart.Position;

        ticketStart.Position = ticketEnd.Position;
        ticketEnd.Position = startPosition;

        await db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteTicketAsync(string ticketId, string operatorId)
    {
        if (string.IsNullOrWhiteSpace(ticketId) || string.IsNullOrWhiteSpace(operatorId)) return false;

        Account? oper = await db.Accounts
            .Include(acc => acc.Tickets)
                .ThenInclude(tick => tick.Requests)
            .FirstOrDefaultAsync(acc => acc.Id == operatorId);

        if (oper == null) return false;

        Ticket? removeTicket = oper.Tickets.FirstOrDefault(ticket => ticket.Id == ticketId);

        if (removeTicket == null || removeTicket.Name == "New") return false;

        Ticket? defaultTicket = oper.Tickets.FirstOrDefault(ticket => ticket.Name == "New");

        if (defaultTicket == null) return false;

        foreach (Request req in removeTicket.Requests)
        {
            req.TicketId = defaultTicket.Id;
        }

        oper.Tickets.Remove(removeTicket);

        foreach (Ticket ticket in oper.Tickets)
        {
            if (ticket.Position > removeTicket.Position)
            {
                ticket.Position -= 1;
            }
        }

        await db.SaveChangesAsync();

        return true;
    }
}