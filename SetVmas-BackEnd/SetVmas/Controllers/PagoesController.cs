using System;
using System.Collections.Generic;
using System.Linq;
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
    public class PagoesController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Pagos> _pagosrepository;
        private readonly Repository<VariableConfiguracion> _configrepository;
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        private readonly Repository<Transferencia> _transferenciasrepository;
        public PagoesController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _pagosrepository = _unitOfWork.PagosRepository;
            _configrepository = _unitOfWork.VariableConfiguracionRepository;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _transferenciasrepository = _unitOfWork.TransferenciaRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
        }

        // GET: api/Pagoes
        [Authorize(Roles = "Super Administrador, Administrador, Director, Colaborador")]
        [HttpGet]
        public IEnumerable<PagosViewModel> GetPagos(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {

            IEnumerable<PagosViewModel> lista;
            //if (!string.IsNullOrEmpty(filter))
            //{
            //    lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
            //        //.Include(tt=> tt.TipoTransferencia)
            //        .OrderByDescending(x=>x.Fecha)
            //        .ToPagedList(pageIndex, pageSize).ToList()); 
            //}
            //else
            //{
            //    //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
            //    //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
            //    lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
            //        .Include(x => x.Usuario)
            //        .OrderByDescending(x => x.Fecha)
            //        .ToPagedList(pageIndex, pageSize).ToList());
            //}

            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("TransferenciaId".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.TransferenciaId)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.TransferenciaId)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("Tipo".Equals(col))
                        {
                           
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.Tipo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.Tipo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("CantCup".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.CantCup)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.CantCup)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.Fecha)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.Fecha)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                           
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.Usuario.Correo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.Usuario.Correo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }


                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderByDescending(x => x.Estado)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderByDescending(x => x.Estado)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            
                        }
                        break;
                    }

                default:
                    {
                        if ("TransferenciaId".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.TransferenciaId)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.Fecha)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("Tipo".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.Tipo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.Tipo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("CantCup".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.CantCup)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.CantCup)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }

                        }
                        else
                        if ("Fecha".Equals(col))
                        {
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.Fecha)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.Fecha)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                        }
                        else
                        if ("Usuario".Equals(col))
                        {
                            
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.Usuario.Correo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.Usuario.Correo)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }


                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(filter))
                            {
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable().Include(x => x.Usuario).Where(p => p.Estado == filter.ToLower())
                                    //.Include(tt=> tt.TipoTransferencia)
                                    .OrderBy(x => x.Estado)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                            else
                            {
                                //lista = _context.Transferencia.Include(tt => tt.TipoTransferencia).ToList(); 
                                //lista = _context.Pagos.Take(pageSize).Skip(pageIndex).ToList();
                                lista = _mapper.Map<List<PagosViewModel>>(_pagosrepository.Queryable()
                                    .Include(x => x.Usuario)
                                    .OrderBy(x => x.Estado)
                                    .ToPagedList(pageIndex, pageSize).ToList());
                            }
                        }
                        break;

                    }
            }
            return lista;

        }


        // GET: api/Pagoes/Count
        [Authorize(Roles = "Super Administrador, Administrador, Director, Colaborador")]
        [HttpGet]
        [Route("Count")]
        public int GetPagoCount()
        {
            return _pagosrepository.Queryable().Count();
        }



        // GET: api/Pagoes/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPago([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pago = await _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.PagoId == id).FirstAsync();

            if (pago == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<PagosViewModel>(pago));
        }

        // GET: api/Pagoes/PuntosCount/5
        [Authorize]
        [HttpGet]
        [Route("PuntosCount/{id}")]
        public decimal GetPagoPuntosCount([FromRoute] int id)
        {
            decimal puntos = 0;
            if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == id && x.Estado == "Confirmado"))
                puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == id && x.Estado == "Confirmado").Sum(x => x.Puntos);

            return puntos;
        }


        // PUT: api/Pagoes/5
        [Authorize(Roles = "Super Administrador, Administrador, Director, Colaborador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPago([FromRoute] int id, [FromBody] Pagos pago)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pago.PagoId)
            {
                return BadRequest();
            }
            pago.Usuario = _usuariorepository.Queryable().AsNoTracking().Where(x => x.UsuarioId == pago.Usuario.UsuarioId).First();
            var config = _configrepository.List();
            string pointPrice = config.Find(d => d.NombreCodigo == "Precio_Puntos").Valor; //precio de un punto
            
            pago.Puntos = pago.CantCup / decimal.Parse(pointPrice);
            try
            {
                _pagosrepository.Update(pago);

           
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PagoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }catch(Exception e)
            {

            }

            return NoContent();
        }


        //-----------------------------Compra directa de puntos-------------------------------
        // POST: api/Pagoes
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostPago([FromBody] PurchaseFormViewModel purchase)
        {
            var config = _configrepository.List();
            int formaPago = Convert.ToInt32(purchase.FormaPago);
            Pagos pago = new Pagos();
            pago.Estado = "No Confirmado";
            pago.Fecha = DateTime.Now;
            decimal monto = Convert.ToDecimal(purchase.Monto);
            pago.CantCup = monto;
            string pointPrice = config.Find(d => d.NombreCodigo == "Precio_Puntos").Valor; //precio de un punto
            decimal points = monto / decimal.Parse(pointPrice); // cuantos puntos representa el monto insertado
            pago.Puntos = points;
            Usuario user = _usuariorepository.Find(purchase.UserId);
            pago.Usuario = user;

            //tipo de compra (telefono, tarjeta o contacto directo), numero de transaccion, mensaje
            string message = "";
            string tipo = "";
            int transaction = purchase.TipoTransferencia;

            pago.Tipo = tipo;
            pago.TransferenciaId = transaction;
            
            _pagosrepository.Create(pago);
            await _unitOfWork.SaveChangesAsync();
            string crearIdunico = transaction.ToString() + user.UsuarioId.ToString() + pago.PagoId.ToString();
            transaction = int.Parse(crearIdunico);
            pago.TransferenciaId = transaction;

                       

            if (formaPago == 1)
            {
                tipo = "No. Cuenta";
               
                string tarjeta = purchase.NoTarjeta;
                //transaction = Convert.ToInt32(tarjeta.Substring(tarjeta.Length - 5, 4));
                pago.Fuente = tarjeta;
                message = "¡SetVmas: Gracias por la intensión de compra de " + pago.Puntos + " puntos que equivalen a " + pago.CantCup.ToString("0.00")
                + " CUP,<br>siendo el precio de un punto igual a: " + _configrepository.Queryable().First(d => d.NombreCodigo == "Precio_Puntos").Valor + "CUP !" 
                + "<br>Para que se verifique, usted debe hacer una transferencia a la cuenta bancaria: " + config.Find(d => d.NombreCodigo == "No_Tarjeta").Valor + " por una cantidad de " + monto + " CUP."
                +"<br>Si ya ha realizado el pago mediante EnZona o TransferMovil, un cajero o en el banco, espere a que se le habiliten sus puntos dentro de las 48 horas posteriores al pago que hizo."
                +"Si no ha pagado, le invitamos a hacerlo."
                  + "<br><strong>¡Gracias por confiar en SetV+!</strong>"
                + "<br><strong>Su No. es Transacción: " + transaction + "</strong>";
            }
            if (formaPago == 2)
            {
                tipo = "Telefónico";
                //transaction = Convert.ToInt32(purchase.Phone);
                pago.Fuente = purchase.Phone;
                message = "¡SetVmas: Gracias por la intensión de compra de " + pago.Puntos + " puntos que equivalen a " + pago.CantCup.ToString("0.00")
                + " CUP,<br> siendo el precio de un punto igual a: " + _configrepository.Queryable().First(d => d.NombreCodigo == "Precio_Puntos").Valor + "CUP !"
                + "<br>Para que se verifique, usted debe hacer una transferencia de saldo al teléfono: " + config.Find(d => d.NombreCodigo == "No_Movil").Valor + " por una cantidad de " + monto + " CUP."
                 + "<br>Si ya ha realizado el pago espere a que se le habiliten sus puntos dentro de las 48 horas posteriores al pago que hizo."
                + "Si no ha pagado, le invitamos a hacerlo."
                  + "<br><strong>¡Gracias por confiar en SetV+!</strong>"
                + "<br><strong>Su No. es Transacción: " + transaction + "</strong>";
            }
            if (formaPago == 3)
            {
                tipo = "Contacto directo";
                Random rnd = new Random();
                pago.Fuente = user.Telefono;
                //transaction = rnd.Next(11111, 99999);
                message = "¡SetVmas: Gracias por la intensión de compra de " + pago.Puntos + " puntos que equivalen a " + pago.CantCup.ToString("0.00")
                + " CUP,<br>siendo el precio de un punto igual a: " + _configrepository.Queryable().First(d => d.NombreCodigo == "Precio_Puntos").Valor + "CUP !"
                    + "<br>Usted será contactado por un comercial en las próximas 48 horas."
                    + "<br><strong>Su No. es Transacción: " + transaction + "</strong>";
            }

            //  Tools.EnviarCorreo(pago.Usuario.Correo, getFromMail(), "Compra de puntos", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail());

            pago.Tipo = tipo;
            _pagosrepository.Update(pago);
            await _unitOfWork.SaveChangesAsync();

            Tools.EnviarCorreo(user.Correo, getFromMail(), "Compra de puntos", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem());

            return Ok(transaction);
        }

        // DELETE: api/Pagoes/5
        [Authorize(Roles = "Super Administrador, Administrador, Director, Colaborador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePago([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pago = await _pagosrepository.FindAsync(id);
            if (pago == null)
            {
                return NotFound();
            }

            _pagosrepository.Delete(pago);
            await _unitOfWork.SaveChangesAsync();

            return Ok(_mapper.Map<PagosViewModel>(pago));
        }


        // GET: api/Pagoes/Confirmar/5
        [Authorize(Roles = "Super Administrador, Administrador, Director, Colaborador")]
        [HttpPost]
        [Route("Confirmar")]
        public async Task<IActionResult> ConfirmarCompra([FromBody] List<int> pagoIds/*[FromRoute] int id*/)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach (var id in pagoIds)
            {
                var pago = await _pagosrepository.Queryable().Include(x => x.Usuario).ThenInclude(y => y.ClasesUsuarios)
                //.ThenInclude(y => y.ClasesUsuarios)
                .Where(x => x.PagoId == id).FirstAsync();

                if (pago == null)
                {
                    return NotFound();
                }
                //tipo de compra (telefono, tarjeta o contacto directo), numero de transaccion, mensaje
                string message = "";
                decimal puntos = 0;
                //string tipo = "";
                //int transaction = 0;

                if (pago.Estado == "No Confirmado")
                {
                    //Cambiar Estado
                    pago.Estado = "Confirmado";
                    _pagosrepository.Update(pago);//Zuleidy modificar el usuario


                    //Enviar correo
                    message = "¡SetVmas: Gracias por la compra de " + pago.Puntos + " puntos que equivalen a " + pago.CantCup
                        + " CUP,<br>siendo el precio de un punto igual a: " + _configrepository.Queryable().First(d => d.NombreCodigo == "Precio_Puntos").Valor + "CUP !"
                       + "<br><strong>Su Transacción " + pago.TransferenciaId + " ha sido confirmada.</strong>";
                    Tools.EnviarCorreo(pago.Usuario.Correo, getFromMail(), "Compra de puntos", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem());


                    TipoTransferencia FactorBonifCompradirecta = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_COMP_DIRECT").First();

                    double CantFactorBonifCompradirecta = 1;

                    if (pago.TransferenciaId.ToString().StartsWith("1"))
                    {
                        CantFactorBonifCompradirecta = FactorBonifCompradirecta.Cantidad;
                    }


                    //Update los puntos del usuario
                    Usuario usuario = pago.Usuario;
                    usuario.Puntos += Convert.ToDecimal(pago.Puntos) + (Convert.ToDecimal(pago.Puntos) * Convert.ToDecimal(usuario.ClasesUsuarios.FactorBonificacionCompra) * Convert.ToDecimal(CantFactorBonifCompradirecta));
                    _usuariorepository.Update(usuario);
                    //Update los puntos del usuario

                    ////Add Transferencia por bonificacion x denuncia
                    Usuario admin = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();
                    Transferencia trans = new Transferencia();
                    trans.UsuarioId = usuario.UsuarioId;
                    trans.UsuarioDestinoUsuarioId = usuario.UsuarioId;
                    trans.UsuarioFuenteUsuarioId = admin.UsuarioId;
                    trans.Fecha = DateTime.Now;
                    trans.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "COMP_DIRECT").First().TipoTransferenciaId;
                    trans.Puntos = Convert.ToDecimal(pago.Puntos);
                    trans.Fecha = DateTime.Now;
                    _transferenciasrepository.Create(trans);
                    ////Add Transferencia por bonificacion x denuncia




                    ////Add Transferencia por bonificacion x denuncia
                    Transferencia trans1 = new Transferencia();
                    trans1.UsuarioId = usuario.UsuarioId;
                    trans1.UsuarioDestinoUsuarioId = usuario.UsuarioId;
                    trans1.UsuarioFuenteUsuarioId = admin.UsuarioId;
                    trans1.Fecha = DateTime.Now;
                    trans1.TipoTransferenciaId = FactorBonifCompradirecta.TipoTransferenciaId;
                    trans1.Puntos = Convert.ToDecimal(pago.Puntos) * Convert.ToDecimal(usuario.ClasesUsuarios.FactorBonificacionCompra) * Convert.ToDecimal(CantFactorBonifCompradirecta);
                    trans1.Fecha = DateTime.Now;
                    _transferenciasrepository.Create(trans1);
                    ////Add Transferencia por bonificacion x denuncia

                    await _unitOfWork.SaveChangesAsync();

                    //Transferencia por bonificacion x referido
                    if (usuario.Anfitrion != admin.Codigo)
                        _unitOfWork.BoniReferido(pago.Usuario.UsuarioId, usuario.Anfitrion, pago.Puntos);
                }
            }
            

            return Ok(/*_mapper.Map<PagosViewModel>(pago)*/);
        }

        private bool PagoExists(int id)
        {
            return _pagosrepository.Queryable().Any(e => e.PagoId == id);
        }

        [Authorize]
        [HttpGet]
        [Route("Compra")]
        public PurchaseDirectViewModel getPurchaceViewData()
        {
            PurchaseDirectViewModel model = new PurchaseDirectViewModel();

            var config = _configrepository.List();
            model.MinPointsBankTransfer = config.Find(d => d.NombreCodigo == "Min_Puntos_Trans_Bancaria").Valor;
            model.MinPointsPhoneTransfer = config.Find(d => d.NombreCodigo == "Min_Puntos_Saldo_Telefónico").Valor;
            model.MinPointsDirectContact = config.Find(d => d.NombreCodigo == "Min_Puntos_Contacto_Directo").Valor;
            model.PointPrice = config.Find(d => d.NombreCodigo == "Precio_Puntos").Valor;
            model.StateFPBankTransfer = config.Find(d => d.NombreCodigo == "Activar_Trans_Bancaria").Valor;
            model.StateFPPhoneTransfer = config.Find(d => d.NombreCodigo == "Activar_Trans_Saldo").Valor;
            model.NoCard = config.Find(d => d.NombreCodigo == "No_Tarjeta").Valor;
            model.NoPhone = config.Find(d => d.NombreCodigo == "No_Movil").Valor;

            var formasPago = Tools.FormasDePago();
            List<FormasDePagoViewModel> lista = new List<FormasDePagoViewModel>();
            foreach (FormasDePagoViewModel item in formasPago)
            {
                if (item.value == 1 && model.StateFPBankTransfer == "1")
                {
                    lista.Add(item);
                }
                if (item.value == 2 && model.StateFPPhoneTransfer == "1")
                {
                    lista.Add(item);
                }
                if (item.value == 3)
                {
                    lista.Add(item);
                }
            }

            model.FormasDePago = lista;
            return model;
        }

    }
}