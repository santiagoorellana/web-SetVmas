using Microsoft.EntityFrameworkCore;
using SetVmasDomain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web;

namespace SetVmasDomain.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly setDBContext context;
        public UnitOfWork()
        {
            this.context = new setDBContext();
        }

        Repository<AlmacenImagen> almacenImagenRepository;
        Repository<AnuncioEtiquetas> anuncioEtiquetasRepository;
        Repository<Anuncios> anunciosRepository;
        Repository<Banners> bannersRepository;
        Repository<Categoria> categoriaRepository;
        Repository<CategoriaEtiqueta> categoriaEtiquetaRepository;
        Repository<ClasesUsuarios> clasesUsuariosRepository;
        Repository<Denuncias> denunciasRepository;
        Repository<Etiqueta> etiquetaRepository;
        Repository<FactoresBonificacionVentas> factoresBonificacionVentasRepository;
        Repository<MotivoDenuncia> motivoDenunciaRepository;
        Repository<Notificacion> notificacionRepository;
        Repository<OpcionAvanzadas> opcionAvanzadasRepository;
        Repository<PaginasEstaticas> paginasEstaticasRepository;
        Repository<Pagos> pagosRepository;
        Repository<TipoOpciones> tipoOpcionesRepository;
        Repository<TipoTransferencia> tipoTransferenciaRepository;
        Repository<Transferencia> transferenciaRepository;
        Repository<Usuario> usuarioRepository;
        Repository<VariableConfiguracion> variableConfiguracionRepository;
        Repository<AnuncioBonificado> anuncioBonificadoRepository;


        #region Repositories

        public string getConnection()
        {
           
                return this.context.getConnection();
           
        }


        public Repository<AlmacenImagen> AlmacenImagenRepository
        {
            get
            {
                if (this.almacenImagenRepository == null)
                {
                    this.almacenImagenRepository = new Repository<AlmacenImagen>(this.context);
                }
                return this.almacenImagenRepository;
            }
        }

        public Repository<AnuncioEtiquetas> AnuncioEtiquetasRepository
        {
            get
            {
                if (this.anuncioEtiquetasRepository == null)
                {
                    this.anuncioEtiquetasRepository = new Repository<AnuncioEtiquetas>(this.context);
                }
                return this.anuncioEtiquetasRepository;
            }
        }
        public Repository<Anuncios> AnunciosRepository
        {
            get
            {
                if (this.anunciosRepository == null)
                {
                    this.anunciosRepository = new Repository<Anuncios>(this.context);
                }
                return this.anunciosRepository;
            }
        }
        public Repository<Banners> BannersRepository
        {
            get
            {
                if (this.bannersRepository == null)
                {
                    this.bannersRepository = new Repository<Banners>(this.context);
                }
                return this.bannersRepository;
            }
        }
        public Repository<Categoria> CategoriaRepository
        {
            get
            {
                if (this.categoriaRepository == null)
                {
                    this.categoriaRepository = new Repository<Categoria>(this.context);
                }
                return this.categoriaRepository;
            }
        }
        public Repository<CategoriaEtiqueta> CategoriaEtiquetaRepository
        {
            get
            {
                if (this.categoriaEtiquetaRepository == null)
                {
                    this.categoriaEtiquetaRepository = new Repository<CategoriaEtiqueta>(this.context);
                }
                return this.categoriaEtiquetaRepository;
            }
        }
        public Repository<ClasesUsuarios> ClasesUsuariosRepository
        {
            get
            {
                if (this.clasesUsuariosRepository == null)
                {
                    this.clasesUsuariosRepository = new Repository<ClasesUsuarios>(this.context);
                }
                return this.clasesUsuariosRepository;
            }
        }
        public Repository<Denuncias> DenunciasRepository
        {
            get
            {
                if (this.denunciasRepository == null)
                {
                    this.denunciasRepository = new Repository<Denuncias>(this.context);
                }
                return this.denunciasRepository;
            }
        }
        public Repository<Etiqueta> EtiquetaRepository
        {
            get
            {
                if (this.etiquetaRepository == null)
                {
                    this.etiquetaRepository = new Repository<Etiqueta>(this.context);
                }
                return this.etiquetaRepository;
            }
        }
        public Repository<FactoresBonificacionVentas> FactoresBonificacionVentasRepository
        {
            get
            {
                if (this.factoresBonificacionVentasRepository == null)
                {
                    this.factoresBonificacionVentasRepository = new Repository<FactoresBonificacionVentas>(this.context);
                }
                return this.factoresBonificacionVentasRepository;
            }
        }
        public Repository<MotivoDenuncia> MotivoDenunciaRepository
        {
            get
            {
                if (this.motivoDenunciaRepository == null)
                {
                    this.motivoDenunciaRepository = new Repository<MotivoDenuncia>(this.context);
                }
                return this.motivoDenunciaRepository;
            }
        }
        public Repository<Notificacion> NotificacionRepository
        {
            get
            {
                if (this.notificacionRepository == null)
                {
                    this.notificacionRepository = new Repository<Notificacion>(this.context);
                }
                return this.notificacionRepository;
            }
        }
        public Repository<OpcionAvanzadas> OpcionAvanzadasRepository
        {
            get
            {
                if (this.opcionAvanzadasRepository == null)
                {
                    this.opcionAvanzadasRepository = new Repository<OpcionAvanzadas>(this.context);
                }
                return this.opcionAvanzadasRepository;
            }
        }
        public Repository<PaginasEstaticas> PaginasEstaticasRepository
        {
            get
            {
                if (this.paginasEstaticasRepository == null)
                {
                    this.paginasEstaticasRepository = new Repository<PaginasEstaticas>(this.context);
                }
                return this.paginasEstaticasRepository;
            }
        }
        public Repository<Pagos> PagosRepository
        {
            get
            {
                if (this.pagosRepository == null)
                {
                    this.pagosRepository = new Repository<Pagos>(this.context);
                }
                return this.pagosRepository;
            }
        }
        public Repository<TipoOpciones> TipoOpcionesRepository
        {
            get
            {
                if (this.tipoOpcionesRepository == null)
                {
                    this.tipoOpcionesRepository = new Repository<TipoOpciones>(this.context);
                }
                return this.tipoOpcionesRepository;
            }
        }
        public Repository<TipoTransferencia> TipoTransferenciaRepository
        {
            get
            {
                if (this.tipoTransferenciaRepository == null)
                {
                    this.tipoTransferenciaRepository = new Repository<TipoTransferencia>(this.context);
                }
                return this.tipoTransferenciaRepository;
            }
        }
        public Repository<Transferencia> TransferenciaRepository
        {
            get
            {
                if (this.transferenciaRepository == null)
                {
                    this.transferenciaRepository = new Repository<Transferencia>(this.context);
                }
                return this.transferenciaRepository;
            }
        }
        public Repository<Usuario> UsuarioRepository
        {
            get
            {
                if (this.usuarioRepository == null)
                {
                    this.usuarioRepository = new Repository<Usuario>(this.context);
                }
                return this.usuarioRepository;
            }
        }
        public Repository<AnuncioBonificado> AnuncioBonificadoRepository
        {
            get
            {
                if (this.anuncioBonificadoRepository == null)
                {
                    this.anuncioBonificadoRepository = new Repository<AnuncioBonificado>(this.context);
                }
                return this.anuncioBonificadoRepository;
            }
        }

        public Repository<VariableConfiguracion> VariableConfiguracionRepository
        {
            get
            {
                if (this.variableConfiguracionRepository == null)
                {
                    this.variableConfiguracionRepository = new Repository<VariableConfiguracion>(this.context);
                }
                return this.variableConfiguracionRepository;
            }
        }

        #endregion

        public void SaveChanges()
        {
            this.context.SaveChangesAsync();
        }
        public async Task SaveChangesAsync()
        {
            await this.context.SaveChangesAsync();
        }


        //------------------------------Procedimientos almacenados-------------------------------------

        #region Procedimientos almacenados
        public List<Anuncios> getAnunciosRecientes(string filter, int pageIndex, int pageSize)
        {
            List<Anuncios> lista = new List<Anuncios>();
            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {

                using (SqlCommand sqlCommand = new SqlCommand("Usp_BuscarAnunciosRecientes", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@texto", SqlDbType.VarChar, 1000).Value = filter == null ? "" : filter;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = pageIndex;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = pageSize;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()
                            ) // recorro cada resultado de la consulta (viene ordenada en grupos por campo ccodliquid)
                            {

                                Anuncios result = new Anuncios()
                                {
                                    AnuncioId = Convert.ToInt32(reader["AnuncioId"].ToString().Trim()),


                                    Titulo = reader["Titulo"] != null ? reader["Titulo"].ToString().Trim() : "",
                                    Descripcion = reader["Descripcion"] != null ? reader["Descripcion"].ToString().Trim() : "",
                                    NombreContacto = reader["NombreContacto"] != null ? reader["NombreContacto"].ToString().Trim() : "",
                                    TelefonoContacto = reader["TelefonoContacto"] != null ? reader["TelefonoContacto"].ToString().Trim() : "",
                                    CorreoContacto = reader["CorreoContacto"] != null ? reader["CorreoContacto"].ToString().Trim() : "",
                                    Precio = reader["Precio"] != null ? Convert.ToDecimal(reader["Precio"].ToString().Trim()) : 0,
                                    IsActivo = Convert.ToBoolean(reader["IsActivo"].ToString().Trim()),
                                    IsVisible = Convert.ToBoolean(reader["IsVisible"].ToString().Trim()),
                                    FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    FechaCreacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    ImageName = reader["ImageName"] != null ? reader["ImageName"].ToString().Trim() : "",
                                    Url = reader["Url"] != null ? reader["Url"].ToString().Trim() : "",
                                    Provincia = reader["Provincia"] != null ? reader["Provincia"].ToString().Trim() : "",
                                    Municipio = reader["Municipio"] != null ? reader["Municipio"].ToString().Trim() : "",
                                    ContadorView = reader["ContadorView"] != null ? int.Parse(reader["ContadorView"].ToString().Trim()) : 0,
                                    ProductoNuevo = Convert.ToBoolean(reader["ProductoNuevo"].ToString().Trim()),
                                    Accion = reader["Accion"] != null ? reader["Accion"].ToString().Trim() : "",
                                    Usuario = context.Usuario.Find(int.Parse(reader["UsuarioId"].ToString().Trim()))

                                };

                                lista.Add(result);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    sqlConnection.Close();
                }

            }

            return lista;
        }

        public List<Anuncios> getAnunciosAvanzados(int indexPage, int sizePage, string Accion, string Provincia, string Municipio, string Titulo, string Url,
            string NombreContacto, string TelefonoContacto, string CorreoContacto, string Categoria, string Descripcion, bool HasFoto, decimal PrecioMin, decimal PrecioMax, string EtiquetasConcat, bool IsWeb, bool ProductoNuevo)
        {
            List<Anuncios> lista = new List<Anuncios>();

            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {

                using (SqlCommand sqlCommand = new SqlCommand("USP_BuscarAnunciosFiltros", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = indexPage;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = sizePage;
                    sqlCommand.Parameters.Add("@accion", SqlDbType.VarChar).Value = Accion != null ? Accion : "";
                    sqlCommand.Parameters.Add("@prov", SqlDbType.VarChar).Value = Provincia != null ? Provincia : "";
                    sqlCommand.Parameters.Add("@mun", SqlDbType.VarChar).Value = Municipio != null ? Municipio : "";
                    sqlCommand.Parameters.Add("@titulo", SqlDbType.VarChar).Value = Titulo != null ? Titulo : "";
                    sqlCommand.Parameters.Add("@url", SqlDbType.VarChar).Value = Url != null ? Url : "";
                    sqlCommand.Parameters.Add("@nombrecon", SqlDbType.VarChar).Value = NombreContacto != null ? NombreContacto : "";
                    sqlCommand.Parameters.Add("@telf", SqlDbType.VarChar).Value = TelefonoContacto != null ? TelefonoContacto : "";
                    sqlCommand.Parameters.Add("@email", SqlDbType.VarChar).Value = CorreoContacto != null ? CorreoContacto : "";
                    sqlCommand.Parameters.Add("@categoria", SqlDbType.VarChar).Value = Categoria != null ? Categoria : "";
                    sqlCommand.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = Descripcion != null ? Descripcion : "";
                    sqlCommand.Parameters.Add("@foto", SqlDbType.Int).Value = HasFoto ? 1 : 0;
                    sqlCommand.Parameters.Add("@pmin", SqlDbType.Decimal).Value = PrecioMin;
                    sqlCommand.Parameters.Add("@pmax", SqlDbType.Decimal).Value = PrecioMax;
                    sqlCommand.Parameters.Add("@lista_etiqueta", SqlDbType.VarChar).Value = EtiquetasConcat != null ? EtiquetasConcat : "";
                    sqlCommand.Parameters.Add("@web", SqlDbType.Int).Value = IsWeb ? 1 : 0;
                    sqlCommand.Parameters.Add("@nuevo", SqlDbType.Int).Value = ProductoNuevo ? 1 : 0;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()
                            ) // recorro cada resultado de la consulta (viene ordenada en grupos por campo ccodliquid)
                            {

                                Anuncios result = new Anuncios()
                                {
                                    AnuncioId = Convert.ToInt32(reader["AnuncioId"].ToString().Trim()),


                                    Titulo = reader["Titulo"] != null ? reader["Titulo"].ToString().Trim() : "",
                                    Descripcion = reader["Descripcion"] != null ? reader["Descripcion"].ToString().Trim() : "",
                                    NombreContacto = reader["NombreContacto"] != null ? reader["NombreContacto"].ToString().Trim() : "",
                                    TelefonoContacto = reader["TelefonoContacto"] != null ? reader["TelefonoContacto"].ToString().Trim() : "",
                                    CorreoContacto = reader["CorreoContacto"] != null ? reader["CorreoContacto"].ToString().Trim() : "",
                                    Precio = reader["Precio"] != null ? Convert.ToDecimal(reader["Precio"].ToString().Trim()) : 0,
                                    IsActivo = Convert.ToBoolean(reader["IsActivo"].ToString().Trim()),
                                    IsVisible = Convert.ToBoolean(reader["IsVisible"].ToString().Trim()),
                                    FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    FechaCreacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    ImageContent = reader["ImageContent"] != null ? reader["ImageContent"].ToString().Trim() : "",
                                    ImageMimeType = reader["ImageMimeType"] != null ? reader["ImageMimeType"].ToString().Trim() : "",
                                    ImageName = reader["ImageName"] != null ? reader["ImageName"].ToString().Trim() : "",
                                    Url = reader["Url"] != null ? reader["Url"].ToString().Trim() : "",
                                    Provincia = reader["Provincia"] != null ? reader["Provincia"].ToString().Trim() : "",
                                    Municipio = reader["Municipio"] != null ? reader["Municipio"].ToString().Trim() : "",
                                    ContadorView = reader["ContadorView"] != null ? int.Parse(reader["ContadorView"].ToString().Trim()) : 0,
                                    ProductoNuevo = Convert.ToBoolean(reader["ProductoNuevo"].ToString().Trim()),
                                    Accion = reader["Accion"] != null ? reader["Accion"].ToString().Trim() : "",
                                    Usuario = context.Usuario.Find(int.Parse(reader["UsuarioId"].ToString().Trim()))

                                };

                                lista.Add(result);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    sqlConnection.Close();
                }

            }

            return lista;
        }


        public int getAnunciosAvanzadosCount(int indexPage, int sizePage, string Accion, string Provincia, string Municipio, string Titulo, string Url,
    string NombreContacto, string TelefonoContacto, string CorreoContacto, string Categoria, string Descripcion, bool HasFoto, decimal PrecioMin, decimal PrecioMax, string EtiquetasConcat, bool IsWeb, bool ProductoNuevo)
        {
            List<Anuncios> lista = new List<Anuncios>();

            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {

                using (SqlCommand sqlCommand = new SqlCommand("USP_BuscarAnunciosFiltros", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = indexPage;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = sizePage;
                    sqlCommand.Parameters.Add("@accion", SqlDbType.VarChar).Value = Accion != null ? Accion : "";
                    sqlCommand.Parameters.Add("@prov", SqlDbType.VarChar).Value = Provincia != null ? Provincia : "";
                    sqlCommand.Parameters.Add("@mun", SqlDbType.VarChar).Value = Municipio != null ? Municipio : "";
                    sqlCommand.Parameters.Add("@titulo", SqlDbType.VarChar).Value = Titulo != null ? Titulo : "";
                    sqlCommand.Parameters.Add("@url", SqlDbType.VarChar).Value = Url != null ? Url : "";
                    sqlCommand.Parameters.Add("@nombrecon", SqlDbType.VarChar).Value = NombreContacto != null ? NombreContacto : "";
                    sqlCommand.Parameters.Add("@telf", SqlDbType.VarChar).Value = TelefonoContacto != null ? TelefonoContacto : "";
                    sqlCommand.Parameters.Add("@email", SqlDbType.VarChar).Value = CorreoContacto != null ? CorreoContacto : "";
                    sqlCommand.Parameters.Add("@categoria", SqlDbType.VarChar).Value = Categoria != null ? Categoria : "";
                    sqlCommand.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = Descripcion != null ? Descripcion : "";
                    sqlCommand.Parameters.Add("@foto", SqlDbType.Int).Value = HasFoto ? 1 : 0;
                    sqlCommand.Parameters.Add("@pmin", SqlDbType.Decimal).Value = PrecioMin;
                    sqlCommand.Parameters.Add("@pmax", SqlDbType.Decimal).Value = PrecioMax;
                    sqlCommand.Parameters.Add("@lista_etiqueta", SqlDbType.VarChar).Value = EtiquetasConcat != null ? EtiquetasConcat : "";
                    sqlCommand.Parameters.Add("@web", SqlDbType.Int).Value = IsWeb ? 1 : 0;
                    sqlCommand.Parameters.Add("@nuevo", SqlDbType.Int).Value = ProductoNuevo ? 1 : 0;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {

                                Anuncios result = new Anuncios()
                                {
                                    AnuncioId = Convert.ToInt32(reader["AnuncioId"].ToString().Trim()),

                                };

                                lista.Add(result);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    sqlConnection.Close();
                }

            }

            return lista.Count;
        }


        public List<Anuncios> getAnuncios(string col,string filter, string rol, string inactividad, string renovacion,string sortDirection, int pageIndex, int pageSize)
        {
            List<Anuncios> lista = new List<Anuncios>();

            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {

                using (SqlCommand sqlCommand = new SqlCommand("USP_ListarAnuncios", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@col", SqlDbType.VarChar, 1000).Value = col == null ? "" : col;
                    sqlCommand.Parameters.Add("@titulo", SqlDbType.VarChar, 1000).Value = filter == null ? "" : filter;
                    sqlCommand.Parameters.Add("@rol", SqlDbType.VarChar, 1000).Value = rol == null ? "" : rol;
                    sqlCommand.Parameters.Add("@antiguedad", SqlDbType.VarChar, 1000).Value = inactividad == null ? "" : inactividad;
                    sqlCommand.Parameters.Add("@renovacion", SqlDbType.VarChar, 1000).Value = renovacion == null ? "" : renovacion;
                    sqlCommand.Parameters.Add("@sortDirection", SqlDbType.VarChar, 1000).Value = sortDirection == null ? "" : sortDirection;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = pageIndex;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = pageSize;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()) 
                            {

                                Anuncios result = new Anuncios()
                                {
                                    AnuncioId = Convert.ToInt32(reader["AnuncioId"].ToString().Trim()),
                                    Titulo = reader["Titulo"] != null ? reader["Titulo"].ToString().Trim() : "",
                                    Descripcion = reader["Descripcion"] != null ? reader["Descripcion"].ToString().Trim() : "",
                                    NombreContacto = reader["NombreContacto"] != null ? reader["NombreContacto"].ToString().Trim() : "",
                                    TelefonoContacto = reader["TelefonoContacto"] != null ? reader["TelefonoContacto"].ToString().Trim() : "",
                                    CorreoContacto = reader["CorreoContacto"] != null ? reader["CorreoContacto"].ToString().Trim() : "",
                                    Precio = reader["Precio"] != null ? Convert.ToDecimal(reader["Precio"].ToString().Trim()) : 0,
                                    IsActivo = Convert.ToBoolean(reader["IsActivo"].ToString().Trim()),
                                    IsVisible = Convert.ToBoolean(reader["IsVisible"].ToString().Trim()),
                                    FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()),//.Date,
                                    FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"].ToString().Trim()),//.Date,
                                    ImageContent = reader["ImageContent"] != null ? reader["ImageContent"].ToString().Trim() : "",
                                    ImageMimeType = reader["ImageMimeType"] != null ? reader["ImageMimeType"].ToString().Trim() : "",
                                    ImageName = reader["ImageName"] != null ? reader["ImageName"].ToString().Trim() : "",
                                    Url = reader["Url"] != null ? reader["Url"].ToString().Trim() : "",
                                    Provincia = reader["Provincia"] != null ? reader["Provincia"].ToString().Trim() : "",
                                    Municipio = reader["Municipio"] != null ? reader["Municipio"].ToString().Trim() : "",
                                    ContadorView = reader["ContadorView"] != null ? int.Parse(reader["ContadorView"].ToString().Trim()) : 0,
                                    ProductoNuevo = Convert.ToBoolean(reader["ProductoNuevo"].ToString().Trim()),
                                    Accion = reader["Accion"] != null ? reader["Accion"].ToString().Trim() : "",
                                    Usuario = context.Usuario.Find(int.Parse(reader["UsuarioId"].ToString().Trim())),
                                    totalbuscado= int.Parse(reader["TOTAL"].ToString().Trim())

                                };
                   

                                lista.Add(result);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    sqlConnection.Close();
                }
            }

            return lista;
        }


        public List<Denuncias> getDenuncias(string col, string estado, string antiguedad, string anuncio, string sortDirection, int pageIndex, int pageSize)
        {
            List<Denuncias> lista = new List<Denuncias>();

            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {
                using (SqlCommand sqlCommand = new SqlCommand("Filtro_Denuncia", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado == null ? "" : estado;
                    sqlCommand.Parameters.Add("@antiguedad", SqlDbType.VarChar).Value = antiguedad == null ? "" : antiguedad;
                    sqlCommand.Parameters.Add("@anuncio", SqlDbType.VarChar).Value = anuncio == null ? "" : anuncio;
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = pageIndex;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = pageSize;
                    sqlCommand.Parameters.Add("@col", SqlDbType.VarChar).Value = col == null ? "" : col;
                    sqlCommand.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection == null ? "" : sortDirection;


                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()
                            ) // recorro cada resultado de la consulta (viene ordenada en grupos por campo ccodliquid)
                            {
                                Denuncias result = new Denuncias()
                                {
                                    DenunciaId = int.Parse(reader["DenunciaId"].ToString().Trim()),
                                    Estado = reader["Estado"].ToString().Trim(),
                                    FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"].ToString().Trim()).Date,
                                    FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    //MotivoDenuncia = MotivoDenunciaRepository.Find(int.Parse(reader["MotivoDenunciaId"].ToString().Trim())),
                                    MotivoDenunciaId = int.Parse(reader["MotivoDenunciaId"].ToString().Trim()),
                                    AnuncioId = int.Parse(reader["AnuncioId"].ToString().Trim()),
                                    UsuarioId = int.Parse(reader["UsuarioId"].ToString().Trim()),
                                    //BannerId = int.Parse(reader["BannerId"].ToString().Trim()),
                                    //Anuncio = AnunciosRepository.Find(int.Parse(reader["AnuncioId"].ToString().Trim())),
                                    //Usuario = UsuarioRepository.Find(int.Parse(reader["UsuarioId"].ToString().Trim()))
                                    //Banner = _context.Banners.Find(int.Parse(reader["BannerId"].ToString().Trim()))
                                                                 };

                                lista.Add(result);
                            }
                        }
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

       

     
        public bool BoniReferido(int UserId, string UserCode, decimal points)
        {
            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {
                using (SqlCommand sqlCommand = new SqlCommand("USP_Boni_Referido", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@userDestino", SqlDbType.VarChar).Value = UserId;
                    sqlCommand.Parameters.Add("@codigoDestino", SqlDbType.VarChar).Value = UserCode;
                    sqlCommand.Parameters.Add("@cantVendida", SqlDbType.Decimal).Value = points;

                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                    }
                    catch (Exception)
                    {
                        return false;
                    }
                    sqlConnection.Close();
                    return true;
                    
                }
            }
        }

        public List<Transferencia> FilterTransferenciasByUser(string query)
        {

            List<Transferencia> result = new List<Transferencia>();
            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {

                SqlCommand sqlCommand = new SqlCommand(query, sqlConnection);
                try
                {
                    sqlConnection.Open();
                    SqlDataReader reader = sqlCommand.ExecuteReader();
                    
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Transferencia row = new Transferencia()
                            {
                                Fecha = Convert.ToDateTime(reader["Fecha"].ToString().Trim()),
                                TipoTransferencia = TipoTransferenciaRepository.Find(Convert.ToInt32(reader["TipoTransferenciaId"].ToString().Trim())),
                                TransferenciaId = Convert.ToInt32(reader["TransferenciaId"].ToString().Trim()),
                                Usuario = UsuarioRepository.Find(Convert.ToInt32(reader["UsuarioId"].ToString().Trim())),
                                UsuarioDestinoUsuario = UsuarioRepository.Find(Convert.ToInt32(reader["UsuarioDestinoUsuarioId"].ToString().Trim())),
                                UsuarioFuenteUsuario = UsuarioRepository.Find(Convert.ToInt32(reader["UsuarioFuenteUsuarioId"].ToString().Trim())),
                                Puntos = Convert.ToDecimal(reader["Puntos"].ToString().Trim()),
                            };

                            result.Add(row);
                        }

                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                sqlConnection.Close();

            }

            return result;
        }


        public List<Usuario> getUsuarios(string col,string rol, string correo, string clase, string puntos, string diasInactividad, string fechaCreacion,string sortDirection,int pageIndex, int pageSize, string codigo)
        {
            List<Usuario> listUser = new List<Usuario>();

            using (SqlConnection sqlConnection = new SqlConnection(context.getConnection()))
            {
                var list = new List<Usuario>();
                using (SqlCommand sqlCommand = new SqlCommand("Filtro_Usuario", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add("@col", SqlDbType.VarChar).Value = col != null ? col : "";
                    sqlCommand.Parameters.Add("@rol", SqlDbType.VarChar).Value = rol != null ? rol : "";
                    sqlCommand.Parameters.Add("@correo", SqlDbType.VarChar).Value = correo != null ? correo : "";
                    sqlCommand.Parameters.Add("@clase", SqlDbType.VarChar).Value = clase != null ? clase : "";
                    sqlCommand.Parameters.Add("@puntos", SqlDbType.VarChar).Value = puntos != null ? puntos : "";
                    sqlCommand.Parameters.Add("@codigo", SqlDbType.VarChar).Value = codigo != null ? codigo : "";
                    sqlCommand.Parameters.Add("@diasInactividad", SqlDbType.VarChar).Value = diasInactividad != null ? diasInactividad : "";
                    sqlCommand.Parameters.Add("@fechaCreacion", SqlDbType.VarChar).Value = fechaCreacion != null ? fechaCreacion : "";
                    sqlCommand.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection != null ? sortDirection : "";
                    sqlCommand.Parameters.Add("@pagina", SqlDbType.Int).Value = pageIndex;
                    sqlCommand.Parameters.Add("@cantPagina", SqlDbType.Int).Value = pageSize;
                    try
                    {
                        sqlConnection.Open();
                        SqlDataReader reader = sqlCommand.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read()
                            ) // recorro cada resultado de la consulta (viene ordenada en grupos por campo ccodliquid)
                            {
                                Usuario result = new Usuario()
                                {
                                    UsuarioId = Convert.ToInt32(reader["UsuarioId"].ToString().Trim()),
                                    Codigo = reader["Codigo"].ToString().Trim() != null ? reader["Codigo"].ToString().Trim() : "",
                                    Correo = reader["Correo"].ToString().Trim() != null ? reader["Correo"].ToString().Trim() : "",
                                    Rol = reader["Rol"].ToString().Trim() != null ? reader["Rol"].ToString().Trim() : "",
                                    Telefono = reader["Telefono"].ToString().Trim() != null ? reader["Telefono"].ToString().Trim() : "",
                                    Activo = reader["Activo"].ToString().Trim() == "True" ? true : false,
                                    Bloqueado = reader["Bloqueado"].ToString().Trim() == "True" ? true : false,
                                    Puntos = decimal.Parse(reader["Puntos"].ToString().Trim()),
                                    FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"].ToString().Trim()).Date,
                                    Anfitrion = reader["Anfitrion"].ToString().Trim() != null ? reader["Anfitrion"].ToString().Trim() : "",
                                    ClasesUsuarios = ClasesUsuariosRepository.Find(int.Parse(reader["ClasesUsuariosId"].ToString().Trim())),
                                    FechaUltimaEntrada = reader["FechaUltimaEntrada"].ToString().Trim() == "" ? (DateTime?)null : Convert.ToDateTime(reader["FechaUltimaEntrada"].ToString().Trim()).Date,
                                    FechaUltimaView = reader["FechaUltimaView"].ToString().Trim() == "" ? (DateTime?)null : Convert.ToDateTime(reader["FechaUltimaView"].ToString().Trim()).Date,
                                    FechaModificacion = reader["FechaModificacion"].ToString().Trim() == "" ? (DateTime?)null : Convert.ToDateTime(reader["FechaModificacion"].ToString().Trim()).Date,
                                    FechaDesbloqueo = reader["FechaDesbloqueo"].ToString().Trim() == "" ? (DateTime?)null : Convert.ToDateTime(reader["FechaDesbloqueo"].ToString().Trim()).Date,
                                    FechaUltimoAnuncio = reader["FechaUltimoAnuncio"].ToString().Trim() == "" ? (DateTime?)null : Convert.ToDateTime(reader["FechaUltimoAnuncio"].ToString().Trim()).Date,
                                   

                                };

                              /*  if (reader["FechaUltimaEntrada"].ToString().Trim() != null && reader["FechaUltimaEntrada"].ToString().Trim() != "")
                                {
                                    result.FechaUltimaEntrada = Convert.ToDateTime(reader["FechaUltimaEntrada"].ToString().Trim()).Date;
                                }*/
                                listUser.Add(result);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    sqlConnection.Close();
                }
            }

            return listUser;
        }

        #endregion
    }
}
