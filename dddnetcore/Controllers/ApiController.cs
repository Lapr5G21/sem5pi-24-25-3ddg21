using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using DDDSample1.Domain.Authentication;

namespace DDDSample1.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {

        private readonly AuthenticationService _authenticationService;

        public ApiController(AuthenticationService authenticationService)
        {
           
            _authenticationService=authenticationService;
        }
        [HttpGet("private")]
        [Authorize]
        public IActionResult Private()
        {
            return Ok(new
            {
                Message = "Hello from a private endpoint!"
            });
        }

        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok(new
            {
                Message = "Hello from a public endpoint!"
            });
        }

        [HttpGet("private-scoped")]
        [Authorize("read:messages")]
        public IActionResult Scoped()
        {
            return Ok(new
            {
                Message = "Hello from a private-scoped endpoint!"
            });
        }

        // Método para obter o token da API Auth0
        public async Task<string> GetToken(string auth0domain, string auth0audience, string auth0clientId, string auth0clientSecret)
        {
          return await _authenticationService.GetToken(auth0domain,auth0audience,auth0clientId,auth0clientSecret);
             
        }

        // Novo endpoint para obter o token
        [HttpGet("get-token")]
        public async Task<IActionResult> RetrieveToken()
        {
            string auth0Domain = "dev-teie1lfprp6bjr5x.us.auth0.com";
            string auth0Audience = "https://dev-teie1lfprp6bjr5x.us.auth0.com/api/v2/";
            string auth0ClientId = "aDC2jQ3ep5kyOVjUWLvbgVmFt7P5Nyco";
            string auth0ClientSecret = "xzmQIQnCLVLgKjPy7vEUbTWSo-7ErobDvt-l7gWrc9Gx0n3MOpmHJ6oGqZdqL8eo";

            var token = await GetToken(auth0Domain, auth0Audience, auth0ClientId, auth0ClientSecret);
            return Ok(new
            {
                Token = token
            });
        }
    }
}
