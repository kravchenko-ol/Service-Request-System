using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.DTO;
using Server.Models;
using Server.Hubs;

namespace Server.Models
{
    public class Account
    {
        public Account
        (
            string id,
            string name,
            string email,
            string phone,
            int? age,
            ESex? sex,
            ERole role,
            string password
        )
        {
            this.Id = id;
            this.Name = name;
            this.Email = email;
            this.Phone = phone;
            this.Age = age;
            this.Sex = sex;
            this.Role = role;
            this.Password = password;
        }
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public int? Age { get; set; }
        public ESex? Sex { get; set; }
        public ERole Role { get; set; }
        public string Password { get; set; } = "";
        public List<Ticket> Tickets { get; set; } = new();
    }
}

public class AccountService: IAccountService
{
    private readonly AppDbContext db;
    private readonly IHubContext<UpdateHubs> hubContext;
    private readonly IDtoAccountServices dtoAccountServices;
    private readonly IPasswordHasher<Account> passwordHasher;

    public AccountService
    (
        AppDbContext db,
        IHubContext<UpdateHubs> hubContext,
        IDtoAccountServices dtoAccountServices,
        IPasswordHasher<Account> passwordHasher
    )
    {
        this.db = db;
        this.hubContext = hubContext;
        this.dtoAccountServices = dtoAccountServices;
        this.passwordHasher = passwordHasher;
    }

    public async Task<bool> AddAccountAsync(DtoRegistration regAccount)
    {
        bool takeEmail = await db.Accounts.AnyAsync(acc => acc.Email == regAccount.Email);
        if (takeEmail) return false;

        bool checkPass = regAccount.Password == regAccount.RepeatPassword;
        if (!checkPass) return false;

        int numId = 1;

        while (await db.Accounts.AnyAsync(acc => acc.Id == $"user-{numId}")) numId++;

        string id = $"user-{numId}";

        Account account = new Account
            (
                id: id,
                name: regAccount.Name,
                email: regAccount.Email,
                phone: regAccount.Phone,
                age: regAccount.Age,
                sex: regAccount.Sex,
                role: ERole.User,
                password: ""
            );

        string hashPassword = passwordHasher.HashPassword(account, regAccount.Password);

        account.Password = hashPassword;

        await db.Accounts.AddAsync(account);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddOperatorAsync(DtoOperatorRegistration regOperator)
    {
        bool corectId = regOperator.Id.StartsWith("op-");
        if (!corectId) return false;

        bool takeEmailId = await db.Accounts
            .AnyAsync(acc => acc.Email == regOperator.Email || acc.Id == regOperator.Id);
        if (takeEmailId) return false;

        bool hasUperCase = regOperator.Password.Any(symbol => char.IsUpper(symbol));
        bool hasSpecialSymbol = regOperator.Password.Any(symbol => !char.IsLetterOrDigit(symbol));
        if (!hasUperCase || !hasSpecialSymbol) return false;

        Account account = new Account
            (
                id: regOperator.Id,
                name: regOperator.Name,
                email: regOperator.Email,
                phone: regOperator.Phone,
                age: null,
                sex: null,
                role: ERole.Operator,
                password: ""
            );

        string hashPass = passwordHasher.HashPassword(account, regOperator.Password);
        account.Password = hashPass;

        Ticket ticket = new Ticket
            (
                id: $"ticket-{account.Id}-1",
                operatorId: account.Id,
                name: "New",
                position: 0
            );

        await db.Tickets.AddAsync(ticket);
        await db.Accounts.AddAsync(account);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<List<DtoAccount>> GetAllDtoAccountsAsync()
    {
        List<Account> accounts = await db.Accounts.ToListAsync();
        return accounts.Select(acc => dtoAccountServices.ToDto(acc)).ToList();
    }

    public async Task<DtoAccount?> GetAccountByIdAsync(string id)
    {
        Account? account = await db.Accounts.FirstOrDefaultAsync(acc => acc.Id == id);
        if (account == null) return null;

        return dtoAccountServices.ToDto(account);
    }

    public async Task<bool> EditAccountByIdAsync(string id, DtoAccountEdit? updateAcc)
    {
        if (updateAcc == null) return false;

        Account? account = await db.Accounts.FirstOrDefaultAsync(acc => acc.Id == id);

        if (account == null) return false;

        if (updateAcc.Name != "") account.Name = updateAcc.Name;
        if (updateAcc.Email != "") account.Email = updateAcc.Email;
        if (updateAcc.Phone != "") account.Phone = updateAcc.Phone;
        if (updateAcc.Age >= 18) account.Age = updateAcc.Age;
        if (updateAcc.Sex != null) account.Sex = updateAcc.Sex;

        await db.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("DataUpdate");

        return true;
    }

    public async Task<bool> DeleteAccountByIdAsync(string id)
    {
        Account? account = await db.Accounts.FirstOrDefaultAsync(acc => acc.Id == id);

        if (account == null) return false;

        db.Accounts.Remove(account);

        await db.SaveChangesAsync();

        return true;
    }
}
