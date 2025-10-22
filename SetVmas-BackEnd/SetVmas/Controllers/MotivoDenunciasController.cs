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
    
    public class MotivoDenunciasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<MotivoDenuncia> _motivoDenunciarepository;

        public MotivoDenunciasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _motivoDenunciarepository = _unitOfWork.MotivoDenunciaRepository;
        }

        // GET: api/MotivoDenuncias
        [HttpGet]
        public IEnumerable<MotivoDenuncia> GetMotivoDenuncia(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<MotivoDenuncia> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _motivoDenunciarepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).ToList(); ;
            }
            else
            {
                lista = _motivoDenunciarepository.List();
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Nombre);

                        }
                        else

                        {
                            lista = lista.OrderByDescending(l => l.Estado);

                        }

                        break;
                    }

                default:
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Nombre);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.Estado);

                        }
                        break;

                    }

            }

            return lista.AsQueryable().ToPagedList(pageIndex, pageSize);

        }

        // GET: api/MotivoDenuncias/Count
        [HttpGet]
        [Route("Count")]
        public int GetMotivoDenunciaCount()
        {
            return _motivoDenunciarepository.Queryable().Count();
        }

        // GET: api/MotivoDenuncias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMotivoDenuncia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var motivoDenuncia = await _motivoDenunciarepository.FindAsync(id);

            if (motivoDenuncia == null)
            {
                return NotFound();
            }

            return Ok(motivoDenuncia);
        }

        // PUT: api/MotivoDenuncias/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMotivoDenuncia([FromRoute] int id, [FromBody] MotivoDenuncia motivoDenuncia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != motivoDenuncia.MotivoDenunciaId)
            {
                return BadRequest();
            }

            _motivoDenunciarepository.Update(motivoDenuncia);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MotivoDenunciaExists(id))
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

        // POST: api/MotivoDenuncias
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPost]
        public async Task<IActionResult> PostMotivoDenuncia([FromBody] MotivoDenuncia motivoDenuncia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _motivoDenunciarepository.Create(motivoDenuncia);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetMotivoDenuncia", new { id = motivoDenuncia.MotivoDenunciaId }, motivoDenuncia);
        }

        // DELETE: api/MotivoDenuncias/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMotivoDenuncia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var motivoDenuncia = await _motivoDenunciarepository.FindAsync(id);
            if (motivoDenuncia == null)
            {
                return NotFound();
            }

            _motivoDenunciarepository.Delete(motivoDenuncia);
            await _unitOfWork.SaveChangesAsync();

            return Ok(motivoDenuncia);
        }

        private bool MotivoDenunciaExists(int id)
        {
            return _motivoDenunciarepository.Queryable().Any(e => e.MotivoDenunciaId == id);
        }
    }
}