using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
    public class DenunciasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Denuncias> _denunciasRepository;
        private readonly Repository<MotivoDenuncia> _motivoDenunciaRepository;
        private readonly Repository<Anuncios> _anunciosRepository;
        private readonly Repository<OpcionAvanzadas> _opcionesAvanzadasrepository;
        private readonly Repository<AnuncioEtiquetas> _anuncioEtiquetasrepository;
        private readonly Repository<Banners> _bannersrepository;
        private readonly Repository<AlmacenImagen> _imagenesAdicionalesrepository;
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        private readonly Repository<Transferencia> _transferenciaRepository;
        private readonly Repository<VariableConfiguracion> _variableConfigRepository;
        private readonly Repository<AnuncioBonificado> _anunciosBonificadosRepository;

        public DenunciasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _denunciasRepository = _unitOfWork.DenunciasRepository;
            _motivoDenunciaRepository = _unitOfWork.MotivoDenunciaRepository;
            _anunciosRepository = _unitOfWork.AnunciosRepository;
            _opcionesAvanzadasrepository = _unitOfWork.OpcionAvanzadasRepository;
            _anuncioEtiquetasrepository = _unitOfWork.AnuncioEtiquetasRepository;
            _bannersrepository = _unitOfWork.BannersRepository;
            _imagenesAdicionalesrepository = _unitOfWork.AlmacenImagenRepository;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
            _transferenciaRepository = _unitOfWork.TransferenciaRepository;
            _variableConfigRepository = _unitOfWork.VariableConfiguracionRepository;
            _anunciosBonificadosRepository = _unitOfWork.AnuncioBonificadoRepository;
        }

        // GET: api/Denuncias
        [Authorize(Roles = "Super Administrador, Administrador, Clasificador, Director")]
        [HttpGet]
        public IEnumerable<DenunciaViewModel> GetDenuncias(string col = "Anuncio", string estado = "", string antiguedad = "", string anuncio = "", string usuario = "", string codigo = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
           // IEnumerable<DenunciaViewModel> lista = _mapper.Map<List<DenunciaViewModel>>(_unitOfWork.getDenuncias(col,estado, antiguedad, anuncio, sortDirection, pageIndex, pageSize));
           IEnumerable<DenunciaViewModel> lista = getDenuncias(col,estado, antiguedad, anuncio, usuario, codigo, sortDirection, pageIndex, pageSize, this.User.IsInRole("Clasificador") ? "Clasificador" : "");

            //switch (sortDirection)
            //{
            //    case "desc":
            //        {
            //            if ("Estado".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Estado);

            //            }
            //            if ("FechaCreacion".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.FechaCreacion);

            //            }
            //            else
            //            if ("Motivo".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.MotivoDenuncia);

            //            }
            //            else
            //            if ("Anuncio".Equals(col))
            //            {
            //                lista = lista.OrderByDescending(l => l.Anuncio.Titulo);

            //            }
            //            else
            //            {
            //                lista = lista.OrderByDescending(l => l.Usuario.Correo);

            //            }
            //            break;
            //        }

            //    default:
            //        {
            //            if ("Estado".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Estado);

            //            }
            //            if ("FechaCreacion".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.FechaCreacion);

            //            }
            //            else
            //            if ("Motivo".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.MotivoDenuncia);

            //            }
            //            else
            //            if ("Anuncio".Equals(col))
            //            {
            //                lista = lista.OrderBy(l => l.Anuncio.Titulo);

            //            }
            //            else
            //            {
            //                lista = lista.OrderBy(l => l.Usuario.Correo);

            //            }

            //            break;

            //        }
            //}
           
            return lista.OrderBy(x=>x.FechaCreacion);

        }

        //GET: api/Denuncias/User/1
        [Authorize(Roles = "Super Administrador, Administrador, Clasificador, Cliente")]
        [HttpGet]
        [Route("User/{Id}")]
        public IEnumerable<DenunciaViewModel> DenunciasByUser([FromRoute] int Id, int pageIndex = 1, int pageSize = 10)
        {
            //IEnumerable<DenunciaViewModel> lista = _mapper.Map<List<DenunciaViewModel>>(_denunciasRepository.Queryable().Include(t => t.MotivoDenuncia).Include(t => t.Usuario).Include(t => t.Anuncio).Where(p => p.Usuario.UsuarioId == Id).OrderByDescending(t => t.FechaCreacion)
            //       .ToPagedList(pageIndex, pageSize).ToList());

            IEnumerable<DenunciaViewModel> lista = getDenuncias("FechaCreacion", "", "", "", Id.ToString(), "", "desc", pageIndex, pageSize, this.User.IsInRole("Clasificador") ? "Clasificador" : "");
            
            return lista;
        }


        // GET: api/Denuncias/Count
        [Authorize(Roles = "Super Administrador, Administrador, Clasificador, Director")]
        [HttpGet]
        [Route("Count")]
        public int GetDenunciaCount()
        {
            return _denunciasRepository.Queryable().Count();
        }


        // GET: api/Denuncias/Count/1
        [Authorize]
        [HttpGet]
        [Route("Count/{userId}")]
        public int GetDenunciaCountByUser([FromRoute] int userId)
        {
            return _denunciasRepository.Queryable().Where(x => x.UsuarioId == userId).Count();

        }

        // PUT: api/Denuncias/5
        [Authorize(Roles = "Super Administrador, Administrador, Clasificador, Director")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDenuncia([FromRoute] int id, [FromBody] DenunciaViewModel model)
        {

            Denuncias denuncia = new Denuncias();

            if (!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }

            if (id != model.DenunciaId)
            {
                return BadRequest();
            }
           

            denuncia.DenunciaId = model.DenunciaId;
            denuncia.Estado = model.Estado;
            denuncia.FechaCreacion = model.FechaCreacion;
            denuncia.FechaModificacion = model.FechaModificacion;
            var motivo = _motivoDenunciaRepository.Queryable().Where(x => x.Nombre == model.MotivoDenuncia).First();
            denuncia.MotivoDenunciaId = motivo.MotivoDenunciaId;
            denuncia.MotivoDenuncia= motivo;
            denuncia.AnuncioId = model.AnuncioId;
            //denuncia.Anuncio = _anunciosRepository.Find(model.Anuncio.AnuncioId);
            denuncia.Usuario = _usuariorepository.Find(model.UsuarioId);
            bool hayMas = _denunciasRepository.Queryable().Any(x => x.AnuncioId == denuncia.AnuncioId && x.DenunciaId != denuncia.DenunciaId);
            List<Denuncias> listD = _denunciasRepository.Queryable().Where(x => x.AnuncioId == denuncia.AnuncioId && x.DenunciaId != denuncia.DenunciaId).ToList();
            try
            {
                _denunciasRepository.Update(denuncia);
            }
            catch (Exception ex)
            {

                throw;
            }
          
            if ((denuncia.Estado == "Procede") && (_anunciosRepository.Find(denuncia.AnuncioId).IsActivo == true))
            {
                Anuncios anuncio = _anunciosRepository.Queryable().Include(x => x.Usuario).First(x => x.AnuncioId == denuncia.AnuncioId);
                anuncio.IsActivo = false;
                anuncio.IsVisible = false;
                // BLOQUEANDO USUARIO
                Usuario usuarioDenunciado = anuncio.Usuario;

                VariableConfiguracion tiempoDeBloqueo = _variableConfigRepository.Queryable().Where(x => x.NombreCodigo == "TIEMPO_BLOQUEO").First();
                usuarioDenunciado.FechaDesbloqueo = DateTime.Now.AddDays(double.Parse(tiempoDeBloqueo.Valor));
                usuarioDenunciado.Bloqueado = true;
                _usuariorepository.Update(usuarioDenunciado);

                // FIN BLOQUEANDO USUARIO


                if (_opcionesAvanzadasrepository.Queryable().Where(x => x.IsActivo == true && x.AnuncioId == denuncia.AnuncioId).Any())
                {
                    List<OpcionAvanzadas> opciones = _opcionesAvanzadasrepository.Queryable().Include(x => x.TipoOpcion).Where(x => x.IsActivo == true && x.AnuncioId == denuncia.AnuncioId).ToList();
                    for (int i = 0; i < opciones.Count; i++)
                    {
                        OpcionAvanzadas opcion = opciones[i];
                        switch (opcion.TipoOpcion.NombreCodigo)
                        {
                            case "ETIQUETA":
                                _anuncioEtiquetasrepository.DeleteRange(_anuncioEtiquetasrepository.Queryable().Where(x => x.AnuncioId == opcion.AnuncioId && x.IsFree == false).ToList());
                                break;
                            case "ENLACE_WEB":
                                _anunciosRepository.Find(denuncia.AnuncioId).Url = "";
                                break;
                            case "BAN_INF":
                                _bannersrepository.DeleteRange(_bannersrepository.Queryable().Where(x => x.AnuncioId == opcion.AnuncioId && x.Tipo == "Inferior").ToList());
                                break;
                            case "BAN_SUP":
                                _bannersrepository.DeleteRange(_bannersrepository.Queryable().Where(x => x.AnuncioId == opcion.AnuncioId && x.Tipo.Contains("Superior")).ToList());
                                break;
                            case "IMG_ADI":
                                _imagenesAdicionalesrepository.DeleteRange(_imagenesAdicionalesrepository.Queryable().Where(x => x.AnuncioId == opcion.AnuncioId && x.IsFree == false).ToList());
                                break;
                        }
                        _opcionesAvanzadasrepository.Find(opcion.OpcionAvanzadaId).IsActivo = false;
                    }
                    
                }
                //denuncia.Anuncio.IsActivo = false;


                Denuncias primeraDenuncia = _denunciasRepository.Queryable().Include(x=>x.Usuario).Where(x => x.AnuncioId == denuncia.AnuncioId ).OrderBy(x=>x.FechaCreacion).FirstOrDefault();
                ////Add Transferencia por bonificacion x denuncia
                Usuario admin = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();
                Transferencia trans = new Transferencia();
                trans.UsuarioId = primeraDenuncia.Usuario.UsuarioId;
                trans.UsuarioDestinoUsuarioId = primeraDenuncia.Usuario.UsuarioId;
                trans.UsuarioFuenteUsuarioId = admin.UsuarioId;
                trans.Fecha = DateTime.Now;
                trans.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_DENUNCIA").First().TipoTransferenciaId;
                trans.Puntos = Convert.ToDecimal(_tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_DENUNCIA").First().Cantidad);
                trans.Fecha = DateTime.Now;
                _transferenciaRepository.Create(trans);
                ////Add Transferencia por bonificacion x denuncia

                //Add Transferencia por bonificacion x referido
                if (denuncia.Usuario.Anfitrion != admin.Codigo)
                    _unitOfWork.BoniReferido(primeraDenuncia.Usuario.UsuarioId, primeraDenuncia.Usuario.Anfitrion, Convert.ToDecimal(_tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_DENUNCIA").First().Cantidad));
                //Transferencia por bonificacion x referido

                //Update los puntos del usuario
                Usuario user = _usuariorepository.Queryable().First(x => x.UsuarioId == primeraDenuncia.UsuarioId);
                user.Puntos+= trans.Puntos;
                _usuariorepository.Update(user);
                //Update los puntos del usuario




                ////Add Transferencia por clasificar denuncia
                //Usuario admin = _usuariorepository.Queryable().Where(x => x.Correo == "info@setvmas.com").First();
                Transferencia trans1 = new Transferencia();
                trans1.UsuarioId = model.UsuarioClasificaId;
                trans1.UsuarioDestinoUsuarioId = model.UsuarioClasificaId; 
                trans1.UsuarioFuenteUsuarioId = admin.UsuarioId;
                trans1.Fecha = DateTime.Now;
                trans1.TipoTransferenciaId = _tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_CLASIF").First().TipoTransferenciaId;
                trans1.Puntos = Convert.ToDecimal(_tiposTransferenciasrepository.Queryable().Where(x => x.NombreCodigo == "BONIF_CLASIF").First().Cantidad);
                trans1.Fecha = DateTime.Now;
                _transferenciaRepository.Create(trans1);
                ////Add Transferencia por bonificacion x denuncia

                

                //Update los puntos del usuario
                Usuario user1 = _usuariorepository.Queryable().First(x => x.UsuarioId == model.UsuarioClasificaId);
                user1.Puntos += trans1.Puntos;
                _usuariorepository.Update(user1);
                //Update los puntos del usuario



                //SI EL ANUNCIO FUE DENUNCIADO SE QUITA LA BONIFICACION
                if (_anunciosBonificadosRepository.Queryable().Any(x => x.AnuncioId == denuncia.AnuncioId))
                {
                    AnuncioBonificado ab = _anunciosBonificadosRepository.Queryable().First(x => x.AnuncioId == denuncia.AnuncioId);
                    TipoTransferencia tt =_tiposTransferenciasrepository.Queryable().First(x=>x.NombreCodigo== "PEN_DENUNCIA") ;
                    Usuario userAnun = _usuariorepository.Queryable().First(x => x.UsuarioId == ab.UsuarioId);
                    userAnun.Puntos -= ab.CantidadBonificada;
                    //userAnun.FechaUltimoAnuncio = DateTime.Now;
                    Transferencia t = new Transferencia();
                    t.Fecha = DateTime.Now;
                    t.Puntos = ab.CantidadBonificada;
                    t.TipoTransferencia = tt;
                    t.Usuario = userAnun;
                    t.UsuarioDestinoUsuario = userAnun;
                    t.UsuarioFuenteUsuario = _usuariorepository.Queryable().Single(x => x.Correo == "info@setvmas.com");
                    _transferenciaRepository.Create(t);
                    _usuariorepository.Update(userAnun);
                }



               // _unitOfWork.SaveChanges();
                // _unitOfWork.BoniDenuncia(denuncia.Usuario.UsuarioId, denuncia.Usuario.Codigo);
            }
            await _unitOfWork.SaveChangesAsync();
            if (hayMas)
                {
                    
                    foreach (var item in listD)
                    {
                        item.Estado = denuncia.Estado;
                        _denunciasRepository.Update(item);
                    }
                }
            
           


            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DenunciaExists(id))
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
        // GET: api/Denuncias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDenuncia([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                Denuncias denuncia = await _denunciasRepository.Queryable()
                    .Include(x => x.MotivoDenuncia)
                    .Include(x => x.Usuario)
                    .Include(x => x.Anuncio)
                    .Where(x => x.DenunciaId == id).FirstAsync();

                DenunciaViewModel model;
                model = _mapper.Map<DenunciaViewModel>(denuncia);

                if (model == null)
                {
                    return NotFound();
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public List<DenunciaViewModel> getDenuncias(string col, string estado, string antiguedad, string anuncio,string usuario, string codigo, string sortDirection, int pageIndex, int pageSize, string rol)
        {
            List<DenunciaViewModel> lista = new List<DenunciaViewModel>();

            using (SqlConnection sqlConnection = new SqlConnection(_unitOfWork.getConnection()))
            {
                using (SqlCommand sqlCommand = new SqlCommand("Filtro_Denuncia", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado == null ? "" : estado;
                    sqlCommand.Parameters.Add("@antiguedad", SqlDbType.VarChar).Value = antiguedad == null ? "" : antiguedad;
                    sqlCommand.Parameters.Add("@anuncio", SqlDbType.VarChar).Value = anuncio == null ? "" : anuncio;
                    sqlCommand.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario == null ? "" : usuario;
                    sqlCommand.Parameters.Add("@codigo", SqlDbType.VarChar).Value = codigo == null ? "" : codigo;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = pageIndex;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = pageSize;
                    sqlCommand.Parameters.Add("@col", SqlDbType.VarChar).Value = col == null ? "" : col;
                    sqlCommand.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection == null ? "" : sortDirection;
                    sqlCommand.Parameters.Add("@rol", SqlDbType.VarChar).Value = rol == null ? "" : rol;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()
                            ) // recorro cada resultado de la consulta (viene ordenada en grupos por campo ccodliquid)
                            {
                                DenunciaViewModel result = new DenunciaViewModel()
                                {
                                    DenunciaId = int.Parse(reader["DenunciaId"].ToString().Trim()),
                                    Estado = reader["Estado"].ToString().Trim(),
                                    FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"].ToString().Trim()),
                                    FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()),
                                    MotivoDenuncia = reader["Motivo"].ToString().Trim(),
                                    MotivoDenunciaId = int.Parse(reader["MotivoDenunciaId"].ToString().Trim()),
                                    AnuncioId = int.Parse(reader["AnuncioId"].ToString().Trim()),
                                    UsuarioId = int.Parse(reader["UsuarioId"].ToString().Trim()),
                                    //BannerId = int.Parse(reader["BannerId"].ToString().Trim()),
                                    Titulo = reader["Anuncio"].ToString().Trim(),
                                    Correo = reader["Usuario"].ToString().Trim(),
                                    Codigo = reader["Codigo"].ToString().Trim()
                                    //Banner = _context.Banners.Find(int.Parse(reader["BannerId"].ToString().Trim()))
                                };

                                lista.Add(result);
                            }
                        }

                        lista.ForEach(x => x.Codigo = _anunciosRepository.Queryable().Include(xx=>xx.Usuario).FirstOrDefault(a=>a.AnuncioId== x.AnuncioId).Usuario.Codigo);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    sqlConnection.Close();
                }
            }


            return lista;
        }


        // POST: api/Denuncias
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostDenuncia([FromBody] DenunciaViewModel model)
        {
            Denuncias denuncia = new Denuncias();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                Anuncios anuncio =_anunciosRepository.Find(model.AnuncioId);
                if(anuncio.UsuarioId == model.UsuarioId)
                {
                    return Ok("auto-denuncia");
                }
               
                denuncia.Estado = model.Estado;
                denuncia.FechaCreacion = model.FechaCreacion;
                denuncia.FechaModificacion = model.FechaModificacion;
                denuncia.MotivoDenunciaId = model.MotivoDenunciaId;
                denuncia.AnuncioId = model.AnuncioId;
                denuncia.UsuarioId =model.UsuarioId;
                _denunciasRepository.Create(denuncia);

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw;
            }


            return CreatedAtAction("GetDenuncia", new { id = denuncia.DenunciaId }, denuncia);
        }

        // DELETE: api/Denuncias/5
        [Authorize(Roles = "Super Administrador, Administrador, Clasificador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDenuncia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var denuncia = await _denunciasRepository.FindAsync(id);
            if (denuncia == null)
            {
                return NotFound();
            }

            _denunciasRepository.Delete(denuncia);
            await _unitOfWork.SaveChangesAsync();

            return Ok(_mapper.Map<DenunciaViewModel>(denuncia));
        }

        private bool DenunciaExists(int id)
        {
            return _denunciasRepository.Queryable().Any(e => e.DenunciaId == id);
        }
    }
}