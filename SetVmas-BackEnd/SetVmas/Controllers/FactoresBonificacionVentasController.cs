using System;
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
    public class FactoresBonificacionVentasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<FactoresBonificacionVentas> _factoresBVrepository;

        public FactoresBonificacionVentasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _factoresBVrepository = _unitOfWork.FactoresBonificacionVentasRepository;
        }

        // GET: api/FactoresBonificacionVentas
        [HttpGet]
        public IEnumerable<FactoresBonificacionVentas> GetFactoresBonificacionVentas()
        {
            return _factoresBVrepository.List();
        }


        [Route("Documento")]
        [HttpGet]
        public IEnumerable<FactoresBonificacionVentasViewModel> getFactoresDocumento()
        {
            var nombres = new Dictionary<int, string> {
                {0,"Primer Anfitrión"},{1,"Segundo Anfitrión"},
                {2,"Tercer Anfitrión"}, {3,"Cuarto Anfitrión"},
                {4,"Quinto Anfitrión"}, {5,"Sexto Anfitrión"},
                {6,"Séptimo Anfitrión"}, {7,"Octavo Anfitrión"},
                {8,"Noveno Anfitrión"}, {9,"Décimo Anfitrión"}
        };

            var lista = new List<FactoresBonificacionVentasViewModel>();
            var factores = _factoresBVrepository.Queryable().Where(x => x.FactoresBonificacionVentasId != 1);
            int ind = 0;
            foreach (var factor in factores)
            {
                lista.Add(new FactoresBonificacionVentasViewModel(nombres.GetValueOrDefault(ind), Math.Round(factor.ClaseDiamante,4), Math.Round(factor.ClaseOro,4), Math.Round(factor.ClasePlata,2), Math.Round(factor.ClaseBronce,4), Math.Round(factor.ClaseIniciada,4)));
                ind++;
            }
            return lista;
        }

        // GET: api/FactoresBonificacionVentas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFactoresBonificacionVentas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var factoresBonificacionVentas = await _factoresBVrepository.FindAsync(id);

            if (factoresBonificacionVentas == null)
            {
                return NotFound();
            }

            return Ok(factoresBonificacionVentas);
        }

        // PUT: api/FactoresBonificacionVentas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactoresBonificacionVentas([FromRoute] int id, [FromBody] FactoresBonificacionVentas factoresBonificacionVentas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != factoresBonificacionVentas.FactoresBonificacionVentasId)
            {
                return BadRequest();
            }

            _factoresBVrepository.Update(factoresBonificacionVentas);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FactoresBonificacionVentasExists(id))
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

        // POST: api/FactoresBonificacionVentas
        [HttpPost]
        public async Task<IActionResult> PostFactoresBonificacionVentas([FromBody] FactoresBonificacionVentas factoresBonificacionVentas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _factoresBVrepository.Create(factoresBonificacionVentas);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetFactoresBonificacionVentas", new { id = factoresBonificacionVentas.FactoresBonificacionVentasId }, factoresBonificacionVentas);
        }

        // DELETE: api/FactoresBonificacionVentas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactoresBonificacionVentas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var factoresBonificacionVentas = await _factoresBVrepository.FindAsync(id);
            if (factoresBonificacionVentas == null)
            {
                return NotFound();
            }

            _factoresBVrepository.Delete(factoresBonificacionVentas);
            await _unitOfWork.SaveChangesAsync();

            return Ok(factoresBonificacionVentas);
        }

        private bool FactoresBonificacionVentasExists(int id)
        {
            return _factoresBVrepository.Queryable().Any(e => e.FactoresBonificacionVentasId == id);
        }


    }
}