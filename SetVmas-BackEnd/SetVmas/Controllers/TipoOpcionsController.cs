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
   
    public class TipoOpcionsController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<TipoOpciones> _tipoOpcionrepository;

        public TipoOpcionsController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _tipoOpcionrepository = _unitOfWork.TipoOpcionesRepository;
        }

        // GET: api/TipoOpcions
        [HttpGet]
        public List<TipoOpciones> GetTipoOpciones(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            List<TipoOpciones> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _tipoOpcionrepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower())) || (p.TextoLabel.ToLower().Contains(filter.ToLower())))
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _tipoOpcionrepository.Queryable().ToPagedList(pageIndex, pageSize).ToList();
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Nombre).ToList();

                        }
                        else
                        if ("TextoLabel".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.TextoLabel).ToList();

                        }
                        else
                        if ("MinimoComprar".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.MinimoComprar).ToList();

                        }
                        else
                        if ("CantidadFrecuencia".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.CantidadFrecuencia).ToList();

                        }
                        else
                        if ("Precio".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }
                        else
                        if ("NombreCodigo".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }

                        break;
                    }

                default:
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Nombre).ToList();

                        }
                        else
                       if ("TextoLabel".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.TextoLabel).ToList();

                        }
                        else
                       if ("MinimoComprar".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.MinimoComprar).ToList();

                        }
                        else
                       if ("CantidadFrecuencia".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.CantidadFrecuencia).ToList();

                        }
                        else
                       if ("Precio".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Precio).ToList();

                        }
                        else
                        if ("NombreCodigo".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }

                        break;

                    }


            }
            /** Ordenando Auto renovables**/
            TipoOpciones to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_TOP");
            if(to!= null)
            {
                lista.Remove(to);
                lista.Add(to);
            }
            

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_30");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_1");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_3");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_6");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_24");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }




            return lista;
        }


        // GET: api/TipoOpcions/AdminAnu
        [Route("AdminAnu")]
        [HttpGet]
        public List<TipoOpciones> GetTipoOpcionesAdmin(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            List<TipoOpciones> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _tipoOpcionrepository.Queryable().Where(p => (p.NombreCodigo.ToLower().Contains(filter.ToLower())) || (p.TextoLabel.ToLower().Contains(filter.ToLower())))
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _tipoOpcionrepository.Queryable().ToPagedList(pageIndex, pageSize).ToList();
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Nombre).ToList();

                        }
                        else
                        if ("TextoLabel".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.TextoLabel).ToList();

                        }
                        else
                        if ("MinimoComprar".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.MinimoComprar).ToList();

                        }
                        else
                        if ("CantidadFrecuencia".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.CantidadFrecuencia).ToList();

                        }
                        else
                        if ("Precio".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }
                        else
                        if ("NombreCodigo".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }

                        break;
                    }

                default:
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Nombre).ToList();

                        }
                        else
                       if ("TextoLabel".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.TextoLabel).ToList();

                        }
                        else
                       if ("MinimoComprar".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.MinimoComprar).ToList();

                        }
                        else
                       if ("CantidadFrecuencia".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.CantidadFrecuencia).ToList();

                        }
                        else
                       if ("Precio".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Precio).ToList();

                        }
                        else
                        if ("NombreCodigo".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Precio).ToList();

                        }

                        break;

                    }


            }
            /** Ordenando Auto renovables**/
            TipoOpciones to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_TOP");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }


            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_30");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_1");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_3");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_6");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }

            to = new TipoOpciones();
            to = lista.SingleOrDefault(x => x.NombreCodigo == "AUTO_24");
            if (to != null)
            {
                lista.Remove(to);
                lista.Add(to);
            }




            return lista;
        }

        // GET: api/TipoOpcions/Count
        [Route("Count")]
        [HttpGet]
        public int GetTipoOpcionesCount()
        {
            return _tipoOpcionrepository.Queryable().Count();
        }

        // GET: api/TipoOpcions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTipoOpcion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoOpcion = await _tipoOpcionrepository.FindAsync(id);

            if (tipoOpcion == null)
            {
                return NotFound();
            }

            return Ok(tipoOpcion);
        }

        // GET: api/TipoOpcions/Codigo/5
        [HttpGet]
        [Route("Codigo/{codigo}")]
        public async Task<IActionResult> GetTipoOpcionByCodigo([FromRoute] string codigo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoOpcion = await _tipoOpcionrepository.Queryable().Where(x => x.NombreCodigo == codigo).FirstAsync();

            if (tipoOpcion == null)
            {
                return NotFound();
            }

            return Ok(tipoOpcion);
        }


        // PUT: api/TipoOpcions/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoOpcion([FromRoute] int id, [FromBody] TipoOpciones tipoOpcion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tipoOpcion.TipoOpcionId)
            {
                return BadRequest();
            }

            _tipoOpcionrepository.Update(tipoOpcion);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoOpcionExists(id))
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

        // POST: api/TipoOpcions
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPost]
        public async Task<IActionResult> PostTipoOpcion([FromBody] TipoOpciones tipoOpcion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _tipoOpcionrepository.Create(tipoOpcion);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetTipoOpcion", new { id = tipoOpcion.TipoOpcionId }, tipoOpcion);
        }

        // DELETE: api/TipoOpcions/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoOpcion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoOpcion = await _tipoOpcionrepository.FindAsync(id);
            if (tipoOpcion == null)
            {
                return NotFound();
            }

            _tipoOpcionrepository.Delete(tipoOpcion);
            await _unitOfWork.SaveChangesAsync();

            return Ok(tipoOpcion);
        }

        private bool TipoOpcionExists(int id)
        {
            return _tipoOpcionrepository.Queryable().Any(e => e.TipoOpcionId == id);
        }

    }
}