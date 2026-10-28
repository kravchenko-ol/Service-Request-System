using System.ComponentModel.DataAnnotations;
namespace Server.DTO
{
    public class DtoRegistration
    {
        [Required]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [Phone]
        public string Phone { get; set; } = "";

        [Required]
        [Range(18, 100)]
        public int Age { get; set; } = 0;

        [Required]
        public ESex Sex { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";

        [Required]
        [MinLength(8)]
        public string RepeatPassword { get; set; } = "";
    }
}
