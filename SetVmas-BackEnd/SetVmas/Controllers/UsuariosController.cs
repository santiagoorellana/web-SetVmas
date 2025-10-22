using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PagedList.Core;
using SetVmas.utils;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;


namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : BaseController
    {
        private readonly IMapper _mapper;
        public IConfiguration Configuration { get; }
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<ClasesUsuarios> _clasesUsuariosrepository;
        private readonly Repository<Transferencia> _transferenciasrepository;
        private readonly Repository<Pagos> _pagosrepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        private readonly Repository<VariableConfiguracion> _configrepository;
        private readonly Repository<Anuncios> _anunciosRepository;
        private readonly Repository<Banners> _bannersrepository;
        private readonly Repository<OpcionAvanzadas> _opcionesAvanzadasrepository;
        private readonly Repository<Denuncias> _denunciasrepository;
        private readonly Repository<FactoresBonificacionVentas> _factoresbonificacionventaspository;
        static Random random;

        public UsuariosController(IMapper mapper, IUnitOfWork unitofwork, IConfiguration configuration) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            Configuration = configuration;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _clasesUsuariosrepository = _unitOfWork.ClasesUsuariosRepository;
            _transferenciasrepository = _unitOfWork.TransferenciaRepository;
            _pagosrepository = _unitOfWork.PagosRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
            _configrepository = _unitOfWork.VariableConfiguracionRepository;
            _anunciosRepository = _unitOfWork.AnunciosRepository;
            _bannersrepository = _unitOfWork.BannersRepository;
            _opcionesAvanzadasrepository = _unitOfWork.OpcionAvanzadasRepository;
            _denunciasrepository = _unitOfWork.DenunciasRepository;
            _factoresbonificacionventaspository = _unitOfWork.FactoresBonificacionVentasRepository;
        }

        // GET: api/Usuarios
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet]
        public List<UsuarioViewModel> GetUsuario(string col = "", string rol = "", string correo = "", string clase = "", string puntos = "",
                  string diasInactividad = "", string fechaCreacion = "", string sortDirection = "desc", int pageIndex = 1, int pageSize = 10, string codigo="")
        {

            IEnumerable<Usuario> lista = _unitOfWork.getUsuarios(col, rol, correo, clase, puntos, diasInactividad, fechaCreacion, sortDirection, pageIndex, pageSize, codigo);

            //switch (sortDirection)
            //{
            //    case "desc":
            //        {
            //            if ("Codigo".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Codigo);

            //            }
            //            else
            //            if ("Correo".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Correo);

            //            }
            //            else
            //            if ("Rol".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Rol);

            //            }
            //            else
            //            if ("Telefono".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Telefono);

            //            }
            //            else
            //            if ("Puntos".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Puntos);

            //            }
            //            else
            //            if ("FechaCreacion".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.FechaCreacion);

            //            }
            //            else
            //            {
            //                lista = lista.OrderByDescending(l => l.FechaUltimaEntrada);

            //            }
            //            break;
            //        }

            //    default:
            //        {
            //            if ("Codigo".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Codigo);

            //            }
            //            else
            //      if ("Correo".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Correo);

            //            }
            //            else
            //      if ("Rol".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Rol);

            //            }
            //            else
            //      if ("Telefono".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Telefono);

            //            }
            //            else
            //      if ("Puntos".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Puntos);

            //            }
            //            else
            //      if ("FechaCreacion".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.FechaCreacion);

            //            }
            //            else
            //            {
            //                lista = lista.OrderBy(l => l.FechaUltimaEntrada);

            //            }
            //            break;

            //        }

            //}

            return _mapper.Map<List<UsuarioViewModel>>(lista);
        }



        // GET: api/Usuarios/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuarioById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => x.UsuarioId == id).FirstAsync();
            usuario.CantReferidos = _usuariorepository.Queryable().Where(x => x.Anfitrion == usuario.Codigo && x.Activo == true).Count();

            Clasificar(usuario);

            await _unitOfWork.SaveChangesAsync();
            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }


        private void Clasificar(Usuario user)
        {
            ClasesUsuarios clase = new ClasesUsuarios();
            decimal puntos = 0;
            decimal antiguedad = Math.Floor((decimal)(DateTime.Today - user.FechaCreacion).Days / 30);
            switch (user.ClasesUsuarios.Nombre)
            {
                case "Iniciado":
                    clase = _clasesUsuariosrepository.Queryable().First(x => x.Nombre == "Bronce");
                    /*if (user.Puntos >= clase.RequisitoPuntos)
                        user.ClasesUsuarios = clase;*/
                    if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                        puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                    if (user.Puntos >= clase.RequisitoPuntos && puntos >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && antiguedad >= clase.RequisitoAntigueda)
                    {
                        user.ClasesUsuariosId = clase.ClasesUsuariosId;
                        user.ClasesUsuarios = clase;
                    }
                        
                    break;
                case "Bronce":
                    clase = _clasesUsuariosrepository.Queryable().First(x => x.Nombre == "Plata");
                    /*if (user.CantReferidos >= clase.RequisitoCantidadReferidos)
                        user.ClasesUsuarios = clase;*/
                    if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                        puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                    if (user.Puntos >= clase.RequisitoPuntos && puntos >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && antiguedad >= clase.RequisitoAntigueda)
                    {
                        user.ClasesUsuariosId = clase.ClasesUsuariosId;
                        user.ClasesUsuarios = clase;
                    }
                    break;
                case "Plata":
                    clase = _clasesUsuariosrepository.Queryable().First(x => x.Nombre == "Oro");
                    /*if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                        puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                    if (puntos >= clase.RequisitoCompras)
                        user.ClasesUsuariosId = clase.ClasesUsuariosId;*/
                    if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                        puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                    if (user.Puntos >= clase.RequisitoPuntos && puntos >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && antiguedad >= clase.RequisitoAntigueda)
                    {
                        user.ClasesUsuariosId = clase.ClasesUsuariosId;
                        user.ClasesUsuarios = clase;
                    }

                    break;
                case "Oro":
                    clase = _clasesUsuariosrepository.Queryable().First(x => x.Nombre == "Diamante");

                    /* if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                         puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                     if (puntos >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && user.FechaCreacion.Month >= clase.RequisitoAntigueda)
                         user.ClasesUsuariosId = clase.ClasesUsuariosId;*/

                    if (_pagosrepository.Queryable().Include(x => x.Usuario).Any(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado"))
                        puntos = _pagosrepository.Queryable().Include(x => x.Usuario).Where(x => x.Usuario.UsuarioId == user.UsuarioId && x.Estado == "Confirmado").Sum(x => x.Puntos);
                    if (user.Puntos >= clase.RequisitoPuntos && puntos >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && antiguedad >= clase.RequisitoAntigueda)
                    {
                        user.ClasesUsuariosId = clase.ClasesUsuariosId;
                        user.ClasesUsuarios = clase;
                    }

                    break;
            }
            if (clase.Nombre != null && clase.Nombre != "" && user.ClasesUsuarios == clase)
            {
                //Bonificacion por Registro
                Transferencia trans = new Transferencia();
                trans.Usuario = user;
                trans.UsuarioDestinoUsuario = user;
                trans.UsuarioFuenteUsuario = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();//aqui se debe poner una variable de session
                TipoTransferencia tipoReferido = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_SUBIR_CLASE").FirstOrDefault();
                trans.TipoTransferencia = tipoReferido;
                trans.Puntos = Convert.ToDecimal(user.ClasesUsuarios.BonificacionPorAlcanzarla);
                trans.Fecha = DateTime.Now;
                _transferenciasrepository.Create(trans);

            }
        }

        // GET: api/Usuarios/Count
        [HttpGet]
        [Route("Count")]
        public int GetUsuarioCount()
        {
            return _usuariorepository.Queryable().Where(x => x.Visible == true).Count();
        }


        // GET: api/Usuarios/List
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet]
        [Route("List")]
        public IActionResult GetUsuarioList()
        {

            var query = _usuariorepository.Queryable().Include(trans => trans.ClasesUsuarios).Select(x => new
            {
                UsuarioId = x.UsuarioId,
                Codigo = x.Codigo,
                Correo = x.Correo,
                Telefono = x.Telefono,
                FechaCreacion = x.FechaCreacion,
                FechaUltimaEntrada = x.FechaUltimaEntrada,
                ClasesUsuarios = x.ClasesUsuarios,
                Rol = x.Rol,
                Puntos = x.Puntos,
                Activo = x.Activo,
                Bloqueado = x.Bloqueado,
                Anfitrion = x.Anfitrion,

            }).ToList();

            return Ok(_mapper.Map<List<UsuarioViewModel>>(query));
        }


        // GET: api/Usuarios/Codigo/5
        [Authorize]
        [HttpGet]
        [Route("Codigo/{codigo}")]
        public async Task<IActionResult> GetUsuarioByCodigo([FromRoute] string codigo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => x.Codigo == codigo).FirstAsync();

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }


        // GET: api/Usuarios/Correo/5
        //   [Authorize]
        [HttpGet]
        [Route("Correo/{correo}")]
        public async Task<IActionResult> GetUsuarioByCorreo([FromRoute] string correo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var usuario = new Usuario();
            try
            {
                usuario = await _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => x.Correo == correo).FirstAsync();
            }
            catch (Exception e)
            {
                throw e;
            }


            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }


        // GET: api/Usuarios/Recuperar/5
        [HttpGet]
        [Route("Recuperar/{correo}")]
        public async Task<IActionResult> Recuperar([FromRoute] string correo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var usuario = new Usuario();

            if (_usuariorepository.Queryable().Where(x => x.Correo == correo).Any())
            {
                usuario = await _usuariorepository.Queryable().Where(x => x.Correo == correo).FirstAsync();
                var newPassword = GenerarPassword(8);
                usuario.Password = HttpUtility.UrlEncode(Tools.Encrypt(newPassword));
                string message = "Su nueva contraseña es: " + newPassword;

                Tools.EnviarCorreo(usuario.Correo, getFromMail(), "Recuperar Contraseña", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem());
                _usuariorepository.Update(usuario);
                await _unitOfWork.SaveChangesAsync();
            }
            else
                return NotFound();

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }

        // GET: api/Usuarios/RecaptchaValidate/5
        [HttpGet]
        [Route("RecaptchaValidate/{response}")]
        public async Task<IActionResult> RecaptchaValidate([FromRoute] string response)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // var response = HttpContext.Request.Form["g-recaptcha-response"];

            string secretKey = "6LfI1fcUAAAAALqv4o0n0EiFQ1c420PhDdBLasi3";
            var client = new WebClient();
            // get captcha verification result
            var verificationResultJson = client.DownloadString(string.Format
            ("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}",
            secretKey, response));
            // convert json to object
            var verificationResult = (CaptchaVerificationResult)JsonConvert.DeserializeObject(verificationResultJson);
            //Process verification result
            if (!verificationResult.Success)
            {
                if ((verificationResult as CaptchaVerificationResult).ErrorCodes.Count <= 0)
                {
                    return Ok(verificationResult);
                }
                var error = (verificationResult as CaptchaVerificationResult).ErrorCodes[0].ToLower();
                string sms = "";
                switch (error)
                {
                    case ("missing-input-secret"):
                        sms = "The secret parameter is missing.";
                        break;
                    case ("invalid-input-secret"):
                        sms = "The secret parameter is invalid or malformed.";
                        break;

                    case ("missing-input-response"):
                        sms = "The captcha input is missing.";
                        break;
                    case ("invalid-input-response"):
                        sms = "The captcha input is invalid or malformed.";
                        break;

                    default:
                        sms = "Ha ocurrido un error. Por favor inténtelo de nuevo";
                        break;
                }
                // return View(user);
                return NotFound(new ValidationResult(sms));
            }
            return Ok(verificationResult);
        }


        /*  [HttpPost]
          [Route("RecaptchaValidate")]
          public IActionResult RecaptchaValidate([FromBody] string captcha)
          {
              if (!ModelState.IsValid)
              {
                  return BadRequest(ModelState);
              }


              // var response = HttpContext.Request.Form["g-recaptcha-response"];
              var response = captcha;
              string secretKey = "6LdoH8YUAAAAAEkXuzxYcO_vyn6fqxDFRhiSKgBt";
              var client = new WebClient();
              // get captcha verification result
              var verificationResultJson = client.DownloadString(string.Format
              ("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}",
              secretKey, response));
              // convert json to object
              var verificationResult = JsonConvert.DeserializeObject
              (verificationResultJson);
              // process verification result
              //if (!verificationResult.Success)
              //{
              //    if (verificationResult.ErrorCodes.Count <= 0)
              //    {
              //        return View(user);
              //    }
              //    var error = verificationResult.ErrorCodes[0].ToLower();
              //    switch (error)
              //    {
              //        case ("missing-input-secret"):
              //            ViewBag.CaptchaMessage = "The secret parameter is missing.";
              //            break;
              //        case ("invalid-input-secret"):
              //            ViewBag.CaptchaMessage = "The secret parameter is invalid or malformed.";
              //            break;

              //        case ("missing-input-response"):
              //            ViewBag.CaptchaMessage = "The captcha input is missing.";
              //            break;
              //        case ("invalid-input-response"):
              //            ViewBag.CaptchaMessage = "The captcha input is invalid or malformed.";
              //            break;

              //        default:
              //            ViewBag.CaptchaMessage = "Error occurred. Please try again";
              //            break;
              //    }
              //    return View(user);
              //}
              //else
              //{
              //    // proceed form submission
              //}

              return Ok(verificationResult);
          }*/

        // GET: api/Usuarios/SingIn/5
        [HttpPost]
        [Route("SingIn")]
        public IActionResult SingIn([FromBody] LoginViewModel login)
        {
            Usuario usuario = null;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IActionResult response = Unauthorized();

            if (_usuariorepository.Queryable().Where(x => (x.Correo == login.UserName.Trim() || x.Codigo == login.UserName) && Tools.Decrypt(HttpUtility.UrlDecode(x.Password)) == login.Password && x.Activo == true).Any())
            {
                usuario = _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => (x.Correo == login.UserName || x.Codigo == login.UserName) && Tools.Decrypt(HttpUtility.UrlDecode(x.Password)) == login.Password).First();
                usuario.FechaUltimaEntrada = DateTime.Now;

                if (usuario.Bloqueado)
                {
                    if (usuario.FechaDesbloqueo <= DateTime.Now)
                    {
                        usuario.Bloqueado = false;
                    }
                }

                _usuariorepository.Update(usuario);
                _unitOfWork.SaveChangesAsync();

            }

            if (usuario != null)
            {
                var tokenString = GenerateJSONWebToken(usuario);
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private string GenerateJSONWebToken(Usuario userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, userInfo.Correo),
                new Claim(JwtRegisteredClaimNames.Email, userInfo.Codigo),
                new Claim("DateOfJoing", userInfo.FechaUltimaEntrada.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, userInfo.Rol),

            };

            var token = new JwtSecurityToken(Configuration["Jwt:Issuer"],
              Configuration["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddMinutes(3600),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        //[Authorize]
        [Route("Current")]
        public IActionResult GetCurrentUser()
        {
            Usuario usuario = CurrentUser();

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }

        // GET: api/Usuarios/Confirmar/5
        [HttpGet]
        [Route("Confirmar/{codigo}")]
        public async Task<IActionResult> Confirmar([FromRoute] string codigo)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Usuario usuario = new Usuario();
            try
            {
                if (_usuariorepository.Queryable().Where(x => x.Codigo == codigo && x.Activo == false).Any())
                {
                    Usuario admin = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();
                    usuario = _usuariorepository.Queryable().Where(x => x.Codigo == codigo).First();
                    usuario.Activo = true;
                   
                    if(usuario.Puntos < 10)//Para q no bonifique cuando es una reauntenticacion
                    {
                        //Bonificacion por registro 
                        Transferencia trans = new Transferencia();
                        trans.UsuarioId = usuario.UsuarioId;
                        trans.UsuarioDestinoUsuarioId = usuario.UsuarioId;
                        trans.UsuarioFuenteUsuarioId = admin.UsuarioId;
                        TipoTransferencia tipo = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_REGISTRO").First();
                        trans.TipoTransferencia = tipo;
                        trans.Puntos = Convert.ToDecimal(tipo.Cantidad);
                        trans.Fecha = DateTime.Now;
                        usuario.Puntos += Convert.ToDecimal(tipo.Cantidad);
                        _transferenciasrepository.Create(trans);
                    }
                   

                    if ((usuario.Anfitrion != admin.Codigo) && (usuario.Anfitrion != null) && (usuario.Anfitrion != ""))
                    {
                        Usuario anfitrion = _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => x.Codigo == usuario.Anfitrion).First();

                        int cantidad_referidos = _usuariorepository.Queryable().Where(x => x.Anfitrion == anfitrion.Codigo).Count();
                        int cant_x_primeros_ref = int.Parse(_configrepository.Queryable().Single(x => x.NombreCodigo == "X_PRIM_REF").Valor);
                        if (cantidad_referidos <= cant_x_primeros_ref) {

                            //Bonificacion por referido
                            Transferencia transRef = new Transferencia();
                            transRef.UsuarioId = anfitrion.UsuarioId;
                            transRef.UsuarioDestinoUsuarioId = anfitrion.UsuarioId;
                            transRef.UsuarioFuenteUsuarioId = admin.UsuarioId;
                            TipoTransferencia tipoRef = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_REFERIDO").First();
                            transRef.TipoTransferencia = tipoRef;
                            transRef.Fecha = DateTime.Now;
                            transRef.Puntos = Convert.ToDecimal(tipoRef.Cantidad);
                            anfitrion.Puntos += Convert.ToDecimal(tipoRef.Cantidad);
                            _transferenciasrepository.Create(transRef);
                            //Add Transferencia por bonificacion x referido

                            //   _unitOfWork.BoniReferido(usuario.UsuarioId, anfitrion.Codigo, Convert.ToDecimal(_tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_DENUNCIA").First().Cantidad));
                            //Transferencia por bonificacion x referido





                            /*switch (anfitrion.ClasesUsuarios.Nombre)
                             {
                                 case "Iniciado":
                                     transRef.Puntos = Convert.ToDecimal(_factoresbonificacionventaspository.Queryable().Where(x => x.Nivel == 1).First().ClaseIniciada);
                                     break;
                                 case "Bronce":
                                     transRef.Puntos = Convert.ToDecimal(_factoresbonificacionventaspository.Queryable().Where(x => x.Nivel == 1).First().ClaseBronce);
                                     break;
                                 case "Plata":
                                     transRef.Puntos = Convert.ToDecimal(_factoresbonificacionventaspository.Queryable().Where(x => x.Nivel == 1).First().ClasePlata);
                                     break;
                                 case "Oro":
                                     transRef.Puntos = Convert.ToDecimal(_factoresbonificacionventaspository.Queryable().Where(x => x.Nivel == 1).First().ClaseOro);
                                     break;
                                 default:
                                     transRef.Puntos = Convert.ToDecimal(_factoresbonificacionventaspository.Queryable().Where(x => x.Nivel == 1).First().ClaseDiamante);
                                     break;
                             }*/




                        }

                    }
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                throw;
            }

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }

        public static string GenerarPassword(int longitud)
        {
            string contraseña = string.Empty;
            string[] letras = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
            Random EleccionAleatoria = new Random();

            for (int i = 0; i < longitud; i++)
            {
                int LetraAleatoria = EleccionAleatoria.Next(0, 100);
                int NumeroAleatorio = EleccionAleatoria.Next(0, 9);

                if (LetraAleatoria < letras.Length)
                {
                    contraseña += letras[LetraAleatoria];
                }
                else
                {
                    contraseña += NumeroAleatorio.ToString();
                }
            }
            return contraseña;
        }
        // Post: api/Usuarios/CambiarPassword
        [HttpPost]
        [Route("CambiarPassword")]
        public async Task<IActionResult> CambiarPassword([FromBody] Usuario user)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var usuario = new Usuario();

            if (_usuariorepository.Queryable().Where(x => x.Codigo == user.Codigo).Any())
            {
                usuario = await _usuariorepository.Queryable().Where(x => x.Codigo == user.Codigo).FirstAsync();
                var newPassword = GenerarPassword(6);
                usuario.Password = HttpUtility.UrlEncode(Tools.Encrypt(newPassword));
                _usuariorepository.Update(usuario);
                string message = "Su nueva contraseña es: " + newPassword;

                Tools.EnviarCorreo(user.Correo, getFromMail(), "Recuperar Contraseña", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem());

                await _unitOfWork.SaveChangesAsync();
            }
            else
                return NotFound();

            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }


        // PUT: api/Usuarios/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario([FromRoute] int id, [FromBody] Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuario.UsuarioId)
            {
                return BadRequest();
            }
            var oldUser = _usuariorepository.Queryable().AsNoTracking().First(x => x.Correo == usuario.Correo);

            try
            {
                if (_usuariorepository.Queryable().Where(x => x.Correo == usuario.Correo).Any())
                {
                    usuario.Activo = usuario.Activo;
                    usuario.ClasesUsuarios = _clasesUsuariosrepository.Find(usuario.ClasesUsuarios.ClasesUsuariosId);
                    if (!oldUser.Password.Trim().Equals(usuario.Password.Trim()))
                        usuario.Password = HttpUtility.UrlEncode(Tools.Encrypt(usuario.Password));
                   
                    _usuariorepository.Update(usuario);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                    return NotFound();


            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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



        // POST: api/Usuarios
        [HttpPost]
        //  public async Task<IActionResult> PostUsuario([FromBody] Usuario usuario, string Captcha)
        public async Task<IActionResult> PostUsuario([FromBody] JObject data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Usuario usuario = new Usuario();

            if (!Tools.VerificarCaptcha(data["Captcha"].ToString()))
                return NotFound(new ValidationResult("Ha ocurrido un error al verificar su captcha."));
            else
            {
                bool reautenticar = data["reautenticar"] != null && data["reautenticar"].ToString().Equals("1");


                if (reautenticar)
                {
                    int id = int.Parse(data["userId"].ToString());
                    Usuario actual = _usuariorepository.Find(id);
                    if (!UsuarioExistsByMail(data["Correo"].ToString()))
                    {
                        /*if (string.IsNullOrEmpty(data["Anfitrion"].ToString()))
                        {
                            data["Anfitrion"] = "0001";
                        }*/


                        actual.Correo = data["Correo"].ToString();
                       // actual.Anfitrion = data["Anfitrion"].ToString();
                        actual.Telefono = data["Telefono"].ToString();
                        actual.Activo = false;
                        actual.Password = HttpUtility.UrlEncode(Tools.Encrypt(data["Password"].ToString()));

                        _usuariorepository.Update(actual);
                        
                        //string codigo = "";
                        //do
                        //{
                        //    codigo = GetRandomHexNumber(usuario.UsuarioId);

                        //} while (_usuariorepository.Queryable().Any(x => x.Codigo == codigo));

                        //usuario.Codigo = codigo;

                        //await _unitOfWork.SaveChangesAsync();

                        //Enviar correo   

                        //  var tokenString = GenerateJSONWebToken(usuario);
                        //  var confirmationLink = Url.Action(nameof(Confirmar2), "Usuarios", new { tokenString, email = usuario.Correo }, Request.Scheme);
                        // response = Ok(new { token = tokenString });
                        var confirmationLink = "https://setvmas.com/#/email-confirm";
                        string message = "Gracias por registarse con nosotros. "
                            + "<br> Su código de confirmación es: "
                            + "<br><h4><strong>" + actual.Codigo + "</strong></h4>"
                            + "<br> Por favor haga click en el siguiente enlace para confirmar su correo: "
                            + "<br>" + "<a style='font-weight: bold; ' href='" + confirmationLink + "'>" + confirmationLink + "</a>" ;

                       if( Tools.EnviarCorreo(actual.Correo, getFromMail(), "Verificar Correo", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem()))
                            await _unitOfWork.SaveChangesAsync();
                       else
                            return NotFound(new ValidationResult("Ocurrió un error cuando se enviaba el correo."));



                    }
                    else
                        return NotFound(new ValidationResult("Ya existe un usuario registrado con ese correo."));
                }

                else
                if (!UsuarioExistsByMail(data["Correo"].ToString()))
                {
                    if (string.IsNullOrEmpty(data["Anfitrion"].ToString()))
                    {
                        data["Anfitrion"] = "0001";
                    }

                    if (UsuarioExistsByCodigo(data["Anfitrion"].ToString()))
                    {
                        usuario.Correo = data["Correo"].ToString();
                        usuario.Anfitrion = data["Anfitrion"].ToString();
                        usuario.Telefono = data["Telefono"].ToString();
                        usuario.Activo = false;
                        usuario.Activo = false;
                        usuario.Bloqueado = false;
                        usuario.FechaCreacion = DateTime.Now;
                        usuario.FechaUltimaEntrada = DateTime.Now;

                        usuario.FechaModificacion = usuario.FechaCreacion;
                        usuario.Rol = "Cliente";
                        usuario.ClasesUsuarios = _clasesUsuariosrepository.Queryable().Where(x => x.Nombre == "Iniciado").First();
                        usuario.Password = HttpUtility.UrlEncode(Tools.Encrypt(data["Password"].ToString()));
                        usuario.Visible = true;
                        _usuariorepository.Create(usuario);
                        await _unitOfWork.SaveChangesAsync();
                        string codigo = "";
                        do
                        {
                            codigo = GetRandomHexNumber(usuario.UsuarioId);

                        } while (_usuariorepository.Queryable().Any(x => x.Codigo == codigo));

                        usuario.Codigo = codigo;

                        await _unitOfWork.SaveChangesAsync();

                        //Enviar correo   

                        //  var tokenString = GenerateJSONWebToken(usuario);
                        //  var confirmationLink = Url.Action(nameof(Confirmar2), "Usuarios", new { tokenString, email = usuario.Correo }, Request.Scheme);
                        // response = Ok(new { token = tokenString });
                        var confirmationLink = "https://setvmas.com/#/email-confirm";
                        string message = "Gracias por registarse con nosotros. "
                            + "<br> Su código de confirmación es: "
                            + "<br><h4><strong>" + codigo + "</strong></h4>"
                            + "<br> Por favor haga click en el siguiente enlace para confirmar su correo: "
                            + "<br>" + "<a style='font-weight: bold; ' href='" + confirmationLink + "'>" + confirmationLink +"</a>"
                        +"<br>";

                        Tools.EnviarCorreo(usuario.Correo, getFromMail(), "Verificar Correo", message, getHost(), getPortMail(), getUserMail(), getPassMail(), getSecurityMail(), getPrivacyNote(), getRem());
                    }
                    else
                        return NotFound(new ValidationResult("No existe ningún anfitrión registrado con ese código."));
                }
                else
                    return NotFound(new ValidationResult("Ya existe un usuario registrado con ese correo."));


                // usuario.Codigo = HttpUtility.UrlEncode(Tools.Encrypt(usuario.Codigo));
            }
            return CreatedAtAction("GetUsuario", new { id = usuario.UsuarioId }, usuario);
        }

        public static string GetRandomHexNumber(int digits)
        {
            random = new Random();
            byte[] buffer = new byte[1];
            random.NextBytes(buffer);
            string result = String.Concat(buffer.Select(x => x.ToString("X4")).ToArray());
            //if (digits % 2 == 0)
            return result;
            // return result + random.Next(4).ToString("X");
        }


        // DELETE: api/Usuarios/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _usuariorepository.Queryable().Where(x => x.UsuarioId == id).FirstAsync();
            if (usuario == null)
            {
                return NotFound();
            }
            if (usuario.Correo == "invitado@gmail.com")
            {
                return NoContent();
            }
            if (usuario.Activo == false)
            {
                _usuariorepository.Delete(usuario);
            }
            else
            {
                usuario.Visible = false;

            }
            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw;
            }


            return Ok(_mapper.Map<UsuarioViewModel>(usuario));
        }

        private bool UsuarioExists(int id)
        {
            return _usuariorepository.Queryable().Any(e => e.UsuarioId == id);
        }

        private bool UsuarioExistsByMail(string mail)
        {
            return (_usuariorepository.Queryable().Where(d => d.Correo == mail).Count() == 0) ? false : true;

        }
        private bool UsuarioExistsByCodigo(string codigo)
        {
            return (_usuariorepository.Queryable().Where(d => d.Codigo == codigo).Count() == 0) ? false : true;
        }























        //EL ESPACIO ES PARA EVITAR PROBLEMAS DE MEZCLA ESTOY AGREGANDO METODOS PARA EL HOME

        /// Para la cantidad de usuarios usamos el mismo metodo Count de aqui

        // GET: api/Usuarios/AnunciosCount
        [HttpGet]
        [Route("AnunciosCount")]
        public int GetUsuarioAnunciosCount()
        {
            return _anunciosRepository.Queryable().Where(x=>x.IsActivo && x.IsVisible).Count();
        }


        // GET: api/Usuarios/Puntos
        [HttpGet]
        [Route("Puntos")]
        public decimal GetUsuarioPuntos()
        {
            return _usuariorepository.Queryable().Where(x => x.Activo).Sum(u => u.Puntos);
        }

        // GET: api/Usuarios/BannerSuperior
        [HttpGet]
        [Route("BannerSuperior")]
        public int GetUsuarioBannerSuperior()
        {
            return _opcionesAvanzadasrepository.Queryable().Include(b => b.Anuncio).Where(b => b.TipoOpcionId == 11 && b.IsActivo && b.Anuncio.IsActivo && b.Anuncio.IsVisible).Count();
        }

        // GET: api/Usuarios/BannerInferior
        [HttpGet]
        [Route("BannerInferior")]
        public int GetUsuarioBannerInferior()
        {
            return _opcionesAvanzadasrepository.Queryable().Include(b=>b.Anuncio).Where(b => b.TipoOpcionId == 10 && b.IsActivo && b.Anuncio.IsActivo && b.Anuncio.IsVisible).Count();
        }

        // GET: api/Usuarios/BannerActivo
        [HttpGet]
        [Route("BannerActivo")]
        public int GetUsuarioBannerActivo()
        {
            return _bannersrepository.Queryable().Include(x => x.Anuncio).Where(b => b.IsActivo && b.Anuncio.IsVisible && b.Anuncio.IsActivo && (b.Tipo == "Inferior" || b.Tipo == "Superior escritorio")).Count();
        }

        // GET: api/Usuarios/LastMes
        [HttpGet]
        [Route("LastMes")]
        public int GetUsuarioLastMes()
        {
            DateTime unMesAntes = DateTime.Now.AddMonths(-1);
            return _usuariorepository.Queryable().Where(b => b.FechaCreacion < unMesAntes && b.Activo).Count();
        }

        // GET: api/Usuarios/View
        [HttpGet]
        [Route("View")]
        public int GetUsuarioView()
        {
            return _anunciosRepository.Queryable().Sum(a => a.ContadorView);
        }

        // GET: api/Usuarios/Auto
        [HttpGet]
        [Route("Auto")]
        public int GetUsuarioAuto()
        {

            return _opcionesAvanzadasrepository.Queryable().Include(b => b.Anuncio)
                .Where(x =>( x.TipoOpcion.NombreCodigo == "AUTO_TOP" || x.TipoOpcion.NombreCodigo == "AUTO_1" || x.TipoOpcion.NombreCodigo == "AUTO_6" 
                || x.TipoOpcion.NombreCodigo == "AUTO_24" || x.TipoOpcion.NombreCodigo == "AUTO_30" || x.TipoOpcion.NombreCodigo == "AUTO_3") && x.IsActivo && x.Anuncio.IsActivo && x.Anuncio.IsVisible).Count();
        }

        // GET: api/Usuarios/VentasUsuario
        [HttpGet]
        [Route("VentasUsuario")]
        public int GetUsuarioVentasUsuario()
        {

            return _transferenciasrepository.Queryable().Where(a => a.TipoTransferencia.NombreCodigo == "VENTA" ).Count();
        }

        // GET: api/Usuarios/DenunciasPendiente
        [HttpGet]
        [Route("DenunciasPendiente")]
        public int GetUsuarioDenunciasPendiente()
        {

            return _denunciasrepository.Queryable().Where(d => d.Estado == "Pendiente").Count();
        }
        /// <summary>
        /// Metodo para saber las compras por confirmar
        /// </summary>
        /// <returns></returns>
        // GET: api/Usuarios/ComprasConfirmar
        [HttpGet]
        [Route("ComprasConfirmar")]
        public int GetUsuarioComprasConfirmar()
        {
            return _pagosrepository.Queryable().Where(x => x.Estado == "No Confirmado").Count();
        }

        // GET: api/Usuarios/AnunciosInvitado
        [HttpGet]
        [Route("AnunciosInvitado")]
        public int GetUsuarioAnunciosInvitado()
        {

            return _anunciosRepository.Queryable()
                .Include(a => a.Usuario)
                .Where(d => d.Usuario.Correo == "invitado@gmail.com").Count();
        }

        // GET: api/Usuarios/Web
        [HttpGet]
        [Route("Web")]
        public int GetUsuarioWeb()
        {

            return _opcionesAvanzadasrepository.Queryable().Include(x=>x.Anuncio).Where(d => d.TipoOpcion.NombreCodigo == "ENLACE_WEB" && d.Anuncio.IsActivo && d.Anuncio.IsVisible ).Count();
        }


        /*METODOS PARA OFICINA VIRTUAL*/
        /// <summary>
        /// Devuelve la lista de referidos del usuario en la oficina
        /// </summary>
        /// <param name="id">Id </param>
        /// <returns></returns>
        // GET: api/Usuarios/ReferidosList
        /*  [HttpGet]
          [Route("ReferidosList/{id}")]
          public IActionResult GetListaReferidosUsuario([FromRoute] int id)
          {
              Usuario userAct = _usuariorepository.Queryable().First(x => x.UsuarioId == id);
              List<Usuario> lista = new List<Usuario>();
              lista = _usuariorepository.Queryable().Where(d => d.Anfitrion == userAct.Codigo).ToList();
              return Ok(_mapper.Map<List<UsuarioViewModel>>(lista));
          }*/

        // GET: api/Usuarios/ReferidosList
        [HttpGet]
        [Route("ReferidosList")]
        public IActionResult GetListaReferidosUsuario(string col = "", int filter = 0, string sortDirection = "asc", int pageIndex = 0, int pageSize = 0)
        {
            List<Usuario> lista = new List<Usuario>();
            if (_usuariorepository.Queryable().Any(x => x.UsuarioId == filter))
            {
                Usuario userAct = _usuariorepository.Queryable().First(x => x.UsuarioId == filter);
                lista = _usuariorepository
                    .Queryable()
                    .Where(d => d.Anfitrion == userAct.Codigo)
                    .ToPagedList(pageIndex, pageSize)
                    .ToList();
            }

            return Ok(_mapper.Map<List<UsuarioViewModel>>(lista));
        }

        /// <summary>
        /// Devuelve la cantidad de referidos del usuario en la oficina
        /// </summary>
        /// <param name="id">Id del usuario autenticado </param>
        /// <returns></returns>
        // GET: api/Usuarios/ReferidosCount/1
        [HttpGet]
        [Route("ReferidosCount/{id}")]
        public int GetCantReferidosUsuario([FromRoute] int id)
        {
            int cont = 0;
            if (_usuariorepository.Queryable().Any(x => x.UsuarioId == id))
            {
                Usuario userAct = _usuariorepository.Queryable().First(x => x.UsuarioId == id);
                cont = _usuariorepository.Queryable().Where(d => d.Anfitrion == userAct.Codigo).Count();
            }
            return cont;
        }

        /// <summary>
        /// Devuelve los anuncios del usuario para la oficina
        /// </summary>
        /// <param name="id">Id del usuario autenticado </param>
        /// <returns></returns>
        // GET: api/Usuarios/Anuncios/1
        [HttpGet]
        [Route("Anuncios/{id}")]
        public IActionResult GetAnunciosByUsuario([FromRoute] int id)
        {
            List<Anuncios> lista = new List<Anuncios>();
            //lista = _context.Anuncios.Include(x => x.OpcionAvanzadas).Where(d => d.Usuario.UsuarioId == id).ToList();
            //Zuleidy actualizar anuncio
            lista = _anunciosRepository.Queryable()
                     .Include(l => l.Usuario)
                     .Include(l => l.AnuncioEtiquetas)
                     .ThenInclude(t => t.Etiqueta)
                     .ThenInclude(y => y.CategoriaEtiqueta)
                     .Include(x => x.AlmacenImagen)
                     .Include(x => x.Banners)
                     .Where(d => d.Usuario.UsuarioId == id)
                     .OrderByDescending(d => d.FechaModificacion)
                     .ToList();

            foreach (var item in lista)
            {
                item.OpcionAvanzadas = _opcionesAvanzadasrepository.Queryable().Include(l => l.TipoOpcion).Where(op => op.AnuncioId == item.AnuncioId && op.IsActivo == true)
                               .Include(p => p.TipoOpcion)
                               .ToList();
            }

            return Ok(_mapper.Map<List<AnuncioViewModel>>(lista));
        }

        // GET: api/Anuncios/AvanzadosCount
        [HttpGet]
        [Route("VolumenCompras/{id}")]
        public decimal GetVolumenCompras([FromRoute] int id)
        {

            decimal cantidad = 0;
            cantidad = _transferenciasrepository.Queryable()
                .Where(x => x.TipoTransferencia.NombreCodigo == "COMP_DIRECT" && x.Usuario.UsuarioId == id)
                .Sum(x => x.Puntos);

            return cantidad;

        }


        [Authorize(Roles = "Super Administrador")]
        [HttpGet]
        [Route("Roles")]
        public List<string> GetRoles()
        {
            List<string> roles = new List<string>();
            roles.Add("Super Administrador");
            roles.Add("Administrador");
            roles.Add("Clasificador");
            roles.Add("Cliente");
            roles.Add("Colaborador");
            roles.Add("Director");
            roles.Add("Invitado");

            return roles;
        }



        // PUT: api/Usuarios/5
        [Authorize]
        [HttpPost("OficinaUpdateUser/{id}")]
        public async Task<IActionResult> PutUsuarioOficina([FromRoute] int id, [FromBody] Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuario.UsuarioId)
            {
                return BadRequest();
            }

            var oldUser = _usuariorepository.Queryable().AsNoTracking().First(x => x.Correo == usuario.Correo);

            try
            {
                if (_usuariorepository.Queryable().Where(x => x.Correo == usuario.Correo).Any())
                {
                    usuario.Activo = usuario.Activo;
                    usuario.ClasesUsuarios = _clasesUsuariosrepository.Find(usuario.ClasesUsuarios.ClasesUsuariosId);
                    if (!oldUser.Password.Trim().Equals(usuario.Password.Trim()))
                        usuario.Password = HttpUtility.UrlEncode(Tools.Encrypt(usuario.Password));

                    _usuariorepository.Update(usuario);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                    return NotFound();


            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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


    }
}