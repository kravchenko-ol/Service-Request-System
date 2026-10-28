using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.DTO;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService commentService;
        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        [HttpGet(Name = "GetComments")]
        public async Task<List<DtoComment>> GetAllCommentAsync()
        {
            return await commentService.GetCommentsAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetByIdCommentAsync(string id)
        {
            Comment? comment = await commentService.GetCommentByIdAsync(id);
            if (comment == null) return NotFound();

            return Ok(comment);
        }

        [HttpPost(Name = "AddComments")]
        public async Task<ActionResult> AddComment(DtoCommentCreate dtoCommentCreate)
        {
            bool add = await commentService.AddCommentAsync(dtoCommentCreate);
            if (!add) return NotFound();
            return Ok(add);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditCommentAsync(string id, Comment commentUp)
        {
            bool edit = await commentService.EditCommentAsync(id, commentUp);
            if (!edit) return NotFound();
            return Ok(edit);
        }
    }
}
