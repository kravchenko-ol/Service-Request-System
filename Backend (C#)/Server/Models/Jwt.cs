using Server.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Server.Models
{
    public class Jwt
    {
        public Jwt(Account account, string token)
        {
            this.Account = account;
            this.Toket = token;
        }
        public Account? Account { get; set; }
        public string Toket { get; set; } = "";
    }
}

public class JwtServices : IJwtServices
{
    private readonly IConfiguration configuration;

    public JwtServices(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    public string CreateToken(Account account)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id),
            new Claim(ClaimTypes.Role, account.Role.ToString())
        };

        string key = configuration["Jwt:Key"] 
            ?? throw new Exception("Jwt:Key not found");

        byte[] keyBytes = Encoding.UTF8.GetBytes(key);

        SymmetricSecurityKey securityKey  = new SymmetricSecurityKey(keyBytes);

        SigningCredentials credentials = new SigningCredentials
            (
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

        DateTime expires = DateTime.UtcNow.AddHours(2);

        JwtSecurityToken token = new JwtSecurityToken
            (
                claims: claims,
                expires: expires,
                signingCredentials: credentials
            );

        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

        string tokenString = handler.WriteToken(token);

        return tokenString;
    }
}
