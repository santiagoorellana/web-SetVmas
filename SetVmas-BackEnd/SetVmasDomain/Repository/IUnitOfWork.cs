using SetVmasDomain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SetVmasDomain.Repository
{
    public interface IUnitOfWork
    {
        Repository<AlmacenImagen> AlmacenImagenRepository { get; }
        Repository<AnuncioEtiquetas> AnuncioEtiquetasRepository { get; }
        Repository<Anuncios> AnunciosRepository { get; }
        Repository<Banners> BannersRepository { get; }
        Repository<Categoria> CategoriaRepository { get; }
        Repository<CategoriaEtiqueta> CategoriaEtiquetaRepository { get; }
        Repository<ClasesUsuarios> ClasesUsuariosRepository { get; }
        Repository<Denuncias> DenunciasRepository { get; }
        Repository<Etiqueta> EtiquetaRepository { get; }
        Repository<FactoresBonificacionVentas> FactoresBonificacionVentasRepository { get; }
        Repository<MotivoDenuncia> MotivoDenunciaRepository { get; }
        Repository<Notificacion> NotificacionRepository { get; }
        Repository<OpcionAvanzadas> OpcionAvanzadasRepository { get; }
        Repository<PaginasEstaticas> PaginasEstaticasRepository { get; }
        Repository<Pagos> PagosRepository { get; }
        Repository<TipoOpciones> TipoOpcionesRepository { get; }
        Repository<TipoTransferencia> TipoTransferenciaRepository { get; }
        Repository<Transferencia> TransferenciaRepository { get; }
        Repository<Usuario> UsuarioRepository { get; }
        Repository<VariableConfiguracion> VariableConfiguracionRepository { get; }
        Repository<AnuncioBonificado> AnuncioBonificadoRepository { get; }
        List<Anuncios> getAnunciosRecientes(string filter, int pageIndex, int pageSize);
        List<Anuncios> getAnunciosAvanzados(int indexPage, int sizePage, string Accion, string Provincia, string Municipio, string Titulo, string Url, string NombreContacto, string TelefonoContacto, string CorreoContacto, string Categoria, string Descripcion, bool HasFoto, decimal PrecioMin, decimal PrecioMax, string EtiquetasConcat, bool IsWeb, bool ProductoNuevo);
        int getAnunciosAvanzadosCount(int indexPage, int sizePage, string Accion, string Provincia, string Municipio, string Titulo, string Url, string NombreContacto, string TelefonoContacto, string CorreoContacto, string Categoria, string Descripcion, bool HasFoto, decimal PrecioMin, decimal PrecioMax, string EtiquetasConcat, bool IsWeb, bool ProductoNuevo);
        List<Anuncios> getAnuncios(string col,string filter, string rol, string inactividad, string renovacion, string sortDirection, int pageIndex, int pageSize);
        List<Denuncias> getDenuncias(string col, string estado, string antiguedad, string anuncio, string sortDirection , int pageIndex, int pageSize);
        bool BoniReferido(int UserId, string UserCode, decimal points);
        List<Transferencia> FilterTransferenciasByUser(string query);
        List<Usuario> getUsuarios(string col,string rol, string correo, string clase, string puntos, string diasInactividad, string fechaCreacion, string sortDirection, int pageIndex, int pageSize, string codigo);
        string getConnection();
        void SaveChanges();
        Task SaveChangesAsync();
       }
}
