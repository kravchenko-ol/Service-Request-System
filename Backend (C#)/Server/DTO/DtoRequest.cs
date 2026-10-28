using Server.DTO;
using Server.Models;

namespace Server.DTO
{
    public class DtoRequest
    {
        public DtoRequest
        (
            string id,
            string authorId,
            DtoAccount? author,
            string? operatorId,
            DtoAccount? oper,
            string title,
            string description,
            ECategory category,
            EPriority priority,
            EStatus status,
            List<DtoComment> comments,
            string createAt
        )
        {
            this.Id = id;
            this.AuthorId = authorId;
            this.Author = author;
            this.OperatorId = operatorId;
            this.Operator = oper;
            this.Title = title;
            this.Description = description;
            this.Category = category;
            this.Priority = priority;
            this.Status = status;
            this.Comments = comments;
            this.CreateAt = createAt;
        }
        public string Id { get; set; } = "";
        public string AuthorId { get; set; } = "";
        public DtoAccount? Author { get; set; }
        public string? OperatorId { get; set; } = "";
        public DtoAccount? Operator { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public ECategory Category { get; set; }
        public EPriority Priority { get; set; }
        public EStatus Status { get; set; }
        public List<DtoComment> Comments { get; set; } = new();
        public string CreateAt { get; set; } = "";
    }
}

public class DtoUpdateStatusRequest
{
    public EStatus Status { get; set; }
}

public class DtoRequestServices : IDtoRequestServices
{
    private readonly IDtoAccountServices dtoAccountServices;
    private readonly IDtoCommentServices dtoCommentServices;

    public DtoRequestServices(IDtoAccountServices dtoAccountServices, IDtoCommentServices dtoCommentServices)
    {
        this.dtoAccountServices = dtoAccountServices;
        this.dtoCommentServices = dtoCommentServices;
    }
    public DtoRequest ToDto(Request request)
    {
        Account? account = request.Author;
        DtoAccount? dtoAccount = account != null ? dtoAccount = dtoAccountServices.ToDto(account) : null;

        Account? oper = request.Operator;
        DtoAccount? dtoOperator = account != null ? dtoOperator = dtoAccountServices.ToDto(account) : null;

        List<Comment> comments = request.Comments;
        List<DtoComment> dtoComments = comments.Select(comm => dtoCommentServices.ToDto(comm)).ToList();


        return new DtoRequest
        (
            id: request.Id,
            authorId: request.AuthorId,
            author: dtoAccount,
            operatorId: request.OperatorId,
            oper: dtoOperator,
            title: request.Title,
            description: request.Description,
            category: request.Category,
            priority: request.Priority,
            status: request.Status,
            comments: dtoComments,
            createAt: request.CreateAt
        );
    }
}
