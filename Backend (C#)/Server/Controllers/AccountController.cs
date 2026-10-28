using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.DTO;
using Server.Models;
using System.Security.Claims;
using Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService accountService;
        private readonly IDtoAccountServices dtoAccountServices;
        private readonly AppDbContext db;

        public AccountController
            (
                IAccountService accountService,
                IDtoAccountServices dtoAccountServices,
                AppDbContext db
            )
        {
            this.accountService = accountService;
            this.dtoAccountServices = dtoAccountServices;
            this.db = db;
        }

        [HttpGet(Name = "GetAccounts")]
        public async Task<List<DtoAccount>> GetAllDtoAccountAync()
        {
            return await accountService.GetAllDtoAccountsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DtoAccount?>> GetAccountAsync(string id)
        {
            DtoAccount? account = await accountService.GetAccountByIdAsync(id);
            if (account == null) return NotFound();
            return Ok(account);
        }

        [HttpPost("register")]
        public async Task<ActionResult> AddAccountAsync(DtoRegistration regAccount)
        {
            bool AddAcc = await accountService.AddAccountAsync(regAccount);
            if (!AddAcc) return BadRequest();
            return Ok();
        }

        [HttpPost("register-operator")]
        public async Task<ActionResult> AddOperatorAsync(DtoOperatorRegistration regOperator)
        {
            bool addOperator = await accountService.AddOperatorAsync(regOperator);
            if (!addOperator) return BadRequest();
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> EditAccountAsync(string id, DtoAccountEdit updateAcc)
        {
            bool accountEdit = await accountService.EditAccountByIdAsync(id, updateAcc);

            if (!accountEdit) return NotFound();

            return Ok();
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<DtoAccount>> GetMe()
        {
            string? accountId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (accountId == null) return Unauthorized();

            Account? acc = await db.Accounts.FirstOrDefaultAsync(acc => acc.Id == accountId);
            if (acc == null) return NotFound();

            DtoAccount dtoAccount = dtoAccountServices.ToDto(acc);

            return Ok(dtoAccount);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAcountAsync(string id)
        {
            bool deleteAcc = await accountService.DeleteAccountByIdAsync(id);
            if (!deleteAcc) return NotFound();
            return Ok();
        }
    }
}
