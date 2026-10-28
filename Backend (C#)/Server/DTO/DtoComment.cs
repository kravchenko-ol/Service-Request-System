using Server.DTO;
using Server.Models;

namespace Server.DTO
{
    public class DtoComment
    {
        public DtoComment
        (
            string id,
            string text,
            string authorId,
            DtoAccount dtoAuthor,
            string requestId,
            string createAt
        )
        {
            this.Id = id;
            this.Text = text;
            this.AuthorId = authorId;
            this.Author = dtoAuthor;
            this.RequestId = requestId;
            this.CreateAt = createAt;
        }

        public string Id { get; set; } = "";
        public string Text { get; set; } = "";
        public string AuthorId { get; set; } = "";
        public DtoAccount? Author { get; set; }
        public string RequestId { get; set; } = "";
        public Request? Request { get; set; }
        public string CreateAt { get; set; } = "";
    }
}

public class DtoCommentCreate
{
    public string Text { get; set; } = "";
    public string AuthorId { get; set; } = "";
    public string RequestId { get; set; } = "";
}

public class DtoCommentService : IDtoCommentServices
{
    private readonly IDtoAccountServices dtoAccountServices;

    public DtoCommentService(IDtoAccountServices dtoAccountServices)
    {
        this.dtoAccountServices = dtoAccountServices;
    }

    public DtoComment? ToDto(Comment comment)
    {
        Account? author = comment.Author;

        DtoAccount? dtoAuthor = author != null ? dtoAccountServices.ToDto(author) : null;
        if (dtoAuthor == null) return null;

        return new DtoComment
            (
                id: comment.Id,
                text: comment.Text,
                authorId: comment.AuthorId,
                dtoAuthor: dtoAuthor,
                requestId: comment.RequestId,
                createAt: comment.CreateAt
            );
    }
}
