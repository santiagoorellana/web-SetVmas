using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PagedList.Core;
using SetVmas.utils;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class PaginasEstaticasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<PaginasEstaticas> _paginasEstaticasrepository;

        public PaginasEstaticasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _paginasEstaticasrepository = _unitOfWork.PaginasEstaticasRepository;
        }

        // GET: api/PaginasEstaticas
        [HttpGet]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public IEnumerable<PaginasEstaticas> GetPaginasEstaticas(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<PaginasEstaticas> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _paginasEstaticasrepository.Queryable().Where(p => (p.Titulo.ToLower().Contains(filter.ToLower()) || p.Contenido.ToLower().Contains(filter.ToLower()))).ToList(); ;
            }
            else
            {
                lista = _paginasEstaticasrepository.List();
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Titulo".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Titulo);

                        }
                        else
                        {
                            lista = lista.OrderByDescending(l => l.Contenido);

                        }
                        break;
                    }

                default:
                    {
                        if ("Titulo".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Titulo);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.Contenido);

                        }

                    }

                    break;
            }

            return lista.AsQueryable().ToPagedList(pageIndex, pageSize);
        }

        // GET: api/PaginasEstaticas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaginasEstaticas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paginasEstaticas = await _paginasEstaticasrepository.FindAsync(id);

            if (paginasEstaticas == null)
            {
                return NotFound();
            }

            return Ok(paginasEstaticas);
        }

        // PUT: api/PaginasEstaticas/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PutPaginasEstaticas([FromRoute] int id, [FromBody] PaginasEstaticas paginasEstaticas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != paginasEstaticas.PaginasEstaticasId)
            {
                return BadRequest();
            }

            _paginasEstaticasrepository.Update(paginasEstaticas);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaginasEstaticasExists(id))
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

        // POST: api/PaginasEstaticas
        [HttpPost]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PostPaginasEstaticas([FromBody] PaginasEstaticas paginasEstaticas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _paginasEstaticasrepository.Create(paginasEstaticas);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetPaginasEstaticas", new { id = paginasEstaticas.PaginasEstaticasId }, paginasEstaticas);
        }

        // DELETE: api/PaginasEstaticas/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> DeletePaginasEstaticas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paginasEstaticas = await _paginasEstaticasrepository.FindAsync(id);
            if (paginasEstaticas == null)
            {
                return NotFound();
            }

            _paginasEstaticasrepository.Delete(paginasEstaticas);
            await _unitOfWork.SaveChangesAsync();

            return Ok(paginasEstaticas);
        }

        [Authorize(Roles = "Super Administrador, Administrador")]
        private bool PaginasEstaticasExists(int id)
        {
            return _paginasEstaticasrepository.Queryable().Any(e => e.PaginasEstaticasId == id);
        }

        // GET: api/PaginasEstaticas/Count
        [HttpGet]
        [Route("Count")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public int GetPaginasEstaticasCount()
        {
            return _paginasEstaticasrepository.Queryable().Count();
        }

        // GET: api/PaginasEstaticas/Correo
        [HttpGet]
        [Route("Correo")]
        public IActionResult GetPaginasEstaticasCorreo(string nombre, string correo, string asunto, string mensaje, string captcha)
        {
            mensaje=mensaje + "<br><br>Correo: " +correo;

            if (!Tools.VerificarCaptcha(captcha))
                return NotFound(new ValidationResult("Ha ocurrido un error al verificar su captcha."));
            else { 
            if (Tools.EnviarCorreo(getFromMail(), getFromMail(), asunto, mensaje, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem()))
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
        }

    }
}