
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

        //GET: api/hospital
        [HttpGet]
        public async Task<IActionResult> GetHospitalMap()
        {
            var map = await _hospitalModelService.GetHospitalMap();
            return Ok(map);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _hospitalModelService.GetHospitalMap();
            return Ok(result);
        }

}
}