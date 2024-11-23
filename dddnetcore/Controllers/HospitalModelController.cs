
using DDDSample1.Domain.Hospital;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace dddnetcore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalModelController : ControllerBase
    {
        private readonly HospitalModelService _hospitalModelService;

        public HospitalModelController(HospitalModelService hospitalModelService)
        {
            _hospitalModelService = hospitalModelService;
        }

        //GET: api/hospitalModel
        [HttpGet]
        public async Task<IActionResult> GetHospitalMap()
        {
            var map = await _hospitalModelService.GetHospitalMap();
            return Ok(map);
        }

}
}