using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Authentication
{
    public class AuthenticationService: ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AuthenticationService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> GetToken(string auth0domain,string auth0audience, string auth0clientId, string auth0clientSecret)
        {
            var tokenEndpoint = $"https://{auth0domain}/oauth/token";

            var requestBody = new StringContent(JsonConvert.SerializeObject(new{client_id = auth0clientId,client_secret = auth0clientSecret,audience=auth0clientSecret,grant_type = "client_credentials"
            }), Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(tokenEndpoint, requestBody);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            dynamic tokenResponse = JsonConvert.DeserializeObject(content);
            return tokenResponse.access_token;
        }
    }
}