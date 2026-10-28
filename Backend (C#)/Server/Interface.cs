using Server.Data;
using Server.DTO;
using Server.Models;

public interface IRequestService
{
    Task<bool> AddRequest(DtoCreateRequest request);
    Task<List<DtoRequest>> GetAllRequest();
    Task<DtoRequest?> GetRequestById(string id);
    Task<bool> UpdateRequest(string id, Request updateRequest);
    Task<bool> UpdateStatusRequest(string id, EStatus status);
    Task<bool> DeleteRequestById(string id);
}

public interface IAccountService
{
    Task<bool> AddAccountAsync(DtoRegistration regAccount);
    Task<bool> AddOperatorAsync(DtoOperatorRegistration regOperator);
    Task<List<DtoAccount>> GetAllDtoAccountsAsync();
    Task<DtoAccount?> GetAccountByIdAsync(string id);
    Task<bool> EditAccountByIdAsync(string id, DtoAccountEdit? updateAcc);
    Task<bool> DeleteAccountByIdAsync(string id);
}

public interface IDtoAccountServices
{
    DtoAccount ToDto(Account account); 
}

public interface IDtoRequestServices
{
    DtoRequest ToDto(Request request);
}

public interface ICommentService
{
    Task<bool> AddCommentAsync(DtoCommentCreate? dtoCommentCreate);
    Task<List<DtoComment>> GetCommentsAllAsync();
    Task<Comment?> GetCommentByIdAsync(string id);
    Task<bool> EditCommentAsync(string id, Comment? upComment);
}

public interface IDtoCommentServices
{
    DtoComment? ToDto(Comment comment);
}

public interface IDtoLoginService
    { 
    Task<DtoLoginResponse?> LoginAsync(DtoLogin login); 
}

public interface ITicketService
{
    Task<List<DtoTicket>> GetTicketsByOperatorAsync(string operatorId);
    Task<DtoTicket> AddTicketAsync(string name, string operatorId);
    Task<bool> DeleteTicketAsync(string ticketId, string operatorId);
    Task<bool> MoveTicketAsync(string tickStartId, string tickEndId, string operatorId);
    Task<bool> MoveRequestAsync(string requestId, string ticketDropId, string operatorId);
}

public interface IDtoTicketService
{
    public DtoTicket ToDto(Ticket ticket);
}

public interface IJwtServices
{
    string CreateToken(Account account);
}
