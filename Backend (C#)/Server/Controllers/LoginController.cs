using Microsoft.AspNetCore.Mvc;
using Server.DTO;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IDtoLoginService loginService;

        public LoginController (IDtoLoginService loginService)
        {
            this.loginService = loginService;
        }

        [HttpPost]
        public async Task<ActionResult<DtoAccount>> LoginAsync(DtoLogin login)
        {
            DtoLoginResponse? acc = await loginService.LoginAsync(login);

            if (acc == null) return Unauthorized();

            return Ok(acc);
        }
    }
}
