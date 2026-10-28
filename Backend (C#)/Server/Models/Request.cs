using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.DTO;
using Server.Models;
using Server.Hubs;

public class Request
{
    public Request
    (
        string id,
        string authorId,
        string operatorId,
        string ticketId,
        string title,
        string description,
        ECategory category,
        EPriority priority,
        EStatus status,
        string createAt
    )
    {
        this.Id = id;
        this.AuthorId = authorId;
        this.OperatorId = operatorId;
        this.TicketId = ticketId;
        this.Title = title;
        this.Description = description;
        this.Category = category;
        this.Priority = priority;
        this.Status = status;
        this.CreateAt = createAt;
    }
    public string Id { get; set; } = "";
    public string AuthorId { get; set; } = "";
    public Account? Author { get; set; }
    public string OperatorId { get; set; } = "";
    public Account? Operator { get; set; }
    public string TicketId { get; set; } = "";
    public Ticket? Ticket { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public ECategory Category { get; set; }
    public EPriority Priority { get; set; }
    public EStatus Status { get; set; }
    public List<Comment> Comments { get; set; } = new();
    public string CreateAt { get; set; } = "";
}

public class ServiceRequest : IRequestService
{
    private readonly AppDbContext db;
    private readonly IHubContext<UpdateHubs> hubContext;
    private readonly IDtoRequestServices dtoRequestServices;
    public ServiceRequest
        (
            AppDbContext db, 
            IHubContext<UpdateHubs> hubContext,
            IDtoRequestServices dtoRequestServices
        )
    {
        this.db = db;
        this.hubContext = hubContext;
        this.dtoRequestServices = dtoRequestServices;
    }
    public async Task<List<DtoRequest>> GetAllRequest()
    {
        List<Request> requests = await db.Requests
            .Include(req => req.Author)
            .Include(req => req.Operator)
            .Include(req => req.Comments)
            .ThenInclude(com => com.Author)
            .ToListAsync();

        return requests.Select(req => dtoRequestServices.ToDto(req)).ToList();
    }
    public async Task<bool> AddRequest(DtoCreateRequest request)
    {
        bool exits = await db.Accounts.AnyAsync(acc => acc.Id == request.AuthorId);
        if (!exits) return false;

        int numId = 1;

        while (await db.Requests.AnyAsync(req => req.Id == $"Bug-{numId}")) numId++;

        string id = $"Bug-{numId}";

        List<Account> opers = await db.Accounts
            .Where(acc => acc.Role == ERole.Operator)
            .Include(acc => acc.Tickets)
            .ToListAsync();

        if (opers.Count == 0) return false;

        int randomIndex = Random.Shared.Next(opers.Count);

        Account oper = opers[randomIndex];

        string operatorId = oper.Id;

        Ticket? ticket = oper.Tickets.FirstOrDefault(ticket => ticket.Name == "New");
        if (ticket == null) return false;

        string ticketId = ticket.Id;

        Request updateRequest = new Request
            (
                id: id,
                authorId: request.AuthorId,
                operatorId: operatorId,
                ticketId: ticketId,
                title: request.Title,
                description: request.Description,
                category: request.Category,
                priority: request.Priority,
                status: request.Status,
                createAt: DateTime.Now.ToString()
            );

        db.Requests.Add(updateRequest);
        await db.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("DataUpdate");

        return true;
    }
    public async Task<DtoRequest?> GetRequestById(string id)
    {
        Request? request = await db.Requests
            .Include(req => req.Author)
            .Include(req => req.Comments)
            .ThenInclude(com => com.Author)
            .FirstOrDefaultAsync(req => req.Id == id);

        if (request == null) return null;

        return dtoRequestServices.ToDto(request);
    }
    public async Task<bool> UpdateRequest(string id, Request updateRequest)
    {
        Request? request = await db.Requests.FirstOrDefaultAsync(req => req.Id == id);

        if (request == null) return false;

        request.Title = updateRequest.Title;
        request.Description = updateRequest.Description;
        request.Category = updateRequest.Category;
        request.Priority = updateRequest.Priority;
        request.Status = updateRequest.Status;

        await db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateStatusRequest(string id, EStatus status)
    {
        Request? request = await db.Requests.FirstOrDefaultAsync(req => req.Id == id);
        if (request == null) return false;

        request.Status = status;

        Ticket? ticket = await db.Tickets.FirstOrDefaultAsync(
            tick => tick.Name == status.ToString()
            && tick.OperatorId == request.OperatorId
            );

        if (ticket == null)
        {
            Account? oper = await db.Accounts
                .Include(acc => acc.Tickets)
                .FirstOrDefaultAsync(acc => acc.Id == request.OperatorId);
            if (oper == null) return false;

            int newPosition = oper.Tickets.Count == 0 ? 0 : oper.Tickets.Max(ticket => ticket.Position) + 1;

            int numId = 1;

            while (await db.Tickets.AnyAsync(tick => tick.Id == $"ticket-{oper.Id}-{numId}")) numId++;

            string idNewTick = $"ticket-{oper.Id}-{numId}";

            Ticket newTicket = new Ticket
                (
                    id: idNewTick,
                    operatorId: oper.Id,
                    name: status.ToString(),
                    position: newPosition
                );
            request.TicketId = newTicket.Id;

            await db.AddAsync(newTicket);
        } 
        else 
        { 
            request.TicketId = ticket.Id; 
        }

        await db.SaveChangesAsync();

        return true;
    }
    public async Task<bool> DeleteRequestById(string id)
    {
        Request? request = await db.Requests.FirstOrDefaultAsync(req => req.Id == id);

        if (request == null) return false;

        db.Requests.Remove(request);

        await db.SaveChangesAsync();

        return true;
    }
}