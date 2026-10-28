using Microsoft.AspNetCore.Mvc;
using Server.DTO;
using Microsoft.AspNetCore.Authorization;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestService serviceRequest;
        public RequestsController(IRequestService serviceRequest)
        {
            this.serviceRequest = serviceRequest;
        }

        [HttpGet(Name = "GetRequests")]
        public async Task<List<DtoRequest>> GetAll()
        {
            return await serviceRequest.GetAllRequest();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DtoRequest>> GetById(string id)
        {
            DtoRequest? request = await serviceRequest.GetRequestById(id);

            if (request == null) return NotFound();

            return Ok(request);
        }

        [HttpPost(Name = "AddRequest")]
        public async Task<ActionResult> AddRequest(DtoCreateRequest request)
        {
            bool add = await serviceRequest.AddRequest(request);
            if (!add) return NotFound();
            return Ok(add);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRequest(string id, Request updateRequest)
        {
            bool requestUp = await serviceRequest.UpdateRequest(id, updateRequest);
            if (!requestUp) return NotFound();
            return Ok();
        }

        [HttpPut("{id}/{status}")]

        public async Task<ActionResult> UpdateStatus(string id, EStatus status)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest();
            bool statusUp = await serviceRequest.UpdateStatusRequest(id, status);
            if (!statusUp) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRequest(string id)
        {
            bool deleted = await serviceRequest.DeleteRequestById(id);

            if (!deleted) return NotFound();

            return Ok();
        }
    }
}

