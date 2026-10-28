using Server.DTO;
using Server.Models;

namespace Server.DTO
{
    public class DtoAccount
    {
        public DtoAccount
        (
            string id,
            string name,
            string email,
            string phone,
            int? age,
            ERole? role,
            ESex? sex
        )
        {
            this.Id = id;
            this.Name = name;
            this.Email = email;
            this.Phone = phone;
            this.Age = age;
            this.Role = role;
            this.Sex = sex;
        }

        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public int? Age { get; set; } 
        public ERole? Role { get; set; }
        public ESex? Sex { get; set; }
        public List<Ticket> Tickets { get; set; } = new();
    }
}

public class DtoAccountEdit
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public int? Age { get; set; }
    public ESex? Sex { get; set; }
}

public class DtoAccountServices : IDtoAccountServices
{
    public DtoAccount ToDto(Account account)
    {
        return new DtoAccount
            (
                id: account.Id,
                name: account.Name,
                email: account.Email,
                phone: account.Phone,
                age: account.Age,
                role: account.Role,
                sex: account.Sex
            );
    }
}
