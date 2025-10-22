using System;
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
    public class VariableConfiguracionsController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<VariableConfiguracion> _configrepository;

        public VariableConfiguracionsController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _configrepository = _unitOfWork.VariableConfiguracionRepository;
        }

        // GET: api/VariableConfiguracions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVariableConfiguracion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var variableConfiguracion = await _configrepository.FindAsync(id);

            if (variableConfiguracion == null)
            {
                return NotFound();
            }

            return Ok(variableConfiguracion);
        }

        // GET: api/VariableConfiguracions/Codigo/5
        [HttpGet]
        [Route("Codigo/{codigo}")]
        public async Task<IActionResult> GetVariableConfiguracionCodigo([FromRoute] string codigo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var variableConfiguracion = await _configrepository.Queryable().Where(x => x.NombreCodigo == codigo).FirstAsync();

            if (variableConfiguracion == null)
            {
                return NotFound();
            }

            return Ok(variableConfiguracion);
        }


        // GET: api/VariableConfiguracions
        [HttpGet]
        public IEnumerable<VariableConfiguracion> GetVariableConfiguracion(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<VariableConfiguracion> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _configrepository.Queryable().Where(p => p.Nombre.Contains(filter.ToLower()) || p.Valor.Contains(filter.ToLower()))
                    //.Include(tt=> tt.TipoTransferencia)
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _configrepository.Queryable().Where(x => x.Tipo == "General").ToPagedList(pageIndex, pageSize).ToList();
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
                            lista = lista.OrderByDescending(l => l.Valor);

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
                            lista = lista.OrderBy(l => l.Valor);

                        }
                        break;

                    }
            }
            return lista;
        }

        // PUT: api/VariableConfiguracions/5
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVariableConfiguracion([FromRoute] int id, [FromBody] VariableConfiguracion variableConfiguracion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != variableConfiguracion.VariableConfiguracionId)
            {
                return BadRequest();
            }

            _configrepository.Update(variableConfiguracion);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VariableConfiguracionExists(id))
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

        // POST: api/VariableConfiguracions
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpPost]
        public async Task<IActionResult> PostVariableConfiguracion([FromBody] VariableConfiguracion variableConfiguracion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _configrepository.Create(variableConfiguracion);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetVariableConfiguracion", new { id = variableConfiguracion.VariableConfiguracionId }, variableConfiguracion);
        }

        // DELETE: api/VariableConfiguracions/5
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVariableConfiguracion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var variableConfiguracion = await _configrepository.FindAsync(id);
            if (variableConfiguracion == null)
            {
                return NotFound();
            }

            _configrepository.Delete(variableConfiguracion);
            await _unitOfWork.SaveChangesAsync();

            return Ok(variableConfiguracion);
        }

        private bool VariableConfiguracionExists(int id)
        {
            return _configrepository.Queryable().Any(e => e.VariableConfiguracionId == id);
        }

        // GET: api/VariableConfiguracions/Puntos
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpGet]
        [Route("Puntos")]
        public IEnumerable<VariableConfiguracion> GetVariableConfiguracionPuntos(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<VariableConfiguracion> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _configrepository.Queryable().Where(p => (p.Nombre.Contains(filter.ToLower()) || p.Valor.Contains(filter.ToLower())) && (p.Tipo == "Puntos"))
                    //.Include(tt=> tt.TipoTransferencia)
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _configrepository.Queryable().Where(x => x.Tipo == "Puntos").ToPagedList(pageIndex, pageSize).ToList();
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
                            lista = lista.OrderByDescending(l => l.Valor);

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
                            lista = lista.OrderBy(l => l.Valor);

                        }
                        break;

                    }
            }
            return lista;
        }
        
        // GET: api/VariableConfiguracions/Bonificacion
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpGet]
        [Route("Bonificacion")]
        public IEnumerable<VariableConfiguracion> GetVariableConfiguracionBonificacion(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<VariableConfiguracion> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _configrepository.Queryable().Where(p => (p.Nombre.Contains(filter.ToLower()) || p.Valor.Contains(filter.ToLower())) && (p.Tipo == "Bonificación"))
                    //.Include(tt=> tt.TipoTransferencia)
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _configrepository.Queryable().Where(x => x.Tipo == "Bonificación").ToPagedList(pageIndex, pageSize).ToList();
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
                            lista = lista.OrderByDescending(l => l.Valor);

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
                            lista = lista.OrderBy(l => l.Valor);

                        }
                        break;

                    }
            }
            return lista;
        }

        // GET: api/VariableConfiguracions/Pago
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpGet]
        [Route("Pago")]
        public IEnumerable<VariableConfiguracion> GetVariableConfiguracionPagos(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)

        {

            IEnumerable<VariableConfiguracion> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _configrepository.Queryable().Where(p => (p.Nombre.Contains(filter.ToLower()) || p.Valor.Contains(filter.ToLower())) && (p.Tipo == " Pagos"))
                    //.Include(tt=> tt.TipoTransferencia)
                    .ToPagedList(pageIndex, pageSize).ToList();
            }
            else
            {
                lista = _configrepository.Queryable().Where(x => x.Tipo == "Pagos").ToPagedList(pageIndex, pageSize).ToList();
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
                            lista = lista.OrderByDescending(l => l.Valor);

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
                            lista = lista.OrderBy(l => l.Valor);

                        }
                        break;

                    }
            }
            return lista;
        }


        // GET: api/VariableConfiguracions/Count/5
        [HttpGet]
        [Route("Count/{tipo}")]
        public int GetVariableConfiguracionsCount([FromRoute] string tipo)
        {
            int cont = _configrepository.Queryable().Where(x => x.Tipo == tipo).Count();
            return cont;
        }

        /// <summary>
        /// Metodo para obtener una variable de configuracion por codigo
        /// </summary>
        /// <param name="codigo">codigo fijo de las variables de configuracion</param>
        /// <returns>una variable con su valor</returns>
        // GET: api/VariableConfiguracions/Codigo/TXT_SMS
        [HttpGet]
        [Route("Codigo")]
        public IActionResult GetVariableConfiguracionsByCodigo(string codigo)
        {
            if (codigo == null || codigo.Length == 0)
            {
                return BadRequest();
            }

            try
            {
                var variableConfiguracion = _configrepository.Queryable().First(x => x.NombreCodigo == codigo);


                if (variableConfiguracion == null)
                {
                    return NotFound();
                }



                return Ok(variableConfiguracion);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}