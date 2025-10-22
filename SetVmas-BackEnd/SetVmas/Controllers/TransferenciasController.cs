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
    public class TransferenciasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Transferencia> _transferenciarepository;
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<ClasesUsuarios> _clasesUsuariosrepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        public TransferenciasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _transferenciarepository = _unitOfWork.TransferenciaRepository;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
            _clasesUsuariosrepository = _unitOfWork.ClasesUsuariosRepository;
    }

        // GET: api/Transferencias
        [Authorize(Roles = "Super Administrador, Administrador, Director")]
        [HttpGet]
        public IEnumerable<TransfersViewModel> GetTransferencia(string col = "Fecha", string filter = "", string sortDirection = "desc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<TransfersViewModel> lista;

            if (!string.IsNullOrEmpty(filter))
            {
                lista = _mapper.Map<List<TransfersViewModel>>(_transferenciarepository.Queryable().Include(x => x.Usuario).Include(x => x.UsuarioFuenteUsuario).Include(x => x.UsuarioDestinoUsuario).Include(x => x.TipoTransferencia).Where(p => (p.UsuarioDestinoUsuario.Correo.ToLower().Contains(filter.ToLower())))
                      //.Include(tt=> tt.TipoTransferencia)
                      .OrderByDescending(x => x.Fecha)
                    .ToPagedList(pageIndex, pageSize)
                    .ToList()); 
            }
            else
            {
                lista = _mapper.Map<List<TransfersViewModel>>(_transferenciarepository.Queryable().Include(x => x.TipoTransferencia).Include(x => x.Usuario).Include(x => x.UsuarioFuenteUsuario).Include(x => x.UsuarioDestinoUsuario)
                      .OrderByDescending(x => x.Fecha)
                    .ToPagedList(pageIndex, pageSize).ToList());
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("UsuarioFuente".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.SourceUser);

                        }
                        else
                        if ("UsuarioDestino".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.TargetUser);

                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.User);

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.OperationDate);

                        }
                        else
                        if ("Puntos".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Points);

                        }
                        else
                        {
                            lista = lista.OrderByDescending(l => l.TransferType);

                        }
                        break;
                    }

                default:
                    {
                        if ("UsuarioFuente".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.SourceUser);

                        }
                        else
                       if ("UsuarioDestino".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.TargetUser);

                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.User);

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.OperationDate);

                        }
                        else
                        if ("Puntos".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Points);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.TransferType);

                        }

                        break;

                    }
            }

            return lista;

        }
        // GET: api/Transferencias/Count
        [Authorize]
        [HttpGet]
        [Route("Count")]
        public int GetTransferenciaCount()
        {
            return _transferenciarepository.Queryable().Count();
        }

        // GET: api/Transferencias/Antiguedad
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet]
        [Route("Antiguedad")]
        public IEnumerable<TransfersViewModel> GetTransferenciaAntiguedad(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            /// hay que poner el filtro de antiguedad
            IEnumerable<TransfersViewModel> lista;
            if (!string.IsNullOrEmpty(filter) && int.Parse(filter) > 0)
            {
                var dia = DateTime.Now.Day;
                var mes = DateTime.Now.Month;
                var anno = DateTime.Now.Year;

                lista = _mapper.Map<List<TransfersViewModel>>(_transferenciarepository.Queryable().Include(x => x.Usuario).Include(x => x.UsuarioFuenteUsuario).Include(x => x.TipoTransferencia).Where(p => (dia - p.Fecha.Day) + ((mes - p.Fecha.Month) * 30) + ((anno - p.Fecha.Year) * 360) == Convert.ToInt32(filter.ToLower()))
                    //.Include(tt=> tt.TipoTransferencia)
                    .OrderByDescending(x=>x.Fecha)
                    .ToPagedList(pageIndex, pageSize)
                    .ToList());
            }
            else
            {
                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                lista = _mapper.Map<List<TransfersViewModel>>(_transferenciarepository.Queryable().Include(x => x.Usuario).Include(x => x.UsuarioFuenteUsuario).Include(x => x.TipoTransferencia)
                    .OrderByDescending(x => x.Fecha)
                    .ToPagedList(pageIndex, pageSize)
                    .ToList());
            }

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("UsuarioFuente".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.SourceUser);

                        }
                        else
                        if ("UsuarioDestino".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.TargetUser);

                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.User);

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.OperationDate);

                        }
                        else
                        if ("Puntos".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Points);

                        }
                        else
                        {
                            lista = lista.OrderByDescending(l => l.TransferType);

                        }
                        break;
                    }

                default:
                    {
                        if ("UsuarioFuente".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.SourceUser);

                        }
                        else
                       if ("UsuarioDestino".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.TargetUser);

                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.User);

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.OperationDate);

                        }
                        else
                        if ("Puntos".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Points);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.TransferType);

                        }

                        break;

                    }


            }


            return lista;

        }

        // GET: api/Transferencias
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet]
        [Route("List")]
        public IActionResult GetAllTransferencias()
        {

            var query = _transferenciarepository.Queryable().Include(trans => trans.TipoTransferencia).Select(trans => new
            {
                TransferenciaId = trans.TransferenciaId,
                UsuarioFuente = trans.UsuarioFuenteUsuario,
                UsuarioDestino = trans.UsuarioDestinoUsuario,
                Fecha = trans.Fecha,
                Puntos = trans.Puntos,
                Nombre = trans.TipoTransferencia.Nombre
            }).ToList();

            return Ok(_mapper.Map<List<TransfersViewModel>>(query));
        }

        // GET: api/Transferencias/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransferencia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transferencia = await _transferenciarepository.FindAsync(id);

            if (transferencia == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<TransfersViewModel>(transferencia));
        }

        // PUT: api/Transferencias/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransferencia([FromRoute] int id, [FromBody] Transferencia transferencia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != transferencia.TransferenciaId)
            {
                return BadRequest();
            }

            _transferenciarepository.Update(transferencia);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransferenciaExists(id))
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

        // POST: api/Transferencias
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostTransferencia([FromBody] TransfersViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Transferencia transferencia = new Transferencia();
            transferencia.UsuarioId= _usuariorepository.Queryable().First(x => x.Correo == model.User).UsuarioId;
            Usuario destino = _usuariorepository.Queryable().First(x => x.Correo == model.TargetUser);
            transferencia.UsuarioDestinoUsuarioId= destino.UsuarioId;
            transferencia.UsuarioFuenteUsuarioId= _usuariorepository.Queryable().First(x => x.Correo == model.SourceUser).UsuarioId;
            transferencia.TipoTransferenciaId= _tiposTransferenciasrepository.Queryable().First(x => x.NombreCodigo == model.TransferType).TipoTransferenciaId;
            transferencia.Puntos = model.Points;
            transferencia.Fecha = model.OperationDate;
            /* Usuario u = _usuariorepository.Queryable().First(x => x.UsuarioId == transferencia.UsuarioDestinoUsuarioId);
             ClasesUsuarios clase = _clasesUsuariosrepository.Queryable().First(x => x.ClasesUsuariosId == u.ClasesUsuariosId);
             u.ClasesUsuarios = clase;
             transferencia.UsuarioDestinoUsuario = u;

             Usuario u1 = _usuariorepository.Queryable().First(x => x.UsuarioId == transferencia.UsuarioId);
             ClasesUsuarios clase1 = _clasesUsuariosrepository.Queryable().First(x => x.ClasesUsuariosId == u1.ClasesUsuariosId);
             u1.ClasesUsuarios = clase1;
             transferencia.Usuario = u1;

             Usuario u2 = _usuariorepository.Queryable().First(x => x.UsuarioId == transferencia.UsuarioFuenteUsuarioId);
             ClasesUsuarios clase2 = _clasesUsuariosrepository.Queryable().First(x => x.ClasesUsuariosId == u2.ClasesUsuariosId);
             u2.ClasesUsuarios = clase2;
             transferencia.UsuarioFuenteUsuario = u2;

             TipoTransferencia tipo = _tiposTransferenciasrepository.Queryable().First(x => x.TipoTransferenciaId == transferencia.TipoTransferenciaId);
             transferencia.TipoTransferencia = tipo;*/
            _transferenciarepository.Create(transferencia);

            destino.Puntos += Convert.ToDecimal(transferencia.Puntos);
            _usuariorepository.Update(destino);
            try
            {


                // transferencia.UsuarioDestino.ClasesUsuarios = _context.ClasesUsuarios.Where(x => x.ClasesUsuariosId == transferencia.UsuarioDestino.ClasesUsuarios.ClasesUsuariosId).First();
                // _context.Entry(transferencia.UsuarioDestino).State = EntityState.Modified;
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw;
            }


            return CreatedAtAction("GetTransferencia", new { id = transferencia.TransferenciaId }, transferencia);
        }

        // DELETE: api/Transferencias/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransferencia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transferencia = await _transferenciarepository.FindAsync(id);
            var usuario = _usuariorepository.Queryable().First(x => x.UsuarioId == transferencia.UsuarioDestinoUsuarioId);
            usuario.Puntos -= Convert.ToDecimal(transferencia.Puntos);
            _usuariorepository.Update(usuario);

            if (transferencia == null)
            {
                return NotFound();
            }

            _transferenciarepository.Delete(transferencia);
            await _unitOfWork.SaveChangesAsync();

            return Ok(_mapper.Map<TransfersViewModel>(transferencia));
        }

        private bool TransferenciaExists(int id)
        {
            return _transferenciarepository.Queryable().Any(e => e.TransferenciaId == id);
        }

        // GET: api/Usuarios/Count/1
        [Authorize]
        [HttpGet]
        [Route("Count/{userId}")]
        public int GetTransferenciaCountByUser([FromRoute] int userId)
        {
            return _transferenciarepository.Queryable().Where(x=>x.UsuarioId==userId).Count();
        }

        [Authorize]
        [HttpGet]
        [Route("User/{userId}")]
        public IEnumerable<TransfersViewModel> GetTransferenciasByUser([FromRoute] int userId, bool opTypePagoPublicidad, bool opTypeVenta, bool opTypeBonificacion, bool opTypeCompraDirecta, string idTransfer, string sourceUser, string targetUser, string dateFrom, string dateTo, string pointsFrom, string pointsTo, int pageIndex = 1, int pageSize = 10)
        {
          
            IEnumerable<TransfersViewModel> lista;

            if (CurrentUser().UsuarioId != userId)
            {
                lista = new List<TransfersViewModel>();
                return lista;
            }

            if (opTypeBonificacion == false && opTypePagoPublicidad == false && opTypeVenta == false && opTypeCompraDirecta == false && (idTransfer == "" || idTransfer == null) && (sourceUser == "" || sourceUser == null) && (targetUser == "" || targetUser == null) && (dateFrom == "" || dateFrom == null) && (dateTo == "" || dateTo == null) && (pointsFrom == "" || pointsFrom == null) && (pointsTo == "" || pointsTo == null))
            {

                var model = _transferenciarepository.Queryable().Where(d => d.UsuarioId == userId || d.UsuarioDestinoUsuarioId == userId).Include(x => x.Usuario).Include(x => x.UsuarioFuenteUsuario).Include(x => x.UsuarioDestinoUsuario).Include(x => x.TipoTransferencia).OrderByDescending(x=>x.Fecha).ToPagedList(pageIndex, pageSize).ToList();
                //where d.UsuarioId == userId
                //select new TransfersViewModel(d.TransferenciaId, d.Fecha, d.TipoTransferencia.Nombre, d.UsuarioFuenteUsuario.Correo, d.UsuarioDestinoUsuario.Correo, d.Puntos);


                lista = _mapper.Map<List<TransfersViewModel>>(model);
 
            }

            else
            {
                string query = "use setDB SELECT T.TransferenciaId, T.UsuarioId, T.UsuarioFuenteUsuarioId, T.UsuarioDestinoUsuarioId, T.Fecha, T.Puntos, T.TipoTransferenciaId FROM Transferencia T  ";

                string filterType = "";
                if (opTypeBonificacion == true || opTypeCompraDirecta == true || opTypePagoPublicidad == true || opTypeVenta == true)
                {
                    query += "INNER JOIN TipoTransferencia P ON T.TipoTransferenciaId = P.TipoTransferenciaId ";
                    string query1, query2, query3, query4 = "";
                    query1 = (opTypeBonificacion) ? "AND P.Nombre LIKE '%Bonificación%' " : "";
                    query2 = (opTypeCompraDirecta) ? "AND P.Nombre LIKE '%Compra directa%' " : "";
                    query3 = (opTypePagoPublicidad) ? "AND P.Nombre LIKE '%Publicidad%' " : "";
                    query4 = (opTypeVenta) ? "AND P.Nombre LIKE '%Venta%' " : "";

                    filterType = query1 + query2 + query3 + query4;
                }

                string filterSourceUser = "";
                if (sourceUser != "" && sourceUser != null)
                {
                    query += "INNER JOIN Usuario U ON T.UsuarioFuenteUsuarioId = U.UsuarioId ";
                    filterSourceUser = "AND U.Correo LIKE '%" + sourceUser + "%' ";
                }

                string filterTargetUser = "";
                if (targetUser != "" && targetUser != null)
                {
                    query += "INNER JOIN Usuario S ON T.UsuarioDestinoUsuarioId = S.UsuarioId ";
                    filterTargetUser = "AND S.Correo LIKE '%" + targetUser + "%' ";
                }

                query += "WHERE (( T.UsuarioId= 16 AND T.UsuarioDestinoUsuarioId = " + userId + ") OR T.UsuarioId = " + userId + " )" + filterType + filterSourceUser + filterTargetUser;
                //query += "WHERE ( T.UsuarioId= 16 AND T.UsuarioDestinoUsuarioId = " + userId + " )" + filterType + filterSourceUser + filterTargetUser;

                query += (idTransfer != "" && idTransfer != null) ? " AND TransferenciaId = " + idTransfer : "";

                if ((dateFrom != "" && dateFrom != null) || (dateTo != "" && dateTo != null))
                {
                    query += ((dateFrom != "" && dateFrom != null) && (dateTo != "" && dateTo != null)) ? " AND T.Fecha BETWEEN '" + dateFrom + "' AND '" + dateTo + "'" : " AND T.Fecha LIKE '%" + dateFrom + "%'";
                }
                if ((pointsFrom != "" && pointsFrom != null) || (pointsTo != "" && pointsTo != null))
                {
                    query += ((pointsFrom != "" && pointsFrom != null) && (pointsTo != "" && pointsTo != null)) ? " AND T.Puntos BETWEEN " + Convert.ToDouble(pointsFrom) + " AND " + Convert.ToDouble(pointsTo) : " AND T.Puntos = " + pointsFrom;
                }


                query += " ORDER by T.Fecha desc";
                var result = _unitOfWork.FilterTransferenciasByUser(query);
                List<TransfersViewModel> transResult = new List<TransfersViewModel>();
                foreach (var item in result)
                {
                    TransfersViewModel model = _mapper.Map<TransfersViewModel>(item);
                    transResult.Add(model);
                }
                lista = transResult.AsQueryable().ToPagedList(pageIndex, pageSize).ToList();

            }

            return lista;

        }


    }
}