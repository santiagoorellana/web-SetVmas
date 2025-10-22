using AutoMapper;
using SetVmasDomain.Models;
using SetVmas.ViewModels;
using System.Linq;

namespace SetVmas.Mapping
{
    public class MappingProfile : Profile
    {
            public MappingProfile()
            {
                CreateMap<AlmacenImagen, AlmacenImagenViewModel>();
            CreateMap<Anuncios, AnuncioViewModel>()
                  .ForMember(m => m.OpcionesAvanzadas, opt => opt.MapFrom(src => src.OpcionAvanzadas))
                  .ForMember(m => m.Etiquetas, opt => opt.MapFrom(src => src.AnuncioEtiquetas));

            CreateMap<Banners, BannerViewModel>();
            CreateMap<Etiqueta, EtiquetaViewModel>()
                 .ForMember(m => m.Categorias, opt => opt.MapFrom(src => src.CategoriaEtiqueta.Select(x => x.Categoria).ToList()));

            CreateMap<AnuncioEtiquetas, EtiquetaViewModel>()
                  .ForMember(m => m.Nombre, opt => opt.MapFrom(src => src.Etiqueta.Nombre))
                  .ForMember(m => m.CantUsada, opt => opt.MapFrom(src => src.Etiqueta.CantUsada))
                  .ForMember(m => m.EtiquetaId, opt => opt.MapFrom(src => src.EtiquetaId))
                  .ForMember(m => m.IsFree, opt => opt.MapFrom(src => src.IsFree));

            CreateMap<CategoriaEtiqueta, EtiquetaViewModel>();


            CreateMap<Categoria, CategoriaViewModel>()
                .ForMember(m => m.Etiquetas, opt => opt.MapFrom(src => src.CategoriaEtiqueta.Select(x=>x.Etiqueta).ToList()));


        

            CreateMap<OpcionAvanzadas, OpcionesAvanzadasViewModel>()
             .ForMember(m => m.NombreCodigo, opt => opt.MapFrom(src => src.TipoOpcion.NombreCodigo))
             .ForMember(m => m.TextoLabel, opt => opt.MapFrom(src => src.TipoOpcion.TextoLabel))
             .ForMember(m => m.Precio, opt => opt.MapFrom(src => src.TipoOpcion.Precio))
             .ForMember(m => m.CantidadFrecuencia, opt => opt.MapFrom(src => src.TipoOpcion.CantidadFrecuencia))
             .ForMember(m => m.MinimoComprar, opt => opt.MapFrom(src => src.TipoOpcion.MinimoComprar));
            /* CreateMap<Denuncias, DenunciaViewModel>()
              .ForMember(m => m.MotivoDenuncia, opt => opt.MapFrom(src => src.MotivoDenuncia.Nombre))
              .ForMember(m => m.Usuario, opt => opt.MapFrom(src => src.Usuario.Correo))
              .ForMember(m => m.Anuncio, opt => opt.MapFrom(src => src.Anuncio.Titulo));*/
            CreateMap<Denuncias, DenunciaViewModel>()
            .ForMember(m => m.MotivoDenuncia, opt => opt.MapFrom(src => src.MotivoDenuncia.Nombre))
            .ForMember(m => m.Correo, opt => opt.MapFrom(src => src.Usuario.Correo))
            .ForMember(m => m.Titulo, opt => opt.MapFrom(src => src.Anuncio.Titulo))
            .ForMember(m => m.AnuncioUsuarioId, opt => opt.MapFrom(src => src.Anuncio.UsuarioId));


            CreateMap<Pagos, PagosViewModel>()
                .ForMember(m => m.Usuario, opt => opt.MapFrom(src => src.Usuario.Correo));
                CreateMap<Transferencia, TransfersViewModel>()
                  .ForMember(m => m.TransferId, opt => opt.MapFrom(src => src.TransferenciaId))
                  .ForMember(m => m.TransferType, opt => opt.MapFrom(src => src.TipoTransferencia.Nombre))
                  .ForMember(m => m.User, opt => opt.MapFrom(src => src.Usuario.Correo))
                  .ForMember(m => m.SourceUser, opt => opt.MapFrom(src => src.UsuarioFuenteUsuario.Correo))
                  .ForMember(m => m.TargetUser, opt => opt.MapFrom(src => src.UsuarioDestinoUsuario.Correo))
                  .ForMember(m => m.OperationDate, opt => opt.MapFrom(src => src.Fecha))
                  .ForMember(m => m.Points, opt => opt.MapFrom(src => src.Puntos));
            CreateMap<Usuario, UsuarioViewModel>()
                .ForMember(m => m.Clase, opt => opt.MapFrom(src => src.ClasesUsuarios.Nombre))
                .ForMember(m => m.FechaDesbloqueo, opt => opt.MapFrom(src => src.FechaDesbloqueo));
        }
     
    }
}