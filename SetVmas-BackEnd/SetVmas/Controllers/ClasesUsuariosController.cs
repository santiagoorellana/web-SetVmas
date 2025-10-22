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
    
    public class ClasesUsuariosController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<ClasesUsuarios> _clasesUsuariosrepository;
        private readonly Repository<FactoresBonificacionVentas> _factoresBonificacionVrepository;
        public ClasesUsuariosController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _clasesUsuariosrepository = _unitOfWork.ClasesUsuariosRepository;
            _factoresBonificacionVrepository = _unitOfWork.FactoresBonificacionVentasRepository;
        }

        // GET: api/ClasesUsuarios
        [HttpGet]
        // [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [Authorize]
        public IEnumerable<ClasesUsuarios> GetClasesUsuarios(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 0, int pageSize = 0)
        {
            IEnumerable<ClasesUsuarios> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                lista = _clasesUsuariosrepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).ToList(); ;
            }
            else
            {
                lista = _clasesUsuariosrepository.List();
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
                        if ("FactorBonificacionCompra".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.FactorBonificacionCompra);

                        }
                        else
                        if ("BonificacionPorAlcanzarla".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.BonificacionPorAlcanzarla);

                        }
                        else
                        if ("BonificacionPorAnuncioDiario".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.BonificacionPorAnuncioDiario);

                        }
                        else
                        if ("RequisitoAntigueda".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.RequisitoAntigueda);

                        }
                        else
                        if ("RequisitoCompras".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.RequisitoCompras);

                        }
                        else
                        if ("RequisitoCantidadReferidos".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.RequisitoCantidadReferidos);

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
                       if ("FactorBonificacionCompra".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.FactorBonificacionCompra);

                        }
                        else
                       if ("BonificacionPorAlcanzarla".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.BonificacionPorAlcanzarla);

                        }
                        else
                       if ("BonificacionPorAnuncioDiario".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.BonificacionPorAnuncioDiario);

                        }
                        else
                       if ("RequisitoAntigueda".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.RequisitoAntigueda);

                        }
                        else
                       if ("RequisitoCompras".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.RequisitoCompras);

                        }
                        else
                       if ("RequisitoCantidadReferidos".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.RequisitoCantidadReferidos);

                        }

                        break;

                    }


            }

            return lista.AsQueryable().ToPagedList(pageIndex, pageSize);
        }


        [HttpGet]
        [Route("Bonificaciones")]
        [Authorize]//[Authorize(Roles = "Super Administrador, Administrador, Director")]
        public IEnumerable<BonificacionesViewModel> getBonificacionesCompraVenta()
        {
            var lista = new List<BonificacionesViewModel>();
            var compra = new BonificacionesViewModel("Por comprar");
            var venta = new BonificacionesViewModel("Por vender");
            var l_clasesusuarios = _clasesUsuariosrepository.List();
            var l_factorbonificacionventa = _factoresBonificacionVrepository.Queryable().First();

            compra.INICIADO = Math.Round(l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Iniciado").FactorBonificacionCompra * 100,2);
            compra.BRONCE = Math.Round(l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Bronce").FactorBonificacionCompra * 100, 2);
            compra.PLATA = Math.Round(l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Plata").FactorBonificacionCompra * 100, 2);
            compra.ORO = Math.Round(l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Oro").FactorBonificacionCompra * 100, 2);
            compra.DIAMANTE = Math.Round(l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Diamante").FactorBonificacionCompra * 100, 2);

            venta.INICIADO = Math.Round( l_factorbonificacionventa.ClaseIniciada * 100, 2);
            venta.BRONCE = Math.Round(l_factorbonificacionventa.ClaseBronce * 100, 2);
            venta.PLATA = Math.Round(l_factorbonificacionventa.ClasePlata * 100, 2);
            venta.ORO = Math.Round(l_factorbonificacionventa.ClaseOro * 100, 2);
            venta.DIAMANTE = Math.Round(l_factorbonificacionventa.ClaseDiamante * 100, 2);

            lista.Add(compra);
            lista.Add(venta);
            return lista;
        }


        [HttpGet]
        [Route("Condiciones")]
        [Authorize(Roles = "Super Administrador, Administrador, Cliente, Clasificador")]
        public IEnumerable<CondicionesViewModel> GetCondiciones()
        {
            var lista = new List<CondicionesViewModel>();
            var antiguedad = new CondicionesViewModel("Días de antigüedad superior a:");
            var minimos = new CondicionesViewModel("Mínimo de referidos directos:");
            var compras = new CondicionesViewModel("Compras directas de puntos superior a:");
            var puntos = new CondicionesViewModel("Mínimo de puntos:");


           

                var l_clasesusuarios = _clasesUsuariosrepository.Queryable().Where(x => x.ClasesUsuariosId != 1);

            antiguedad.BRONCE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Bronce").RequisitoAntigueda;
            antiguedad.PLATA = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Plata").RequisitoAntigueda;
            antiguedad.ORO = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Oro").RequisitoAntigueda;
            antiguedad.DIAMANTE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Diamante").RequisitoAntigueda;

            minimos.BRONCE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Bronce").RequisitoCantidadReferidos;
            minimos.PLATA = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Plata").RequisitoCantidadReferidos;
            minimos.ORO = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Oro").RequisitoCantidadReferidos;
            minimos.DIAMANTE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Diamante").RequisitoCantidadReferidos;

            compras.BRONCE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Bronce").RequisitoCompras;
            compras.PLATA = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Plata").RequisitoCompras;
            compras.ORO = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Oro").RequisitoCompras;
            compras.DIAMANTE = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Diamante").RequisitoCompras;

            decimal bro = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Bronce").RequisitoPuntos ?? 0;
            puntos.BRONCE = Math.Round(bro, 2);
            bro = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Plata").RequisitoPuntos ?? 0;
            puntos.PLATA = Math.Round(bro, 2);
            bro = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Oro").RequisitoPuntos ?? 0;
            puntos.ORO = Math.Round(bro, 2);

            bro = l_clasesusuarios.FirstOrDefault(x => x.Nombre == "Diamante").RequisitoPuntos ?? 0;
            puntos.DIAMANTE = Math.Round(bro, 2);

            lista.Add(antiguedad);
            lista.Add(minimos);
            lista.Add(compras);
            lista.Add(puntos);
            return lista;
        }


        // GET: api/ClasesUsuarios/List
        [HttpGet]
        [Route("List")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public IEnumerable<ClasesUsuarios> GetClasesUsuariosList()
        {
            return _clasesUsuariosrepository.List();
        }
        // GET: api/ClasesUsuarios/Count
        [Route("Count")]
        [HttpGet]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public int GetClasesUsuariosCount()
        {
            return _clasesUsuariosrepository.Queryable().Count();
        }

        // GET: api/ClasesUsuarios/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> GetClasesUsuarios([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clasesUsuarios = await _clasesUsuariosrepository.FindAsync(id);

            if (clasesUsuarios == null)
            {
                return NotFound();
            }

            return Ok(clasesUsuarios);
        }

        // PUT: api/ClasesUsuarios/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> PutClasesUsuarios([FromRoute] int id, [FromBody] ClasesUsuarios clasesUsuarios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clasesUsuarios.ClasesUsuariosId)
            {
                return BadRequest();
            }

            _clasesUsuariosrepository.Update(clasesUsuarios);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClasesUsuariosExists(id))
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

        // POST: api/ClasesUsuarios
        [HttpPost]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> PostClasesUsuarios([FromBody] ClasesUsuarios clasesUsuarios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _clasesUsuariosrepository.Create(clasesUsuarios);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetClasesUsuarios", new { id = clasesUsuarios.ClasesUsuariosId }, clasesUsuarios);
        }

        // DELETE: api/ClasesUsuarios/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        public async Task<IActionResult> DeleteClasesUsuarios([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clasesUsuarios = await _clasesUsuariosrepository.FindAsync(id);
            if (clasesUsuarios == null)
            {
                return NotFound();
            }

            _clasesUsuariosrepository.Delete(clasesUsuarios);
            await _unitOfWork.SaveChangesAsync();

            return Ok(clasesUsuarios);
        }

        private bool ClasesUsuariosExists(int id)
        {
            return _clasesUsuariosrepository.Queryable().Any(e => e.ClasesUsuariosId == id);
        }



        // GET: api/ClasesUsuarios/Bonificacion
        [Authorize/*(Roles = "Super Administrador, Administrador, Director")*/]
        [HttpGet]
        [Route("Bonificacion")]
        public BonificacionesViewModel GetBonificacionPorAlcancar()
        {
            BonificacionesViewModel bonif = new BonificacionesViewModel("BonificacionPorAlcanzarla");

            var listaClases = _clasesUsuariosrepository.Queryable().ToList();

            foreach( var item in listaClases)
            {
                switch (item.Nombre)
                {
                    default:
                        break;
                    case "Iniciado":
                        bonif.INICIADO = Math.Round( item.BonificacionPorAlcanzarla,2);
                        break;
                    case "Bronce":
                        bonif.BRONCE = Math.Round(item.BonificacionPorAlcanzarla, 2); 
                        break;
                    case "Plata":
                        bonif.PLATA = Math.Round(item.BonificacionPorAlcanzarla, 2); 
                        break;
                    case "Diamante":
                        bonif.DIAMANTE = Math.Round(item.BonificacionPorAlcanzarla, 2);
                        break;
                    case "Oro":
                        bonif.ORO = Math.Round(item.BonificacionPorAlcanzarla, 2);
                        break;
                    
                }
            }


            return bonif;
        }



    }
}