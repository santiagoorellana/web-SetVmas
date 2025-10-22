using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VenderPuntosController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        private readonly Repository<Transferencia> _transferenciasrepository;
        private readonly Repository<FactoresBonificacionVentas> _factBonifVentasrepository;

        public VenderPuntosController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
            _transferenciasrepository = _unitOfWork.TransferenciaRepository;
            _factBonifVentasrepository = _unitOfWork.FactoresBonificacionVentasRepository;
        }


        [HttpPost]
        public IActionResult VenderPuntos([FromBody] SellPointsViewModel modelo)
        {

            bool result1 = false;
            bool result2 = false;
            Usuario admin = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();

            Usuario seller = _usuariorepository.Queryable().Include(c => c.ClasesUsuarios).FirstOrDefault(x => x.UsuarioId == modelo.Seller);
           

            Usuario buyer = _usuariorepository.Queryable().Include(c => c.ClasesUsuarios).FirstOrDefault(x => x.Codigo == modelo.Buyer || x.Correo == modelo.Buyer);
            if (buyer == null)
            {

                return Ok("not-found");
            }

            if (seller.UsuarioId == buyer.UsuarioId)
            {
                return Ok("auto-venta");
            }

            if(buyer.ClasesUsuariosId >= seller.ClasesUsuariosId)
            {
                return Ok("not-clase");
            }

            if ("Diamante".Equals(buyer.ClasesUsuarios.Nombre) &&  seller.UsuarioId != admin.UsuarioId)
            {
                return Ok("not-diamante");
            }


            var factBonificacionVenta = GetFactorBonficacionVenta(seller, 1);
            seller.Puntos -= Convert.ToDecimal(modelo.Amount);
            seller.Puntos += (Convert.ToDecimal(modelo.Amount) * factBonificacionVenta);//Convert.ToDecimal(seller.ClasesUsuarios.FactorBonificacionCompra));
            _usuariorepository.Update(seller);//Zuleidy modificar el usuario


            buyer.Puntos += Convert.ToDecimal(modelo.Amount) + (Convert.ToDecimal(modelo.Amount) * Convert.ToDecimal(buyer.ClasesUsuarios.FactorBonificacionCompra));
            _usuariorepository.Update(buyer);//Zuleidy modificar el usuario


            //VENTA
            ////Add Transferencia
            Transferencia trans = new Transferencia();
            trans.UsuarioId = seller.UsuarioId;
            trans.UsuarioDestinoUsuarioId = buyer.UsuarioId;
            trans.UsuarioFuenteUsuarioId = seller.UsuarioId;
            trans.Fecha = DateTime.Now;
            trans.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "VENTA").First().TipoTransferenciaId;
            trans.Puntos = Convert.ToDecimal(modelo.Amount);
            trans.Fecha = DateTime.Now;
            _transferenciasrepository.Create(trans);
            ////Add Transferencia 

            ////Add bonificacion 
            Transferencia trans1 = new Transferencia();
            trans1.UsuarioId = admin.UsuarioId;//seller.UsuarioId; el admin es el que desencadena esta transferencia por tanto es el doer
            trans1.UsuarioDestinoUsuarioId = seller.UsuarioId;
            trans1.UsuarioFuenteUsuarioId = admin.UsuarioId;
            trans1.Fecha = DateTime.Now;
            trans1.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_VENTA").First().TipoTransferenciaId;
           

            trans1.Puntos = (Convert.ToDecimal(modelo.Amount) * Convert.ToDecimal(factBonificacionVenta));
            trans1.Fecha = DateTime.Now;
            _transferenciasrepository.Create(trans1);
            ////Add bonificacion 
            ///
            if (seller.Anfitrion != admin.Codigo)
               result1= _unitOfWork.BoniReferido(seller.UsuarioId, seller.Anfitrion, modelo.Amount);
            //VENTA

            //Compra 
             ////Add Transferencia
            Transferencia trans2 = new Transferencia();
            trans2.UsuarioId = buyer.UsuarioId;//seller.UsuarioId; aqui el doer es el comprador
            trans2.UsuarioDestinoUsuarioId = seller.UsuarioId;
            trans2.UsuarioFuenteUsuarioId = buyer.UsuarioId;
            trans2.Fecha = DateTime.Now;
            trans2.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "COMPRA").First().TipoTransferenciaId;
            trans2.Puntos = Convert.ToDecimal(modelo.Amount);
            trans2.Fecha = DateTime.Now;
            _transferenciasrepository.Create(trans2);
            ////Add Transferencia 

            ////Add bonificacion 
            Transferencia trans3 = new Transferencia();
            trans3.UsuarioId = admin.UsuarioId; //seller.UsuarioId; el admin es el que desencadena esta transferencia por tanto es el doer
            trans3.UsuarioDestinoUsuarioId = buyer.UsuarioId;
            trans3.UsuarioFuenteUsuarioId = admin.UsuarioId;
            trans3.Fecha = DateTime.Now;
            trans3.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_COMPRA").First().TipoTransferenciaId;
            trans3.Puntos = /*Convert.ToDecimal(modelo.Amount) +*/ (Convert.ToDecimal(modelo.Amount) * Convert.ToDecimal(buyer.ClasesUsuarios.FactorBonificacionCompra));
            trans3.Fecha = DateTime.Now;
            _transferenciasrepository.Create(trans3);
            ////Add bonificacion 
            if (buyer.Anfitrion != admin.Codigo)
                result2 = _unitOfWork.BoniReferido(seller.UsuarioId, buyer.Anfitrion, modelo.Amount);
            //Compra 

            // bool result = _unitOfWork.BoniCompraVenta(seller.UsuarioId, buyer.UsuarioId, buyer.Codigo, seller.Codigo, modelo.Amount);
             _unitOfWork.SaveChanges();
            return Ok(result1&result2);
        }


        private decimal GetFactorBonficacionVenta(Usuario user , int nivel)
        {
            var factBonificacionVenta = decimal.Zero;
            FactoresBonificacionVentas fila = _factBonifVentasrepository.Queryable().Where(x => x.Nivel == 1).First();

            switch (user.ClasesUsuarios.Nombre)
            {
                case "Iniciado":
                    factBonificacionVenta = decimal.Parse(fila.ClaseIniciada.ToString());
                    break;
                case "Bronce":
                    factBonificacionVenta = decimal.Parse(fila.ClaseBronce.ToString());
                    break;
                case "Plata":
                    factBonificacionVenta = decimal.Parse(fila.ClasePlata.ToString());

                    break;
                case "Oro":
                    factBonificacionVenta = decimal.Parse(fila.ClaseOro.ToString());

                    break;
                case "Diamante":
                    factBonificacionVenta = decimal.Parse(fila.ClaseDiamante.ToString());

                    break;
            }
            return factBonificacionVenta;
        }

    }
}