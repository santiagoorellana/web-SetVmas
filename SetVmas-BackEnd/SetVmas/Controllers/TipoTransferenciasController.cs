using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PagedList.Core;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class TipoTransferenciasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<TipoTransferencia> _tipoTransferenciarepository;

        public TipoTransferenciasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _tipoTransferenciarepository = _unitOfWork.TipoTransferenciaRepository;
        }

        // GET: api/TipoTransferencias
        [HttpGet]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public IEnumerable<TipoTransferencia> GetTipoTransferencia(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<TipoTransferencia> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _tipoTransferenciarepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()) || p.Descripcion.ToLower().Contains(filter.ToLower()))).ToList(); ;
            }
            else
            {
                lista = _tipoTransferenciarepository.List();
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Nombre);

                        }
                        if ("Cantidad".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Cantidad);

                        }
                        else

                        {
                            lista = lista.OrderByDescending(l => l.Descripcion);

                        }

                        break;
                    }

                default:
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Nombre);

                        }
                        if ("Cantidad".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Cantidad);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.Descripcion);

                        }
                        break;

                    }


            }

            return lista.AsQueryable().ToPagedList(pageIndex, pageSize);

        }


        [HttpGet]
        [Route("Documento")]
        [Authorize]//[Authorize(Roles = "Super Administrador, Administrador")]
        public TipoTransferenciasViewModel getValoresDocumento()
        {
            var valores = new TipoTransferenciasViewModel();
            foreach (TipoTransferencia item in _tipoTransferenciarepository.List())
            {
                switch (item.NombreCodigo)
                {
                    default:
                        break;
                    case "BONIF_REGISTRO":
                        valores.bon_registro = item.Cantidad;
                        break;
                    case "2":
                        valores.bon_referido = item.Cantidad;
                        break;
                    case "BONIF_CLASIF":
                        valores.bon_clasificacion = item.Cantidad;
                        break;
                    case "BONIF_VIEW":
                        valores.bon_visualizacion = item.Cantidad;
                        break;
                    case "12":
                        valores.bon_subirclase = item.Cantidad;
                        break;
                    case "BONIF_DENUNCIA":
                        valores.bon_denuncia = item.Cantidad;
                        break;
                }
            }

            return valores;
        }


        // GET: api/TipoTransferencias/Count
        [HttpGet]
        [Route("Count")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public int GetTipoTransferenciaCount()
        {
            return _tipoTransferenciarepository.Queryable().Count();
        }

        // GET: api/TipoTransferencias/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> GetTipoTransferencia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoTransferencia = await _tipoTransferenciarepository.FindAsync(id);

            if (tipoTransferencia == null)
            {
                return NotFound();
            }

            return Ok(tipoTransferencia);
        }
        // GET: api/TipoTransferencias/Codigo/5
        [HttpGet]
        [Route("Codigo/{codigo}")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> GetTipoTransferenciasByCodigo([FromRoute] string codigo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoTransferencia = await _tipoTransferenciarepository.Queryable().Where(x => x.NombreCodigo == codigo).FirstAsync();

            if (tipoTransferencia == null)
            {
                return NotFound();
            }

            return Ok(tipoTransferencia);
        }

        // PUT: api/TipoTransferencias/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PutTipoTransferencia([FromRoute] int id, [FromBody] TipoTransferencia tipoTransferencia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tipoTransferencia.TipoTransferenciaId)
            {
                return BadRequest();
            }

            _tipoTransferenciarepository.Update(tipoTransferencia);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoTransferenciaExists(id))
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

        // POST: api/TipoTransferencias
        [HttpPost]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PostTipoTransferencia([FromBody] TipoTransferencia tipoTransferencia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _tipoTransferenciarepository.Create(tipoTransferencia);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetTipoTransferencia", new { id = tipoTransferencia.TipoTransferenciaId }, tipoTransferencia);
        }

        // DELETE: api/TipoTransferencias/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> DeleteTipoTransferencia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoTransferencia = await _tipoTransferenciarepository.FindAsync(id);
            if (tipoTransferencia == null)
            {
                return NotFound();
            }

            _tipoTransferenciarepository.Delete(tipoTransferencia);
            await _unitOfWork.SaveChangesAsync();

            return Ok(tipoTransferencia);
        }

        private bool TipoTransferenciaExists(int id)
        {
            return _tipoTransferenciarepository.Queryable().Any(e => e.TipoTransferenciaId == id);
        }

    }
}