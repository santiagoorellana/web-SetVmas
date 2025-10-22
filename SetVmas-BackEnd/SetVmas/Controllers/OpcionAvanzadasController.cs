using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OpcionAvanzadasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<OpcionAvanzadas> _opcionesAvanzadasrepository;

        public OpcionAvanzadasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _opcionesAvanzadasrepository = _unitOfWork.OpcionAvanzadasRepository;
        }

        // GET: api/OpcionAvanzadas
        [HttpGet]
        public IEnumerable<OpcionAvanzadas> GetOpcionAvanzadas()
        {
            return _opcionesAvanzadasrepository.Queryable().Include(x => x.TipoOpcion);
        }

        // GET: api/OpcionAvanzadas/Tipo/tipo
        [HttpGet]
        [Route("Tipo/{tipo}")]
        public IEnumerable<OpcionAvanzadas> GetOpcionAvanzadasTipo([FromRoute] string tipo)
        {
            if (tipo == "Banner superior")
            {
                return _opcionesAvanzadasrepository.Queryable().Include(x => x.TipoOpcion).Where(x => x.TipoOpcion.Nombre == "Banner superior").ToList();
            }
            return _opcionesAvanzadasrepository.List();
        }

        // GET: api/OpcionAvanzadas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOpcionAvanzada([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //  var opcionAvanzada = await _context.OpcionAvanzadas.FindAsync(id);
            var opcionAvanzada = await _opcionesAvanzadasrepository.Queryable().Include(x => x.TipoOpcion).Where(x => x.OpcionAvanzadaId == id).FirstAsync();

            if (opcionAvanzada == null)
            {
                return NotFound();
            }

            return Ok(opcionAvanzada);
        }

        // PUT: api/OpcionAvanzadas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOpcionAvanzada([FromRoute] int id, [FromBody] OpcionAvanzadas opcionAvanzada)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != opcionAvanzada.OpcionAvanzadaId)
            {
                return BadRequest();
            }

            _opcionesAvanzadasrepository.Update(opcionAvanzada);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpcionAvanzadaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OpcionAvanzadas
        [HttpPost]
        public async Task<IActionResult> PostOpcionAvanzada([FromBody] OpcionAvanzadas opcionAvanzada)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _opcionesAvanzadasrepository.Create(opcionAvanzada);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetOpcionAvanzada", new { id = opcionAvanzada.OpcionAvanzadaId }, opcionAvanzada);
        }

        // DELETE: api/OpcionAvanzadas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOpcionAvanzada([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var opcionAvanzada = await _opcionesAvanzadasrepository.FindAsync(id);
            if (opcionAvanzada == null)
            {
                return NotFound();
            }

            _opcionesAvanzadasrepository.Delete(opcionAvanzada);
            await _unitOfWork.SaveChangesAsync();

            return Ok(opcionAvanzada);
        }

        private bool OpcionAvanzadaExists(int id)
        {
            return _opcionesAvanzadasrepository.Queryable().Any(e => e.OpcionAvanzadaId == id);
        }

    }
}