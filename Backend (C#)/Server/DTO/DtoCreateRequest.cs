using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class DtoCreateRequest
    {
        public string AuthorId { get; set; } = "";
        public DtoAccount? Author { get; set; }
        public string OperatorId { get; set; } = "";
        public DtoAccount? Operator { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public ECategory Category { get; set; }
        public EPriority Priority { get; set; }
        public EStatus Status { get; set; }
        public List<DtoComment> Comments { get; set; } = new();
    }
}
