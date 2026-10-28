using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.DTO;
using Server.Models;
using Server.Hubs;

namespace Server.Models
{
    public class Comment
    {
        public Comment
        (
            string id,
            string text,
            string authorId,
            string requestId,
            string createAt
        )
        {
            this.Id = id;
            this.Text = text;
            this.AuthorId = authorId;
            this.RequestId = requestId;
            this.CreateAt = createAt;
        }

        public string Id { get; set; } = "";
        public string Text { get; set; } = "";
        public string AuthorId { get; set; } = "";
        public Account? Author { get; set; }
        public string RequestId { get; set; } = "";
        public Request? Request { get; set; }
        public string CreateAt { get; set; } = "";
    }
}

public class CommentService : ICommentService
{
    private readonly AppDbContext db;
    private readonly IHubContext<UpdateHubs> hubContext;
    private readonly IDtoCommentServices dtoCommentServices;

    public CommentService
    (
        AppDbContext db,
        IHubContext<UpdateHubs> hubContext,
        IDtoCommentServices dtoCommentServices
    )
    {
        this.db = db;
        this.hubContext = hubContext;
        this.dtoCommentServices = dtoCommentServices;
    }
    public async Task<bool> AddCommentAsync(DtoCommentCreate? dtoCommentCreate)
    {
        if (dtoCommentCreate == null) return false;

        bool authorExists = await db.Accounts.AnyAsync(acc => acc.Id == dtoCommentCreate.AuthorId);
        bool requestExists = await db.Requests.AnyAsync(req => req.Id == dtoCommentCreate.RequestId);

        if (!authorExists || !requestExists) return false;

        int numId = 1;

        while (await db.Comments.AnyAsync(tick => tick.Id == $"com-{dtoCommentCreate.AuthorId}-{numId}")) numId++;

        string id = $"com-{dtoCommentCreate.AuthorId}-{numId}";

        Comment comment = new Comment
            (
                id: id,
                text: dtoCommentCreate.Text,
                authorId: dtoCommentCreate.AuthorId,
                requestId: dtoCommentCreate.RequestId,
                createAt: DateTime.Now.ToString()
            );

        await db.Comments.AddAsync(comment);
        await db.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("DataUpdate");

        return true;
    }
    public async Task<List<DtoComment>> GetCommentsAllAsync()
    {
        List<Comment> comments = await db.Comments
            .Include(comm => comm.Author)
            .ToListAsync();
        return comments.Select(comm => dtoCommentServices.ToDto(comm)).ToList();
    }
    public async Task<Comment?> GetCommentByIdAsync(string id)
    {
        return await db.Comments.FirstOrDefaultAsync(comment => comment.Id == id);
    }
    public async Task<bool> EditCommentAsync(string id, Comment? upComment)
    {
        Comment? comment = await GetCommentByIdAsync(id);

        if (comment == null || upComment == null) return false;

        comment.Text = upComment.Text;
        comment.CreateAt = upComment.CreateAt;
        await db.SaveChangesAsync();

        return true;
    }
}
