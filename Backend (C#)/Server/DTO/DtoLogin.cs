using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTO;
using Server.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Server.DTO
{
    public class DtoLogin
    { 
        public DtoLogin(string email, string password)
        {
            this.Email = email;
            this.Password = password;
        }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }
}

public class DtoLoginResponse
{
    public DtoLoginResponse(DtoAccount dtoAccount, string jwt)
    {
        this.DtoAccount = dtoAccount;
        this.Jwt = jwt;
    }
    public DtoAccount? DtoAccount { get; set; }
    public string Jwt { get; set; } = "";
}

public class LoginService : IDtoLoginService
{
    private readonly AppDbContext db;
    private readonly IPasswordHasher<Account> passwordHasher;
    private readonly IDtoAccountServices dtoAccountServices;

    private readonly IJwtServices jwtServices;

    public LoginService
    (
        AppDbContext db, 
        IPasswordHasher<Account> passwordHasher, 
        IDtoAccountServices dtoAccountServices,
        IJwtServices jwtServices
    )
    {
        this.db = db;
        this.passwordHasher = passwordHasher;
        this.dtoAccountServices = dtoAccountServices;
        this.jwtServices = jwtServices;
    }
    public async Task<DtoLoginResponse?> LoginAsync(DtoLogin login)
    {
        Account? account = await db.Accounts.FirstOrDefaultAsync(acc => acc.Email == login.Email);

        if (account == null) return null;

        PasswordVerificationResult verificationResult =
            passwordHasher.VerifyHashedPassword
            (
                account,
                account.Password,
                login.Password
            );

        if (verificationResult == PasswordVerificationResult.Failed) return null;

        string token = jwtServices.CreateToken(account);
        DtoAccount dtoAccount = dtoAccountServices.ToDto(account);

        return new DtoLoginResponse
            (
                dtoAccount,
                token
            );
    }
}